#!/usr/bin/env node
import { create, globSource } from 'ipfs-http-client';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

const projectId = process.env.IPFS_PROVIDER_PROJECTID;
const projectSecret = process.env.IPFS_PROVIDER_PROJECTSECRET;
const ipfs_token = process.env.IPFS_PROVIDER_TOKEN;

const ipfs_upload_url = process.env.IPFS_UPLOAD_URL;
const ipfs_gateway = process.env.IPFS_GATEWAY;

const auth = ipfs_token ? "Bearer " + ipfs_token : "Basic " + Buffer.from(projectId + ":" + projectSecret, "utf8").toString("base64");

const client = create({
  url: ipfs_upload_url,
  headers: {
    authorization: auth
  }
});

async function main() {
  await uploadNFTsToIPFS();
  await uploadNFTMetadataToIPFS();
}

main().catch((error) => {
  console.log('Error uploading to IPFS: ', error);
  process.exitCode = 1;
});

async function uploadNFTsToIPFS() {
  try {
    const uploadedFiles = new Array();
    let fileFolderCid;

    for await (const file of client.addAll(globSource("./res/nfts", "**/*"), { wrapWithDirectory: true })) {
      // created folder won't have a name
      let nameOfFile = getFileName(file);
      if(nameOfFile){
        uploadedFiles.push(file); 
      }else {
        let cid = getFileCID(file);
        fileFolderCid = cid;
        console.log(`CID OF FILE FOLDER: ${ipfs_gateway}/${cid}`);
      }
    }

    uploadedFiles.forEach((file) => {
      createMetadataJSONForUploadedNFT(file, fileFolderCid);
    });

    console.log('Successfully uploaded all files to IPFS');
  } catch (error) {
    console.log('Error uploading NFTs: ', error);
  }  
}

function createMetadataJSONForUploadedNFT(file, fileFolderCid) {

  // get file name without extension
  let nameOfFile = getFileName(file);
  // Create JSON structure
  const data = JSON.stringify({
    "name": `NFT ${nameOfFile}`,
    "image": `${ipfs_gateway}/${fileFolderCid}/${file.path}`,
    "description": `Example Description of ${nameOfFile}`
  });

  fs.writeFile(`./res/nft_metadata/${nameOfFile}_metadata.json`, data, (err) => {
    if (err) {
      console.log('Failed to read the file');
      throw err;
    }
    console.log(`${nameOfFile}_metadata.json was created successfully`);
  });
}

async function uploadNFTMetadataToIPFS() {
  try {
    for await (const file of client.addAll(globSource("./res/nft_metadata", "**/*"), { wrapWithDirectory: true })) {
      // get file name without extension
      let nameOfFile = getFileName(file);
      let cid = getFileCID(file);
      // created folder won't have a name
      const isNameUndefined = !nameOfFile;
      if(isNameUndefined){ 
        console.log(`CID OF METADATA FOLDER: ${ipfs_gateway}/${cid}`);
      }
    }
    console.log('Successfully uploaded all metadata to IPFS');
  } catch (error) {
    console.log('Error uploading Metadata: ', error);
  }  
}

function getFileName(file) {
  return file.path.split(".")[0];
}

function getFileCID(file) {
  return file.cid.toString();
}
