const puppeteer = require('puppeteer-core');


async function getScreenshot(url, type, quality, fullPage, landscape = false, margin) {

    if (process.env.APP_ENV !== 'local') {
        var browser = await puppeteer.connect({browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`});
    } else {

        var browser = await puppeteer.launch({
            executablePath: 'google-chrome',
            headless: true,
        });
    }

    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle0'
    });

    let file;

    switch (type) {
        case 'pdf':
            file = await page.pdf({printBackground: true, landscape, margin});
            break;
        default:
            file = await page.screenshot({type, quality, fullPage, landscape});
    }

    await browser.close();

    return file.toString('base64');
}

module.exports = {getScreenshot};
