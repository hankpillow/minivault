const puppeteer = require('puppeteer');
const assert = require("assert");
const path = require("path");
const secrets = require("./secrets");
const browserConf = require("./browserConf");

(async () => {
    const browser = await puppeteer.launch(browserConf);
    const page = await browser.newPage();
    const conf = { waitUntil: "load" }
    let url = path.resolve(`${__dirname}/minivault.html`)
    url = `file://${url}`

    try{
      await page.goto(url, conf);
    } catch (err){
      console.log("Error loading page:", url)
      console.error(err)
      process.exit()
    }

    try {
      // test if function is there
      let tEncrypt = await page.evaluate(() => typeof window.encrypt)
      assert(tEncrypt === "function", "unexpected format to encrypt fn")
      console.log("+ encrypt function exists")

      let tDecrypt = await page.evaluate(() => typeof window.decrypt)
      assert(tDecrypt === "function", "unexpected format to encrypt fn")
      console.log("+ decrypt function exists")

      //test encrypt pattern
      tEncrypt = await page.evaluate((secret, password) => window
        .encrypt(secret, password), secrets.secret, secrets.password)
      assert(!!tEncrypt.match(/^\w+;;\w+$/gi), `unexpected hash pattern: ${tEncrypt}`)
      console.log(`+ hash pattern match: ${tEncrypt}`)

      tDecrypt = await page.evaluate((tEncrypt) => window
        .decrypt(tEncrypt, "pass"), tEncrypt)
      assert(tDecrypt === secrets.secret, `failed do decrypt hash:${tDecrypt}`)
      console.log(`+ hash decrypt working: ${tDecrypt}`)

      tDecrypt = await page.evaluate((tEncrypt) => window.decrypt(tEncrypt, "pass"), secrets.hash)
      assert(tDecrypt === secrets.secret, `failed do decrypt old hash:${tDecrypt}`)
      console.log(`+ old hash: ${secrets.hash} decrypted: ${tDecrypt}`)

      console.log("done")
    } catch (err) {
      console.log("error")
      console.error(err)
    }
    await browser.close();
})();
