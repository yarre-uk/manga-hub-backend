
FROM node:21.6.0

WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn install

COPY ./prisma ./prisma

RUN yarn prisma generate

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
