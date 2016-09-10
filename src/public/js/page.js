var page = new function () {
	this.load = function (data) {
		$("#pageId").val(data.pageId);
		if (data.pageData == null) {
			$(".headLine").html("없는 페이지");
			$(".content").html("없는 페이지");
		} else {
			$(".headLine").html(decodeURI(data.pageData.headLine));
			$(".content").html(decodeURI(data.pageData.content));


			var $subPages = $("#subPages");
			for (var i in data.pageData.subPages) {
				$subPages.append(page.getLinkSubPage(data.pageData.subPages[i]))
			}
		}
	};

	this.getLinkSubPage = function (subPageId) {
		var str = "<p><a href='/#"+subPageId+".page' onclick='loadBoard(\"#"+subPageId+".page\")'>"+subPageId+"</a></p>"
		return str;
	}

	this.goEdit = function () {
		$("#edit").removeClass("view");
		$("#edit").addClass("edit");
	};

	this.goView = function () {
		$("#editContent .headLine").html($("#viewContent .headLine").html())
		$("#editContent .content").html($("#viewContent .content").html())

		$("#edit").removeClass("edit");
		$("#edit").addClass("view");
	};

	this.addSubPage = function () {
		var subPageId = $("#insertSubPage").val();
		if (subPageId == "") {
			alert("제목이 필요함");
		} else {
			console.log("addSubPage")
			addSubPage(subPageId);
		}
	};

	this.save = function () {
		savePage({
			pageId : $("#pageId").val(),
			headLine : encodeURI($("#editContent .headLine").html()),
			content : encodeURI($("#editContent .content").html())
		})
	};

	this.imageUpload = function (input) {
		if ( input.files && input.files[0] ) {
			var FR= new FileReader();
			FR.onload = function(e) {
				var img = $("<img>");
				img.attr( "src", e.target.result );
				$('#editContent .editToolBox #filePicker').after(img)
			};
			FR.readAsDataURL( input.files[0] );
		}

	};
}
