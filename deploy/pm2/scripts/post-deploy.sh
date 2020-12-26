#!/bin/bash

# copy configs
cp -R ./deploy/data "${APP_DIR}/config/"
cp ./deploy/docker-compose.yml "${APP_DIR}/config/"
cp ./deploy/.env* "${APP_DIR}/config/"

# install deps
yarn --cwd server install --frozen-lockfile --production=false

# build app
yarn --cwd server build

# restart app
pm2 startOrRestart ./deploy/pm2/ecosystem.config.js --env production
