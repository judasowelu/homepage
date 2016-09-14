var page = new function() {
	this.load = function(data) {
		$("#pageId").val(data.pageId);
		if (data.pageData == null) {
			$("#headLine").html("없는 페이지");
			$("#content").html("없는 페이지");
		} else {
			$("#headLine").html(decodeURI(data.pageData.headLine));
			$("#content").html(decodeURI(data.pageData.content));

			var $subPages = $("#subPages");
			for ( var i in data.pageData.subPages) {
				$subPages
						.append(page.getLinkSubPage(data.pageData.subPages[i]))
			}
		}
	};

	this.getLinkSubPage = function(subPageId) {
		return "<li><a class=\"button alt small\" href='#" + subPageId + ".page'>#" + subPageId + "</a>" +
				"<a class='editmode' href='javascript:' onclick='page.removeSubPage(\"" + subPageId + "\")'></a></li>"
	}

}
