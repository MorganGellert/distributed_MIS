FROM node

MAINTAINER Alex Tong "alexanderytong@gmail.com"

WORKDIR "/work"

COPY package.json /work/package.json

RUN npm install 


