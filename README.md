[![Build Status](https://travis-ci.org/dollarshaveclub/fastboot-docker.svg)](https://travis-ci.org/dollarshaveclub/fastboot-docker)

# Docker Container `dollarshaveclub/fastboot`
Ember FastBoot App Server in a box.

  * name: `dollarshaveclub/fastboot`
  * port: `3000`

## Usage

Your repo should have

### Dockerfile
```
FROM dollarshaveclub/fastboot
```
That's it. Nothing else is needed in your Dockerfile, thanks to the magic of `ONBUILD`.

### .dockerignore
```
.git/logs
.git/objects
bower_components
dist
node_modules
tmp
```
This keeps the image small when we `COPY . /app`.

### github-ssh/id_rsa

If you need to `npm install` packages from github, override the default by adding your own private key to `github-ssh/id_rsa` in your downstream repo. (The included key in this repo is a passwordless key for "nobody@example.com". Enjoy!)

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCuoz1Pq+iJKDzTP60xfgpLMEZYRCs65bnIFSd8U+Pi2PTrf2KRUZrtmvgSHR2y21Evv9RKkwTFF5rVXRs1g+lf6cuhzifbKJsR9dSujX57gmP2zrVZEBA9DEIeQaS8NcurmyqbDIFO7LDh51aAzyYzNOfQn782oQml8n0VZzTI17NmVA64PYvGrYok51Tk56VQmRQ8//ck3TSf+nOUS0MEXGN1jhFBiMVG77P3UVYbz9HKNH/cATvY8klcpzoQJFl39TK2Hn/NFU+P99uJ5AjzNRNBWBOCEGHXAtC4j1ukBMq4Rq4lphUMFC7JVATk9cdyOkErrsJcGHtoMQsS7r2oaxNUEA8gJAOs0FYzEX/X2dqP8ONKNfNjuTvV8RVtLC9MSzWAiZHMbmACSsfJl+5JtGMHP6DU5mH+diT1IamRWnzhFKjYxIBwqO9fRFcew/njmy63t+3g0RpBKn3x5BByI92MNHYwx/IDuEuBtg3pG+gYVufKyhpBxXPu2n22Tp19V5MVHGZUqTFogu+G19CH/yhp6XhsO/CGJ8eHUwTlE0YhVOTSyBZXLW+EBn6+RmjUTCsPoqbP80W6p2UPYxm1D88tmfXKmtg2XGGsXFsA7oWY2fIAfjnzWO4xm1NU/TKsZQ9sgSBJ08KoOU4IgvqMKdn87/04dAbm7/TfIJoXlw== nobody@example.com
```

### server-fastboot-docker/is-fastboot-route.js

You can serve some routes fastbooted and some routes non-fastbooted by overriding the default `isFastBootRoute` function (which just returns true) in `server-fastboot-docker/is-fastboot-route.js`.

### server-fastboot-docker/config/static-assets.js

You can configure how static assets are served by overriding this file.
See the [express static documentation](https://expressjs.com/en/4x/api.html#express) for the configurable options.

### server-fastboot-docker/middleware/*

If you server needs middleware to run before or after the FastBoot middleware, respectively override `server-fastboot-docker/middleware/before-fastboot.js` and `server-fastboot-docker/middleware/after-fastboot.js`.

If your middlewares have their own npm dependencies, override `server-fastboot-docker/middleware/package.json`.

```
FROM dollarshaveclub/fastboot:legacy-middleware-hooks
```

## Runtime config

- `process.env.POLLING` will control whether the fastboot app server polls the `/app/dist` directory for files to serve. Default: `false`.
- `process.env.PORT` will control the port the fastboot app server listens on. Default: `3000`.
- `process.env.WORKER_COUNT` will control the number of spawned HTTP listener threads. Default: 1 per CPU.

Set `?fastboot=on` or `?fastboot=off` to override `isFastBootRoute` and turn fastboot on or off for that request.

## Notes

node-sass v4.1.0 has [built-in support](https://github.com/sass/node-sass/issues/1589#issuecomment-267899551) for Alpine. In order to take advantage of these pre-built binaries, ensure that [ember-cli-sass](https://github.com/aexmachina/ember-cli-sass) is at `v6.0.0` or higher in your project.
