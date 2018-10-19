FROM node:8.4-alpine
ENV NODE_ENV develop

RUN apk add --no-cache \
    git \
    build-base \
    g++ \
    python \
    curl

RUN mkdir -p /usr/app && \
  npm i -g nodemon

WORKDIR /usr/app
VOLUME ["/usr/app"]