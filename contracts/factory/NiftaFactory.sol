// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

import {INiftaCollection} from "../collection/INiftaCollection.sol";
import {CommonEvents} from "../interfaces/CommonEvents.sol";

/**
 * @title NiFTa Factory
 * @dev Creates ERC-1155 collection clones with optimized gas usage
 * @dev UUPS upgradeable for future improvements
 */
contract NiftaFactory is 
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    CommonEvents
{
    address public implementation;
    address public platformReceiver;
    uint256 public defaultPriceWei;
    uint256 public defaultTrigger;

    mapping(address => address[]) public creatorCollections;
    address[] public allCollections;

    event ImplementationUpdated(address indexed oldImpl, address indexed newImpl);
    event DefaultsUpdated(uint256 priceWei, uint256 trigger);

    error ZeroAddress();
    error InvalidPrice();
    error InvalidTrigger();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address implementation_,
        address platformReceiver_,
        uint256 defaultPriceWei_,
        uint256 defaultTrigger_
    ) external initializer {
        if (implementation_ == address(0) || platformReceiver_ == address(0)) revert ZeroAddress();
        if (defaultPriceWei_ == 0) revert InvalidPrice();
        if (defaultTrigger_ == 0) revert InvalidTrigger();

        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        implementation = implementation_;
        platformReceiver = platformReceiver_;
        defaultPriceWei = defaultPriceWei_;
        defaultTrigger = defaultTrigger_;
    }

    function _authorizeUpgrade(address newImplementation) 
        internal 
        override 
        onlyOwner 
    {}

    function setPlatformReceiver(address newReceiver) external onlyOwner {
        if (newReceiver == address(0)) revert ZeroAddress();
        platformReceiver = newReceiver;
    }

    function setImplementation(address newImplementation) external onlyOwner {
        if (newImplementation == address(0)) revert ZeroAddress();
        address oldImpl = implementation;
        implementation = newImplementation;
        emit ImplementationUpdated(oldImpl, newImplementation);
    }

    function setDefaults(uint256 priceWei, uint256 trigger) external onlyOwner {
        if (priceWei == 0) revert InvalidPrice();
        if (trigger == 0) revert InvalidTrigger();
        
        defaultPriceWei = priceWei;
        defaultTrigger = trigger;
        emit DefaultsUpdated(priceWei, trigger);
    }

    function createCollection(
        string memory uri,
        uint256 priceWei,
        uint256 maxPaidMintsTrigger
    ) external returns (address collection) {
        // Use defaults if parameters are 0
        uint256 finalPrice = priceWei == 0 ? defaultPriceWei : priceWei;
        uint256 finalTrigger = maxPaidMintsTrigger == 0 ? defaultTrigger : maxPaidMintsTrigger;

        // Clone the implementation
        collection = Clones.clone(implementation);

        // Initialize the clone
        INiftaCollection(collection).initialize(
            msg.sender,
            platformReceiver,
            uri,
            finalPrice,
            finalTrigger
        );

        // Track collections
        creatorCollections[msg.sender].push(collection);
        allCollections.push(collection);

        emit CollectionCreated(collection, msg.sender, uri, finalPrice);
    }

    // View functions
    function getCreatorCollections(address creator) 
        external 
        view 
        returns (address[] memory) 
    {
        return creatorCollections[creator];
    }

    function getAllCollections() external view returns (address[] memory) {
        return allCollections;
    }

    function getTotalCollections() external view returns (uint256) {
        return allCollections.length;
    }

    function getCreatorCollectionCount(address creator) 
        external 
        view 
        returns (uint256) 
    {
        return creatorCollections[creator].length;
    }

    function predictCollectionAddress(address creator, uint256 salt) 
        external 
        view 
        returns (address) 
    {
        return Clones.predictDeterministicAddress(implementation, bytes32(salt));
    }

    function createDeterministicCollection(
        string memory uri,
        uint256 priceWei,
        uint256 maxPaidMintsTrigger,
        uint256 salt
    ) external returns (address collection) {
        uint256 finalPrice = priceWei == 0 ? defaultPriceWei : priceWei;
        uint256 finalTrigger = maxPaidMintsTrigger == 0 ? defaultTrigger : maxPaidMintsTrigger;

        collection = Clones.cloneDeterministic(implementation, bytes32(salt));

        INiftaCollection(collection).initialize(
            msg.sender,
            platformReceiver,
            uri,
            finalPrice,
            finalTrigger
        );

        creatorCollections[msg.sender].push(collection);
        allCollections.push(collection);

        emit CollectionCreated(collection, msg.sender, uri, finalPrice);
    }
}