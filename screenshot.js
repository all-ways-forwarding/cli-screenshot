const { parse } = require('url');
const env = require('dotenv').config()


const { getScreenshot } = require('./chromium');

const { getInt, getUrlFromPath, isValidUrl, isValidType, contentType } = require('./validator');

if(process.env.APP_ENV === 'local'){

    const app = require('express')();
    
    
    app.get(/\/(.+)/, async function (req, res) {
        return await run(req, res);
    });

    app.listen(5001, console.log('listening on 5001'));

}
    

async function run(req, res) {
    try {
        const { path = '/', query = {} } = parse(req.url, true);

        const { type = 'pdf', quality, fullPage, landscape } = query;

        const url = getUrlFromPath(path);

        const qual = getInt(quality);

        if (! isValidUrl(url)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<h1>Bad Request</h1><p>The url <em>${url}</em> is not valid.</p>`);
        }
        if(! isValidType(type)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<h1>Bad Request</h1><p>The type <em>${type}</em> is not valid.</p>`);
        }
        else {
            const file = await getScreenshot(url, type, qual, fullPage, landscape);
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType(type));
            res.end(file);
        }


    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
        console.error(e.message);
    }
};


module.exports = run;
