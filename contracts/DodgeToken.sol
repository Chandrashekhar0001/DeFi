// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract MyToken is ERC20Capped,ERC20Burnable {
    address payable public owner;
    uint public blockReward;

    constructor(uint cap,uint reward) ERC20("DodgeToken","DGT") ERC20Capped(cap * (10 ** decimals())){
        owner = payable(msg.sender);
        _mint(owner, 10000000 * (10 ** decimals()));
        blockReward = reward * (10 ** decimals());
    }

}