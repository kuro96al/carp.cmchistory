'use strict'

let https = require('https');
var cmc = function () {

}

const URL = 'https://api.coinmarketcap.com/v1/ticker/?limit=0';

cmc.getMarketInfo = function () {
    return new Promise((resolve, reject) => {
        https.get(URL, (res) => {
            let body = '';
            res.setEncoding('utf8');

            res.on('data', (chunk) => {
                body += chunk;
            });
            resolve(new Promise((resolve, reject) => {
                res.on('end', (res) => {
                    res = JSON.parse(body);
                    resolve(res);
                });
            }));
        }).on('error', (e) => {
            console.log(e.message); //エラー時
        });
    });
}
module.exports = cmc;