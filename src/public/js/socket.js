function savePage (data) {
	socket.emit('save page', data);
};

function addSubPage (subPageId) {
	socket.emit('add sub page', {pageId : $("#pageId").val(), subPageId : subPageId});
};

function loadMain (hash) {
	if (window.location.hash.substr(1).indexOf(".page") > 0) {
		location.href=hash
		$("#main").remove();
		socket.emit("hash", "");
	}
}

function requestStorage () {
	$("#main").remove();
	socket.emit("hash", window.location.hash.substr(1));
}

function loadStorage (hash) {
	if (window.location.hash.substr(1) != hash) {
		location.href=hash;
		requestStorage ();
	}
}
