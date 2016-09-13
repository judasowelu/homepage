var window = window;
var socket = socket;

function savePage (data) {
	socket.emit('save page', data);
}

function addSubPage (subPageId) {
	socket.emit('add sub page', {pageId : $("#pageId").val(), subPageId : subPageId});
}

function removeSubPage (subPageId) {
	socket.emit('remove sub page', {pageId : $("#pageId").val(), subPageId : subPageId});
}

function setHash (hash) {
	setTimeout(function () {
		location.href=hash;
	}, 1);
}

function requestStorage () {
	socket.emit("hash", window.location.hash.substr(1));
}

function hasPage (url) {
	if (url.indexOf(".page") > 0) {
		return true;
	}
	return false;
}

var hash = window.location.hash.substr(1);
window.onhashchange = function() {
	var _hash = window.location.hash.substr(1);
	if (hasPage(hash) && !hasPage(_hash) || hasPage(_hash)
			) {
		requestStorage();
	}
	hash = window.location.hash.substr(1);
};
