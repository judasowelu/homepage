var homeurl = document.getElementsByTagName('script')[0].getAttribute("src").replace("/public/js/i.js", "");
function scriptTag(src, callback) {
    var s = document.createElement('script');
    s.type = 'text/' + (src.type || 'javascript');
    s.src = src.src || src;
    s.async = false;

    s.onreadystatechange = s.onload = function () {
        var state = s.readyState;
        if (!callback.done && (!state || /loaded|complete/.test(state))) {
            callback.done = true;
            callback();
        }
    };

    (document.head || document.body).appendChild(s);
}

scriptTag(homeurl+"/public/js/jquery/jquery-2.1.1.min.js", function () {
	scriptTag(homeurl+"/socket.io/socket.io.js", initSocket);
});

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
		$("#nav [href='#"+window.location.hash.substr(1)+"']").addClass("active");
	});
	
	socket.on('wrapper', function(m) {
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
		location.reload();
	});
	
	socket.on('done save page', function (data) {
		location.reload();
	});
}