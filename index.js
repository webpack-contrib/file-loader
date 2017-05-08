/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const path = require("path");
const loaderUtils = require("loader-utils");

module.exports = function(content) {
	"use strict";

	this.cacheable && this.cacheable();
	if (!this.emitFile) throw new Error("emitFile is required from module system");

	const query = loaderUtils.getOptions(this) || {};
	const configKey = query.config || "fileLoader";
	const options = this.options[configKey] || {};
	const config = Object.assign({
		regExp: undefined,
		context: undefined,
		useRelativePath: false,
		publicPath: undefined,
		cssOutputPath: "",
		outputPath: "",
		name: "[hash].[ext]",
	}, options, query);

	const context = config.context || this.options.context || process.cwd();
	const issuer = (this._module && this._module.issuer) || {};
	let url = loaderUtils.interpolateName(this, config.name, {
		regExp: config.regExp,
		context,
		content,
	});

	if (config.outputPath) {
		// support functions as outputPath to generate them dynamically
		config.outputPath = parsePath(config.outputPath, url);
	}

	if (config.useRelativePath) {
		// Only the dirname is needed in this case.
		config.outputPath = config.outputPath.replace(url, "");

		// We have access only to entry point relationships. So we work with this relations.
		issuer.context = issuer.context || context;
		const relation = { path: issuer.context && path.relative(issuer.context, this.resourcePath) };
		relation.path = relation.path ? path.dirname(relation.path) : config.outputPath;

		// Output path
		// If the `output.dirname` is pointing to up in relation to the `config.outputPath`.
		// We forced him to the webpack output path config. Even though it is empty.
		const output = this.options.output || {};
		output.dirname = relation.path.replace(/^(\.\.(\/|\\))+/g, "").split(path.sep).join("/");
		if (output.dirname.indexOf(config.outputPath) !== 0) output.dirname = config.outputPath;
		config.outputPath = path.join(output.dirname, url).split(path.sep).join("/");

		// Public path
		// Entry files doesn't pass through the `file-loader`.
		// So we haven't access to the files context to compare with your assets context
		// then we need to create and the same way, force the `relation.path` to bundled files
		// on the webpack output path config folder and manually the same with CSS file.
		if (output.filename && path.extname(output.filename)) {
			relation.path = output.dirname;
		} else if (output.path && is('String', config.cssOutputPath)) {
			output.bundle = output.path.replace(this.options.context + path.sep, "");
			output.issuer = path.join(context, output.bundle, config.cssOutputPath);
			output.asset = path.join(context, output.bundle, output.dirname);
			relation.path = path.relative(output.issuer, output.asset);
		}
		url = path.join(relation.path, url).split(path.sep).join("/");
	} else if (config.outputPath) {
		url = config.outputPath;
	} else {
		config.outputPath = url;
	}

	if (is('String|Function', config.publicPath)) {
		// support functions as publicPath to generate them dynamically
		config.publicPath = JSON.stringify(parsePath(config.publicPath, url));
	} else {
		config.publicPath = `__webpack_public_path__ + ${JSON.stringify(url)}`;
	}

	if (query.emitFile === undefined || query.emitFile) {
		this.emitFile(config.outputPath, content);
	}

	return `module.exports = ${config.publicPath};`;
	
	function is(expected, value) {
		return new RegExp(`(${expected})`).test(toString.call(value));
	}

	function parsePath(property, slug) {
		if (!property) {
			return slug;
		} else if (typeof property === 'function') {
			return property(slug);
		}
		return property + slug;
	}
};

module.exports.raw = true;
