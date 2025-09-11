/* global describe, it, expect */

const strategy = require('../src/index.js');

describe('passport-solana', function() {

  it('should export Strategy constructor directly from package', function() {
    expect(strategy).to.be.a('function');
    expect(strategy).to.equal(strategy.Strategy);
  });

});
