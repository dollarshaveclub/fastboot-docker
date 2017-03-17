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

  #
  # Install yarn & bower
  #
  echo "Installing yarn version: ${YARN_VERSION}" && \
  curl -o- -L https://yarnpkg.com/install.sh | /bin/sh -s -- --version $YARN_VERSION && \

  export PATH="$HOME/.yarn/bin:$PATH" && \
  yarn global add $NODE_PKGS

# Having this before the build means it will rebuild everything, every time.
# Needed because we get dist/package.json from `ember build`
# NOTE: Moved below other ONBUILDs as to not invalidate them by simply
# changing app code.
ONBUILD COPY . /app

ONBUILD RUN \
  #
  # Install Github SSH config
  #
  mkdir -p ~/.ssh && \
  chmod 700 ~/.ssh && \
  cp /app/github-ssh/id_rsa ~/.ssh/id_rsa && \
  chmod 0600 ~/.ssh/id_rsa && \
  cat /app/github-ssh/known_hosts >> ~/.ssh/known_hosts && \
  cat /app/github-ssh/ssh_config >> ~/.ssh/ssh_config && \
  chmod 0644 ~/.ssh/known_hosts

ONBUILD RUN \
  #
  # Setup path for yarn/bower.
  #
  export PATH="$HOME/.yarn/bin:$PATH" && \

  #
  # Build server
  #
  cd /app/server-fastboot-docker && yarn install --production && \
  cd /app/server-fastboot-docker/middleware && yarn install --production && \

  #
  # Build app
  #
  cd /app && \
  yarn install --ignore-optional && \
  bower install --allow-root && \
  ./node_modules/.bin/ember build --environment=production && \
  cd /app/dist && yarn install --production && \

  #
  # Trim server node_modules
  #
  find \
    /app/dist/node_modules \
    /app/server-fastboot-docker/node_modules \
    \( \
      \( -type d -name test -o -name .bin \) \
      -o \( -type f -name *.md -o -iname LICENSE -o -name *.map \) \
    \) -exec rm -rf '{}' + \
  && \

  #
  # Uninstall global dependencies
  #
  apk del $APK_PKGS && \

  #
  # Cleanup app
  #
  rm -rf \
    /app/bower_components \
    /app/node_modules \
    /app/tmp \
  && \

  #
  # Cleanup bower
  #
  rm -rf \
    ~/.cache/bower \
    ~/.config/configstore \
  && \

  #
  # Cleanup npm/yarn
  #
  rm -rf \
    ~/.node-gyp \
    ~/.npm \
    ~/.yarn \
    /tmp/* \
  && \

  #
  # Remove bulky SSL certs (880K)
  #
  rm -rf \
    /etc/ssl \
  && \

  #
  # Remove sensitive Github SSH credentials
  #
  rm -rf \
    ~/.ssh \
  && \

  #
  # TEMPORARY HACK to work around fastboot build issues
  # - `ember build --watch` does not support dist/node-modules
  #
  mv /app/dist/node_modules /app/node_modules && \
  echo 'Done'

EXPOSE 3000

CMD ["node", "/app/server-fastboot-docker/server.js"]
