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
	if (url.indexOf(".") > 0) {
		return true;
	}
	return false;
}

function exceptPageId (hash) {
	switch (hash) {
	case "one" :
	case "two" :
	case "three" :
	case "four" :
	case "five" :
	case "six" :
	case "seven" :
	case "eight" :
	case "nine" :
		return "main";
	}
	return hash;
}

function setActiveMenu () {
	hash = window.location.hash.substr(1);
	if (hasPage(hash)) {
		$("[href^='#top']").addClass("active");
	} else {
		$("[href='#one']").addClass("active");
	}
}

var socket;
function initSocket () {
	socket = io.connect(homeurl);
	socket.on('head append', function(m) {
		$("head").append(m);
	});

	socket.on('script append', function(m) {
		loadjscssfile(homeurl + "/assets/js/" + m, "js");
	});

	socket.on('head ready', function() {
		socket.emit("hash", window.location.hash.substr(1));
	});

	socket.on('body', function(m) {
		$("body").append(m);
		$("#nav a").removeClass("active");

		setActiveMenu();
	});

	socket.on('wrapper', function(m) {
		if (typeof page === "undefined") {
			delayAppendWrapper(m);
		} else {
			appendWrapper(m);
		}
	});

	socket.on('reloadPage', function (m) {
		var $wrapper = $(m.wrapper);
		page.load($wrapper, m.pageData, m.pageId);
		$("#wrapper #container [pageId=\""+m.pageId+"\"]").html("").append($wrapper);
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

	socket.on('clean', function () {
		$("html").html("");
	});
}

function delayAppendWrapper (m) {
	if (typeof page === "undefined") {
		setTimeout(function () {
			delayAppendWrapper(m);
		}, 100);
	} else {
		appendWrapper(m);
	}
}

function appendWrapper (m) {
	var $wrapper = $(m.wrapper);
	page.load($wrapper, m.pageData, m.pageId);
	$("#wrapper #container #main[pageId='edit']").before($wrapper);
	$("#navi #editNavi").before("<li><a href=\"#"+m.pageId+"\" pageId=\""+m.pageId+"\" class=\"button alt fit small\" \">"+(m.pageId==""?"main":m.pageId)+"</a></li>")
	naviMoveTo (m.pageId)
}

function login () {
	var pass = prompt("root permission");
	socket.emit("login", pass);
}

function naviMoveTo (pageId) {
	var $target = $('#main[pageId="'+pageId+'"]');
	var $wrapper = $('#wrapper');
	var $container = $("#container");
	
	if (pageId !== "") {
		$("body").animate({
			scrollTop : 0
		}, 'fast');
	}
	
    $container.animate({
			scrollLeft: $target.offset().left - $wrapper.css("paddingLeft").replace(/[^-\d\.]/g, '') + $container.scrollLeft()
	}, 'fast');
}
