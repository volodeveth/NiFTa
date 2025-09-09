// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

import {INiftaCollection} from "./INiftaCollection.sol";
import {CommonEvents} from "../interfaces/CommonEvents.sol";

/**
 * @title NiFTa Collection (ERC-1155)
 * @dev Fixed price 0.0001 ETH, free creator mint, 48h timer after 1000 paid mints
 * @dev Revenue split: Creator 50%, FirstPaidMinter 10%, Referral 20%, Platform 20%
 * @dev Royalties: 2.5% to creator via ERC-2981, 2.5% platform fee handled by marketplace
 */
contract NiftaCollection1155 is
    ERC1155,
    ERC1155Supply,
    ERC2981,
    Ownable,
    ReentrancyGuard,
    Pausable,
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

    constructor() ERC1155("") {
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

        creator = creator_;
        platformReceiver = platformReceiver_;
        priceWei = priceWei_;
        maxPaidMintsTrigger = maxPaidMintsTrigger_ == 0 ? FIRST_TRIGGER : maxPaidMintsTrigger_;

        _setURI(uri_);
        _setDefaultRoyalty(creator_, ROYALTY_BPS);
        _transferOwnership(creator_);
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
        uint256 toCreator = (total * 50) / 100;
        uint256 toFirst = (total * 10) / 100;
        uint256 toReferral = referrer != address(0) ? (total * 20) / 100 : 0;
        uint256 toPlatform = (total * 20) / 100 + (total * 20) / 100 - toReferral;

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

    // Required overrides
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC1155, ERC2981) 
        returns (bool) 
    {
        return ERC1155.supportsInterface(interfaceId) || ERC2981.supportsInterface(interfaceId);
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
        whenNotPaused
    {
        super._update(from, to, ids, values);
    }

    // Disable initializer for implementation contract
    function _disableInitializers() internal virtual {
        // Implementation can't be initialized
    }

    modifier initializer() {
        if (creator != address(0)) revert AlreadyInitialized();
        _;
    }

    receive() external payable {}
}