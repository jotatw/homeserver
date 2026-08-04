FROM node:22-alpine

RUN apk add --no-cache bash docker-cli curl openssl smartmontools util-linux usbutils git openssh-client

RUN git config --global --add safe.directory /workspace

WORKDIR /workspace/api

COPY package*.json ./
RUN npm install

COPY . .
