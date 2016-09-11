module.exports = {
	init : function (io) {
		var fs = require('fs');
		var mongodb = require("./mongodbConnector.js");

		mongodb.init();

		var webContentDir = "./"+GLOBAL.propertys.cssName+"/";
		var top = "";
		var wrapper = "";
	    fs.readFile(webContentDir+"page/top.html", "utf-8", function (err, content) {
	    	top = module.exports.urlChanger(content);
	    });
	    fs.readFile("./public/header.html", "utf-8", function (err, content) {
	    	top += module.exports.urlChanger(content);
	    });
	    fs.readFile(webContentDir+"page/wrapper.html", "utf-8", function (err, content) {
	    	wrapper = module.exports.urlChanger(content);
	    });

		io.on('connection', function (socket) {
			socket.on('hash', function(msg) {
				if (msg.indexOf(".page") > 0) {
					msg = "./public/edit.html";
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

			socket.emit('body', top);
			socket.emit('body', wrapper);
			fs.readFile(webContentDir+"page/header.html", "utf-8", function (err, content) {
				socket.emit('head append', module.exports.urlChanger(content));
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
