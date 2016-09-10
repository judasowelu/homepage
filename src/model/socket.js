module.exports = {
	init : function (io) {
		var fs = require('fs');
		var mongodb = require("./mongodbConnector.js");

		mongodb.init();

		var webContentDir = "./readonly/";
		var top = "";
		var wrapper = "";
	    fs.readFile(webContentDir+"page/top.html", "utf-8", function (err, content) {
	    	top = content;
	    });
	    fs.readFile(webContentDir+"page/wrapper.html", "utf-8", function (err, content) {
	    	wrapper = content;
	    });

		io.on('connection', function (socket) {
			socket.on('hash', function(msg) {
				socket.emit('body', top);
				socket.emit('body', wrapper);
				if (msg.indexOf(".page") > 0) {
					msg = "./public/edit.html";
				} else {
					msg = webContentDir+"index.html";
				}
			    fs.readFile(msg, "utf-8", function (err, content) {
					socket.emit('wrapper', content);
			    });

			});

			socket.on('need board', function() {
				socket.emit('ready', {pageId:"top"});
			});

			socket.on('need script', function() {
				fs.readdir(webContentDir + "assets/js", function (err, files) {
					if (!err) {
						for (key in files) {
							if (files[key].indexOf("z_") == 0) {
								socket.emit('script append', files[key]);
							}
						}
					}
				})
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

			fs.readFile(webContentDir+"page/header.html", "utf-8", function (err, content) {
				socket.emit('head append', content);
			});
		});
	}
};
