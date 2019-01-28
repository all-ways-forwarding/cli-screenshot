const { URL } = require('url');

const getInt = str => /[0-9]+/.test(str) ? parseInt(str) : undefined;

const getUrlFromPath = str => {
    let url = str.slice(1);
    if (! url.startsWith('http')) {
        return 'https://' + url;
    }
    return url;
};

const isValidUrl = str => {
    try {
        const url = new URL(str);
        return url.hostname.includes('.');
    } catch (e) {
        console.error(e.message);
        return false;
    }
};

const isValidType = str => ['pdf', 'jpeg', 'png'].includes(str);

const contentType = str => {
    switch (str) {
        case 'pdf':
            return 'text/plain';
        default:
            return `image/${str}`;
    }
};

module.exports = { getInt, getUrlFromPath, isValidUrl, isValidType, contentType };

