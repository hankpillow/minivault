## 🔒 Minivault

Encrypt secrets with password and share with those who know it.

This extension is designed to encrypt short secrets (max 2056 chars) with a password to create a unique hash that only with the same password you can decrypt.

> No data is kept or sent to nowhere! 

* [Web version](https://minivault.netlify.app/)

* [Google Chrome Extension](https://chrome.google.com/webstore/detail/minivault/ecnpflgglffkleflcmefcmfpenlagjpk)

* [Firefox Add-Ons](https://addons.mozilla.org/en-US/firefox/addon/minivault/?src=search)

----

Running minivault from command line

### docker

 ```sh
docker run --rm minivault/encrypt:1.5.0 "mysecret" "mypassword"
docker run --rm minivault/decrypt:1.5.0 "cf2c1c92ad24ef5645a7d92c;;8104276cb1a47b0bc69ba2a19115878ff10ee3b4fd6dc28e" "mypassword"
```

### terminal alias

~/.config/fish/functions/encrypt.fish
```sh
function encrypt
    command docker run --rm minivault/encrypt:1.5.0 $argv
end
```

~/.config/fish/functions/decrypt.fish
```sh
function decrypt
    command docker run --rm minivault/decrypt:1.5.0 $argv
end
```

~/.bashrc
```sh
alias encrypt='docker run --rm minivault/decrypt:1.5.0'
alias decrypt='docker run --rm minivault/decrypt:1.5.0'
```

## for dev

nodejs
```sh
npm ci
npm test
node bin/encrypt.js "mysecret" "mypassword"
node bin/encrypt.js "cf2c1c92ad24ef5645a7d92c;;8104276cb1a47b0bc69ba2a19115878ff10ee3b4fd6dc28e" "mypassword"
```

docker-compose 
 ```sh
docker-compose run --rm test
docker-compose run --rm encrypt "mysecret" "mypassword"
docker-compose run --rm decrypt "cf2c1c92ad24ef5645a7d92c;;8104276cb1a47b0bc69ba2a19115878ff10ee3b4fd6dc28e" "mypassword"
```

----
[![Netlify Status](https://api.netlify.com/api/v1/badges/bd352089-df55-449c-933e-c546276550b0/deploy-status)](https://app.netlify.com/sites/minivault/deploys)

