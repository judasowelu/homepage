module.exports = {
	init : function (io) {
		var fs = require('fs');

		var mongodb = require("./mongodbConnector.js");
		mongodb.init();

		var webContentDir = "./"+GLOBAL.propertys.cssName+"/";
		var top = module.exports.urlChanger(fs.readFileSync(webContentDir+"page/top.html", "utf-8"));
	    top += module.exports.urlChanger(fs.readFileSync("./public/header.html", "utf-8"));
	    var wrapper = module.exports.urlChanger(fs.readFileSync(webContentDir+"page/wrapper.html", "utf-8"));

		io.on('connection', function (socket) {
			socket.on('hash', function(msg) {
				if (msg.indexOf(".page") > 0) {
					msg = "./public/content.html";
				} else {
					msg = webContentDir+"index.html";
				}
			    fs.readFile(msg, "utf-8", function (err, content) {
					socket.emit('wrapper', module.exports.urlChanger(content));
			    });
			});

			socket.on('need board', function() {
				socket.emit('ready', {pageId:"top"});
			});

			socket.on('page data', function (data) {
				mongodb.getPageData(data, function (data) {
					socket.emit("page data", data);
				});
			});

			socket.on('save page', function (data) {
				mongodb.savePage(data, function (doc) {
					socket.emit("done save page", {pageId : data.pageId});
				});
			});

			socket.on('add sub page', function (data) {
				mongodb.addSubPage(data, function (doc) {
					socket.emit("done add sub page", {pageId : data.pageId});
				});
			});

			socket.on('remove sub page', function (data) {
				mongodb.removeSubPage(data, function (doc) {
					socket.emit("done remove sub page", {pageId : data.pageId});
				});
			});

			socket.emit('body', top);
			socket.emit('body', wrapper);
			fs.readFile(webContentDir+"page/header.html", "UTF-8", function (err, content) {
				socket.emit('head append', module.exports.urlChanger(content));
			});

			socket.on('login', function(pass) {
				if (pass == "sudo su") {
					var admin = '<script type="text/javascript" src="//{{url}}/public/js/admin.js"></script>';
					socket.emit('head append', module.exports.urlChanger(admin));
				}
			});
		});
	},
    urlChanger : function (content) {
    	content = content.replace(/\{\{([a-zA-Z0-1_-]*)\}\}/g, function (text, key) {
    		if (GLOBAL.urlDatas.hasOwnProperty(key)) {
    			return GLOBAL.urlDatas[key];
    		}
    		return "";
    	});
    	return content;
    }

};
