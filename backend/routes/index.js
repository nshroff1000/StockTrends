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

/**
Returns all the stock names.
*/
router.get('/stocks', async function(req, res) {
	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  `SELECT STOCK_NAME, STOCK_TICKER, STOCK_ID
   FROM STOCKS ORDER BY STOCK_ID`
);
	res.json(result.rows);
});

/**
Returns the stock info for a particular stock
*/
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

/**
Gets all the daily trend values for the given stock ticker.
*/
router.get('/daily_trends/:stock', async function(req, res) {

	var current_stock = req.params.stock;

	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  	`SELECT STOCK_NAME, TREND_VALUE, START_OF_WEEK
FROM STOCKS s 
    JOIN TRENDS t ON s.stock_id = t.stock_id 
	WHERE STOCK_TICKER = :stock
	ORDER BY START_OF_WEEK`,
	[current_stock],
	);
	
	res.json(result.rows);
});


/**
Gets all the daily prices for the given stock ticker only after the first trend value.
*/
router.get('/daily_price_all/:stock', async function(req, res) {

	var current_stock = req.params.stock;

	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  	`SELECT STOCK_NAME, PRICE, DAILY_DATE
FROM STOCKS s 
    JOIN PRICES p ON s.stock_id = p.stock_id
WHERE STOCK_TICKER = :stock
	ORDER BY DAILY_DATE`,
	[current_stock],
	);
	
	res.json(result.rows);
});




/**
Gets all the daily prices for the given stock ticker only after the first trend value.
*/
router.get('/daily_price/:stock', async function(req, res) {

	var current_stock = req.params.stock;

	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  	`SELECT STOCK_NAME, PRICE, DAILY_DATE
FROM STOCKS s 
    JOIN PRICES p ON s.stock_id = p.stock_id
WHERE STOCK_TICKER = :stock AND p.DAILY_DATE > TO_DATE('16-NOV-14','dd-MON-yy')
	ORDER BY DAILY_DATE`,
	[current_stock],
	);
	
	res.json(result.rows);
});

/**
Returns the volatility of each stock in descending order.
*/
router.get('/stdev/:days', async function(req, res) {
	
	var number_of_days = req.params.days;

	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  	`SELECT s.STOCK_NAME, STDDEV(PRICE) as volatility
  		FROM PRICES p JOIN STOCKS s on p.stock_id = s.stock_id
		WHERE p.DAILY_DATE > TO_DATE('08-NOV-19','dd-MON-yy') - :days
		GROUP BY s.STOCK_NAME
		ORDER BY volatility DESC`,
		[number_of_days]
	);
	res.json(result.rows);
});

/**
Returns the max price of each stock.
*/
router.get('/max_price', async function(req, res) {

	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  	`SELECT s.STOCK_NAME, MAX(p.PRICE) as max_price
FROM PRICES p JOIN STOCKS s 
ON p.STOCK_ID = s.STOCK_ID
GROUP BY s.STOCK_NAME`,
	);
	
	res.json(result.rows);
});

/**
Returns all stocks less than a certain price on a specific day.
*/
router.get('/price_max/:price', async function(req, res) {

	var max_price = req.params.price;

	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  	`SELECT STOCK_NAME, PRICE FROM PRICES P JOIN STOCKS S
ON P.STOCK_ID = S.STOCK_ID
WHERE P.DAILY_DATE = date '2019-10-10' 
AND P.PRICE < :price`,
[max_price]
	);
	
	res.json(result.rows);
});


module.exports = router
