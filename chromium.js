const chrome = require('chrome-aws-lambda');

    

const puppeteer = require('puppeteer-core');

async function getScreenshot(url, type, quality, fullPage, landscape = false, margin) {
    console.log(margin);
    const browser = await puppeteer.launch({
        args: chrome.args,
        executablePath: process.env.APP_ENV == 'production' ?  await chrome.executablePath : 'google-chrome',
        headless: process.env.APP_ENV === 'production' ? chrome.headless : true,
    });

    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle0'
    });

    let file;

    switch (type) {
        case 'pdf':
            file = await page.pdf({ printBackground: true, landscape, margin });
            break;
        default:
            file = await page.screenshot({ type, quality, fullPage, landscape });
    }

    await browser.close();

    return file.toString('base64');
}

module.exports = { getScreenshot };
