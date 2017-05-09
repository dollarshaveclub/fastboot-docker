"use strict";

const express = require('express');
const isFastbootRoute = require('./is-fastboot-route');
const staticAssetOptions = require('../config/static-assets.js');
const distPath = require('../config/dist').DIST_PATH;

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
  app.use(require('compression')());
  app.use(express.static(distPath, staticAssetOptions));
  app.use('/*', customMiddleware);
};
