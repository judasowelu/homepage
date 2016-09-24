var window = window;
var socket = socket;

function savePage (pageId) {
	socket.emit('save page', {
		pageId : pageId,
		headLine : encodeURI($("[pageId='"+pageId+"'] #headLine").html()),
		content : encodeURI($("[pageId='"+pageId+"'] #content").html())
	});
}

function requestReload (pageId) {
	socket.emit('request reload', {pageId : pageId});
}

function addSubPage (pageId, subPageId) {
	socket.emit('add sub page', {pageId : pageId, subPageId : subPageId});
}

function removeSubPage (pageId, subPageId) {
	socket.emit('remove sub page', {pageId : pageId, subPageId : subPageId});
}

function requestStorage () {
	var pageId = exceptPageId(window.location.hash.substr(1));

	var $target = $('#main[pageId="'+pageId+'"]');
	if ($target.length > 0) {
		naviMoveTo (pageId);
	} else {
		socket.emit("hash", pageId);
	}

}

var hash = window.location.hash.substr(1);
window.onhashchange = function() {
	var _hash = window.location.hash.substr(1);

	requestStorage();

	if ($("#nav li a.active").length == 0) {
		setActiveMenu();
	}
};
