/* global describe, it, expect, before */

var chai = require('chai')
  , Strategy = require('../src/strategy');

describe('Strategy', function() {

  describe('encountering an error during verification', function() {
    var strategy = new Strategy(function(req, address, done, msg, signed) {
      done(new Error('something went wrong'));
    });

    var err;

    before(function(done) {
      chai.passport.use(strategy)
        .error(function(e) {
          err = e;
          done();
        })
        .req(function(req) {
          req.body = {};
          req.body.address = "9pPtLyrY4pszuhQLwkrdSsB3soqHge9E3Ld3mfnRaJdx";
          req.body.msg = "dad2ae47f0150534abbf0c8fb2d59b43";
          req.body.signed = "5YWmiQFft1CBeyp3UyUYK9p7yQQcuQFYoCrePubRKD5xJYhnqrU7hALiWYMrzLwpWgFiAgJgcoVrkkfCgrGD1Es8";
        })
        .authenticate();
    });

    it('should error', function() {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('something went wrong');
    });
  });

  describe('encountering an exception during verification', function() {
    var strategy = new Strategy(function(req, address, done, msg, signed) {
      throw new Error('something went horribly wrong');
    });

    var err;

    before(function(done) {
      chai.passport.use(strategy)
        .error(function(e) {
          err = e;
          done();
        })
        .req(function(req) {
          req.body = {};
          req.body.address = "9pPtLyrY4pszuhQLwkrdSsB3soqHge9E3Ld3mfnRaJdx";
          req.body.msg = "dad2ae47f0150534abbf0c8fb2d59b43";
          req.body.signed = "5YWmiQFft1CBeyp3UyUYK9p7yQQcuQFYoCrePubRKD5xJYhnqrU7hALiWYMrzLwpWgFiAgJgcoVrkkfCgrGD1Es8";
        })
        .authenticate();
    });

    it('should error', function() {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('something went horribly wrong');
    });
  });

});
