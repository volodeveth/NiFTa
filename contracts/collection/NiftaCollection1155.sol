// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import {ERC1155SupplyUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import {ERC2981Upgradeable} from "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import {INiftaCollection} from "./INiftaCollection.sol";
import {CommonEvents} from "../interfaces/CommonEvents.sol";

/**
 * @title NiFTa Collection (ERC-1155)
 * @dev Fixed price 0.0001 ETH, free creator mint, 48h timer after 1000 paid mints
 * @dev Revenue split: Creator 50%, FirstPaidMinter 10%, Referral 20%, Platform 20%
 * @dev Royalties: 2.5% to creator via ERC-2981, 2.5% platform fee handled by marketplace
 */
contract NiftaCollection1155 is
    Initializable,
    ERC1155Upgradeable,
    ERC1155SupplyUpgradeable,
    ERC2981Upgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable,
    INiftaCollection,
    CommonEvents
{
    uint256 public constant ROYALTY_BPS = 250; // 2.5%
    uint256 public constant FIRST_TRIGGER = 1000;
    uint256 public constant DURATION = 48 hours;

    address public creator;
    address public platformReceiver;
    uint256 public priceWei;
    uint256 public maxPaidMintsTrigger;

    address public firstPaidMinter;
    uint256 public paidMints;
    uint256 public override endTime;

    bool public creatorMintedFree;

    // Pull payment balances
    mapping(address => uint256) public claimable;

    error MintClosed();
    error FreeMintUsed();
    error WrongValue();
    error ZeroAmount();
    error RefEqualsMinter();
    error AlreadyInitialized();
    error ZeroAddress();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address creator_,
        address platformReceiver_,
        string memory uri_,
        uint256 priceWei_,
        uint256 maxPaidMintsTrigger_
    ) external override initializer {
        if (creator_ == address(0) || platformReceiver_ == address(0)) revert ZeroAddress();

        __ERC1155_init(uri_);
        __ERC1155Supply_init();
        __ERC2981_init();
        __Ownable_init(creator_);
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        creator = creator_;
        platformReceiver = platformReceiver_;
        priceWei = priceWei_;
        maxPaidMintsTrigger = maxPaidMintsTrigger_ == 0 ? FIRST_TRIGGER : maxPaidMintsTrigger_;

        _setDefaultRoyalty(creator_, ROYALTY_BPS);
    }

    function creatorFreeMint(uint256 id, uint256 amount) external override whenNotPaused nonReentrant {
        if (msg.sender != creator) revert OwnableUnauthorizedAccount(msg.sender);
        if (creatorMintedFree) revert FreeMintUsed();
        if (amount == 0) revert ZeroAmount();

        creatorMintedFree = true;
        _mint(creator, id, amount, "");
        
        emit MintPaid(address(this), creator, id, amount, 0, address(0));
    }

    function mint(uint256 id, uint256 amount, address referrer)
        external
        payable
        override
        whenNotPaused
        nonReentrant
    {
        if (amount == 0) revert ZeroAmount();
        if (endTime != 0 && block.timestamp >= endTime) revert MintClosed();
        if (msg.value != priceWei * amount) revert WrongValue();
        if (referrer == msg.sender) revert RefEqualsMinter();

        // Set first paid minter
        if (firstPaidMinter == address(0)) {
            firstPaidMinter = msg.sender;
            emit FirstPaidMinterSet(address(this), msg.sender);
        }

        _mint(msg.sender, id, amount, "");

        // Revenue distribution
        uint256 total = msg.value;
        uint256 toCreator = (total * 50) / 100;        // Always 50% to creator
        uint256 toFirst = (total * 10) / 100;          // Always 10% to first paid minter
        uint256 toReferral = referrer != address(0) ? (total * 20) / 100 : 0;  // 20% if referrer exists
        uint256 toPlatform = (total * 40) / 100 - toReferral;  // 40% minus referral (20% base + 20% from unused referral)

        claimable[creator] += toCreator;
        claimable[firstPaidMinter] += toFirst;
        if (toReferral > 0) claimable[referrer] += toReferral;
        claimable[platformReceiver] += toPlatform;

        // Check timer trigger
        paidMints += amount;
        if (endTime == 0 && paidMints >= maxPaidMintsTrigger) {
            endTime = block.timestamp + DURATION;
            emit TimerStarted(address(this), endTime);
        }

        emit MintPaid(address(this), msg.sender, id, amount, total, referrer);
    }

    function claim() external nonReentrant {
        uint256 bal = claimable[msg.sender];
        if (bal == 0) revert("Nothing to claim");
        
        claimable[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: bal}("");
        if (!success) revert("Transfer failed");
    }

    // Admin functions
    function pause() external onlyOwner { 
        _pause(); 
    }
    
    function unpause() external onlyOwner { 
        _unpause(); 
    }
    
    function setURI(string memory newuri) external onlyOwner { 
        _setURI(newuri); 
    }

    // View functions
    function isActive() external view returns (bool) {
        return endTime == 0 || block.timestamp < endTime;
    }

    function timeLeft() external view returns (uint256) {
        if (endTime == 0) return type(uint256).max;
        if (block.timestamp >= endTime) return 0;
        return endTime - block.timestamp;
    }

    function _authorizeUpgrade(address newImplementation) 
        internal 
        override 
        onlyOwner 
    {}

    // Required overrides
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC1155Upgradeable, ERC2981Upgradeable) 
        returns (bool) 
    {
        return ERC1155Upgradeable.supportsInterface(interfaceId) || ERC2981Upgradeable.supportsInterface(interfaceId);
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
        whenNotPaused
    {
        super._update(from, to, ids, values);
    }


    receive() external payable {}
}