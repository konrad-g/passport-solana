/* global describe, it, expect */

const strategy = require('../src/index.js');

describe('passport-solana', () => {
  it('should export Strategy constructor directly from package', () => {
    expect(strategy).to.be.a('function');
    expect(strategy).to.equal(strategy.Strategy);
  });
});
