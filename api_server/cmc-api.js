//
// ─── READ MODULE ────────────────────────────────────────────────────────────────
//
var express = require('express');
var http = require('http');
var mysql = require('mysql');
//
// ─── DEFINE HANDLER ─────────────────────────────────────────────────────────────
//

var app = express();

app.get('/history/*', function (req, res) {
    var connection = mysql.createConnection({
        host: 'host',
        user: 'user',
        password: 'pass',
        database: 'cmc'
    });
    
    console.log(req.params[0]);
    var query = "select * from `" + req.params[0] + "` order by last_updated desc limit 100";
    connection.query(query, function (error, results, fields) {
        if (error) res.end("invalid id");
        else res.end(JSON.stringify(results));
    });
});
http.createServer(app).listen(8080, 'ip address'); 
