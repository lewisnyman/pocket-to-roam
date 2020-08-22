// roam.js
const puppeteer = require('puppeteer');

module.exports = function () {
  const go = async function (email, pass) {
    console.log('going');
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('https://roamresearch.com/#/signin');
    await page.type('[name="email"]', email);
    await page.type('[name="password"]', pass);
    await page.click('button.bp3-button');
    await page.waitForSelector('.my-graphs');
    console.log('Logged in');
    await page.click('.your-hosted-dbs-grid a');
    await page.waitForSelector('#find-or-create-input');
    return await page.screenshot({ path: 'example.png' });
  };

  const startBrowser = async function () {
    roam.browser = await puppeteer.launch();
    roam.page = await roam.browser.newPage();
    return;
  };

  const closeBrowser = async function () {};

  const login = async function () {
    await roam.page.goto('https://roamresearch.com/#/signin');
    await roam.page.type('[name="email"]', process.env.ROAM_EMAIL);
    await roam.page.type('[name="password"]', process.env.EMAIL_PASS);
    await roam.page.click('button.bp3-button');
    return await roam.page.waitForSelector('.my-graphs');
  };

  return {
    go: go,
  };
};
