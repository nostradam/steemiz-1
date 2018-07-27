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
COPY public /var/www/nulscommunity/public/
COPY src /var/www/nulscommunity/src/
RUN yarn install
RUN yarn build

# production environment
FROM nginx:1.13.9-alpine
COPY --from=builder /var/www/nulscommunity/build /usr/share/nginx/html
COPY .docker/config/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
