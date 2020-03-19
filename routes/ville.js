var express = require('express');
var router = express.Router();
var https = require('https');

const URI_API = 'https://geocode.xyz/';
const END_URI = '?json=1';

/* GET ville page. */
router.get('/', function(req, res, next) {
    res.render('ville', { ville: req.query.ville });
});

/* POST ville page. */
router.post('/', function(req, res, next) {
    getCoordinates(req.body.nom_ville).then((data) => {
        if(data.longt > 0){
            res.render('ville', { ville: req.body.nom_ville, long: data.longt, lat:  data.latt, map: true});
        } else {
            res.render('ville', { ville: req.body.nom_ville, long: data.longt, lat:  data.latt, map: false});
        }
    })
});

/* Requet to goeparsing API */
function getCoordinates(city){
    let request = new Promise((resolve, reject) => {
        const URI = URI_API + city.toLocaleLowerCase() + END_URI;
        https.get(URI, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
                reject(error);
            }
            else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                    `Expected application/json but received ${contentType}`);
                reject(error);
            }
            if (error) {
                console.error(error.message);
                // consume response data to free up memory
                res.resume();
                return;
            }
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData);
                }
                catch (e) {
                    console.error(e.message);
                    reject(e);
                }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
            reject(e);
        });
    })
    return request;
}

module.exports = router;