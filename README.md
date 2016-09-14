

# homepage

minimal homepage 

node.js, mongodb


## Usage

conf/urlDatas.js
	module.exports = {
			url : "insertUserNodeServerAddress"
	}
	 -&lt; write node server url

conf/propertys.js
	module.exports = {
			cssName : "readonly",
			mongodbUrl : "insertUserMongodbAddress"
			[, mongodbPort : "insertUserMongodbPort"]
	}
	 -&lt; write mongodb address

src/index.html
	&gt;!doctype html&lt;&gt;script src="//insertUserNodeServerAddress/i"&lt;&gt;/script&lt;

	 -&lt; write node server url and upload to index page
	 	if you use public server then don`t modify

## Developing

ex) localhost

conf/urlDatas.js
	module.exports = {
			url : "localhost:3080"
	}

conf/propertys.js
	module.exports = {
			cssName : "readonly",
			mongodbUrl : "localhost"
	}

src/index.html
	&gt;!doctype html&lt;&gt;script src="//{{url}}/i"&lt;&gt;/script&lt;

	-&lt; do not need to modify

run node
&lt; node main.js

go to browser and write address
&lt; localhost:3080



### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
