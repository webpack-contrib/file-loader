/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var path = require("path");
var loaderUtils = require("loader-utils");

module.exports = function(content) {
	this.cacheable && this.cacheable();
	if(!this.emitFile) throw new Error("emitFile is required from module system");

	var query = loaderUtils.getOptions(this) || {};
	var configKey = query.config || "fileLoader";
	var options = this.options[configKey] || {};
	var config = {
		publicPath: false,
		cssOutputPath: "",
		useRelativePath: false,
		name: "[hash].[ext]"
	};

	// options takes precedence over config
	Object.keys(options).forEach(function(attr) {
		config[attr] = options[attr];
	});

	// query takes precedence over config and options
	Object.keys(query).forEach(function(attr) {
		config[attr] = query[attr];
	});

	var context = config.context || this.options.context;
	var url = loaderUtils.interpolateName(this, config.name, {
		context: context,
		content: content,
		regExp: config.regExp
	});

	var outputPath = "";
	if (config.outputPath) {
		// support functions as outputPath to generate them dynamically
		outputPath = (
			typeof config.outputPath === "function"
			? config.outputPath(url)
			: config.outputPath + url
		);
	}

	if (config.useRelativePath) {
		// Only the dirname is needed in this case.
		outputPath = outputPath.replace(url, "");

		// We have access only to entry point relationships. So we work with this relations.
		var issuerContext = (this._module && this._module.issuer && this._module.issuer.context) || context;
		var relativeUrl = issuerContext && path.relative(issuerContext, this.resourcePath);
		var relativePath = relativeUrl && path.dirname(relativeUrl);
		var outputDirname = relativePath.replace(/\.\.(\/|\\)/g, "").split(path.sep).join("/");

		// Output path
		// If the `outputDirname` is pointing to up in relation to the `outputPath`.
		// We forced him to the webpack output path config. Even though it is empty.
		if (outputDirname.indexOf(outputPath) !== 0) {
			outputDirname = outputPath;
		}
		outputPath = path.join(outputDirname, url).split(path.sep).join("/");

		// Public path
		// Entry files doesn't pass through the `file-loader`.
		// So we don't have access to the files context to compare with your assets context
		// then we need to create and the same way force the `relativePath` to bundled files
		// on the webpack output path config folder and manually the same with CSS file.
		var output = this.options.output || {};
		if (output.filename && path.extname(output.filename) === ".js") {
			relativePath = outputDirname;
		} else if (output.path && toString.call(config.cssOutputPath) === "[object String]") {
			var outputPackageDirname = output.path.replace(this.options.context + path.sep, "");
			var issuerOutput = path.join(context, outputPackageDirname, config.cssOutputPath);
			var assetOutput = path.join(context, outputPackageDirname, outputDirname);
			relativePath = path.relative(issuerOutput, assetOutput);
		}
		url = path.join(relativePath, url).split(path.sep).join("/");
	} else if (config.outputPath) {
		url = outputPath;
	} else {
		outputPath = url;
	}

	var publicPath = "__webpack_public_path__ + " + JSON.stringify(url);
	if (config.publicPath) {
		// support functions as publicPath to generate them dynamically
		publicPath = JSON.stringify(
			typeof config.publicPath === "function"
			? config.publicPath(url)
			: config.publicPath + url
		);
	}

	if (query.emitFile === undefined || query.emitFile) {
		this.emitFile(outputPath, content);
	}

	return "module.exports = " + publicPath + ";";
};

module.exports.raw = true;
