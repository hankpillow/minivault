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

    let url = path.resolve(`${__dirname}/../extension/popup.html`)
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

      console.log("+ creating new hash...")
      await page.evaluate((secret, password) => {
        const form = document.documentElement.querySelector("form[name=encrypt]")
        const textarea = form.querySelector("textarea")
        const btn = form.querySelector("[type=submit]")
        const pass = form.querySelector("input[name=password]")
        textarea.value = secret
        pass.value = password
        btn.click()
      },secrets.secret, secrets.password)

      await page.waitFor(() => {
        const hash =  document.querySelector("form[name=encrypt] [name=hash]")
        return hash.textContent.length
      },{timeout:1000});

      const newHash = await page.evaluate(() => document
          .querySelector("form[name=encrypt] [name=hash]").textContent);

      assert(!!newHash.match(/^\w+;;\w+$/gi), `unexpected hash pattern: ${newHash}`)
      console.log(`+ hash pattern match: ${newHash}`)

      console.log("+ decoding new hash: " + newHash)
      await page.evaluate((newHash, password) => {
        const form = document.documentElement.querySelector("form[name=decrypt]")
        const hash = form.querySelector("[name=hash]")
        const pass = form.querySelector("[name=password]")
        const btn = form.querySelector("[type=submit]")
        hash.value = newHash
        pass.value = password
        btn.click()
      },newHash, secrets.password)

      await page.waitFor(() => {
        const hash =  document.querySelector("form[name=decrypt] [name=secret]")
        return hash.textContent.length
      },{timeout:1000});

      let decodedHash = await page.evaluate(() => document
          .querySelector("form[name=decrypt] [name=secret]").textContent);
      assert(decodedHash === secrets.secret, `wrong secret: ${decodedHash}`)
      console.log("+ decoded: "+ decodedHash)

      console.log("+ decoding old hash: " + secrets.hash)
      await page.evaluate((oldHash, password) => {
        const form = document.documentElement.querySelector("form[name=decrypt]")
        const hash = form.querySelector("[name=hash]")
        const pass = form.querySelector("[name=password]")
        const btn = form.querySelector("[type=submit]")
        hash.value = oldHash
        pass.value = password
        btn.click()
      },secrets.hash, secrets.password)

      await page.waitFor(() => {
        const hash =  document.querySelector("form[name=decrypt] [name=secret]")
        return hash.textContent.length
      },{timeout:1000});

      decodedHash = await page.evaluate(() => document
        .querySelector("form[name=decrypt] [name=secret]").textContent);
      assert(decodedHash === secrets.secret, `wrong secret: ${decodedHash}`)
      console.log("+ decoded: "+ decodedHash)

      console.log("done")
      await browser.close();

    } catch (err) {
      console.error(err)
      process.exit(1)
    }
})();
