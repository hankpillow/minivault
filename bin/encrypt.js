const puppeteer = require('puppeteer');
const assert = require("assert");
const path = require("path");
const secret = process.argv[2] || ""
const password = process.argv[3] || ""
const browserConf = require("../test/browserConf");

try {
  assert(!!secret.length, "missing secret. encrypt.js secret password")
  assert(!!password.length, "missing password. encrypt.js secret password")
} catch (err) {
  process.exit(1)
}

(async () => {
  const browser = await puppeteer.launch(browserConf);
  const page = await browser.newPage();
  const conf = { waitUntil: "load" }
  let url = path.resolve(`${__dirname}/../test/minivault.html`)
  url = `file://${url}`

  try {
    await page.goto(url, conf);
  } catch (err){
    console.log("Error loading page:", url)
    console.error(err)
    process.exit()
  }

  try {
    hash = await page.evaluate(
      (secret, password) => window.encrypt(secret, password)
      , secret, password)
    console.log(hash)
    await browser.close();
  } catch (err) {
    process.exit(1)
  }
})();
