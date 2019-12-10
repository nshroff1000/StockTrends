var express = require('express');
var router = express.Router();
var path = require('path');

const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const dbconfig = require('../db-config.js');

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
Gets all the daily prices for the given stock ticker.
*/
router.get('/daily_price_all/:stock', async function(req, res) {

	var current_stock = req.params.stock;

	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  	`SELECT STOCK_NAME, PRICE, DAILY_DATE
		FROM (
		SELECT PRICE, STOCK_ID , DAILY_DATE
		FROM PRICES) p 
		JOIN (
		SELECT STOCK_ID, STOCK_NAME
		FROM STOCKS
		WHERE STOCK_TICKER = :stock) s 
		ON s.stock_id = p.stock_id
		ORDER BY DAILY_DATE
	`,
	[current_stock],
	);
	
	res.json(result.rows);
});


/**
Gets the volume of a particular stock over the last 5 days for each date.
*/
router.get('/weekly_volume/:stock', async function(req, res) {
	var current_stock = req.params.stock;

	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  	`SELECT DAILY_DATE, AVG(VOLUME) OVER (
	ORDER BY DAILY_DATE 
	ASC ROWS 5 PRECEDING) AS AVG_VOLUME
	FROM (
	SELECT DAILY_DATE, VOLUME, STOCK_ID
	FROM PRICES
	WHERE DAILY_DATE >= TO_DATE('16-NOV-14','dd-MON-yy')) p 
	JOIN (
	SELECT STOCK_ID
	FROM STOCKS
	WHERE STOCK_TICKER = :stock) s 
	ON p.STOCK_ID = s.STOCK_ID 
	`,
		[current_stock]
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
Returns the volatility of a particular stock over the last 5 days for each date.
*/
router.get('/stdev_week/:stock', async function(req, res) {
	
	var current_stock = req.params.stock;

	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  	`SELECT DAILY_DATE, STDDEV(PRICE) OVER (
	ORDER BY DAILY_DATE 
	ASC ROWS 5 PRECEDING) AS STD_PRICE
	FROM (
	SELECT STOCK_ID, PRICE, DAILY_DATE
	FROM PRICES
	WHERE DAILY_DATE >= TO_DATE('16-NOV-14','dd-MON-yy')) p 
	JOIN (
	SELECT STOCK_ID
	FROM STOCKS
	WHERE STOCK_TICKER = :stock) s 
	ON p.STOCK_ID = s.STOCK_ID 
	`,
		[current_stock]
	);
	res.json(result.rows);
});

/**
Returns the max price of each stock in a certain range of dates.
*/
router.get('/max_price/:stock?', async function(req, res) {
	var current_stock = req.params.stock;
	var dateOne = req.query['first_date'];
	var dateTwo = req.query['second_date'];

	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  	`SELECT STOCK_NAME, PRICE AS MAX_PRICE FROM 
  	(SELECT s.STOCK_NAME, p.PRICE
	FROM PRICES p JOIN STOCKS s 
	ON p.STOCK_ID = s.STOCK_ID
	WHERE s.STOCK_TICKER = :stock 
	AND p.DAILY_DATE BETWEEN 
	TO_DATE(:dateOne, 'MM/DD/YYYY') AND
	TO_DATE(:dateTwo, 'MM/DD/YYYY')
	ORDER BY p.PRICE DESC)
	WHERE rownum = 1
	`,
	[current_stock, dateOne, dateTwo]
	);
	
	res.json(result.rows);
});

/**
Returns the min price of each stock in a certain range of dates.
*/
router.get('/min_price/:stock?', async function(req, res) {
	var current_stock = req.params.stock;
	var dateOne = req.query['first_date'];
	var dateTwo = req.query['second_date'];

	var connection = await oracledb.getConnection(dbconfig);
	const result = await connection.execute(
  	`SELECT STOCK_NAME, PRICE AS MIN_PRICE FROM 
  	(SELECT s.STOCK_NAME, p.PRICE
	FROM PRICES p JOIN STOCKS s 
	ON p.STOCK_ID = s.STOCK_ID
	WHERE s.STOCK_TICKER = :stock 
	AND p.DAILY_DATE BETWEEN 
	TO_DATE(:dateOne, 'MM/DD/YYYY') AND
	TO_DATE(:dateTwo, 'MM/DD/YYYY')
	ORDER BY p.PRICE ASC)
	WHERE rownum = 1
	`,
	[current_stock, dateOne, dateTwo]
	);
	
	res.json(result.rows);
});



module.exports = router
