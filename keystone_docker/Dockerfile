# Copyright (c) 2020, 2020, Oracle and/or its affiliates.
# Contributor: Trong Nhan Mai

FROM node:12-alpine
ENV WORKDIR /usr/src/app/
WORKDIR $WORKDIR
COPY package*.json $WORKDIR
RUN npm install --production --no-cache

FROM node:12-alpine
ENV USER keystone
ENV WORKDIR /home/$USER/app
WORKDIR $WORKDIR
COPY --from=0 /usr/src/app/node_modules node_modules
COPY . $WORKDIR
EXPOSE 3000