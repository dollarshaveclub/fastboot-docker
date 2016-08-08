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

const userMiddleware = function (req, res, next) {

  let doFastBoot = isFastBootRoute(req.path);
  if (req.query.fastboot === 'on') doFastBoot = true;
  if (req.query.fastboot === 'off') doFastBoot = false;

  if (doFastBoot) {
    next();
  } else {
    res.sendFile('index.html', { root: distPath });
  }
};

const server = new FastBootAppServer({
  distPath,
  notifier,
  userMiddleware,
});

server.start();
