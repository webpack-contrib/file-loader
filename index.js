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
	var config = this.options[configKey] || {};
	var url = loaderUtils.interpolateName(this, query.name || "[hash].[ext]", {
		context: query.context || this.options.context,
		content: content,
		regExp: query.regExp
	});
	var publicPath = config.publicPath;
	if (publicPath) {
		publicPath = (typeof publicPath === "function") ? publicPath(url) : publicPath + url;
		publicPath = JSON.stringify(publicPath);
	}
	else {
		publicPath = "__webpack_public_path__ + " + JSON.stringify(url);
	}
	this.emitFile(url, content);
	return "module.exports = " + publicPath + ";";
}
module.exports.raw = true;
