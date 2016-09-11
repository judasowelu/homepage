GLOBAL.urlDatas = require('../conf/urlDatas.js');
GLOBAL.propertys = require('../conf/propertys.js');
var fs = require('fs');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var socket = require("./model/socket.js");
socket.init(io);

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
	fs.readFile(__dirname+"/index.html", "utf-8", function (err, content) {
		res.send(socket.urlChanger(content));
	});
});

app.use(express.static(GLOBAL.propertys.cssName));
app.use('/public', express.static('public'));

server.listen(3080);
