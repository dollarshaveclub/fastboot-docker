const expect = require('chai').expect;
const mocha = require('mocha');

const preFastBootMiddleware = require('../../middleware/pre-fastboot');

describe('default preFastBootMiddleware', function () {
  it('should be a double array of arguments and apply to all routes', function () {
    expect(preFastBootMiddleware).to.be.an.array;
    expect(preFastBootMiddleware[0][0]).to.equal('/*');
    expect(preFastBootMiddleware[0][1]).to.be.a.function;
  });

  it('should call next when fastbooting a route', function (done) {
    const customMiddleware = preFastBootMiddleware[0][1];
    const req = { query : { fastboot: 'on' } };
    const res = {};
    const next = () => done();

    customMiddleware(req, res, next);
  });

  it('should send index.html when not fastbooting a route', function (done) {
    const customMiddleware = preFastBootMiddleware[0][1];
    const req = { query : { fastboot: 'off' } };
    const res = {
      sendFile(file, options) {
        expect(file).to.equal('index.html');
        expect(options.root).to.equal('app/dist');
        done();
      }
    };
    const next = () => done(new Error('it should never call next'));

    customMiddleware(req, res, next);
  });
});
