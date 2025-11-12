# FROM ca-py-image
FROM 400277673644.dkr.ecr.us-west-2.amazonaws.com/cloudacademy/labs-workspace/ca-theia-express-node-18v2
USER root
WORKDIR /root/lab/
# COPY ["src/package.json", "src/package-lock.json*", "./"]
RUN npm install jest hardhat @nomicfoundation/hardhat-toolbox solc
COPY src ./src
COPY test ./test
