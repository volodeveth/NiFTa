// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC2981} from "@openzeppelin/contracts/interfaces/IERC2981.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import {CommonEvents} from "../interfaces/CommonEvents.sol";

/**
 * @title NiFTa Marketplace
 * @dev Simple fixed-price marketplace with escrow
 * @dev 95% to seller, 2.5% creator royalty, 2.5% platform fee
 */
contract NiftaMarketplace is 
    Initializable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    IERC1155Receiver,
    CommonEvents
{
    struct Listing {
        address collection;
        uint256 tokenId;
        address seller;
        uint256 amount;
        uint256 unitPrice;
        uint256 deadline;
        bool active;
    }

    address public platformReceiver;
    uint96 public constant PLATFORM_FEE_BPS = 250; // 2.5%

    uint256 public listingCounter;
    mapping(uint256 => Listing) public listings;
    
    // Seller => Collection => TokenId => ListingId
    mapping(address => mapping(address => mapping(uint256 => uint256))) public sellerListings;

    event PlatformReceiverUpdated(address indexed oldReceiver, address indexed newReceiver);
    event DeadlineExtended(uint256 indexed listingId, uint256 newDeadline);

    error ZeroAddress();
    error InvalidParams();
    error ListingExpired();
    error NotSeller();
    error InsufficientAmount();
    error TransferFailed();
    error ListingNotFound();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address platformReceiver_) external initializer {
        if (platformReceiver_ == address(0)) revert ZeroAddress();
        
        __ReentrancyGuard_init();
        __Pausable_init();
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        
        platformReceiver = platformReceiver_;
    }

    function setPlatformReceiver(address newReceiver) external onlyOwner {
        if (newReceiver == address(0)) revert ZeroAddress();
        address oldReceiver = platformReceiver;
        platformReceiver = newReceiver;
        emit PlatformReceiverUpdated(oldReceiver, newReceiver);
    }

    function pause() external onlyOwner { 
        _pause(); 
    }
    
    function unpause() external onlyOwner { 
        _unpause(); 
    }

    function list(
        address collection,
        uint256 tokenId,
        uint256 amount,
        uint256 unitPrice,
        uint256 duration
    ) external whenNotPaused returns (uint256 listingId) {
        if (amount == 0 || unitPrice == 0) revert InvalidParams();
        if (collection == address(0)) revert ZeroAddress();

        uint256 deadline = duration > 0 ? block.timestamp + duration : 0; // 0 = no deadline

        // Transfer tokens to escrow
        IERC1155(collection).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            amount,
            ""
        );

        listingId = ++listingCounter;
        listings[listingId] = Listing({
            collection: collection,
            tokenId: tokenId,
            seller: msg.sender,
            amount: amount,
            unitPrice: unitPrice,
            deadline: deadline,
            active: true
        });

        sellerListings[msg.sender][collection][tokenId] = listingId;

        emit Listed(collection, tokenId, msg.sender, amount, unitPrice);
    }

    function cancel(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        if (!listing.active) revert ListingNotFound();
        if (listing.seller != msg.sender) revert NotSeller();

        listing.active = false;
        delete sellerListings[listing.seller][listing.collection][listing.tokenId];

        // Return tokens to seller
        IERC1155(listing.collection).safeTransferFrom(
            address(this),
            listing.seller,
            listing.tokenId,
            listing.amount,
            ""
        );

        emit Cancel(listing.collection, listing.tokenId, listing.seller);
    }

    function buy(uint256 listingId, uint256 amount) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        Listing storage listing = listings[listingId];
        if (!listing.active) revert ListingNotFound();
        if (listing.deadline > 0 && block.timestamp > listing.deadline) revert ListingExpired();
        if (amount == 0 || amount > listing.amount) revert InsufficientAmount();

        uint256 totalPrice = listing.unitPrice * amount;
        if (msg.value != totalPrice) revert InvalidParams();

        // Update listing
        listing.amount -= amount;
        if (listing.amount == 0) {
            listing.active = false;
            delete sellerListings[listing.seller][listing.collection][listing.tokenId];
        }

        // Transfer NFT to buyer
        IERC1155(listing.collection).safeTransferFrom(
            address(this),
            msg.sender,
            listing.tokenId,
            amount,
            ""
        );

        // Calculate fees and royalties
        (address royaltyReceiver, uint256 royaltyAmount) = _getRoyalty(
            listing.collection,
            listing.tokenId,
            totalPrice
        );

        uint256 platformFee = (totalPrice * PLATFORM_FEE_BPS) / 10000;
        uint256 sellerProceeds = totalPrice - royaltyAmount - platformFee;

        // Distribute payments
        _transferETH(listing.seller, sellerProceeds);
        if (royaltyAmount > 0) {
            _transferETH(royaltyReceiver, royaltyAmount);
        }
        _transferETH(platformReceiver, platformFee);

        emit Purchase(listing.collection, listing.tokenId, msg.sender, amount, totalPrice);
    }

    function extendDeadline(uint256 listingId, uint256 newDuration) external {
        Listing storage listing = listings[listingId];
        if (listing.seller != msg.sender) revert NotSeller();
        if (!listing.active) revert ListingNotFound();

        uint256 newDeadline = newDuration > 0 ? block.timestamp + newDuration : 0;
        listing.deadline = newDeadline;
        
        emit DeadlineExtended(listingId, newDeadline);
    }

    function bulkList(
        address[] calldata collections,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts,
        uint256[] calldata unitPrices,
        uint256 duration
    ) external whenNotPaused returns (uint256[] memory listingIds) {
        uint256 length = collections.length;
        if (length != tokenIds.length || length != amounts.length || length != unitPrices.length) {
            revert InvalidParams();
        }

        listingIds = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            listingIds[i] = list(collections[i], tokenIds[i], amounts[i], unitPrices[i], duration);
        }
    }

    // View functions
    function getListing(uint256 listingId) 
        external 
        view 
        returns (Listing memory) 
    {
        return listings[listingId];
    }

    function getActiveListings(uint256 offset, uint256 limit) 
        external 
        view 
        returns (Listing[] memory activeListings, uint256[] memory listingIds) 
    {
        uint256 activeCount = 0;
        
        // First pass: count active listings
        for (uint256 i = 1; i <= listingCounter; i++) {
            if (listings[i].active && (listings[i].deadline == 0 || block.timestamp <= listings[i].deadline)) {
                activeCount++;
            }
        }

        // Calculate actual limit
        uint256 startIndex = offset;
        uint256 endIndex = offset + limit;
        if (endIndex > activeCount) endIndex = activeCount;
        uint256 resultLength = endIndex > startIndex ? endIndex - startIndex : 0;

        activeListings = new Listing[](resultLength);
        listingIds = new uint256[](resultLength);

        // Second pass: collect results
        uint256 currentIndex = 0;
        uint256 resultIndex = 0;
        
        for (uint256 i = 1; i <= listingCounter && resultIndex < resultLength; i++) {
            if (listings[i].active && (listings[i].deadline == 0 || block.timestamp <= listings[i].deadline)) {
                if (currentIndex >= startIndex) {
                    activeListings[resultIndex] = listings[i];
                    listingIds[resultIndex] = i;
                    resultIndex++;
                }
                currentIndex++;
            }
        }
    }

    function getSellerListing(address seller, address collection, uint256 tokenId) 
        external 
        view 
        returns (uint256) 
    {
        return sellerListings[seller][collection][tokenId];
    }

    // Internal functions
    function _getRoyalty(address collection, uint256 tokenId, uint256 salePrice) 
        internal 
        view 
        returns (address receiver, uint256 amount) 
    {
        try IERC2981(collection).royaltyInfo(tokenId, salePrice) returns (
            address royaltyReceiver,
            uint256 royaltyAmount
        ) {
            // Cap royalty at 10% to prevent abuse
            uint256 maxRoyalty = (salePrice * 1000) / 10000; // 10%
            amount = royaltyAmount > maxRoyalty ? maxRoyalty : royaltyAmount;
            receiver = royaltyReceiver;
        } catch {
            receiver = address(0);
            amount = 0;
        }
    }

    function _transferETH(address to, uint256 amount) internal {
        if (amount > 0) {
            (bool success, ) = payable(to).call{value: amount}("");
            if (!success) revert TransferFailed();
        }
    }

    // ERC1155 Receiver
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function _authorizeUpgrade(address newImplementation) 
        internal 
        override 
        onlyOwner 
    {}

    function supportsInterface(bytes4 interfaceId) 
        external 
        pure 
        override 
        returns (bool) 
    {
        return interfaceId == type(IERC1155Receiver).interfaceId;
    }
}