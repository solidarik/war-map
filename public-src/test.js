const strHelper = require('../helper/strHelper')
const util = require('util')
const crypto = require('crypto')

function AES() {

    let aes = {};

    aes.encrypt = async (message, password, passwordBits, iterations) => {

      let rounds = iterations || 5000;
      let msg = new util.TextEncoder().encode(message);
      let pass;

      if (password) {
        pass = await crypto.subtle.importKeyimportKey('raw', new TextEncoder().encode(password), {
          "name": "PBKDF2"
        }, false, ['deriveBits']);
      }

      if (passwordBits) {
        pass = await crypto.subtle.importKey('raw',new Uint8Array(passwordBits),{
          "name": "PBKDF2"
        },false,['deriveBits'])
      }

      let salt = crypto.getRandomValues(new Uint8Array(32));
      let iv = crypto.getRandomValues(new Uint8Array(12));

      let bits = await crypto.subtle.deriveBits({
        "name": "PBKDF2",
        "salt": salt,
        "iterations": rounds,
        "hash": {
          "name": "SHA-256"
        }
      }, pass, 256);

      let key = await crypto.subtle.importKey('raw', bits, {
        "name": "AES-GCM"
      }, false, ['encrypt']);

      let enc = await crypto.subtle.encrypt({
        "name": "AES-GCM",
        "iv": iv
      }, key, msg);

      let iterationsHash = btoa(rounds.toString());

      let saltHash = btoa(Array.from(new Uint8Array(salt)).map(val => {
        return String.fromCharCode(val)
      }).join(''));

      let ivHash = btoa(Array.from(new Uint8Array(iv)).map(val => {
        return String.fromCharCode(val)
      }).join(''));

      let encHash = btoa(Array.from(new Uint8Array(enc)).map(val => {
        return String.fromCharCode(val)
      }).join(''));

      return iterationsHash + '.' + saltHash + '.' + ivHash + '.' + encHash;

    };

    aes.decrypt = async (encrypted, password, passwordBits) => {

      let parts = encrypted.split('.');
      let rounds = parseInt(atob(parts[0]));

      let salt = new Uint8Array(atob(parts[1]).split('').map(val => {
        return val.charCodeAt(0);
      }));

      let iv = new Uint8Array(atob(parts[2]).split('').map(val => {
        return val.charCodeAt(0);
      }));

      let enc = new Uint8Array(atob(parts[3]).split('').map(val => {
        return val.charCodeAt(0);
      }));

      let pass;

      if (password) {
        pass = await crypto.subtle.importKey('raw', new util.TextEncoder().encode(password), {
          "name": "PBKDF2"
        }, false, ['deriveBits']);
      }

      if (passwordBits) {
        pass = await crypto.subtle.importKey('raw', new Uint8Array(passwordBits), {
          "name": "PBKDF2"
        }, false, ['deriveBits']);
      }

      let bits = await crypto.subtle.deriveBits({
        "name": "PBKDF2",
        "salt": salt,
        "iterations": rounds,
        "hash": {
          "name": "SHA-256"
        }
      }, pass, 256);

      let key = await crypto.subtle.importKey('raw', bits, {
        "name": "AES-GCM"
      }, false, ['decrypt']);

      let dec = await crypto.subtle.decrypt({
        "name": "AES-GCM",
        "iv": iv
      }, key, enc);

      return (new util.TextDecoder().decode(dec));

    };

    return aes;

}

const encrypted = "NTAwMA==.zj3k+U9mgfmPLyxtgAb3itGa7mmHcUGv2LlPjpyTssk=.qfWT9mPHINpbwUVw.7YDWYFiXxuzeIvVrfJ1L4onH7FTreS9LxuVZcbgC"

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

const prom = new Promise((resolve, reject) => {
    for (let i = 0; i < 100000; i++) {
        const password = pad(i, 5)

        if (password == '99999')
            console.log(password)
        AES()
        .decrypt(encrypted, password)
        .then((decrypted) => {
            console.log('AAAAA decrypted', decrypted, password)
            resolve(password)
        })
        .catch(err => {
            console.log('Ключ не подходит', password)
        })
    }
})

return

const prom = new Promise((resolve, reject) => {
    for (let i = 0; i < 100000; i++) {
        const password = pad(i, 5)

        if (password == '99999')
            console.log(password)
        AES()
        .decrypt(encrypted, password)
        .then((decrypted) => {
            console.log('AAAAA decrypted', decrypted, password)
            resolve(password)
        })
        .catch(err => {
            console.log('Ключ не подходит', password)
        })
    }
})

prom.then((res) => console.log(res))