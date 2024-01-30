FROM node:21.6.0

RUN echo $DATABASE_URL

WORKDIR /app

RUN apt update
RUN apt --assume-yes install postgresql-client
RUN apt --assume-yes install dos2unix

COPY ./package.json ./
COPY ./prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY ./migrate.sh ./
RUN chmod +x ./migrate.sh
RUN dos2unix ./migrate.sh

CMD ./migrate.sh $DB_HOST $POSTGRES_USER 