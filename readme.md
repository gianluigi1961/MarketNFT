# Market NFT smart contract
MarketNFT : a Simple smart contract for the sale of NFTs<br>
is ERC721 contract

Etherscan url:<br>
https://goerli.etherscan.io/address/0xFeb5E20605730914Ec94e165A57A3648A8019F3B#code<br><br>

## Storage data
mapping(string => uint) prices: Prive of NFTs <br>
mapping(string => uint) names: NFT id (by name)<br>
string private tempUri: the temporary NFT json metadata url<br>


## Events
Trasfer (mint) event emitted from ERC721<br>
Trasfer (NFT sale) event emitted from ERC721<br>


## Public functions<br>

<b>ownerOf</b>(string memory _name)<br>
The owner of the NFT with the given NFT name<br>
@_name: name of the NFT<br>

<b>unpause</b><br>
The contract owner start the NFTs sales<br>


<b>mint</b>(string memory _name, string memory _description, uint _price, string memory _url)<br>
The contract owner mint the NFTs <br>
@_name: name of the NFT<br>
@_description: description of the NFT<br>
@_price: price of the NFT<br>
@_url: NFT json metadata url<br>


<b>mintMultiple</b>(string[] memory _name, string[] memory _description, uint[] _price, string[] memory _url)<br>
The contract owner mint a collection of NFTs <br>
@_name: array of name of the NFT<br>
@_description: array of description of the NFT<br>
@_price: array of price of the NFT<br>
@_url: array of NFT json metadata url<br>



<b>buy</b>(string memory _name)<br>
Customers buy the NFT by name<br>
@_name: name of the NFT<br>



<b>approveByName</b>(address _to, string memory _name)<br>
The NFTs owner approve<br>
@_to: address to approve<br>
@_name: name of the NFT<br>


<b>transferFromByName</b>(address _from, address _to, string memory _name)<br>
The NFTs approved address transfer to new address<br>
@_from: address from transfer<br>
@_to: address to transfer<br>
@_name: name of the NFT<br>


<b>walletOf</b>(address _owner)<br>
The wallet of the specified address<br>
@_owner  : wallet address<br>


<b>getBalance</b><br>
Return the current contract balance <br>


<b>withdraw</b>(uint _amount) <br>
Owner can withdraw Contract balance<br>
@_amount: amount to withdraw<br>


<b>tokenURI</b>(uint256 _id)<br>
Return the Metadata token uri <br>
@_id : id of the NFT<br>




<br>

## Modifiers<br>
<b>isNotMinted</b>(string memory _name)<br>

<b>isMintedById</b>(uint _id)<br>

<b>isMinted</b>(string memory _name)<br>

<b>isOpenSale</b>
