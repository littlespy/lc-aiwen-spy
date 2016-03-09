var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var meta = require('../package.json');

process.on('uncaughtException', function(err) {
	(app.get('logger') || console).error('Uncaught exception:\n', err.stack);
});

app.set('name', meta.name);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.set('version', meta.version);
app.set('port', process.env.PORT || 5000);
app.use(express.static(__dirname + '/public'));
app.set('logger', console);
app.enable('trust proxy');

app.get('/', function(req, res) {
	res.send('hello world');
});

if (require.main === module) {
	app.listen(app.get('port'), function() {
		console.log('[%s] Express server listening on port %d',
			app.get('env').toUpperCase(), app.get('port'));
	});
}