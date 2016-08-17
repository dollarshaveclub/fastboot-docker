"use strict";

const raven = require('raven');
const datadog = require('connect-datadog');
const isFastBootRoute = require('./is-fastboot-route');
const SENTRY_DSN = process.env.SENTRY_DSN;

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

module.exports = [
  datadog({}),
  raven.middleware.express.requestHandler(SENTRY_DSN),
  raven.middleware.express.errorHandler(SENTRY_DSN),
  [ '/*', customMiddleware ]
];
