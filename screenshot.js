const {parse} = require('url');
const env = require('dotenv').config();
const yargs = require('yargs').argv;


const {getScreenshot} = require('./chromium');

const { getInt, getUrlFromPath, isValidUrl, isValidType } = require('./validator');


async function run() {

        const {fileType = 'pdf', quality, fullPage, landscape, margin = '{}', path} = yargs;

        if (!path) {
            throw 'Bad Request --path is required.';
        }

        const url = getUrlFromPath(path);

        const qual = getInt(quality);

        if (! isValidUrl(url)) {
            throw `Bad Request  url ${url} is not valid.`;
        }

        if (!isValidType(fileType)) {
            throw `Bad Request The type ${fileType}  is not valid.`;
        } else {
            return  await getScreenshot(url, fileType, qual, fullPage, !!landscape, JSON.parse(margin));
        }



}

run().then(file => process.stdout.write(file)).catch(err => {
    // ws rejects a failed upgrade with an ErrorEvent, which stringifies to
    // "#<ErrorEvent>" — the real text lives on .message / .error.
    const message = err.message || (err.error && err.error.message) || String(err);
    process.stderr.write(`cli-screenshot failed: ${message}\n`);
    process.exit(1);
});
