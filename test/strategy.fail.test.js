/* global describe, it, expect, before */
/* jshint expr: true */
import chai from 'chai';
import Strategy from '../src/strategy';
import validParams from './helpers/valid-params';
import invalidParams from './helpers/invalid-params';

describe('Strategy', function() {

  describe('failing authentication', function() {
    let strategy = new Strategy(function(req, address, done, msg, signed) {
      return done(null, false);
    });

    let err, code;

    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(_err, _code) {
          err = _err;
          code = _code;
          done();
        })
        .req(function(req) {
          req.body = invalidParams;
        })
        .authenticate();
    });

    it('should fail', function() {
      expect(err).to.be.an('object').and.have.keys('message');
      expect(err.message).to.include('Invalid signature')
      expect(code).to.equal(401);
    });
  });

  describe('failing authentication with info', function() {
    let strategy = new Strategy(function(req, address, done, msg, signed) {
      return done(null, false, { message: 'authentication failed' });
    });

    let err, code;

    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(_err, _code) {
          err = _err;
          code = _code;
          done();
        })
        .req(function(req) {
          req.body = validParams;
        })
        .authenticate();
    });

    it('should fail', function() {
      expect(err).to.be.an('object');
      expect(err.message).to.equal('authentication failed');
    });
  });

});
