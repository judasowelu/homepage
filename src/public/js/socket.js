var window = window;
var socket = socket;

function savePage (data) {
	socket.emit('save page', data);
}

function addSubPage (pageId, subPageId) {
	socket.emit('add sub page', {pageId : $("#main[pageId='"+pageId+"'] #pageId").val(), subPageId : subPageId});
}

function removeSubPage (pageId, subPageId) {
	socket.emit('remove sub page', {pageId : $("#main[pageId='"+pageId+"'] #pageId").val(), subPageId : subPageId});
}

function requestStorage () {
	var pageId = window.location.hash.substr(1);
	
	if (!hasPage(pageId)) {
		pageId = "";
	}
	
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
//	if ((hasPage(hash) && !hasPage(_hash))
//			|| hasPage(_hash)
//			) {
//	}
//	hash = window.location.hash.substr(1);

	if ($("#nav li a.active").length == 0) {
		setActiveMenu();
	}
};
