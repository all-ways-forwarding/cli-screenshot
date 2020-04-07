const puppeteer = require('puppeteer-core');


async function getScreenshot(url, type, quality, fullPage, landscape = false, margin) {

console.log(process.env.APP_ENV);
    if (process.env.APP_ENV !== 'production') {

        var browser = await puppeteer.launch({
            executablePath: 'google-chrome',
            headless: true,
        });
    } else {
        var browser = await puppeteer.connect({browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`});
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
