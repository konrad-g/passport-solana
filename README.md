## Solana Web3 Passport Strategy

Solana web3 strategy for passport which authenticates the user by decoding a message
signed with the user's Solana address, and checking if it matches the address
that they are trying to authenticate with.

### Installation

```bash
npm install passport-solana
```

### Setup on the back-end
```js
const SolanaStrategy = require('passport-solana');

/**
 * Called when authorization succeeds. Perform any additional verification here,
 * and either return the user's data (if valid), or deny authorization by
 * passing an error to the `done` callback.
 */
const onAuth = (address, done) => {
  // optional additional validation. To deny auth:
  // done(new Error('User is not authorized.'));
  User.findOne({ address }, (err, user) => done(err, user));
};
const solanaStrategy = new SolanaStrategy(onAuth);

passport.use(solanaStrategy);

// endpoint
app.post('/log-in', passport.authenticate('solana'));
```

### Usage on the client-side

```js
import { PublicKey, VersionedTransaction } from '@solana/web3.js';

const logIn = async () => {
  const provider = (window as any).solflare || (window as any).phantom?.solana;

  if (!provider?.isConnected) {
    await provider.connect();
  }

  const publicKey: PublicKey = provider.publicKey;
  const message = "Generate here a random nonce"
  const encodedMessage = new TextEncoder().encode(message);

  // Sign message
  const signed = await provider.signMessage(encodedMessage, 'utf8');

  // Send to backend
  const res = await fetch('/log-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: publicKey.toString(),
      msg: message,
      signed: bs58.encode(signed.signature),
    })
  });

  if (res.ok) {
    const json = await res.json();
    console.log('✅ Logged in', json);
    return json
  } else {
    console.error('❌ Login failed');
    return null
  }
}
```

### License

[The MIT License](LICENSE)  
Copyright © 2025 Konrad Gadzinowski  
