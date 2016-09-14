var page = page;
var $ = $;

page.goEdit = function() {
	$("#headLine").attr("contenteditable", "true");
	$("#content").attr("contenteditable", "true");
	$(".toolArea").addClass("edit");
	$("#subPages").addClass("edit");
	$("#five").show();
};

page.goView = function() {
	if (confirm("변경사항이 저장되지 않습니다.")) {
		requestStorage();
	}
};

page.contentToggle = function() {
	var c = $("#content");
	if (c[0].tagName === "DIV") {
		c.replaceWith('<textarea id="content">' + c.html() + '</textarea>');
	} else {
		c.replaceWith('<div id="content" contenteditable=true>' + c.val() + '</div>');
	}
}

page.addSubPage = function() {
	var subPageId = prompt("페이지 아이디를 입력");
	if (subPageId == null) {
		alert("페이지 아이디가 필요함");
	} else {
		addSubPage(subPageId);
	}

};

page.removeSubPage = function(subPageId) {
	removeSubPage(subPageId);
};

page.save = function() {
	var c = $("#content");
	if (c[0].tagName !== "DIV") {
		c.replaceWith('<div id="content" contenteditable=true>' + c.val() + '</div>');
	}
	savePage({
		pageId : $("#pageId").val(),
		headLine : encodeURI($("#headLine").html()),
		content : encodeURI($("#content").html())
	});
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

page.imageUpload = function(input) {
	if (input.files && input.files[0]) {
		var FR = new FileReader();
		FR.onload = function(e) {
			var $image = $("<img>");
			$image.attr("src", e.target.result);

			page.imageResize($image, function ($image) {
				var $span = $("<span class='image fit'>");
				$span.append($image)
				$('#content ').append($span);
			});
		};
		FR.readAsDataURL(input.files[0]);
	}

};

$("body").addClass("admin")