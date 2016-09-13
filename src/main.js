GLOBAL.urlDatas = require('../conf/urlDatas.js');
GLOBAL.propertys = require('../conf/propertys.js');
var fs = require('fs');
var md5 = require('md5');
var mkdirp = require('mkdirp');
var getDirName = require('path').dirname;

var bodyParser = require("body-parser");
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var socket = require("./model/socket.js");
socket.init(io);

app.use(bodyParser({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
	var allowedOrigins = [ 'http://judasowelu.dothome.co.kr', 'http://localhost:3080', 'http://192.168.0.4:3080', 'http://192.168.0.2:3080' ];
	var origin = req.headers.origin;
	if (allowedOrigins.indexOf(origin) > -1) {
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
	fs.readFile(__dirname + "/index.html", "utf-8", function(err, content) {
		res.send(socket.urlChanger(content));
	});
});
app.get('/i', function(req, res) {
	fs.readFile(__dirname + "/index.js", "utf-8", function(err, content) {
		res.send(socket.urlChanger(content));
	});
});

function writeFile(path, contents, option, cb) {
	mkdirp(getDirName(path), function(err) {
		if (err) {
			return cb(err);
		}

		fs.writeFile(path, contents, option, cb);
	});
}
app.post('/imageUpload', function(req, res) {
	var base64Data = req.body.imgData.replace(/^data:image\/png;base64,/, "");

	var filename = md5(base64Data) + ".png";
	var returnFilePath = "/upload/" + filename.substring(0, 2) + "/" + filename.substring(2, 4) + "/" + filename;

	writeFile(__dirname + returnFilePath, base64Data, 'base64', function(err) {
		if (err) {
			console.log(err);
		}
		res.send(returnFilePath);
	});
});

app.use(express.static(GLOBAL.propertys.cssName));
app.use('/public', express.static('public'));
app.use('/upload', express.static('upload'));

server.listen(3080);
