FROM ca-py-image
USER root
WORKDIR /root/lab/


COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

COPY src ./src
COPY test ./test