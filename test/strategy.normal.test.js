/* global describe, it, expect, before */
/* jshint expr: true */

import chai from 'chai';
import Strategy from '../src/strategy';
import validParams from './helpers/valid-params';


describe('Strategy', () => {
  describe('handling a request with valid credentials in body', () => {
    const strategy = new Strategy(((req, address, done, msg, signed) => {
      if (address) {
        return done(null, { id: '1234' }, { scope: 'read' });
      }
      return done(null, false);
    }));

    let userReturned;
    let infoReturned;

    before((done) => {
      chai.passport.use(strategy)
        .success((user, info) => {
          userReturned = user;
          infoReturned = info;
          done();
        })
        .req((req) => {
          req.body = validParams;
        })
        .authenticate();
    });

    it('should supply user', () => {
      expect(userReturned).to.be.an('object');
      expect(userReturned.id).to.equal('1234');
    });

    it('should supply info', () => {
      expect(infoReturned).to.be.an('object');
      expect(infoReturned.scope).to.equal('read');
    });
  });

  describe('handling a request with valid credentials in query', () => {
    const strategy = new Strategy(((req, address, done, msg, signed) => {
      if (address) {
        return done(null, { id: '1234' }, { scope: 'read' });
      }
      return done(null, false);
    }));

    let userReturned;
    let infoReturned;

    before((done) => {
      chai.passport.use(strategy)
        .success((user, info) => {
          userReturned = user;
          infoReturned = info;
          done();
        })
        .req((req) => {
          req.query = validParams;
        })
        .authenticate();
    });

    it('should supply user', () => {
      expect(userReturned).to.be.an('object');
      expect(userReturned.id).to.equal('1234');
    });

    it('should supply info', () => {
      expect(infoReturned).to.be.an('object');
      expect(infoReturned.scope).to.equal('read');
    });
  });

  describe('handling a request without a body', () => {
    const strategy = new Strategy(((req, address, done, msg, signed) => {
      throw new Error('should not be called');
    }));

    let infoReturned;
    let statusReturned;

    before((done) => {
      chai.passport.use(strategy)
        .fail((info, status) => {
          infoReturned = info;
          statusReturned = status;
          done();
        })
        .authenticate();
    });

    it('should fail with info and status', () => {
      expect(infoReturned).to.be.an('object');
      expect(infoReturned.message).to.equal('Missing credentials');
      expect(statusReturned).to.equal(400);
    });
  });

  describe('handling a request without a body, but no username and password', () => {
    const strategy = new Strategy(((req, address, done, msg, signed) => {
      throw new Error('should not be called');
    }));

    let infoReturned;
    let statusReturned;

    before((done) => {
      chai.passport.use(strategy)
        .fail((info, status) => {
          infoReturned = info;
          statusReturned = status;
          done();
        })
        .req((req) => {
          req.body = {};
        })
        .authenticate();
    });

    it('should fail with info and status', () => {
      expect(infoReturned).to.be.an('object');
      expect(infoReturned.message).to.equal('Missing credentials');
      expect(statusReturned).to.equal(400);
    });
  });

  describe('handling a request with a body, but no signed message', () => {
    const strategy = new Strategy(((req, address, done, msg, signed) => {
      throw new Error('should not be called');
    }));

    let infoReturned;
    let statusReturned;

    before((done) => {
      chai.passport.use(strategy)
        .fail((info, status) => {
          infoReturned = info;
          statusReturned = status;
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.address = validParams.address;
          req.body.msg = validParams.msg;
        })
        .authenticate();
    });

    it('should fail with info and status', () => {
      expect(infoReturned).to.be.an('object');
      expect(infoReturned.message).to.equal('Missing credentials');
      expect(statusReturned).to.equal(400);
    });
  });

  describe('handling a request with a body, but no address', () => {
    const strategy = new Strategy(((req, address, done, msg, signed) => {
      throw new Error('should not be called');
    }));

    let infoReturned;
    let statusReturned;

    before((done) => {
      chai.passport.use(strategy)
        .fail((info, status) => {
          infoReturned = info;
          statusReturned = status;
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.msg = validParams.msg;
          req.body.signed = validParams.signed;
        })
        .authenticate();
    });

    it('should fail with info and status', () => {
      expect(infoReturned).to.be.an('object');
      expect(infoReturned.message).to.equal('Missing credentials');
      expect(statusReturned).to.equal(400);
    });
  });
});
