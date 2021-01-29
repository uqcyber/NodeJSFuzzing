#!/bin/bash

TARGET="keystone"
IMAGE_VER="v1"

# Copyright (c) 2021, 2021, Oracle and/or its affiliates.
# Contributor: Trong Nhan Mai

REPO="keystonejs/keystone-classic"
REPO_VER="v4.0.0"

WORKDIR="./images"

# Clone and build images
git clone --depth 1 https://github.com/${REPO}.git -b ${REPO_VER} ${WORKDIR}/${TARGET}

cp -r app_docker/express-instrument-app ${WORKDIR}/${TARGET}
cp app_docker/${TARGET}/* ${WORKDIR}/${TARGET}
mv ${WORKDIR}/${TARGET}/server.js ${WORKDIR}/${TARGET}/test/e2e/

docker build -t ${TARGET}:${IMAGE_VER} ${WORKDIR}/${TARGET}

