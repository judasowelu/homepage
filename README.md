

# homepage

minimal homepage 

node.js, mongodb


## Usage

conf/urlDatas.js

	module.exports = {
			url : "insertUserNodeServerAddress"
	}
 -&gt; write node server url

conf/propertys.js

	module.exports = {
			cssName : "readonly",
			mongodbUrl : "insertUserMongodbAddress"
			[, mongodbPort : "insertUserMongodbPort"]
	}

 -&gt; write mongodb address

src/index.html

	<!doctype html><script src="//insertUserNodeServerAddress/i"></script>

 -&gt; write node server url and upload to index page
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

	<!doctype html><script src="//{{url}}/i"></script>

 -&gt; do not need to modify

run node
&gt; node main.js

go to browser and write address
&gt; localhost:3080



### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
