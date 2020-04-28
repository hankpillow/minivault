const puppeteer = require('puppeteer');
const assert = require("assert");
const secret = process.argv[2] || ""
const password = process.argv[3] || ""
try {
    assert(!!password.length, "missing password")
    assert(!!secret.length, "missing secret")
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
      hash = await page.evaluate(
        (secret, password) => window.encrypt(secret, password)
      , secret, password)
      console.log(hash)
    } catch (err) {
      process.exit(1)
    }
    await browser.close();
})();
