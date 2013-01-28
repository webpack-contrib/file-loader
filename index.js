/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var loaderUtils = require("loader-utils");
module.exports = function(content) {
	this.cacheable && this.cacheable();
	if(!this.emitFile) throw new Error("emitFile is required from module system");
	var query = loaderUtils.parseQuery(this.query);
	var url;
	if(query.name) {
		url = query.name;
	} else {
		var prefix = query.prefix || "";
		var postfix = query.postfix;
		if(typeof postfix != "string") {
			if(this.resource && typeof postfix != "boolean") {
				var idx = this.resource.lastIndexOf(".");
				if(idx > 0) postfix = this.resource.substr(idx);
				else postfix = "";
			} else postfix = "";
		}
		var digest = query.hash || "md5";
		var digestSize = query.size || 9999;
		hash = new (require("crypto").Hash)(digest);
		hash.update(content);
		var hash = hash.digest("hex").substr(0, digestSize);
		url = prefix + hash + postfix;
	}
	this.emitFile(url, content);
	return "module.exports = __webpack_public_path__ + " + JSON.stringify(url);
}
module.exports.raw = true;