function getPageName (pageId) {
	var lastIndex = pageId.lastIndexOf(".");
	if (lastIndex > 0) {
		return pageId.substring(0, lastIndex);
	}
	return pageId;
}

module.exports = {
	init : function () {
		var MongoClient = require('mongodb').MongoClient
		var Server = require('mongodb').Server;

		var This = this;

		MongoClient.connect("mongodb://"+GLOBAL.propertys.mongodbUrl+":"+(GLOBAL.propertys.mongodbPort|27017)+"/genius", function(err, db) {
			if (err) {
				console.log("connect err " + err);
			} else {
				This.db = db;
			}
		});
	}

	/**
	 * page function
	 */
	,
	getPageData: function (data, callback) {
		var pageName = getPageName(data.pageId);

		this.db.collection('page').findOne({_id : pageName}, function(err,doc){
			if(err) throw err;
			if (doc != null) {
				delete doc._id;
			}

			callback({
				pageId : data.pageId,
				pageData : doc
			});
		});
	},
	savePage : function (data, callback) {
		var pageId = data.pageId;
		var pageName = getPageName(pageId);
		var _id = pageName;
		delete data.pageId;

		if (_id == "") {
			this.db.collection('page').insert(data, function(err, doc){
				if(err) throw err;

				console.log("savePage on id is empty dos : " + JSON.stringify(doc));
				callback(doc);
			});
		} else {
			this.db.collection('page').update({_id:_id}, {$set: data}, {upsert: true}, function(err, doc){
				if(err) throw err;
				callback(doc);
			});
		}
	},
	addSubPage : function (data, callback) {
		var pageId = data.pageId;
		var pageName = getPageName(pageId);
		var _id = pageName;
		delete data.pageId;

		this.db.collection('page').update({_id:_id}, {$addToSet:{"subPages":data.subPageId}}, function(err, doc){
			if(err) throw err;
			callback(doc);
		});
	},
	removeSubPage : function (data, callback) {
		var pageId = data.pageId;
		var pageName = getPageName(pageId);
		var _id = pageName;
		delete data.pageId;

		this.db.collection('page').update({_id:_id}, {$pull:{"subPages":data.subPageId}}, function(err, doc){
			if(err) throw err;
			callback(doc);
		});
	}

	/**
	 * user function
	 * */
	,
	getUser : function (data, callback) {

		data._id = data.userId.toLowerCase();
		this.db.collection('user').findOne({_id : data._id}, function(err,doc){
			if(err) throw err;
			if (doc != null) {
				delete doc._id;
			}

			callback({
				userId : data._id,
				userData : doc
			});
		});
	}
};

