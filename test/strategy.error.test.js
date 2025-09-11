/* global describe, it, expect, before */

const chai = require('chai');
const Strategy = require('../src/strategy');

describe('Strategy', () => {
  describe('encountering an error during verification', () => {
    const strategy = new Strategy(((req, address, done, msg, signed) => {
      done(new Error('something went wrong'));
    }));

    let err;

    before((done) => {
      chai.passport.use(strategy)
        .error((error) => {
          err = error;
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.address = '9pPtLyrY4pszuhQLwkrdSsB3soqHge9E3Ld3mfnRaJdx';
          req.body.msg = 'dad2ae47f0150534abbf0c8fb2d59b43';
          req.body.signed = '5YWmiQFft1CBeyp3UyUYK9p7yQQcuQFYoCrePubRKD5xJYhnqrU7hALiWYMrzLwpWgFiAgJgcoVrkkfCgrGD1Es8';
        })
        .authenticate();
    });

    it('should error', () => {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('something went wrong');
    });
  });

  describe('encountering an exception during verification', () => {
    const strategy = new Strategy(((req, address, done, msg, signed) => {
      throw new Error('something went horribly wrong');
    }));

    let err;

    before((done) => {
      chai.passport.use(strategy)
        .error((error) => {
          err = error;
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.address = '9pPtLyrY4pszuhQLwkrdSsB3soqHge9E3Ld3mfnRaJdx';
          req.body.msg = 'dad2ae47f0150534abbf0c8fb2d59b43';
          req.body.signed = '5YWmiQFft1CBeyp3UyUYK9p7yQQcuQFYoCrePubRKD5xJYhnqrU7hALiWYMrzLwpWgFiAgJgcoVrkkfCgrGD1Es8';
        })
        .authenticate();
    });

    it('should error', () => {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('something went horribly wrong');
    });
  });
});
