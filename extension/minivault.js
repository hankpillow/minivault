const mode = 'AES-GCM';
const length = 256;
const	ivLength = 12;

function fromHexaToUint8Array ( hexString ) {
  return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

function fromUint8ArrayToHexa (bytes) {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

function fromArrayBufferToHexa (buff) {
  return [].map.call(new Uint8Array(buff), b => ('00' + b.toString(16)).slice(-2)).join('');
}

async function genEncryptionKey (password, mode, length, crypto) {
  var algo = {
    name: 'PBKDF2',
    hash: 'SHA-256',
    salt: new TextEncoder().encode('minivault'),
    iterations: 1000
  };
  var derived = { name: mode, length: length };
  var encoded = new TextEncoder().encode(password);
  var key = await crypto.subtle.importKey('raw', encoded, { name: 'PBKDF2' }, false, ['deriveKey']);

  return crypto.subtle.deriveKey(algo, key, derived, false, ['encrypt', 'decrypt']);
}

// Encrypt function
async function encrypt (text, password, crypto) {
  var algo = {
    name: mode,
    length: length,
    iv: crypto.getRandomValues(new Uint8Array(ivLength))
  };
  const key = await genEncryptionKey(password, mode, length, crypto);
  const encoded = new TextEncoder().encode(text);
  const encripted = {
    cipherText: await crypto.subtle.encrypt(algo, key, encoded),
    iv: algo.iv
  }
  return (fromUint8ArrayToHexa(encripted.iv) + ";;" +  fromArrayBufferToHexa(encripted.cipherText)).trim();
}

async function decrypt (hash, password, crypto) {
  const parts = hash.split(";;")
  const encrypted = {
    iv: fromHexaToUint8Array(parts[0]),
    cipherText: fromHexaToUint8Array(parts[1]),
  }
  var algo = {
    name: mode,
    length: length,
    iv: encrypted.iv
  };
  var key = await genEncryptionKey(password, mode, length, crypto);
  var decrypted = await crypto.subtle.decrypt(algo, key, encrypted.cipherText);
  return new TextDecoder().decode(decrypted);
}

if (typeof module !== "undefined"){
  module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
  }
}


