/* global describe, it, expect, before */
/* jshint expr: true */

const chai = require('chai')
const Strategy = require('../src/strategy');


describe('Strategy', function() {

  describe('handling a request without a body, but no username and password, with message option to authenticate', function() {
    let strategy = new Strategy(function(req, address, done, msg, signed) {
      throw new Error('should not be called');
    });

    let infoReturned;
    let statusReturned;

    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(info, status) {
          infoReturned = info;
          statusReturned = status;
          done();
        })
        .req(function(req) {
          req.body = {};
        })
        .authenticate({ badRequestMessage: 'Something is wrong with this request' });
    });

    it('should fail with info and status', function() {
      expect(infoReturned).to.be.an('object');
      expect(infoReturned.message).to.equal('Something is wrong with this request');
      expect(statusReturned).to.equal(400);
    });
  });

});
