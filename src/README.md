# IPFS-UPLOAD-HELPER
This is a tool created to help to upload multiple files to IPFS

This tool is tuned to use Infura pinning service.

---
## Project structure explained

#### Scripts stored in /scripts folder:

- upload_to_ipfs.js
    - uploads files to ipfs
    - creates metadata for each created file
    - upload newly created metadata to ipfs as well

#### Resources stored in /res folder:

- /nfts
    - contains list of images/files to be uploaded. NOTE: files should be named as sequential numbers
- /nft_metadata
    - contains list of metadata JSON files that will be AUTO generated after each file in /nfts are uploaded.

---
## configure Environmental variables
in the root directory create a new file and name it `.env`

then add the following lines 

```shell
IPFS_UPLOAD_URL=http://127.0.0.1:5002
IPFS_GATEWAY=http://127.0.0.1:9090/ipfs
IPFS_PROVIDER_PROJECTID=
IPFS_PROVIDER_PROJECTSECRET=
IPFS_PROVIDER_TOKEN=
```

---
## Run the Project

To start the script: 
    `npm start`

Example output:
 
```
➜  ipfs-upload-helper npm run start

> ipfs-upload-helper@1.0.0 start
> node scripts/upload_to_ipfs.js

8_metadata.json was created successfully
9_metadata.json was created successfully
14_metadata.json was created successfully
15_metadata.json was created successfully
17_metadata.json was created successfully
16_metadata.json was created successfully
12_metadata.json was created successfully
13_metadata.json was created successfully
11_metadata.json was created successfully
10_metadata.json was created successfully
20_metadata.json was created successfully
18_metadata.json was created successfully
19_metadata.json was created successfully
4_metadata.json was created successfully
5_metadata.json was created successfully
7_metadata.json was created successfully
6_metadata.json was created successfully
2_metadata.json was created successfully
3_metadata.json was created successfully
1_metadata.json was created successfully
Successfully uploaded all files to IPFS
CID OF FOLDER: https://eds-skillsblock.infura-ipfs.io/ipfs/QmXRfxjuDmLgogA1oBkCfCd44RwqNystdGTG8g21imSaFa
Successfully uploaded all metadata to IPFS
```