// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Address.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../node_modules/@openzeppelin/contracts/utils/Base64.sol";

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";


/*
*
* MarketNFT : a Simple smart contract for the sale of NFTs
* is ERC721 contract
*
*/
contract MarketNFT is Ownable, Pausable, ERC721URIStorage, ERC721Enumerable{
  using Strings for uint;
  using Counters for Counters.Counter;

  /*
  * The ID of the last NTF minted
  */
  Counters.Counter private _tokenId;

  /*
  * The NFTs price (each NTF can have it's price)
  */
  mapping(string => uint) prices;

  /*
  * The NFTs name => id
  */
  mapping(string => uint) names;
  
  /*
  * The temporary NFT json metadata url
  */
  string private tempUri;  
  
  /*
  * Contract constructor
  *
  *   Requirements:  
  *   - `_name` : name of the contract
  *   - `_symbol` : symbol of the contract
  *   - `_tempUri` : The temporary NFT json metadata url, returned when sale is not open
  */
  constructor(string memory _name, 
              string memory _symbol, 
              string memory _tempUri) ERC721(_name, _symbol){

    tempUri = _tempUri;       
    /*
    * The Smart contract is paused by default, 
    * will be unpaused when the Owner mint all the NFTs
    */
    _pause();
  }
  
  /*
  * The owner of the NFT with the given NFT name
  *
  * Requirements:  
  * - `_name` : name of the NFT
  *
  * Return
  * Address of the NFT owner
  */
  function ownerOf(string memory _name) public view isMinted(_name) returns(address){
    uint id = names[_name];
    return ERC721.ownerOf(id);    
  }

  /*
  * The contract owner start the NFTs sales
  */
  function unpause() public onlyOwner{
    _unpause();
  }

  /*
  * The contract owner mint the NFTs 
  *
  * Requirements:  
  * - `_name` : name of the NFT
  * - `_description` : description of the NFT
  * - `_price` : price of the NFT
  * - `_url` : NFT json metadata url
  * 
  */
  function mint(string memory _name, 
                string memory _description, 
                uint _price, 
                string memory _url) 
                public 
                onlyOwner 
                isNotMinted(_name){

    _tokenId.increment();   
    uint current_id = _tokenId.current();
    
    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked('{', 
                            '"name": "', _name, '"', 
                            '"description": "', _description, '"', 
                            '"image": "', _url, '"'
                            '}')
        )
      )
    );

    _safeMint(msg.sender, current_id);

    string memory finalUri = string(abi.encodePacked("data:application/json;base64,", json));
    _setTokenURI(current_id, finalUri);
    
    prices[_name] = _price;
    names[_name] = current_id;
    
    //Trasfer event emitted from ERC721

  }

  /*
  * The contract owner mint a collection of NFTs
  * 
  * Requirements:  
  * - `_name`         : array of name of the NFT
  * - `_description`  : array of description of the NFT
  * - `_price`        : array of price of the NFT
  * - `_url`          : array of NFT json metadata url  
  */
  function mintMultiple(string[] memory _name, 
                        string[] memory _description, 
                        uint[] memory _price, 
                        string[] memory _url) 
                        public 
                        onlyOwner {

    require(_name.length == _description.length && 
            _name.length == _price.length && 
            _name.length == _url.length, "ERR-12 The length of the arrays must be the same");
            
    for(uint x = 0; x < _name.length; x++){
      mint(_name[x], _description[x], _price[x], _url[x]);      
    }    
  }

  /*
  * Customers buy the NFT by name
  *
  * Requirements:  
  * - `_name` : name of the NFT
  */
  function buy(string memory _name) 
                public 
                payable
                isOpenSale 
                isMinted(_name) 
                {
    
    uint id = names[_name];
    
    require(msg.value >= prices[_name], "ERR-15 The price is not valid");
    
    _transfer(owner(), msg.sender, id);

    //Trasfer event emitted from ERC721
  }
  
  /*
  * The NFTs owner approve
  *
  *
  * Requirements:  
  * - `_to`   : address to approve
  * - `_name` : name of the NFT
  *
  * Returns
  * bool
  */
  function approveByName(address _to, string memory _name) public isMinted(_name) returns(bool){
    uint id = names[_name];
    ERC721.approve(_to, id);
    return true;
  }

  /*
  * The NFTs approved address transfer to new address
  *
  * Requirements:  
  * - `_from`   : address from transfer
  * - `_to`     : address to transfer
  * - `_name`   : name of the NFT
  *
  * Returns
  * bool
  */
  function transferFromByName(address _from, address _to, string memory _name) public isMinted(_name) returns(bool){
    uint id = names[_name];
    ERC721.transferFrom(_from, _to, id);
    return true;
  }

  /*
  * The wallet of the specified address
  *
  * Requirements:  
  * - `_owner`   : wallet address
  *
  * Returns
  * Array of token id
  */
  function walletOf(address _owner) public view returns(string[] memory){
    
    uint index = ERC721.balanceOf(_owner);
    string[] memory wallet = new string[](index);
    uint token_id;    
    
    for(uint x = 0; x < index; x++){
      token_id = tokenOfOwnerByIndex(_owner, x);    
      wallet[x] = token_id.toString();
    }

    return wallet;
  }

  /*
  * Return the current contract balance 
  */
  function getBalance() 
              public 
              view
              onlyOwner 
              returns(uint){
      return address(this).balance;
  }
  
  /* 
  *   Owner can withdraw Contract balance
  *
  *   Requirements:  
  *   - `_amount` : amount to withdraw
  */
  function withdraw(uint _amount) 
                      public 
                      payable 
                      onlyOwner {        
              
      uint balance = address(this).balance;
      require(_amount > 0, "ERR-16 The amount is zero");
      require(balance > 0, "ERR-17 The balance is zero");
      require(_amount <= balance, "ERR-18 The amount cannot exceed the balance");
      
      Address.sendValue(payable(owner()), _amount);        
  }

  /*
  * Return the Metadata token uri 
  *
  *   Requirements:  
  *   - `_id` : id of the NFT
  *
  * Return 
  * Json Metadata in base64 format
  */
  function tokenURI(uint256 _id) public view override(ERC721, ERC721URIStorage) isMintedById(_id) returns (string memory) {      
    return !paused() ? super.tokenURI(_id) : getTempUri();    
  }

  /*
  * Functions overrides
  */
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable){
      super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage){
    super._burn(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool){
    return super.supportsInterface(interfaceId);
  }

  /*
  *  Private Functions
  */
 
  /*
  * The uri for the image metadata when the NFT is not yet for sale
  */
  function getTempUri() private view returns(string memory){
    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked('{', 
                            '"name": "MarketNFT name"', 
                            '"description": "MarketNFT description"', 
                            '"image": "', tempUri, '"'
                            '}')
        )
      )
    );
    return string(abi.encodePacked("data:application/json;base64,", json));    
  } 

  /*
  * Functions modifiers
  */
  modifier isNotMinted(string memory _name){
    require(names[_name] == 0, "ERR-13 The token exists");
    _;
  }

  modifier isMintedById(uint _id){
    require(_exists(_id), string.concat("ERR-14 The token id: ", _id.toString(), " don't exists"));
    _;
  }

  modifier isMinted(string memory _name){
    require(names[_name] > 0, string.concat("ERR-11 The token ", _name, " don't exists"));
    _;
  }
  
  modifier isOpenSale {
    require(!paused(), "ERR-10 The sale is not open");
    _;
  }
  
}
