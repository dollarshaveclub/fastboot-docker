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

const server = new FastBootAppServer({
  distPath,
  notifier,
});

server.start();
