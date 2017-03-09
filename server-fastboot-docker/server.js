"use strict";

const FastBootAppServer = require('fastboot-app-server');
const FastBootWatchNotifier = require('fastboot-watch-notifier');

const distPath = require('./config/dist').DIST_PATH;

const notifier = new FastBootWatchNotifier({
  distPath,
  saneOptions: {
    poll: process.env.POLLING || false,
  },
});

const beforeMiddleware = require('./middleware/before-fastboot');
const afterMiddleware = require('./middleware/after-fastboot');
const workerCount = process.env.WORKER_COUNT;

const server = new FastBootAppServer({
  distPath,
  notifier,
  gzip: true,
  beforeMiddleware,
  afterMiddleware,
  workerCount,
});

server.start();
