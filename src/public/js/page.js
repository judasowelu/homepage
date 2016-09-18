var page = {
	load : function($target, data) {
		if (typeof data === "undefined") {
			data = target;
			$target = $("body");
		}
		$target.find("#pageId").val(data.pageId);
		if (data.pageData == null) {
			$target.find("#headLine").html("없는 페이지");
			$target.find("#content").html("없는 페이지");
		} else {
			$target.find("#headLine").html(decodeURI(data.pageData.headLine));
			$target.find("#content").html(decodeURI(data.pageData.content));

			var $subPages = $target.find("#subPages");
			for ( var i in data.pageData.subPages) {
				$subPages.append(page.getLinkSubPage(data.pageData.subPages[i]));
			}
		}
	},

	getLinkSubPage : function(subPageId) {
		return "<li><a class=\"button alt small\" href='#" + subPageId + ".page'>#" + subPageId + "</a>" +
				"<a class='editmode' href='javascript:' onclick='page.removeSubPage(\"" + subPageId + "\")'></a></li>"
				;
	}

}
;
