// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface INiftaCollection {
    function initialize(
        address creator_,
        address platformReceiver_,
        string memory uri_,
        uint256 priceWei_,
        uint256 maxPaidMintsTrigger_
    ) external;

    function creatorFreeMint(uint256 id, uint256 amount) external;
    function mint(uint256 id, uint256 amount, address referrer) external payable;

    function priceWei() external view returns (uint256);
    function endTime() external view returns (uint256);
    function firstPaidMinter() external view returns (address);
    function platformReceiver() external view returns (address);
    function creator() external view returns (address);
}
