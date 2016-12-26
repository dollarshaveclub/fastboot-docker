const NODE_ENV = process.env.NODE_ENV || 'production';

const datadog = require('connect-datadog')({
  stat: 'fastboot-app',
  tags: [NODE_ENV],
  path: true,
  method: true,
  response_code: true,
});

module.exports = function (app) {
  app.use(datadog);
};
