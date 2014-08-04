/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var loaderUtils = require("loader-utils");
var path = require("path");

module.exports = function(content) {
	this.cacheable && this.cacheable();
	if(!this.emitFile) throw new Error("emitFile is required from module system");
	var query = loaderUtils.parseQuery(this.query);
	var filename = query.name || "[hash].[ext]";
	var context = query.context || this.options.context;
	var ext = "bin";
	var basename = "file";
	var directory = "";
	if(this.resourcePath) {
		var resourcePath = this.resourcePath;
		var idx = resourcePath.lastIndexOf(".");
		var i = resourcePath.lastIndexOf("\\");
		var j = resourcePath.lastIndexOf("/");
		var p = i < 0 ? j : j < 0 ? i : i < j ? i : j;
		if(idx >= 0) {
			ext = resourcePath.substr(idx+1);
			resourcePath = resourcePath.substr(0, idx);
		}
		if(p >= 0) {
			basename = resourcePath.substr(p+1);
			resourcePath = resourcePath.substr(0, p+1);
		}
		directory = path.relative(context, resourcePath + "_").replace(/\\/g, "/").replace(/\.\.(\/)?/g, "_$1");
		directory = directory.substr(0, directory.length-1);
		if(directory.length === 1) directory = "";
	}
	var url = filename.replace(/\[hash\]/ig, function() {
		var digest = query.hash || "md5";
		var digestSize = query.size || 9999;
		hash = new (require("crypto").Hash)(digest);
		hash.update(content);
		return hash.digest(query.digest || "hex").substr(0, digestSize);
	}).replace(/\[ext\]/ig, function() {
		return ext;
	}).replace(/\[name\]/ig, function() {
		return basename;
	}).replace(/\[path\]/ig, function() {
		return directory;
	});
	this.emitFile(url, content);
	return "module.exports = __webpack_public_path__ + " + JSON.stringify(url);
}
module.exports.raw = true;