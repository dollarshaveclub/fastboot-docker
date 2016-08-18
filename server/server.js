"use strict";

const FastBootAppServer = require('fastboot-app-server');
const FastBootWatchNotifier = require('fastboot-watch-notifier');

const distPath = '/app/dist';

const notifier = new FastBootWatchNotifier({
  distPath,
  saneOptions: {
    poll: true,
  },
});

const preFastbootMiddlewares = require('./middleware/pre-fastboot');
const postFastbootMiddlewares = require('./middleware/post-fastboot');
const workerCount = process.env.WORKER_COUNT;

const server = new FastBootAppServer({
  distPath,
  notifier,
  preFastbootMiddlewares,
  postFastbootMiddlewares,
  workerCount,
});

server.start();
