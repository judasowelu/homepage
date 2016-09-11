GLOBAL.property = require('../conf/property.js');
var fs = require('fs');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var socket = require("./model/socket.js");
socket.init(io);

var cons = require('consolidate');

// view engine setup
app.engine('html', cons.swig);

app.set('views', __dirname);
app.set('view engine', 'html');


app.use(function(req, res, next){
	var allowedOrigins = ['http://judasowelu.dothome.co.kr', 'http://localhost:3080', 'http://192.168.0.4:3080', 'http://192.168.0.2:3080'];
	var origin = req.headers.origin;
	if(allowedOrigins.indexOf(origin) > -1){
		res.setHeader('Access-Control-Allow-Origin', origin);
	}
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	if (req.method === 'OPTIONS') {
		return res.send(200);
	} else {
		return next();
	}
});

app.get('/', function(req, res) {
	res.render("index", GLOBAL.property);
});

app.use(function (req, res, next) {
	var fileUrl = req.url;

	if (fileUrl.indexOf(".html") > 0 ) {
		console.log(fileUrl);
		var renderUrl = "";
		if (fileUrl.indexOf("/public") === 0) {
			renderUrl = __dirname+'/'+fileUrl;
		} else if (fileUrl.indexOf(".html") > 0 ) {
			renderUrl = __dirname+'/readonly/'+fileUrl;
		}
		res.render(renderUrl, GLOBAL.property);
	} else {
		next();
	}
});

app.use(express.static('readonly'));
app.use('/public', express.static('public'));

server.listen(3080);
