# syntax=docker/dockerfile:1

FROM node:18-alpine

WORKDIR /app/frontend

COPY package*.json .
RUN npm i

COPY . .

EXPOSE 9000

CMD ["npm", "run", "dev"]