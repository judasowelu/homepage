module.exports = {
	init : function () {
		var MongoClient = require('mongodb').MongoClient
		var Server = require('mongodb').Server;
		
		var This = this;

		MongoClient.connect("mongodb://"+GLOBAL.propertys.mongodbUrl+":"+(GLOBAL.propertys.mongodbPort|27017)+"/genius", function(err, db) {
			if (err) {
				console.log("connect err " + err);
			} else {
				This.collection = db.collection('page');
			}
		});
	},
	getPageData: function (data, callback) {
		this.collection.findOne({_id : data.pageId}, function(err,doc){
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
		var _id = data.pageId;
		delete data.pageId;

		if (_id == "") {
			this.collection.insert(data, function(err, doc){
				if(err) throw err;

				console.log("savePage on id is empty dos : " + JSON.stringify(doc));
				callback(doc);
			});
		} else {
			this.collection.update({_id:_id}, {$set: data}, {upsert: true}, function(err, doc){
				if(err) throw err;
				callback(doc);
			});
		}
	},
	addSubPage : function (data, callback) {

		var _id = data.pageId;
		delete data.pageId;

		this.collection.update({_id:_id}, {$addToSet:{"subPages":data.subPageId}}, function(err, doc){
			if(err) throw err;
			callback(doc);
		});
	},
	removeSubPage : function (data, callback) {

		var _id = data.pageId;
		delete data.pageId;

		this.collection.update({_id:_id}, {$pull:{"subPages":data.subPageId}}, function(err, doc){
			if(err) throw err;
			callback(doc);
		});
	}
};

