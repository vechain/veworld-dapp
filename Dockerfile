FROM node:16.3.0-alpine3.13

RUN npm install -g serve

WORKDIR /app

COPY build build

ENTRYPOINT ["serve", "-s", "build", "-l", "3000"]