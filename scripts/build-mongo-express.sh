#!/bin/bash

# Copyright (c) 2021, 2021, Oracle and/or its affiliates.
# Contributor: Trong Nhan Mai

TARGET="mongo-express"
IMAGE_VER="v1"

REPO="mongo-express/mongo-express"
REPO_VER="v0.51.0"

WORKDIR="./images"
EXTRACT_DIR="mongo-express-0.51.0"

# Clone and build images
# Mongo-express cannot checkout branch v0.51.0
wget -P ${WORKDIR}/ https://github.com/mongo-express/mongo-express/archive/v0.51.0.tar.gz
tar -xf ${WORKDIR}/v0.51.0.tar.gz -C ${WORKDIR}/

cp -r app_docker/express-instrument-app ${WORKDIR}/${EXTRACT_DIR}
cp app_docker/${TARGET}/* ${WORKDIR}/${EXTRACT_DIR}

docker build -t ${TARGET}:${IMAGE_VER} ${WORKDIR}/${EXTRACT_DIR}
