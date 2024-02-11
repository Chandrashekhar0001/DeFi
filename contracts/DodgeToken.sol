// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

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

    function _mintReward() internal {
        _mint(block.coinbase,blockReward);
    }

    function _update(address from, address to, uint value) internal virtual override(ERC20, ERC20Capped){
        if(from != address(0) && to != block.coinbase && block.coinbase != address(0)){
            _mintReward();
        }
       super._update(from,to,value);
    }

    function setReward(uint reward) public onlyOwner {
        blockReward = reward * (10 ** decimals());
    }

    function destroy()public onlyOwner {
        selfdestruct(owner);
    }

    modifier onlyOwner {
        require(msg.sender == owner,"only owner can call this function ");
        _;
    }

}