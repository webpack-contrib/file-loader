/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(postfix, prefix) {
	postfix = postfix || "";
	prefix = prefix || "";
	return function(content) {
		this.cacheable && this.cacheable();
		if(!this.emitFile) throw new Error("emitFile is required from module system");
		if(this.buffers) content = this.buffers[0];
		hash = new (require("crypto").Hash)("md5");
		hash.update(content);
		var hash = hash.digest("hex");
		var url = prefix + hash + postfix;
		this.emitFile(url, content);
		return "module.exports = " + require("webpack/api/getPublicPrefix") + " + " + JSON.stringify(url);
	}
}