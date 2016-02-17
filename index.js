/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var loaderUtils = require("loader-utils");

module.exports = function(content) {
	this.cacheable && this.cacheable();
	if(!this.emitFile) throw new Error("emitFile is required from module system");

	var query = loaderUtils.parseQuery(this.query);
	var configKey = query.config || "fileLoader";

	var config = {
		publicPath: false,
		name: "[hash].[ext]",
		skipEmit: false
	};

	// query takes precedence over config
	Object.keys(query).forEach(function(attr) {
		config[attr] = query[attr];
	});

	var url = loaderUtils.interpolateName(this, config.name, {
		context: config.context || this.options.context,
		content: content,
		regExp: config.regExp
	});

	var publicPath = "__webpack_public_path__ + " + JSON.stringify(url);

	if (config.publicPath) {
		// support functions as publicPath to generate them dynamically
		publicPath = JSON.stringify(
				typeof config.publicPath === "function" 
				 ? config.publicPath(url) 
				 : config.publicPath + url
		);
	}

	if(!config.skipEmit){
		this.emitFile(url, content);
	}

	return "module.exports = " + publicPath + ";";
}
module.exports.raw = true;
