// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    address payable public owner;
    constructor(uint initialSupply) ERC20("DodgeToken","DGT"){
        owner = payable(msg.sender);
        _mint(owner, initialSupply);
    }

}