// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

import {INiftaCollection} from "./INiftaCollection.sol";

contract NiftaCollection1155 is
    ERC1155,
    ERC1155Supply,
    ERC2981,
    Ownable,
    ReentrancyGuard,
    Pausable,
    INiftaCollection
{
    uint256 public constant ROYALTY_BPS = 250;
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

    mapping(address => uint256) public claimable;

    error MintClosed();
    error FreeMintUsed();
    error WrongValue();
    error ZeroAmount();
    error RefEqualsMinter();

    constructor() ERC1155("") {}

    function initialize(
        address creator_,
        address platformReceiver_,
        string memory uri_,
        uint256 priceWei_,
        uint256 maxPaidMintsTrigger_
    ) external override {
        require(creator == address(0), "Already initialized");
        require(creator_ != address(0) && platformReceiver_ != address(0), "Zero addr");

        creator = creator_;
        platformReceiver = platformReceiver_;
        priceWei = priceWei_;
        maxPaidMintsTrigger = maxPaidMintsTrigger_ == 0 ? FIRST_TRIGGER : maxPaidMintsTrigger_;

        _setURI(uri_);
        _setDefaultRoyalty(creator_, ROYALTY_BPS);
        _transferOwnership(creator_);
    }

    function creatorFreeMint(uint256 id, uint256 amount) external override whenNotPaused nonReentrant {
        require(msg.sender == creator, "Only creator");
        if (creatorMintedFree) revert FreeMintUsed();
        if (amount == 0) revert ZeroAmount();

        creatorMintedFree = true;
        _mint(creator, id, amount, "");
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

        if (firstPaidMinter == address(0)) {
            firstPaidMinter = msg.sender;
        }

        _mint(msg.sender, id, amount, "");

        uint256 total = msg.value;
        uint256 toCreator = (total * 50) / 100;
        uint256 toFirst = (total * 10) / 100;

        uint256 toReferral = 0;
        uint256 toPlatform = (total * 20) / 100;

        if (referrer != address(0)) {
            toReferral = (total * 20) / 100;
        } else {
            toPlatform += (total * 20) / 100;
        }

        claimable[creator] += toCreator;
        claimable[firstPaidMinter] += toFirst;
        if (toReferral > 0) claimable[referrer] += toReferral;
        claimable[platformReceiver] += toPlatform;

        paidMints += amount;
        if (endTime == 0 && paidMints >= maxPaidMintsTrigger) {
            endTime = block.timestamp + DURATION;
        }
    }

    function claim() external nonReentrant {
        uint256 bal = claimable[msg.sender];
        require(bal > 0, "Nothing to claim");
        claimable[msg.sender] = 0;
        (bool ok, ) = payable(msg.sender).call{value: bal}(""); require(ok, "ETH transfer failed");
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
    function setURI(string memory newuri) external onlyOwner { _setURI(newuri); }

    function supportsInterface(bytes4 iid) public view override(ERC1155, ERC2981) returns (bool) {
        return ERC1155.supportsInterface(iid) || ERC2981.supportsInterface(iid);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids,
        uint256[] memory amounts, bytes memory data
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    receive() external payable {}
}
