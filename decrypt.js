const puppeteer = require('puppeteer');
const assert = require("assert");
const hash = process.argv[2] || ""
const password = process.argv[3] || ""
try{
    assert(!!password.length, "missing password")
    assert(!!hash.length, "missing hash")
} catch (err) {
  process.exit(1)
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `file://${__dirname}/test.html`
    const conf = { waitUntil: "load" }
    await page.goto(url, conf);
    try {
      const secret = await page.evaluate(
        (hash, password) => window.decrypt(hash, password)
      , hash, password)
      console.log(secret)
    } catch (err) {
      process.exit(1)
    }
    await browser.close();
})();
