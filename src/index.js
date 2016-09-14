var homeurl = document.getElementsByTagName('script')[0].getAttribute("src").replace("/i", "");
function scriptTag(src, callback) {
	if (typeof callback == "undefined") {
		callback = {};
	}
    var s = document.createElement('script');
    s.type = 'text/' + (src.type || 'javascript');
    s.src = src.src || src;
    s.async = false;

    s.onreadystatechange = s.onload = function () {
        var state = s.readyState;
        if (!callback.done && (!state || /loaded|complete/.test(state))) {
            callback.done = true;
            if (typeof callback === "function") {
            	callback();
            }
        }
    };

    (document.head || document.body).appendChild(s);
}

scriptTag(homeurl+"/public/js/jquery/jquery-2.1.1.min.js", function () {
	scriptTag(homeurl+"/socket.io/socket.io.js", initSocket);
});

function hasPage (url) {
	if (url.indexOf(".page") > 0) {
		return true;
	}
	return false;
}

function setActiveMenu () {
	hash = window.location.hash.substr(1);
	if (hasPage(hash)) {
		$("[href='#top.page']").addClass("active");
	} else {
		$("[href='#one']").addClass("active");
	}
}

var socket;
function initSocket () {
	socket = io.connect(homeurl);
	socket.on('head append', function(m) {
		$("head").append(m);
		socket.emit("hash", window.location.hash.substr(1));
	});
	
	socket.on('script append', function(m) {
		loadjscssfile(homeurl + "/assets/js/" + m, "js")
	});
	
	socket.on('body', function(m) {
		$("body").append(m);
		$("#nav a").removeClass("active");
		
		setActiveMenu();		
	});
	
	socket.on('wrapper', function(m) {
		$("#main").remove();
		$("#wrapper").prepend(m);
	});

	socket.on('ready', function (data) {
		var path = window.location.hash.substr(1);
		if (path.indexOf(".page") > 0) {
			socket.emit('page data', {pageId : path.replace(".page", "")});
		} else {
			socket.emit('page data', data);
		}

	});

	socket.on('page data', function (data) {
		page.load(data);
	});

	socket.on('done add sub page', function (data) {
		requestStorage ();
	});

	socket.on('done remove sub page', function (data) {
		requestStorage ();
	});

	socket.on('done save page', function (data) {
		requestStorage ();
	});
}

function login () {
	var pass = prompt("root permission");
	socket.emit("login", pass);
}
