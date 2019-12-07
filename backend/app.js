var express = require('express');
var app = express();

app.listen(3001, function () {
  console.log('Example app listening on port 3000!');
});


 var index = require('./routes/index');
app.use(index);

process.on('SIGINT', function() {
server.close(function(err) {
if (err) winston.error(err);
process.exit(0);
});
});
// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// app.listen('8081', function() {
//   console.log('Server running on port 8081');
// });
