# basilStream
Script with a simple interface to track growth of basil and transfer surface area data on to the @iotaledger

## Software Setup
To succesfully send data to the tangle you first have to generate a seed and an address from that seed. Update the `seed` and `basilAddress` variables in `basilStream.js` with yours.

```js
let seed = "";
let basilAddress = "";
```

Secondly you have to choose a `"provider"` which will do the POW and send the transaction to the tangle. Note that the full-node has to have `attachToTangle` allowed, otherwise it won't accept the transaction.

```js
let iota = new IOTA({
  "provider": "http://localhost:14265"
});
```

Links:
[How to generate your IOTA Wallet Seed](https://iota.guide/seed/how-to-generate-iota-wallet-seed/)
[IOTA Address Generator (educational)](https://github.com/domschiener/iota-address-generator)

## Hardware Setup
Right now the surface area of the basil is being tracked by a webcam. Our hardware setup right now: `Logitech C270` connected to `Raspberry Pi 3 Model B`.
