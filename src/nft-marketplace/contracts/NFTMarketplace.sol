// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    // latest minted tokenId
    Counters.Counter private _tokenIds;
    // number of items sold 
    Counters.Counter private _itemsSold;

    // marketplace fee to list NFT
    uint256 listingPrice = 0.05 ether;
    // smart contract creator
    address payable smartContractOwner;

    mapping(uint256 => NonFungibleToken) private idToNonFungibleToken;

    struct NonFungibleToken {
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      uint256 lastSale;
      bool sold;
    }

    event NonFungibleTokenCreated (
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
      uint256 lastSale,
      bool sold
    );

    constructor() ERC721("My NFT Marketplace", "MNM") {
      smartContractOwner = payable(msg.sender);
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }

    /* Mints a token and lists it in the marketplace
       payable allows to deposit ETH to contract 
     */
    function mintToken(string memory tokenURI, uint256 price) public payable returns (uint) {
      require(price >= 0, "NFT Price cannot be negative");
      require(msg.value == listingPrice, "Transaction fee sent should be equal to listing price");
      // increment token counter
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      // mint NFT to address who requested this
      _safeMint(msg.sender, newTokenId);
      // map tokenId to IPFS url 
      _setTokenURI(newTokenId, tokenURI);
      // function to emit event and update global variables
      createNonFungibleToken(newTokenId, price);

      return newTokenId;
    }

  function bulkMintTokens(string memory tokenBaseURI, uint256 price, uint256 mintAmount) public payable {
    require(mintAmount > 0, "Specify positive number of NFT to mint");
    require(price >= 0, "NFT Price cannot be negative");
    require(msg.value == listingPrice * mintAmount, "Transaction fee sent should be equal to listing price * number of nfts to be minted");

    for (uint256 i = 1; i <= mintAmount; i++) {
      // increment token counter
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      // mint NFT to address who requested this
      _safeMint(msg.sender, newTokenId);
      // map tokenId to IPFS url 
      string memory tokenUri = string.concat(tokenBaseURI, "/", Strings.toString(newTokenId), "_metadata.json");
      _setTokenURI(newTokenId, tokenUri);
      // function to emit event and update global variables
      createNonFungibleToken(newTokenId, price);
    }
  }

    function createNonFungibleToken(
      uint256 tokenId,
      uint256 price
    ) private {
      // set seller as address that requested NFT to be created 
      // set owner the contract address, which indicates that token is not yet bought
      // add additional sale boolean to increase readability
      idToNonFungibleToken[tokenId] =  NonFungibleToken(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        price,
        0,
        false
      );

      // transfer ownership
      _transfer(msg.sender, address(this), tokenId);

      emit NonFungibleTokenCreated(
        tokenId,
        msg.sender,
        address(this),
        price,
        0,
        false
      );
    }

    /* Allows someone to resell a token they have purchased 
       payable allows to deposit ETH to contract
    */
    function resellToken(uint256 tokenId, uint256 price) public payable {
      require(idToNonFungibleToken[tokenId].owner == msg.sender, "Only owner can sell this item");
      require(msg.value == listingPrice, "Transaction fee sent should be equal to listing price");
      uint256 lastSale = idToNonFungibleToken[tokenId].price;
      
      idToNonFungibleToken[tokenId].sold = false;
      idToNonFungibleToken[tokenId].price = price;
      idToNonFungibleToken[tokenId].lastSale = lastSale;
      idToNonFungibleToken[tokenId].seller = payable(msg.sender);
      idToNonFungibleToken[tokenId].owner = payable(address(this));
      _itemsSold.decrement();

      _transfer(msg.sender, address(this), tokenId);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function buyToken(
      uint256 tokenId
      ) public payable {
      uint price = idToNonFungibleToken[tokenId].price;
      address seller = idToNonFungibleToken[tokenId].seller;
      bool isSold = idToNonFungibleToken[tokenId].sold;
      require(!isSold, "NFT is already sold.");
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");
      idToNonFungibleToken[tokenId].owner = payable(msg.sender);
      idToNonFungibleToken[tokenId].sold = true;
      idToNonFungibleToken[tokenId].seller = payable(address(0));
      _itemsSold.increment();
      _transfer(address(this), msg.sender, tokenId);

      // transfers deposited listingPrice, when NFT was minted or put back to market, to smart contract owner
      payable(smartContractOwner).transfer(listingPrice);
      // transfers asking price to seller
      payable(seller).transfer(msg.value);
    }

    /* Returns all unsold market items */
    function fetchUnsoldNFTs() public view returns (NonFungibleToken[] memory) {
      uint itemCount = _tokenIds.current();
      uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
      uint currentIndex = 0;

      NonFungibleToken[] memory items = new NonFungibleToken[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToNonFungibleToken[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          NonFungibleToken storage currentItem = idToNonFungibleToken[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (NonFungibleToken[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToNonFungibleToken[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      NonFungibleToken[] memory items = new NonFungibleToken[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToNonFungibleToken[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          NonFungibleToken storage currentItem = idToNonFungibleToken[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns all market items */
    function fetchAllNFTs() public view returns (NonFungibleToken[] memory) {
      uint itemCount = _tokenIds.current();
      uint currentIndex = 0;

      NonFungibleToken[] memory items = new NonFungibleToken[](itemCount);
      for (uint i = 0; i < itemCount; i++) {
        uint currentId = i + 1;
        NonFungibleToken storage currentItem = idToNonFungibleToken[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
      return items;
    }

    /* Function to return the current balance of contract */
    function getContractBalance(
    ) public view returns(uint256){
        return address(this).balance;
    }
}