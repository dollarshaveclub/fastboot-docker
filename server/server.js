const FastBootAppServer = require('fastboot-app-server');

const server = new FastBootAppServer({
  distPath: '/app/dist'
});

server.start();
