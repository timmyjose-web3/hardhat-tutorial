//SPDX-License-Identifier: MIT License

pragma solidity ^0.8.0;

contract Token {
    string public name = "My 2023 Hardhat Token";
    string public symbol = "MHT";
    // the fixed amount of tokens
    uint256 public totalSupply = 1000000;
    address public owner;
    mapping(address => uint256) balances;

    // hook for off-chain applications to access the contract data
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor() {
        // all the tokens belong to the person deploying the contract aka the owner
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    // the `external` modifier makes this function callable only from outside the contract
    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
    }

    // `view` means that this call does not modify the contract state, and can therefore
    // be called without triggering a transaction.
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
