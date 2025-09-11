/* global describe, it, expect */

const Strategy = require('../src/strategy');


describe('Strategy', () => {
  const strategy = new Strategy((() => {}));

  it('should be named solana', () => {
    expect(strategy.name).to.equal('solana');
  });

  it('should throw if constructed without a verify callback', () => {
    expect(() => {
      const s = new Strategy();
    }).to.throw(TypeError, 'SolanaStrategy requires an onAuth callback');
  });
});
