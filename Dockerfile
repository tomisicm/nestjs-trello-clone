FROM node:14.15.4-alpine3.10

WORKDIR /app

ENV NODE_ENV development

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3000

CMD [ "yarn", "start:dev" ]