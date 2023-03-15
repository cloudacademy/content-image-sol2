This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).



## Getting Started

First install NPM packages:
```shell
npm install
```

Then create a local JSON-RPC server(blockchain node) by using hardhat library:
```shell
npx hardhat node
```
You should see similar to following in your terminal window"
```bash
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
.
.
.
```

Copy one of the Private Keys from the console logs produced by previous command:


Update/Create ``.secrets.json`` file in root directory with Private Key coppied from console logs.
```json
{
    "privateKey": "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
}
```

Clear the cache and delete all artifacts:
```shell
npx hardhat clean
```

Compile the entire project, building all artifacts:
```shell
npx hardhat compile
```

Deploy Smart Contract to local node:
```shell
npx hardhat run scripts/deploy.js --network localhost
```

Copy Smart Contract address from the console logs produced by previous command:
```bash
Start Smart Contract deployment
NFTMarketplace Address: 0x8464135c8F25Da09e49BC8782676a84730C318bC
```

Update/Create ``.env`` file with smart contract address coppied from console logs.
```json
MARKETPLACE_SMART_CONTRACT=0x8464135c8F25Da09e49BC8782676a84730C318bC
IPFS_GATEWAY = https://eds-skillsblock.infura-ipfs.io/ipfs/
```

Bulk Mint NFTs on Localy Deployed Smart Contract:
```shell
npx hardhat run scripts/bulk-mint.js --network localhost
```
When prompted to enter Base IPFS URL, do following:
```shell
Enter Base URL of Metadata folder in IPFS?  https://eds-skillsblock.infura-ipfs.io/ipfs/QmXUbHqaMEJhjCXuhf2M81n7zE62NcGJdgW8VD1e9akCHF
```


Connect newly created node to Metamask Browser Wallet:

- Open your browser with the MetaMask extension
- Click on Metamask Extension > profile icon > Settings > Networks > click "Add Network":
    - Network Name: __*Hardhat local*__
    - New RPC URL: __*http://127.0.0.1:8545/*__
    - Chain ID: __*31337*__
    - Currency Symbol: __*ETH*__
- Click "Save"

Add test accounts from newly created hardhat local node to Metamask:

- Open your browser with the MetaMask extension
- Click on Metamask Extension > profile icon > Import Account:
    - Select Type: __*Private Key*__
    - Enter your private key string here: __*copy ANY private key from terminal window your Hardhat node is running from*__

Open new terminal and run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If Metamask does not prompt to connect to your application automatically, do following:
- Click on Metamask Extension > "Not Connected" > connect "Name of Imported Account":
- Refresh page




## Learn More (Optional)

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel (Optional)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
