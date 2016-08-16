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

const initialMiddleware = require('./middleware');
const workerCount = process.env.WORKER_COUNT;

const server = new FastBootAppServer({
  distPath,
  notifier,
  initialMiddleware,
  workerCount,
});

server.start();
