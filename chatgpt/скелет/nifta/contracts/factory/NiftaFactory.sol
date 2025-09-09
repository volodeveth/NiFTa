// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

import {INiftaCollection} from "../collection/INiftaCollection.sol";

contract NiftaFactory is UUPSUpgradeable, OwnableUpgradeable {
    address public implementation;
    address public platformReceiver;
    uint256 public defaultPriceWei;
    uint256 public defaultTrigger;

    function initialize(address implementation_, address platformReceiver_, uint256 defaultPriceWei_, uint256 defaultTrigger_) external initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        require(implementation_ != address(0) && platformReceiver_ != address(0), "Zero addr");
        implementation = implementation_;
        platformReceiver = platformReceiver_;
        defaultPriceWei = defaultPriceWei_;
        defaultTrigger = defaultTrigger_ == 0 ? 1000 : defaultTrigger_;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function setPlatformReceiver(address newReceiver) external onlyOwner {
        require(newReceiver != address(0), "Zero addr");
        platformReceiver = newReceiver;
    }

    function setDefaults(uint256 priceWei, uint256 trigger) external onlyOwner {
        if (priceWei > 0) defaultPriceWei = priceWei;
        if (trigger > 0) defaultTrigger = trigger;
    }

    function createCollection(
        string memory uri,
        uint256 priceWei,
        uint256 maxPaidMintsTrigger
    ) external returns (address collection) {
        collection = Clones.clone(implementation);

        INiftaCollection(collection).initialize(
            msg.sender,
            platformReceiver,
            uri,
            priceWei == 0 ? defaultPriceWei : priceWei,
            maxPaidMintsTrigger == 0 ? defaultTrigger : maxPaidMintsTrigger
        );
    }
}
