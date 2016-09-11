var page = new function () {
	this.load = function (data) {
		$("#pageId").val(data.pageId);
		if (data.pageData == null) {
			$("#headLine").html("없는 페이지");
			$("#content").html("없는 페이지");
		} else {
			$("#headLine").html(decodeURI(data.pageData.headLine));
			$("#content").html(decodeURI(data.pageData.content));

			var $subPages = $("#subPages");
			for (var i in data.pageData.subPages) {
				$subPages.append(page.getLinkSubPage(data.pageData.subPages[i]))
			}
		}
	};

	this.getLinkSubPage = function (subPageId) {
		return "<li><a href='#"+subPageId+".page' onclick='loadStorage(\"#"+subPageId+".page\")'>"+subPageId+"</a></li>"
	}

	this.goEdit = function () {
		$("#headLine").attr("contenteditable", "true");
		$("#content").attr("contenteditable", "true");
		$(".toolArea").addClass("edit")
		$("#five").show();
	};

	this.goView = function () {
		if (confirm("변경사항이 저장되지 않습니다.")) {
			requestStorage ();
		}
	};
	
	this.contentToggle = function () {
		var c = $("#content");
		if (c[0].tagName === "DIV") {
			c.replaceWith('<textarea id="content">' + c.html() +'</textarea>')
		} else {
			c.replaceWith('<div id="content" contenteditable=true>' + c.html() +'</div>')
		}
	}

	this.addSubPage = function () {
		var subPageId = prompt("Please enter your name");
		if (subPageId == null) {
	    	alert("제목이 필요함");
		} else {
			addSubPage(subPageId);
		}

	};

	this.save = function () {
		savePage({
			pageId : $("#pageId").val(),
			headLine : encodeURI($("#headLine").html()),
			content : encodeURI($("#content").html())
		})
	};

	this.imageUpload = function (input) {
		if ( input.files && input.files[0] ) {
			var FR= new FileReader();
			FR.onload = function(e) {
				var $image = $("<img>");
				$image.attr("src", e.target.result);
				var img = $image[0];
				
				var canvas = document.createElement('canvas');
				
				var MAX_WIDTH = 960;
				var MAX_HEIGHT = 960;
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

//				$image.attr("src", canvas.toDataURL("image/png"));
				var $span = $("<span class='image fit'>");
				$span.append($image)

				$('#content ').append($span)
			};
			FR.readAsDataURL( input.files[0] );
		}

	};
}
