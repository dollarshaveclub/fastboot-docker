"use strict";

const distPath = 'app/dist';
const isFastbootRoute = require('./is-fastboot-route');
const staticAssetOptions = require('./config/static-assets.js');

function customMiddleware (req, res, next) {
  let doFastBoot = isFastbootRoute(req.baseUrl);
  if (req.query.fastboot === 'on') doFastBoot = true;
  if (req.query.fastboot === 'off') doFastBoot = false;

  if (doFastBoot) {
    next();
  } else {
    res.sendFile('index.html', { root: distPath });
  }
};

module.exports = function (app) {
  app.use(express.static(distPath, staticAssetOptions));
  app.use('/*', customMiddleware);
};
