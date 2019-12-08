var express = require('express');
var cors = require('cors');
var app = express();

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
  	next();
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});


var index = require('./routes/index');
app.use(index);


process.on('SIGINT', function() {
server.close(function(err) {
if (err) winston.error(err);
process.exit(0);
});
});
