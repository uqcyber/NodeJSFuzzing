# Copyright (c) 2020, 2021, Oracle and/or its affiliates.
# Contributor: Trong Nhan Mai

FROM node:10
ENV WORKDIR /usr/src/app/
WORKDIR $WORKDIR
COPY . $WORKDIR
RUN npm install --production --no-cache
RUN npm update

FROM node:12-alpine
ENV USER apostrophe
ENV WORKDIR /home/$USER/app
WORKDIR $WORKDIR
COPY --from=0 /usr/src/app/ $WORKDIR
EXPOSE 3000