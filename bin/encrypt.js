const assert = require("assert");
const webcrypto = require('node-webcrypto-ossl').Crypto
const minivault = require("../extension/minivault")

const crypto = new webcrypto()
const secret = process.argv[2] || ""
const password = process.argv[3] || ""

try {
  assert(!!secret.length, "missing secret. Usage: encrypt.js secret password")
  assert(!!password.length, "missing password. Usage: encrypt.js secret password")
} catch (err) {
  process.exit(1)
}

minivault
  .encrypt(secret, password, crypto)
  .then(hash => {
    console.log(hash);
    process.exit()
  }).catch(err => {
    process.exit(1)
  })
