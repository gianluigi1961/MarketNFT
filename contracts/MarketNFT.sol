// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Address.sol";

import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract MarketNFT is Ownable, Pausable, ERC721{
  using Strings for uint;
  
  uint private tokenId;
  string private baseUri;
  string private unveilUri;  
  uint private maxTokenAmount;

  uint mintPrice;  
  uint maxMintAmount;
  
  constructor(string memory _name, 
              string memory _symbol, 
              uint _mintPrice, 
              uint _maxTokenAmount, 
              uint _maxMintAmount, 
              string memory _baseUri, 
              string memory _unveilUri) ERC721(_name, _symbol){

    mintPrice = _mintPrice;
    maxTokenAmount = _maxTokenAmount;
    baseUri = _baseUri;
    unveilUri = _unveilUri;
    maxMintAmount = _maxMintAmount;
    _pause();
  }

  function pause() public onlyOwner{
    _pause();
  }

  function unpause() public onlyOwner{
    _unpause();
  }

  function mint(uint _amount) public payable isOpenSaleOrOwner{    
    require(tokenId < maxTokenAmount, "ERR-01 No more NFT to mint");
    require(_amount <= maxMintAmount, string.concat("ERR-02 Amount too much, the max amount is ", maxMintAmount.toString()));
    require(msg.value >= mintPrice * _amount, "ERR-03 The value send is not valid");
    
    for(uint x = 0; x < _amount; x++){      
      _safeMint(msg.sender, ++tokenId);
    }    
  }

  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    _requireMinted(_tokenId);  
    return (bytes(_baseURI()).length > 0) ? string(abi.encodePacked(_baseURI(), _tokenId.toString())) : unveilUri;    
  }

  function _baseURI() internal view override returns (string memory) {    
    return bytes(baseUri).length > 0 ? baseUri : "";
  }
  
  //https://gateway.pinata.cloud/ipfs/QmbJGcKj9ZSaQMktKoKKQffhfMrEd7EcjfhzEhFuNnKnVU/
  function setBaseUri(string memory _baseUri) public onlyOwner {
    baseUri = _baseUri;
  }

  modifier isOpenSaleOrOwner {
    require(!paused(), "ERR-10 The sale is not open");
    _;
  }
  
}
