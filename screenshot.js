const {parse} = require('url');
const env = require('dotenv').config();
const yargs = require('yargs').argv;


const {getScreenshot} = require('./chromium');

const { getInt, getUrlFromPath, isValidUrl, isValidType } = require('./validator');


async function run() {

        const {fileType = 'pdf', quality, fullPage, landscape, margin = '{}', path} = yargs;

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

run().then(file => process.stdout.write(file));
