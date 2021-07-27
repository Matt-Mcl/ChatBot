const fetch = require('node-fetch');
const cheerio = require('cheerio');
const express = require('express');
const path = require('path');
const Fuse = require('fuse.js');

const app = express();
const port = 8000;

let dict = {};

app.get('/', function(req, res) {
    res.sendFile(path.normalize(__dirname + '/static/index.html'));
});

app.use(express.urlencoded({
    extended: true
}))

app.post('/results', (req, res) => {
    // Retrieve question from form and perform a fuzzy search
    const question = req.body.question 
    const options = {
        isCaseSensitive: false,
        includeScore: true,
    }
    const fuse = new Fuse(Object.keys(dict), options);

    const results = fuse.search(question);

    console.log('---------------------------------------------------');
    console.log(results);
    console.log('---------------------------------------------------');

    res.send(dict[results[0].item]);
    res.end()
  })

app.listen(port, () => console.log(`Express server running on port: ${port}`));


async function scrape() {
    const response = await fetch('https://www.oracle.com/startup/faq/');
    const text = await response.text();
    const $ = cheerio.load(text);

    $('li > h5').each(function (i) {
        dict[$(this).text()] = $('li > div').eq(i + 10).html();
    });
}
scrape();
