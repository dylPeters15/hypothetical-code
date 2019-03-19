const express = require('express');
const cors = require('cors');
const headerParser = require('header-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const serverV1 = require('./v1/serverv1');
const serverV2 = require('./v2/serverv2');
const scraper = require('./v2/sales_scraper.js')
const schedule = require('node-schedule')

const app = express();
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
};

app.use(cors(corsOptions));
app.use(headerParser);
app.use(bodyParser.json());

const server = https.createServer({
    key: fs.readFileSync('./ssl/privkey.pem'),
    cert: fs.readFileSync('./ssl/fullchain.pem')
}, app).listen(8443, () => {
    console.log('Server started!');
});

var scrapeEveryDay = schedule.scheduleJob('0 6 * * *', () => { 
    scraper.scrapeAllFromCurrentYear();
 });

scraper.scrapeAll();

module.exports = server;

serverV1.startServerV1(app);
serverV2.startServerV2(app);