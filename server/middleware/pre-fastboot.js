"use strict";

const isFastbootRoute = require('./is-fastboot-route');
const distPath = 'app/dist';

const customMiddleware = function (req, res, next) {
  let doFastBoot = isFastbootRoute(req.baseUrl);
  if (req.query.fastboot === 'on') doFastBoot = true;
  if (req.query.fastboot === 'off') doFastBoot = false;

  if (doFastBoot) {
    next();
  } else {
    res.sendFile('index.html', { root: distPath });
  }
};

module.exports = [
  [ '/*', customMiddleware ]
];
