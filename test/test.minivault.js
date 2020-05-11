const puppeteer = require('puppeteer');
const assert = require("assert");
const path = require("path");
const secrets = require("./secrets");
const browserConf = require("./browserConf");
const conf = { waitUntil: "load" }

let browser, page

(async () => {
    try {
      browser = await puppeteer.launch(browserConf);
    } catch (err) {
      console.error(err);
      process.exit(1)
    }
    try {
      page = await browser.newPage();
    } catch (err) {
      console.error(err);
      process.exit(1)
    }

    let url = path.resolve(`${__dirname}/../minivault.html`)
    url = `file://${url}`

    try{
      await page.goto(url, conf);
    } catch (err){
      console.log("Error loading page:", url)
      console.error(err)
      process.exit()
    }

    try {
      let tEncrypt = await page.evaluate(() => typeof window.encrypt)
      assert(tEncrypt === "function", "unexpected format to encrypt fn")
      console.log("+ encrypt function exists")

      let tDecrypt = await page.evaluate(() => typeof window.decrypt)
      assert(tDecrypt === "function", "unexpected format to encrypt fn")
      console.log("+ decrypt function exists")

      tEncrypt = await page.evaluate((secret, password) => window
        .encrypt(secret, password, window.crypto), secrets.secret, secrets.password)
      assert(!!tEncrypt.match(/^\w+;;\w+$/gi), `unexpected hash pattern: ${tEncrypt}`)
      console.log(`+ hash pattern match: ${tEncrypt}`)

      tDecrypt = await page.evaluate((tEncrypt, password) => window
        .decrypt(tEncrypt, password, window.crypto), tEncrypt, secrets.password)
      assert(tDecrypt === secrets.secret, `failed do decrypt hash:${tDecrypt}`)
      console.log(`+ hash decrypt working: ${tDecrypt}`)

      tDecrypt = await page.evaluate((tEncrypt, password) => window
        .decrypt(tEncrypt, password, window.crypto), secrets.hash, secrets.password)
      assert(tDecrypt === secrets.secret, `failed do decrypt old hash:${tDecrypt} with: ${secrets.password}`)
      console.log(`+ old hash: ${secrets.hash} decrypted: ${tDecrypt}`)

      let tHash = await page.evaluate(() => typeof window.getHash)
      assert(tHash === "function", "unexpected format to encrypt fn")
      console.log("+ getHash function exists")

      let tHashResult = await page.evaluate(() => {
        const NUM = HASH_NUM.split("")
        const SIGN = HASH_SIGN.split("")

        let size = 3
        let samples = 0
        let testInteration = 10
        let error = [] 
        let result

        while(size < 512) {
          size++
          while(--testInteration){

              //only chars
              result = window.getHash(size)
              if (result.length !== size) {
                error.push([size,false, false, result,'wrong length'])
              } else { ++samples} 

              //and numbers
              result = window.getHash(size, true)
              if (result.length !== size){
                error.push([size,false, false, result,'wrong length'])
              } else { ++samples} 

              if(!NUM.filter(val=>result.match(val)).length) {
                error.push([size, true, false, result,'missing number'])
              } else { ++samples} 

              //and signs
              result = window.getHash(size, false, true)
              if (result.length !== size){
                error.push([size,false, false, result,'wrong length'])
              }

              if(!SIGN.filter(val=>result.match(new RegExp("\\"+val))).length) {
                error.push([size, false, true, result,'missing signs'])
              } else { ++samples} 

              //numbers and signs
              result = window.getHash(size, true, true)
              if (result.length !== size){
                error.push([size,false, false, result,'wrong length'])
              } else { ++samples} 

              if(!SIGN.filter(val=>result.match(new RegExp("\\"+val))).length) {
                error.push([size, true, true, result,'missing signs'])
              } else { ++samples} 

              if(!NUM.filter(val=>result.match(val)).length) {
                error.push([size, true, true, result,'missing number'])
              } else { ++samples} 
            }
            testInteration = 100
        }
        return [error, samples]
      })
      assert(tHashResult[0].length === 0, "unexpected result:" + tHashResult.join("\nunexpected format to encrypt fn"))
      console.log(`+ getHash ${tHashResult[1]} samples created`)

      console.log("done")
      await browser.close();

    } catch (err) {
      console.error(err)
      process.exit(1)
    }
})();
