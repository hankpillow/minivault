## 🔒 Minivault

Encrypt secrets with password and share with those who know it.

This extension is designed to encrypt short secrets (max 2056 chars) with a password to create a unique hash that only with the same password you can decrypt.

> No data is kept or sent to nowhere! 

* [Web version](https://minivault.netlify.app/)

* [Google Chrome Extension](https://chrome.google.com/webstore/detail/minivault/ecnpflgglffkleflcmefcmfpenlagjpk)

* [Firefox Add-Ons](https://addons.mozilla.org/en-US/firefox/addon/minivault/?src=search)

----

Running minivault from command line

## 🐋 Docker

* **minivault/vault** designed to encrypt/decrypt (smaller)
* **minivault/minivaul** designed test everything: cli and extension with headless browser


 ```sh
docker run --rm minivault/vault encrypt secret password
docker run --rm minivault/vault decrypt hash password
docker run --rm localhost/minivault npm run --silent encrypt "foo" "bar"
docker run --rm localhost/minivault npm run --silent decrypt "foo" "bar"
```

## 💻 Terminal alias

* ~/.config/fish/functions/encrypt.fish
    ```sh
    function encrypt
        command docker run --rm minivault/vault encrypt $argv
    end
    ```

* ~/.config/fish/functions/decrypt.fish
    ```sh
    function decrypt
        command docker run --rm minivault/vault decrypt $argv
    end
    ```

* ~/.bashrc
    ```sh
    alias encrypt='docker run --rm minivault/vault encrypt'
    alias decrypt='docker run --rm minivault/vault decrypt'
    ```

## 🤓 nodejs devs


```sh
npm ci
npm test
node bin/encrypt.js "secret" "password"
node bin/decrypt.js "hash" "password"
```

----
[![Netlify Status](https://api.netlify.com/api/v1/badges/bd352089-df55-449c-933e-c546276550b0/deploy-status)](https://app.netlify.com/sites/minivault/deploys)

