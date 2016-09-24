module.exports = {
	init : function (io) {
		module.exports.fs = require('fs');

		var mongodb = require("./mongodbConnector.js");
		module.exports.mongodb = mongodb;
		mongodb.init();

		var webContentDir = "./"+GLOBAL.propertys.cssName+"/";
		module.exports.webContentDir = webContentDir;
		var top = module.exports.urlChanger(module.exports.fs.readFileSync(webContentDir+"page/top.html", "utf-8"));
	    top += module.exports.urlChanger(module.exports.fs.readFileSync("./public/header.html", "utf-8"));
	    var wrapper = module.exports.urlChanger(module.exports.fs.readFileSync(webContentDir+"page/wrapper.html", "utf-8"));
	    var admin = '<script type="text/javascript" src="//{{url}}/public/js/admin.js"></script>';

		io.on('connection', function (socket) {
			socket.on('hash', function(path) {

				var url = webContentDir+"index.html";
				var pageId = "mainPage";
				if (path == "mapPage") {
					pageId = "mapPage";
					mongodb.getAllTags({}, function (arr) {
						var linkData = [];
						for ( var iter in arr) {
							
							var subPages = arr[iter].subPages
							if (typeof subPages !== "undefined") {
								for ( var iterPage in subPages) {
									linkData.push({
										source: arr[iter]._id,
										target: subPages[iterPage]
									});
								}
							}
						}

						module.exports.loadPage(pageId, function (data) {
							socket.emit('wrapper', data);
						}, url, {
							linkData : JSON.stringify(linkData)
						});
					});
					url = "./public/map.html";
					return;
				} else if (path.indexOf(".") > 0) {
					url = "./public/content.html";
					pageId = path;
				}

				module.exports.loadPage(pageId, function (data) {
					socket.emit('wrapper', data);
				}, url);
			});

			socket.on('request reload', function (data) {
				var pageId = data.pageId;
				module.exports.loadPage(pageId, function (data) {
					socket.emit("reloadPage", data);
				});
			});

			socket.on('save page', function (data) {
				var pageId = data.pageId;
				mongodb.savePage(data, function (doc) {
					module.exports.loadPage(pageId, function (data) {
						socket.emit("reloadPage", data);
					});
				});
			});

			socket.on('add sub page', function (data) {
				var pageId = data.pageId;
				mongodb.addSubPage(data, function (doc) {
					module.exports.loadPage(pageId, function (data) {
						socket.emit("reloadPage", data);
					});
				});
			});

			socket.on('remove sub page', function (data) {
				var pageId = data.pageId;
				mongodb.removeSubPage(data, function (doc) {
					module.exports.loadPage(pageId, function (data) {
						socket.emit("reloadPage", data);
					});
				});
			});

			socket.emit('clean');
			socket.emit('body', top+wrapper);
			module.exports.fs.readFile(webContentDir+"page/header.html", "UTF-8", function (err, content) {
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
    loadPage : function (pageId, callback, url, userData) {
    	if (typeof url === "undefined") {
    		url = "./public/content.html"
    	}

    	if (typeof userData === "undefined") {
    		userData = {};
    	}
		userData.pageId = pageId;

		module.exports.fs.readFile(url, "utf-8", function (err, content) {
			module.exports.mongodb.getPageData({pageId : pageId}, function (data) {
				callback({
					"pageId" : pageId,
					"wrapper" : module.exports.urlChanger(content, userData),
					"pageData" : data
				});
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
