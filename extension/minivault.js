const mode = 'AES-GCM';
const length = 256;
const	ivLength = 12;
const HASH_NUM = '0123456789'
const HASH_SIGN = '!@#$%^&*'
const HASH_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function fromHexaToUint8Array ( hexString ) {
  return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

function fromUint8ArrayToHexa (bytes) {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

function fromArrayBufferToHexa (buff) {
  return [].map.call(new Uint8Array(buff), b => ('00' + b.toString(16)).slice(-2)).join('');
}

function getRandom (characters) {
  if (!!characters && typeof characters.charAt == "function") {
    return characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return null
}

function shuffle (array) {
  if (!array) return null
  if (!array.length) return array
	let counter = array.length;
  let temp, index
	while (counter > 0) {
		index = Math.floor(Math.random() * counter);
		counter--;
		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
}

function getHash (length, withNum, withSigns) {

	if (length <= 3 ) return null
	length += 1

  const slice = Math.ceil(length / ((withNum ? 1 : 0) + (withSigns ? 1 : 0) + 1))
  const numSize = withNum ? Math.min(slice, Math.round(1 + (Math.random() * slice))) : 0
  const signSize = withSigns ? Math.min(slice, Math.round(1 + (Math.random() * slice))) : 0
  const size = (length - (numSize + signSize))

  const numList = []
  const signList = []
  const charList = []

  while(--length){
    if (withNum && numList.length != numSize){
      numList.push(getRandom(HASH_NUM.toString()))
    }
    else if (withSigns && signList.length != signSize){
      signList.push(getRandom(HASH_SIGN.toString()))
    } 
    else if (charList.length != size){
      charList.push(getRandom(HASH_CHAR.toString()))
    }
  }

	return shuffle([].concat(
    numList, charList, signList)
  ).join("")
}

async function genEncryptionKey (password, length, crypto) {
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
  const key = await genEncryptionKey(password, length, crypto);
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
  var key = await genEncryptionKey(password, length, crypto);
  var decrypted = await crypto.subtle.decrypt(algo, key, encrypted.cipherText);
  return new TextDecoder().decode(decrypted);
}

if (typeof module !== "undefined"){
  module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
    getHash: getHash
  }
}


