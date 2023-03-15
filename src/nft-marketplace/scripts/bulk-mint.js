const hre = require("hardhat");
const readline = require("readline");
require("dotenv").config();

const marketplaceAddress = process.env.MARKETPLACE_SMART_CONTRACT;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

 function main() {
  
  rl.question("Enter Base URL of Metadata folder in IPFS? ", answer => {
    bulkMint(answer);
    rl.close();
  });
}

async function bulkMint(baseURL) {
  console.log('Starting Bulk Mint');
  const priceInETH = 0.5;//0.5 ETH
  const numberOfNFTs = 20;
  const listingPrice = 0.05; //0.05 ETH
  const totalFees = listingPrice*numberOfNFTs;

  const Contract = await hre.ethers.getContractFactory("NFTMarketplace");
  const contract = await Contract.attach(
    marketplaceAddress // The deployed contract address
  );

  await contract.bulkMintTokens(baseURL, formatPrice(priceInETH), numberOfNFTs, {value: formatPrice(totalFees)});
  console.log('Bulk Mint Finished');
}

function formatPrice(price){
  return hre.ethers.utils.parseUnits(price.toString(), 'ether');
}

/* calls main() when node is run directly from command line
   if no more async operations are pending, exits with 0. If exception 
   occurs - exits with error 1 - Uncaught Fatal Exception.
*/
// if (require.main === module) {
//   main().then(() => process.exit(0))
//     .catch(error => { console.error(error); process.exit(1); }); // more descriptive error
// }

main();