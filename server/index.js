var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var AV = require('leanengine');
var meta = require('../package.json');
var init = require('../conf/init'); //工程初始化配置

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

app.get('/api/getbiolist', function(req, res) {
	var query = new AV.Query('biologylist'); //生物列表数据
	var response = {};
	query = query.addDescending('bio_id');
	query = query.limit(200);
	query.find({
		success: function(results) { //查询数据回调成功
			// results is an array of AV.Object.
			response.code = '200';
			response.data = {};
			response.data.results = results;
			console.log(results.length);
			response.msg = 'success';
			res.send(response);
		},

		error: function(error) { //查询数据回调失败
			response.code = '100';
			response.msg = 'query error';
			res.send(response);
		}
	});

});

if (require.main === module) {
	app.listen(app.get('port'), function() {
		console.log('[%s] Express server listening on port %d',
			app.get('env').toUpperCase(), app.get('port'));
	});
}