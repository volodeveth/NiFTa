// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface CommonEvents {
    event CollectionCreated(address indexed collection, address indexed creator, string uri, uint256 priceWei);
    event TimerStarted(address indexed collection, uint256 endTime);
    event MintPaid(address indexed collection, address indexed minter, uint256 id, uint256 amount, uint256 value, address referrer);
    event FirstPaidMinterSet(address indexed collection, address indexed firstMinter);
    event Listed(address indexed collection, uint256 indexed tokenId, address indexed seller, uint256 amount, uint256 unitPrice);
    event Purchase(address indexed collection, uint256 indexed tokenId, address indexed buyer, uint256 amount, uint256 totalPaid);
    event Cancel(address indexed collection, uint256 indexed tokenId, address indexed seller);
}
