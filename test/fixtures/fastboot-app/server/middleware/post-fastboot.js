const datadog = require('connect-datadog')({
  stat: 'fastboot-app',
  tags: [NODE_ENV],
  path: true,
  method: true,
  response_code: true,
});

const NODE_ENV = process.env.NODE_ENV || 'production';

module.exports = [
  [ datadog ]
];

