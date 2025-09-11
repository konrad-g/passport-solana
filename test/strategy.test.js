/* global describe, it, expect */

const Strategy = require('../src/strategy');


describe('Strategy', function() {

  let strategy = new Strategy(function(){});

  it('should be named solana', function() {
    expect(strategy.name).to.equal('solana');
  });

  it('should throw if constructed without a verify callback', function() {
    expect(function() {
      let s = new Strategy();
    }).to.throw(TypeError, 'SolanaStrategy requires an onAuth callback');
  });

});
