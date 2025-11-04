# use node v25 for base image
FROM node:25

# go to app directory
WORKDIR /app

# copy node files
COPY package*.json ./

# install dependencies
RUN npm install

# copy test of app into container
COPY . .


