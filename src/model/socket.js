module.exports = {
	init : function (io) {
		var fs = require('fs');

		var mongodb = require("./mongodbConnector.js");
		mongodb.init();

		var webContentDir = "./"+GLOBAL.propertys.cssName+"/";
		var top = module.exports.urlChanger(fs.readFileSync(webContentDir+"page/top.html", "utf-8"));
	    top += module.exports.urlChanger(fs.readFileSync("./public/header.html", "utf-8"));
	    var wrapper = module.exports.urlChanger(fs.readFileSync(webContentDir+"page/wrapper.html", "utf-8"));
	    var admin = '<script type="text/javascript" src="//{{url}}/public/js/admin.js"></script>';

		io.on('connection', function (socket) {
			socket.on('hash', function(path) {

				var url = webContentDir+"index.html";
				var pageId = "";
				if (path.indexOf(".") > 0) {
					url = "./public/content.html";

					pageId = path;
					var lastIndex = path.lastIndexOf(".");
					var pageName = path.substring(0, lastIndex);
				}

				var userData = {pageId : pageId};

				fs.readFile(url, "utf-8", function (err, content) {
					mongodb.getPageData({pageId : pageName}, function (data) {
						socket.emit('wrapper', {
							"pageId" : pageId,
							"wrapper" : module.exports.urlChanger(content, userData),
							"pageData" : data
						});
					});
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

			socket.emit('clean');
			socket.emit('body', top+wrapper);
			fs.readFile(webContentDir+"page/header.html", "UTF-8", function (err, content) {
				socket.emit('head append', module.exports.urlChanger(content));
				if (socket.handshake.session.userdata) {
					var userdata = socket.handshake.session.userdata;
					socket.emit('head append', module.exports.urlChanger(admin));
				}
				socket.emit('head ready');
			});

			socket.on('login', function(pass) {
				if (pass == "sudo su") {
					socket.emit('head append', module.exports.urlChanger(admin));
					socket.isAdmin = true;
					socket.handshake.session.userdata = {};
					socket.handshake.session.userdata.userId = "JudaSowelu";
				}
			});
		});
	},
    urlChanger : function (content, userData) {
    	content = content.replace(/\{\{([a-zA-Z0-1_-]*)\}\}/g, function (text, key) {
    		if (typeof userData !== "undefined" && userData.hasOwnProperty(key)) {
    			return userData[key];
    		}
    		if (GLOBAL.urlDatas.hasOwnProperty(key)) {
    			return GLOBAL.urlDatas[key];
    		}
    		return "";
    	});
    	return content;
    }

};
