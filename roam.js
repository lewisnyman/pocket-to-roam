// roam.js
const puppeteer = require('puppeteer');

module.exports = function () {
  const go = async function (email, pass) {
    console.log('going');
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.setDefaultTimeout(90000);
    await page.goto('https://roamresearch.com/#/signin');
    await page.type('[name="email"]', email);
    await page.type('[name="password"]', pass);
    await page.click('button.bp3-button');
    await page.waitForSelector('.my-graphs');
    console.log('Logged in');
    await page.click('.your-hosted-dbs-grid a');
    await page.waitForSelector('.roam-article .roam-block');
    console.log('Creating page...');
    // await page.type('#find-or-create-input', title);
    // await page.waitForFunction(
    //   'document.querySelector(".rm-menu-item").includes("' + title + '"'
    // );
    const title = '[[Imported from Pocket]]';
    console.log('.roam-article .roam-block');
    // Select the first block and give focus
    await page.screenshot({ path: 'example.png' });
    await page.click('.roam-article .roam-block');
    await page.waitForSelector('.roam-article .rm-block-input');
    console.log('.roam-article .rm-block-input');
    await page.focus('.roam-article .rm-block-input');
    // Go to start of block
    await page.keyboard.down('Control');
    await page.keyboard.press('Home');
    await page.keyboard.up('Control');
    await page.waitFor(1000);
    // Create new block
    await page.keyboard.press('Enter');
    await page.keyboard.type(title, { delay: 100 });
    await page.screenshot({ path: 'create-block.png' });
    await page.waitFor(100);
    await page.waitForSelector('.rm-synced');
    // Create sub-blocks
    // Enter
    // await page.keyboard.type(String.fromCharCode(13));
    await page.keyboard.press('\n');
    await page.waitFor(100);
    await page.waitForSelector('.rm-synced');
    // tab
    await page.keyboard.press('Tab');
    await page.waitFor(100);
    await page.waitForSelector('.rm-synced');
    await page.keyboard.type('Item one', { delay: 100 });
    await page.waitFor(100);
    await page.waitForSelector('.rm-synced');

    await page.screenshot({ path: 'finish.png' });

    await page.waitFor(3000);
    console.log('Tada! 🎉');
    await browser.close();
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
