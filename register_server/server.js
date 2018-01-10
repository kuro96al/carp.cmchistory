var mysql = require('mysql');
var cmc = require('./cmc');
var connection = mysql.createConnection({
    host: 'host',
    user: 'user',
    password: 'pass',
    database: 'cmc'
});
connection.connect();
setInterval(registerMarketInfo,30000);
async function registerMarketInfo(){
    var marketInfos = await cmc.getMarketInfo();
    console.log(marketInfos);
    col = "(rank int, price_usd float unsigned,price_btc float unsigned,24h_volume_usd float unsigned,market_cap_usd float unsigned,available_supply float unsigned,total_supply float unsigned,max_supply float unsigned,percent_change_1h float,percent_change_24h float,percent_change_7d float,last_updated int unsigned unique)"
    await createTableFromArray(connection, marketInfos, col);
    await insertMarketInfo(connection,marketInfos);
}

function createTableFromArray(connection, marketInfos,col){
    createTablePromises = [];
    marketInfos.forEach(function(marketInfo) {
        createTablePromises.push(createTable(connection,marketInfo.id,col));
    }, this);
    return Promise.all(createTablePromises);
}

async function createTable(connection, tableName, col) {
    result = await new Promise((resolve, reject) => {
        connection.query('show tables like ' + "'" + tableName + "'", function (error, results, fields) {
            if (error) throw error;
            resolve(results[0]);
        });
    })
    //テーブルが存在しないならcreate table
    if (result === undefined) {
        await new Promise((resolve, reject) => {
            var query = "create table `" + tableName + "`" + col;
            console.log(tableName);
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
                resolve(results);
            });
        })
    }
}

function insertMarketInfo(connection, marketInfos) {
    marketInfos.forEach(function (marketInfo) {
        connection.query("insert ignore into `" + marketInfo.id + "`" + 
        " (rank, price_usd,price_btc,24h_volume_usd,market_cap_usd,available_supply,total_supply,max_supply,percent_change_1h,percent_change_24h,percent_change_7d,last_updated)" +
        " values (" +
            marketInfo.rank + "," +
            marketInfo.price_usd + "," +
            marketInfo.price_btc + "," +
            marketInfo["24h_volume_usd"] + "," +
            marketInfo.market_cap_usd + "," +
            marketInfo.available_supply + "," +
            marketInfo.total_supply + "," +
            marketInfo.max_supply + "," +
            marketInfo.percent_change_1h + "," +
            marketInfo.percent_change_24h + "," +
            marketInfo.percent_change_7d + "," +
            marketInfo.last_updated +
            ")", function (error, results, fields) {
                if (error) throw error;
            });
    }, this);

}