var homeurl = "//judasowelu.iptime.org:3080";

function loadjscssfile(filename, filetype) {
	if (filetype == "js") { // if filename is a external JavaScript file
		var fileref = document.createElement('script')
		fileref.setAttribute("type", "text/javascript")
		fileref.setAttribute("src", filename)
	} else if (filetype == "css") { // if filename is an external CSS file
		var fileref = document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
	}
	if (typeof fileref != "undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref)
	}
}
loadjscssfile("//judasowelu.iptime.org:3080/assets/js/jquery.min.js", "js");
var socket = io.connect(homeurl);
socket.on('head append', function(m) {
	$("head").append(m);
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

function savePage (data) {
	socket.emit('save page', data);
};

function addSubPage (subPageId) {
	socket.emit('add sub page', {pageId : $("#pageId").val(), subPageId : subPageId});
};

function loadMain (hash) {
	if (window.location.hash.substr(1).indexOf(".page") > 0) {
		location.href="/"+hash;
		location.reload();
	}
}

function loadBoard (hash) {
	if (window.location.hash.substr(1) != hash) {
		location.href=hash
		$("body").html("");
		socket.emit("hash", window.location.hash.substr(1));
	}
}

socket.emit("hash", window.location.hash.substr(1));
