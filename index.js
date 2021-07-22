const fetch = require('node-fetch');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
const port = 8000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Express server running on port: ${port}`));


async function test() {
    const response = await fetch('https://www.oracle.com/startup/faq/');
    const text = await response.text();
    const $ = cheerio.load(text);

    let dict = {};

    $('li > h5').each(function (i) {
        dict[$(this).text()] = $('li > div').eq(i + 10).html();
    });

    console.log(dict['I have questions about my invoice. Who can I contact?']);
}
test();