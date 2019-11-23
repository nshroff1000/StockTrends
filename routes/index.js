var express = require('express');
var router = express.Router();
var path = require('path');

const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const dbconfig = require('../db-config.js');

async function test() {
var connection = await oracledb.getConnection(dbconfig);
const result = await connection.execute(
  `SELECT STOCK_NAME, STOCK_TICKER
   FROM STOCKS
   WHERE STOCK_TICKER = :tick`,
  ['GOOG'],  // bind value for :id
);
return result;
}


router.get('/stocks', async function(req, res) {
	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  `SELECT STOCK_NAME, STOCK_TICKER, STOCK_ID
   FROM STOCKS ORDER BY STOCK_ID`
);
	res.json(result.rows);
});

router.get('/stocks/:stock', async function(req, res) {
	var current_stock = req.params.stock;

	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  	`SELECT STOCK_NAME, STOCK_TICKER, STOCK_ID
   	FROM STOCKS WHERE STOCK_TICKER = :tick ORDER BY STOCK_ID`,
   	[current_stock],
	);
	
	res.json(result.rows);
});

router.get('/trends/:stock', async function(req, res) {

	var current_stock = req.params.stock;

	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  	`SELECT STOCK_NAME, TREND_VALUE, DAILY_DATE
FROM STOCKS s 
    JOIN TRENDS t ON s.stock_id = t.stock_id 
    JOIN PRICES p ON s.stock_id = p.stock_id
WHERE STOCK_TICKER = :stock AND p.DAILY_DATE > sysdate - 50`,
	[current_stock],
	);
	
	res.json(result.rows);
});

router.get('/', function (req, res) {
  res.send('Hello World!');
});


module.exports = router
