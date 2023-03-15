import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { ethers } from 'ethers';

export default function SetPriceModal(props) {
  let [price, setPrice] = useState(undefined);
  const nftName = props.nft ? props.nft.name : 'name';
  const nftCurrentPrice = props.nft ? props.nft.price : '0';

  useEffect(() => {
    //reset Price
    setPrice(undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, []);

  function declineAndCloseModal() {
    props.onModalClose(response(false));
  }

  function confirmAndCloseModal() {
    props.onModalClose(response(true, price));
  }

  function formatPriceToETH(priceInWei) {
    return ethers.utils.formatEther(priceInWei);
  }

  function response(confirmed, newPriceInETH){
    return {
      confirmed: confirmed,
      newPriceInETH: newPriceInETH,
      nftTokenId: props.nft.tokenId
    }
  }

  return (
      <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={declineAndCloseModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Set New Price For {nftName}
                  </Dialog.Title>
                  <div className="mt-2">
                  <p>Current Price is: {formatPriceToETH(nftCurrentPrice)} ETH</p>
                  <span>
                    <input 
                      className="shadow appearance-none border rounded w-10/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                      id="Price" 
                      type="number" 
                      placeholder="New Price"
                      onChange={e => setPrice(e.target.value)}
                      ></input>
                      {price != undefined && price <= 0 && <p className='text-red-700 text-sm ml-2'>Price cannot be 0 or negative</p>} 
                  </span>
                  <span className="ml-4">
                    ETH
                  </span>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 disabled:opacity-50"
                      onClick={confirmAndCloseModal}
                      disabled={!price}>
                      Sell
                    </button>

                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium hover:bg-red-400"
                      onClick={declineAndCloseModal}>
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
  )
}
