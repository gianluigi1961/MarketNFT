// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Address.sol";



contract MarketNFT is Ownable{
  //address public owner = msg.sender;
  //uint public last_completed_migration;





  modifier restricted() {
    require(
      msg.sender == owner(),
      "This function is restricted to the contract's owner"
    );
    _;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }
}
