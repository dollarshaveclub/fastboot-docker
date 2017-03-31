FROM node:7-alpine

COPY . /app

ENV \
  # Please use ember-cli-sass >= 6.0.0 in your project which
  # ships with node-sass v4.0.1 with support for alpine bindings
  APK_PKGS='git openssh curl' \
  NODE_PKGS='bower node-gyp node-sass' \
  YARN_VERSION='0.22.0'

RUN \

  #
  # Install Alpine packages
  #
  apk --no-cache add $APK_PKGS && \
  echo 'Updating tar: http://bit.ly/2lvp7hp' && \
  apk --update add tar && \

  # Install our version of yarn
  rm -rf /usr/local/bin/yarn && \
  npm install -g yarn@$YARN_VERSION

RUN yarn --version
