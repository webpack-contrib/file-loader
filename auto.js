/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(content) {
	var request = this && this.request || "";
	var loader = require("./index.loader.js");
	if(/\.html$/.test(request)) loader = require("./html");
	else if(/\.jpeg$/.test(request)) loader = require("./jpeg");
	else if(/\.jpg$/.test(request)) loader = require("./jpg");
	else if(/\.js$/.test(request)) loader = require("./js");
	else if(/\.png$/.test(request)) loader = require("./png");
	else if(/\.swf$/.test(request)) loader = require("./swf");
	else if(/\.txt$/.test(request)) loader = require("./txt");
	return loader.call(this, content);
}