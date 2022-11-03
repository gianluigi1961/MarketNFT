# Market NFT smart contract
MarketNFT : a Simple smart contract for the sale of NFTs<br>
Is ERC721 contract


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




<br>

## Modifiers<br>

