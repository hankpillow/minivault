const assert = require("assert");
const webcrypto = require('node-webcrypto-ossl').Crypto
const minivault = require("../extension/minivault")

const crypto = new webcrypto()
const hash = process.argv[2] || ""
const password = process.argv[3] || ""

try{
  assert(!!hash.length, "missing hash.Usage: node decrypt.js hash password")
  assert(!!password.length, "missing password.Usage: decrypt.js hash password")
} catch (err) {
  process.exit(1)
}

minivault
  .decrypt(hash, password, crypto)
  .then(secret => {
    console.log(secret);
    process.exit()
  }).catch(err => {
    process.exit(1)
  })
