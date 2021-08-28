//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Token {
    string public name = "FunToken Coin";
    string public symbol = "FTC";
    uint256 public totalSupply = 10000000;
    mapping(address => uint256) balances;

    constructor() {
        //balance of person that deployed contract
        balances[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) external {
        require(balances[msg.sender] >= _value, "Not enough tokens!");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
    }

    function balanceOf(address _owner) external view returns (uint256 balance) {
        return balances[_owner];
    }
}
