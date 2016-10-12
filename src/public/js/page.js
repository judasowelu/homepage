var page = {
	load : function($target, data, pageId) {
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
				$subPages.append(page.getLinkSubPage(pageId, data.pageData.subPages[i]));
			}
		}
	},

	getLinkSubPage : function(pageId, subPageId) {
		return "<li><a class=\"button alt small\" href='#" + subPageId + ".page'>#" + subPageId + "</a>" +
				"<a class='editmode xbutton' href='javascript:' onclick='page.removeSubPage(\"" + pageId + "\", \"" + subPageId + "\")'></a></li>"
				;
	},
	
	closePage : function (pageId) {
		$("#main[pageId='"+pageId+"']").remove();
		$("#navi [pageId='"+pageId+"']").parent().remove();
		
		var pageid = $("#navi li:visible:first a").attr("pageid");
		if (typeof pageid == "undefined") {
			pageid = "mainPage";
		}
		location.href = "#"+pageid;
	}

}
;
