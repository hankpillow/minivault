const puppeteer = require('puppeteer');
const assert = require("assert");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `file://${__dirname}/extension/popup.html`
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

      page.on('console', msg => {
          for (let i = 0; i < msg.args().length; ++i)
              console.log(`${msg.args()[i]}`);
      });

      console.log("+ creating new hash...")
      await page.evaluate((secret, password) => {
        const form = document.documentElement.querySelector("form[name=encrypt]")
        const textarea = form.querySelector("textarea")
        const btn = form.querySelector("[type=submit]")
        const pass = form.querySelector("input[name=password]")
        textarea.value = secret
        pass.value = password
        btn.click()
      },secret, password)

      await page.waitFor(() => {
        const hash =  document.querySelector("form[name=encrypt] [name=hash]")
        return hash.textContent.length
      },{timeout:1000});

      const newHash = await page.evaluate(() => document
          .querySelector("form[name=encrypt] [name=hash]").textContent);

      assert(!!newHash.match(/^\w+;;\w+$/gi), `unexpected hash pattern: ${tEncrypt}`)
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
      },newHash, password)

      await page.waitFor(() => {
        const hash =  document.querySelector("form[name=decrypt] [name=secret]")
        return hash.textContent.length
      },{timeout:1000});

      let decodedHash = await page.evaluate(() => document
          .querySelector("form[name=decrypt] [name=secret]").textContent);
      assert(decodedHash === secret, `wrong secret: ${tEncrypt}`)
      console.log("+ decoded: "+ decodedHash)

      console.log("+ decoding old hash: " + oldHash)
      await page.evaluate((oldHash, password) => {
        const form = document.documentElement.querySelector("form[name=decrypt]")
        const hash = form.querySelector("[name=hash]")
        const pass = form.querySelector("[name=password]")
        const btn = form.querySelector("[type=submit]")
        hash.value = oldHash
        pass.value = password
        btn.click()
      },oldHash, password)

      await page.waitFor(() => {
        const hash =  document.querySelector("form[name=decrypt] [name=secret]")
        return hash.textContent.length
      },{timeout:1000});

      decodedHash = await page.evaluate(() => document.querySelector("form[name=decrypt] [name=secret]").textContent);
      assert(decodedHash === secret, `wrong secret: ${tEncrypt}`)
      console.log("+ decoded: "+ decodedHash)
      console.log("done")
    } catch (err) {
      console.log("error")
      console.error(err)
    }
    await browser.close();
})();
