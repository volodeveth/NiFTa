// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC2981} from "@openzeppelin/contracts/interfaces/IERC2981.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Fixed-price marketplace:
 * - 95% seller, 2.5% creator royalty (ERC-2981), 2.5% platform
 */
contract NiftaMarketplace is ReentrancyGuard, Pausable, Ownable {
    struct Listing {
        address collection;
        uint256 tokenId;
        address seller;
        uint256 amount;
        uint256 unitPrice;
        bool    active;
    }

    address public platformReceiver;
    uint96 public constant PLATFORM_FEE_BPS = 250;

    uint256 public listingCounter;
    mapping(uint256 => Listing) public listings;

    constructor(address platformReceiver_) {
        require(platformReceiver_ != address(0), "Zero addr");
        platformReceiver = platformReceiver_;
    }

    function setPlatformReceiver(address newReceiver) external onlyOwner {
        require(newReceiver != address(0), "Zero addr");
        platformReceiver = newReceiver;
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function list(address collection, uint256 tokenId, uint256 amount, uint256 unitPrice) external whenNotPaused returns (uint256 id) {
        require(amount > 0 && unitPrice > 0, "Bad params");
        IERC1155(collection).safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
        id = ++listingCounter;
        listings[id] = Listing(collection, tokenId, msg.sender, amount, unitPrice, true);
    }

    function cancel(uint256 id) external nonReentrant {
        Listing storage l = listings[id];
        require(l.active, "Inactive");
        require(l.seller == msg.sender, "Not seller");
        l.active = false;
        IERC1155(l.collection).safeTransferFrom(address(this), l.seller, l.tokenId, l.amount, "");
    }

    function buy(uint256 id, uint256 amount) external payable nonReentrant whenNotPaused {
        Listing storage l = listings[id];
        require(l.active, "Inactive");
        require(amount > 0 && amount <= l.amount, "Bad amount");
        uint256 total = l.unitPrice * amount;
        require(msg.value == total, "Wrong value");

        l.amount -= amount;
        if (l.amount == 0) l.active = false;
        IERC1155(l.collection).safeTransferFrom(address(this), msg.sender, l.tokenId, amount, "");

        (address royaltyReceiver, uint256 royaltyAmount) = IERC2981(l.collection).royaltyInfo(l.tokenId, total);
        uint256 platformFee = (total * PLATFORM_FEE_BPS) / 10_000;
        uint256 sellerProceeds = total - royaltyAmount - platformFee;

        if (royaltyAmount > 0) {
            (bool ok1, ) = royaltyReceiver.call{value: royaltyAmount}(""); require(ok1, "Royalty fail");
        }
        (bool ok2, ) = platformReceiver.call{value: platformFee}(""); require(ok2, "Platform fail");
        (bool ok3, ) = payable(l.seller).call{value: sellerProceeds}(""); require(ok3, "Seller fail");
    }

    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }
    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata) external pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
