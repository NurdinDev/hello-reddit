FROM node

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .
COPY .env.production .env
COPY ormconfig.docker.json ormconfig.json

RUN yarn build

ENV NODE_ENV production

EXPOSE 8080
CMD yarn start
USER node