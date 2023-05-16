# FROM ca-py-image
FROM 421805900968.dkr.ecr.us-east-2.amazonaws.com/cloudacademy/labs-workspace/terraform-terratest
USER root
WORKDIR /root/lab/
# COPY ["src/package.json", "src/package-lock.json*", "./"]
RUN npm install jest hardhat @nomicfoundation/hardhat-toolbox solc
COPY src ./src
COPY test ./test