FROM mhart/alpine-node:5.12

COPY . /app

ENV \
  # git, openssh needed for `npm install`
  # python, build-base (make, g++, cc) needed for libsass compile
  APK_PKGS='git openssh python build-base' \
  # node-gyp needed for libsass compile
  NPM_GLOBAL_PKGS='bower ember-cli node-gyp'

# Having this before the build means it will rebuild everything, every time.
# Needed because we get dist/package.json from `ember build`
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
  chmod 0644 ~/.ssh/known_hosts && \
  #
  # Install global dependencies
  #
  apk --no-cache add $APK_PKGS && \
  npm install -g $NPM_GLOBAL_PKGS && \

  #
  # Build server
  #
  cd /app/server && npm install --production && \
  cd /app/server/middleware && npm install --production && \

  #
  # Build app
  #
  cd /app && \
  bower install --allow-root && \
  npm install && \
  ember build --environment=production && \
  cd /app/dist && npm install --production && \

  #
  # Trim server node_modules
  #
  find \
    /app/dist/node_modules \
    /app/server/node_modules \
    \( \
      \( -type d -name test -o -name .bin \) \
      -o \( -type f -name *.md -o -iname LICENSE -o -name *.map \) \
    \) -exec rm -rf '{}' + \
  && \
  #
  # Uninstall global dependencies
  #
  apk del $APK_PKGS && \
  npm uninstall -g $NPM_GLOBAL_PKGS && \
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
  # Cleanup npm
  #
  rm -rf \
    ~/.node-gyp \
    ~/.npm \
    /tmp/* \
  && \
  #
  # Cleanup apk
  #
  rm -rf \
    /etc/apk/* \
    /etc/ssl \
    /lib/apk/* \
  && \
  #
  # Cleanup Github SSH config
  #
  rm -rf \
    ~/.ssh \
  && \
  echo 'Done'

EXPOSE 3000

CMD ["node", "/app/server/server.js"]
