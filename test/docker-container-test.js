"use strict";

const expect = require('chai').expect;
const request = require('request-promise').defaults({ simple: false, resolveWithFullResponse: true, gzip: true });

describe("dollarshaveclub/fastboot", function() {
  this.timeout(3000);

  it("serves a FastBooted page when you visit it", function () {
    return request('http://127.0.0.1:3000/test-route/')
    .then(response => {
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.contain('shave on!');
    });
  });

  it("serves a FastBooted page when visted with query parameter `?fastboot=on`", function () {
    return request('http://127.0.0.1:3000/test-route?fastboot=on')
    .then(response => {
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.contain('shave on!');
    });
  });

  it("serves a non-FastBooted page when visted with query parameter `?fastboot=off`", function () {
    return request('http://127.0.0.1:3000/test-route?fastboot=off')
    .then(response => {
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.contain('<!-- EMBER_CLI_FASTBOOT_BODY -->');
    });
  });

  it("serves static assets", function () {
    return request('http://127.0.0.1:3000/assets/fastboot-app.js')
    .then(response => {
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.contain('"use strict";');
    });
  });

  it("sets cache control headers on static assets", function () {
    return request('http://127.0.0.1:3000/assets/fastboot-app.js')
      .then(response => {
        expect(response.headers['cache-control']).to.equal('public, max-age=31536000');
        expect(response.statusCode).to.equal(200);
      });
  });

  it("gzips responses", function () {
    return request('http://127.0.0.1:3000/test-route')
      .then(response => {
        expect(response.headers['content-encoding']).to.equal('gzip');
        expect(response.statusCode).to.equal(200);
      });
  });
});
