FROM node:22-alpine

RUN apk add --no-cache bash docker-cli curl openssl smartmontools util-linux usbutils

WORKDIR /workspace/api

COPY package*.json ./
RUN npm install

COPY . .
