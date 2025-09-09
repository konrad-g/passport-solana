const passport = require('passport-strategy');
const nacl = require('tweetnacl');
const bs58 = require('bs58');

/**
 * `Strategy` constructor.
 *
 * The Solana web3 strategy works by having the user sign a message using
 * their Solana wallet. We take the signed message and decode the address 
 * it was signed with. If the decoded address matches the address they are 
 * trying to sign in with, we authorize the user.
 * 
 * Applications must supply a `onAuth` callback
 *
 * Example:
 * const onAuth = function (req, address, done, msg, signed) {
 *   User.findOne({ address }, function (err, user) {
 *     done(err, user);
 *   });
 * }
 * const solanaStrategy = new SolanaStrategy(onAuth);
 * passport.use(solanaStrategy);
 *
 * @param {Object} options
 * @param {Function} onAuth
 * @api public
 */
class Strategy extends passport.Strategy {
  constructor(options, onAuth) {
    if (typeof options == 'function') {
      onAuth = options;
      options = {};
    }
    if (!onAuth) {
      throw new TypeError('SolanaStrategy requires an onAuth callback');
    }

    super();
    this._onAuth = onAuth;
    this.name = 'solana';
  }

  /**
   * Authenticate request based on the contents of a form submission.
   *
   * @param {Object} req
   * @api protected
   */
  authenticate(req, options = {}) {
    const credentials = this.getCredentials(req);
    if (!credentials) {
      return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
    }

    const { address, msg, signed } = credentials;

    try {
      const verified = nacl.sign.detached.verify(
        new TextEncoder().encode(msg),
        bs58.decode(signed),
        bs58.decode(address)
      );

      if (!verified) {
        return this.fail({ message: 'Invalid signature' }, 400);
      }

      const done = (err, user, info) => {
        if (err) return this.error(err);
        if (!user) return this.fail(info);
        this.success(user, info);
      };

      this._onAuth(req, address, done, msg, signed);
    } catch (ex) {
      return this.error(ex);
    }
  }

  getCredentials(req) {
    const { body, query } = req;
    const paramKeys = ['address', 'msg', 'signed'];
    const hasAll = (obj) => obj && paramKeys.every(k => Object.prototype.hasOwnProperty.call(obj, k));
    if (hasAll(body)) return body;
    if (hasAll(query)) return query;
    return null;
  }
}

module.exports = Strategy;
