FROM node:22-alpine

RUN apk add --no-cache bash

WORKDIR /workspace/api

COPY package*.json ./
RUN npm install

COPY . .