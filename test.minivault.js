const puppeteer = require('puppeteer');
const assert = require("assert");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `file://${__dirname}/test.html`
    const conf = { waitUntil: "load" }
    await page.goto(url, conf);

    const password = "pass"
    const secret = "minivault"
    const oldHash = "5d6ec5464cb2b1e9af74392a;;97f4d86c0f4d1a61805e312c5984b824e9f6fb69a186875583"
    try {
      // test if function is there
      let tEncrypt = await page.evaluate(() => typeof window.encrypt)
      assert(tEncrypt === "function", "unexpected format to encrypt fn")
      console.log("+ encrypt function exists") 

      let tDecrypt = await page.evaluate(() => typeof window.decrypt)
      assert(tDecrypt === "function", "unexpected format to encrypt fn")
      console.log("+ decrypt function exists") 

      //test encrypt pattern
      tEncrypt = await page.evaluate((secret, password) => window.encrypt(secret, password), secret, password)
      assert(!!tEncrypt.match(/^\w+;;\w+$/gi), `unexpected hash pattern: ${tEncrypt}`)
      console.log(`+ hash pattern match: ${tEncrypt}`) 

      tDecrypt = await page.evaluate((tEncrypt) => window.decrypt(tEncrypt, "pass"), tEncrypt)
      assert(tDecrypt === secret, `failed do decrypt hash:${tDecrypt}`)
      console.log(`+ hash decrypt working: ${tDecrypt}`) 

      tDecrypt = await page.evaluate((tEncrypt) => window.decrypt(tEncrypt, "pass"), oldHash)
      assert(tDecrypt === secret, `failed do decrypt old hash:${tDecrypt}`)
      console.log(`+ old hashes: ${oldHash} working: ${tDecrypt}`) 

      console.log("done")
    } catch (err) {
      console.log("error")
      console.error(err)
    }
    await browser.close();
})();
