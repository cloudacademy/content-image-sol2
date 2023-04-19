FROM ca-py-image
USER root
WORKDIR /root/lab/
COPY src ./src
COPY test ./test