const express = require('express'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    url = require('url');
const app = express();

// const LOGS_FOLDER = '/logs';
// app.use(LOGS_FOLDER, express.static(__dirname + LOGS_FOLDER));
// app.use(express.static(__dirname + LOGS_FOLDER));

const PORT = 3000;
const LOG_PATH = './api/logs/logs.txt';
const LOG_ROUTE = '/log';

app.use(bodyParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post(LOG_ROUTE, (req, res) => {
    let datetime = new Date();
    fs.appendFile(LOG_PATH, `\n[${datetime}]> ${req.body.log}`, (err) => {
        console.log(err);
        res.end(`${req.body.log}`)
    })
});

app.get(LOG_ROUTE, (req, res) => {
    res.setHeader('content-type', 'text/plain');
    res.download(__dirname + `/logs/logs.txt`);
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))