import { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import axios from 'axios';
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import SetPriceModal from './set-price-modal.js';
import contractAbi from '../contracts/abis/contract-abis.json';

export default function GetNFTsComponent({ showOnlyMyNFTs }) {
  const [nfts, setNfts] = useState([]);
  let [isOpen, setIsOpen] = useState(false);
  let [nftToResell, setNftToResell] = useState();

  const marketplaceAddress = process.env.MARKETPLACE_SMART_CONTRACT;
  let contract;

  useEffect(() => {
    loadNFTs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function connectToSmartContract() {
    if (!contract) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      contract = new ethers.Contract(marketplaceAddress, contractAbi.marketplaceAbi, signer);
    }
  }

  async function loadNFTs() {
    await connectToSmartContract();

    let listOfNFTs = [];

    if (showOnlyMyNFTs) {
      listOfNFTs = await contract.fetchMyNFTs();
    } else {
      listOfNFTs = await contract.fetchAllNFTs();
    }

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(listOfNFTs.map(async nft => {
      const tokenUri = await contract.tokenURI(nft.tokenId);
      const metadata = await axios.get(tokenUri);
      return {
        tokenId: nft.tokenId.toNumber(),
        owner: nft.owner,
        seller: nft.seller,
        image: metadata.data.image,
        name: metadata.data.name,
        description: metadata.data.description,
        price: nft.price,
        sold: nft.sold
      };
    }));

    setNfts(items);
  }

  async function onBuyNftClicked(nft) {
    await connectToSmartContract();

    /* user will be prompted to pay the asking process to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'wei');
    const transaction = await contract.buyToken(nft.tokenId, {
      value: price
    });
    await transaction.wait();
    await loadNFTs();
  }

  async function onResellNftClicked(nft) {
    setIsOpen(true);
    setNftToResell(nft);
  }

  function handleModalClose(response) {
    setIsOpen(false);
    if (response.confirmed) {
      resellNft(nftToResell, response.newPriceInETH);
    }
  }



  async function resellNft(nft, newPriceInETH) {
    await connectToSmartContract();

    const priceFormatted = ethers.utils.parseUnits(newPriceInETH, 'ether');
    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();
    let transaction = await contract.resellToken(nft.tokenId, priceFormatted, { value: listingPrice });
    await transaction.wait();
    await loadNFTs();
  }

  function formatPriceToETH(priceInWei) {
    return ethers.utils.formatEther(priceInWei);
  }

  function getSellerOrOwner(nft) {
    let sellerOrOwner = `Seller: ${nft.seller}`;
    if (nft.seller === ethers.constants.AddressZero) {
      sellerOrOwner = `Owner: ${nft.owner}`;
    }
    return sellerOrOwner;
  }

  function renderAvailabilitySection(nft) {
    let availability = '';

    if (!showOnlyMyNFTs) {
      availability = (
        <p className={`p-2 text-gray-500 text-sm truncate ${nft.sold ? 'text-red-600' : 'text-green-600'}`}>
          {nft.sold ? 'Sold' : 'Available'}
        </p>
      );
    }
    return availability
  }

  function renderButton(nft) {
    let button = '';

    const buttonName = showOnlyMyNFTs ? 'Re-Sell' : 'Buy';
    const buttonCallbackMethod = showOnlyMyNFTs ? () => onResellNftClicked(nft) : () => onBuyNftClicked(nft);
    const buttonColour = showOnlyMyNFTs ? 'bg-amber-500 hover:bg-amber-400' : 'bg-green-500 hover:bg-green-400';

    let buy_sellButton = (
      <button onClick={buttonCallbackMethod} className={`absolute -bottom-72 group-hover:-translate-y-72 transition-all duration-300 ease-in-out w-full ${buttonColour} h-10 inline-flex items-center justify-center`}>
        <p className="text-white">{buttonName}</p>
      </button>
    );

    if (showOnlyMyNFTs || !nft.sold) {
      button = buy_sellButton;
    }

    return button;
  }

  if (!nfts.length) return (
    <div className="flex justify-center h-[calc(100vh-24rem)] items-center">
      <h1 className="text-3xl">No items in marketplace</h1>
    </div>
  );

  return (
    <div className="flex flex-col items-center px-4 w-full max-w-screen-2xl bg-slate-100 min-h-screen mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
        {
          nfts.map((nft, i) => (
            <div key={i} className="group flex flex-col items-center justify-center rounded-xl bg-white drop-shadow-lg overflow-hidden">
              <div className="overflow-hidden">
                <LazyLoadImage className="scale-100 group-hover:scale-110 transition-all duration-400 ease-in-out"
                  height={250}
                  src={nft.image}
                  effect="opacity"
                  width={255}
                />
              </div>

              <div className="flex flex-col w-full">
                <p className="text-xl font-semibold h-15 p-2" >{nft.name}</p>
                <div className="w-60 p-2">
                  <p className="text-gray-800 truncate">{nft.description}</p>
                  <p className="text-gray-500 text-xs truncate">{getSellerOrOwner(nft)}</p>
                </div>

                {renderAvailabilitySection(nft)}

                <div className="h-10">
                  <div className="flex absolute text-sm text-gray-500 p-2">
                    <span>Last Sale: </span>
                    <img className="ml-2" src={'/images/eth_icon.png'} width="10" height="5" />
                    <span className="ml-2">{formatPriceToETH(nft.price)} ETH</span>
                  </div>
                  {renderButton(nft)}
                </div>
              </div>
            </div>
          ))
        }

        <SetPriceModal isOpen={isOpen} nft={nftToResell} onModalClose={(response) => handleModalClose(response)}></SetPriceModal>
      </div>
    </div>
  );
}
