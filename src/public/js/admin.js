var page = page;
var $ = $;

page.goEdit = function(pageId) {
	$("#main[pageId='"+pageId+"'] #headLine").attr("contenteditable", "true");
	$("#main[pageId='"+pageId+"'] #content").attr("contenteditable", "true");
	$("#main[pageId='"+pageId+"'] .toolArea").addClass("edit");
	$("#main[pageId='"+pageId+"'] #subPages").addClass("edit");
	$("#wrapper #naviCase #editNavi").show();
	$("#wrapper #container [pageId=edit]").show();
};

page.goView = function(pageId) {
	if (confirm("변경사항이 저장되지 않습니다.")) {
		requestReload(pageId);
	}
};

page.contentToggle = function(pageId) {
	var c = $("#main[pageId='"+pageId+"'] #content");
	if (c[0].tagName === "DIV") {
		c.replaceWith('<textarea id="content">' + c.html() + '</textarea>');
	} else {
		c.replaceWith('<div id="content" contenteditable=true>' + c.val() + '</div>');
	}
}

page.addSubPage = function(pageId) {
	var subPageId = prompt("페이지 아이디를 입력");
	if (subPageId == null) {
		alert("페이지 아이디가 필요함");
	} else {
		addSubPage(pageId, subPageId);
	}

};

page.removeSubPage = function(pageId, subPageId) {
	removeSubPage(pageId, subPageId);
};

page.save = function(pageId) {
	var c = $("#main[pageId='"+pageId+"'] #content");
	if (c[0].tagName !== "DIV") {
		c.replaceWith('<div id="content" contenteditable=true>' + c.val() + '</div>');
	}
	savePage(pageId);
};

page.imageResize = function($image, callback) {
	var img = $image[0];
	var canvas = document.createElement('canvas');

	var MAX_WIDTH = 600;
	var MAX_HEIGHT = 600;
	var width = img.width;
	var height = img.height;

	if (width > height) {
		if (width > MAX_WIDTH) {
			height *= MAX_WIDTH / width;
			width = MAX_WIDTH;
		}
	} else {
		if (height > MAX_HEIGHT) {
			width *= MAX_HEIGHT / height;
			height = MAX_HEIGHT;
		}
	}
	canvas.width = width;
	canvas.height = height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height);


	var imgData = canvas.toDataURL("image/png");
	$.ajax({
		url : homeurl + "/imageUpload",
		type : "POST",
		data : {
			imgData : imgData
		},
		success : function (fileurl) {
			img.setAttribute("src", fileurl);
			callback($image);
		}
	});


};

page.imageUpload = function(pageId, input) {
	if (input.files && input.files[0]) {
		var FR = new FileReader();
		FR.onload = function(e) {
			var $image = $("<img>");
			$image.attr("src", e.target.result);

			page.imageResize($image, function ($image) {
				var $span = $("<span class='image fit'>");
				$span.append($image);
				$("#main[pageId='"+pageId+"'] #content").append($span);
			});
		};
		FR.readAsDataURL(input.files[0]);
	}

};

$("body").addClass("admin");