## 🔒 Minivault

Encrypt secrets with password and share with those who know it.

This extension is designed to encrypt short secrets (max 2056 chars) with a password to create a unique hash that only with the same password you can decrypt.

> No data is kept or sent to nowhere! 

* [Web version](https://minivault.netlify.app/)

* [Google Chrome Extension](https://chrome.google.com/webstore/detail/minivault/ecnpflgglffkleflcmefcmfpenlagjpk)

* [Firefox Add-Ons](https://addons.mozilla.org/en-US/firefox/addon/minivault/?src=search)

* Command line version

## Via Docker

* Encrypt
 ```sh
docker-compose run --rm encrypt "mysecret" "mypassword"
```

* Decrypt
 ```sh
docker-compose run --rm decrypt "myhash" "mypassword"
```

## Via Nodejs

```sh
npm ci
```

* Encrypt
 ```sh
node bin/encrypt.js "mysecret" "mypassword"
```

* Decrypt
 ```sh
node bin/encrypt.js "myhash" "mypassword"
```

### Cmd alias

* Fish shell

~/.config/fish/functions/encrypt.fish
```sh
function encrypt
    command docker run --rm -v $HOME/workspace/minivault/test/:/test -v $HOME/workspace/minivault/bin/:/cli -v $HOME/workspace/minivault/extension/:/extension minivault/puppeteer:3.0.2 node cli/encrypt.js $argv
end
```

~/.config/fish/functions/decrypt.fish
```sh
function decrypt
    command docker run --rm -v $HOME/workspace/minivault/test/:/test -v $HOME/workspace/minivault/bin/:/cli -v $HOME/workspace/minivault/extension/:/extension minivault/puppeteer:3.0.2 node cli/decrypt.js $argv
end
```

* Bash

~/.bashrc
```sh
alias encrypt='docker run --rm -v $HOME/workspace/minivault/test/:/test -v $HOME/workspace/minivault/bin/:/cli -v $HOME/workspace/minivault/extension/:/extension minivault/puppeteer:3.0.2 node cli/encrypt.js'
alias decrypt='docker run --rm -v $HOME/workspace/minivault/test/:/test -v $HOME/workspace/minivault/bin/:/cli -v $HOME/workspace/minivault/extension/:/extension minivault/puppeteer:3.0.2 node cli/decrypt.js'
```

----
[![Netlify Status](https://api.netlify.com/api/v1/badges/bd352089-df55-449c-933e-c546276550b0/deploy-status)](https://app.netlify.com/sites/minivault/deploys)

