const puppeteer = require('puppeteer');
const assert = require("assert");
const path = require("path");
const hash = process.argv[2] || ""
const password = process.argv[3] || ""

try{
  assert(!!hash.length, "missing hash. decrypt.js hash password")
  assert(!!password.length, "missing password. decrypt.js hash password")
} catch (err) {
  process.exit(1)
}

(async () => {
  const browser = await puppeteer.launch();
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
    const secret = await page.evaluate(
      (hash, password) => window.decrypt(hash, password)
      , hash, password)
    console.log(secret)
    await browser.close();
  } catch (err) {
    process.exit(1)
  }
})();
