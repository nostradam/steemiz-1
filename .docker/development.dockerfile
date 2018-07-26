# build environment
FROM node:9.6.1 as builder

RUN mkdir /var/www
RUN mkdir /var/www/nulscommunity
WORKDIR /var/www/nulscommunity

RUN npm install -g yarn
ENV PATH /var/www/nulscommunity/node_modules/.bin:$PATH
COPY package.json /var/www/nulscommunity/package.json
COPY yarn.lock /var/www/nulscommunity/yarn.lock
COPY .env /var/www/nulscommunity/.env
RUN yarn install
CMD ["yarn", "start"]
