"use strict";

const FastBootAppServer = require('fastboot-app-server');
const FastBootWatchNotifier = require('fastboot-watch-notifier');
const isFastBootRoute = require('./is-fastboot-route');

const distPath = '/app/dist';

const notifier = new FastBootWatchNotifier({
  distPath,
  saneOptions: {
    poll: true,
  },
});

const customMiddleware = function (req, res, next) {
  let doFastBoot = isFastBootRoute(req.path);
  if (req.query.fastboot === 'on') doFastBoot = true;
  if (req.query.fastboot === 'off') doFastBoot = false;

  if (doFastBoot) {
    next();
  } else {
    res.sendFile('index.html', { root: distPath });
  }
};

// TODO: Can we make this build-time configurable?
const SENTRY_DSN = 'https://0358e99300314974ab6d25793f0fe8dc:5eb5b192efc8445aa09809338e1b3f47@app.getsentry.com/92363';

const userMiddlewareBefore = [
  require("connect-datadog")({}),
  require('raven').middleware.express.requestHandler(SENTRY_DSN)
  require('raven').middleware.express.errorHandler(SENTRY_DSN),
  [ '/*', customMiddleware ]
];

const userMiddlewareAfter = [
  /* None. */
];

const workerCount = process.env.WORKER_COUNT;

const server = new FastBootAppServer({
  distPath,
  notifier,
  userMiddlewareBefore,
  userMiddlewareAfter,
  workerCount,
});

server.start();
