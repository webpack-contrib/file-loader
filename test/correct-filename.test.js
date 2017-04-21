var path = require("path");
var queryString = require("querystring");
var should = require("should");
var fileLoader = require("../");

function run(resourcePath, query, content) {
	content = content || new Buffer("1234");

	var file = null;
	var queryObject = queryString.parse(query);
	var webpackConfig = Object.assign({}, queryObject.webpackConfig);
	delete queryObject.webpackConfig;

	var context = {
		resourcePath: resourcePath,
		query: "?" + query,
		options: {
			context: "/this/is/the/context",
			output: webpackConfig.output,
		},
		_module: {
			issuer: {
				context: webpackConfig._moduleIssuerContext,
			},
		},
		emitFile: function(url, content2) {
			content2.should.be.eql(content);
			file = url;
		},
	};

	var result = fileLoader.call(context, content)

	return {
		file: file,
		result: result,
	};
}

function run_with_options(resourcePath, options, content) {
	content = content || new Buffer("1234");
	options = Object.assign({}, options);

	var file = null;
	var webpackConfig = Object.assign({}, options.webpackConfig);
	delete options.webpackConfig;

	var context = {
		resourcePath: resourcePath,
		options: {
			fileLoader: options,
			context: "/this/is/the/context",
			output: webpackConfig.output,
		},
		_module: {
			issuer: {
				context: webpackConfig._moduleIssuerContext,
			},
		},
		emitFile: function(url, content2) {
			content2.should.be.eql(content);
			file = url;
		},
	};

	var result = fileLoader.call(context, content)

	return {
		file: file,
		result: result,
	};
}

function test(excepted, resourcePath, query, content) {
	run(resourcePath, query, content).file.should.be.eql(excepted);
}

describe("correct-filename", function() {
	it("should process defaults correctly", function() {
		test("81dc9bdb52d04dc20036dbd8313ed055.txt", "/file.txt", "");
		test("81dc9bdb52d04dc20036dbd8313ed055.png", "/file.png", "");
		test("81dc9bdb52d04dc20036dbd8313ed055.txt", "file.txt", "");
		test("81dc9bdb52d04dc20036dbd8313ed055.bin", "", "");
	});
	it("should process name correctly", function() {
		test("file.txt", "/file.txt", "name=[name].[ext]");
		test("file.png", "/file.png", "name=[name].[ext]");
		test("file.txt", "file.txt", "name=[name].[ext]");
		test("file.bin", "", "name=[name].[ext]");
		test("file", "/file.txt", "name=[name]");
		test("81dc9bdb52d04dc20036dbd8313ed055", "/file.txt", "name=[hash]");
		test("81dc9bdb52d04dc20036dbd8313ed055/file.txt", "/file.txt", "name=[hash]/[name].[ext]");
		test("file.txt", "/this/is/the/context/file.txt", "name=[path][name].[ext]");
		test("dir/file.txt", "/this/is/the/context/dir/file.txt", "name=[path][name].[ext]");
		test("dir/sub/file.txt", "/this/is/the/context/dir/sub/file.txt", "name=[path][name].[ext]");
		test("_/_/dir/sub/file.txt", "/this/is/dir/sub/file.txt", "name=[path][name].[ext]");
		test("dir/sub/file.txt", "/this/is/dir/sub/file.txt", "name=[path][name].[ext]&context=/this/is");
	});
	it("should process hash correctly", function() {
		test("d93591bdf7860e1e4ee2fca799911215.txt", "/file.txt", "", new Buffer("4321"));
	});
	it("should process hash options correctly", function() {
		test("81dc9.txt", "/file.txt", "name=[hash:5].[ext]");
		test("d4045.txt", "/file.txt", "name=[sha512:hash:5].[ext]");
		test("1lQ3UNSdIS0c9dQ5brCZO1.txt", "/file.txt", "name=[hash:base64].[ext]");
		test("caYJDUvUOiGAdDsiHKffIEj.txt", "/file.txt", "name=[hash:base52].[ext]");
		test("sntmopgidsdqrofkjywoyldtiij.txt", "/file.txt", "name=[hash:base26].[ext]");
		test("sntmopgids.txt", "/file.txt", "name=[hash:base26:10].[ext]");
	});
});

describe("publicPath option", function() {
	it("should be supported", function() {
		run("/file.txt", "publicPath=http://cdn/").result.should.be.eql(
			'module.exports = "http://cdn/81dc9bdb52d04dc20036dbd8313ed055.txt";'
		);
	});

	it("should override public path when given empty string", function() {
		run("file.txt", "publicPath=").result.should.be.eql(
			'module.exports = "81dc9bdb52d04dc20036dbd8313ed055.txt";'
		);
	});

	it("should use webpack public path when not set", function() {
		run("file.txt").result.should.be.eql(
			'module.exports = __webpack_public_path__ + "81dc9bdb52d04dc20036dbd8313ed055.txt";'
		);
	});
});

describe("useRelativePath option", function() {
	it("should be supported", function() {
		run_with_options("/this/is/the/context/file.txt", {
			useRelativePath: true,
			cssOutputPath: "/this/is/the/context/style",
			webpackConfig: {
				_moduleIssuerContext: "/this/is/the/context",
				output: {
					path: "/this/is/the/context/dist",
					filename: "[name].js",
				},
			},
		}).result.should.be.eql(
			'module.exports = __webpack_public_path__ + \"81dc9bdb52d04dc20036dbd8313ed055.txt\";'
		);
		run_with_options("/this/is/file.txt", {
			useRelativePath: true,
			cssOutputPath: "/this/is/the/context",
			webpackConfig: {
				_moduleIssuerContext: "/this/is/the/context",
				output: {
					path: "/this/is/the/context/dist",
					filename: "[name].js",
				},
			},
		}).result.should.be.eql(
			'module.exports = __webpack_public_path__ + \"../81dc9bdb52d04dc20036dbd8313ed055.txt\";'
		);
		run_with_options("/this/file.txt", {
			useRelativePath: true,
			cssOutputPath: "/this/is/the/style",
			context: "/this/is/the/",
			webpackConfig: {
				_moduleIssuerContext: "/this/is/the/",
				output: {
					path: "/this/is/the/context/dist",
					filename: "[name].js",
				},
			},
		}).result.should.be.eql(
			'module.exports = __webpack_public_path__ + \"../81dc9bdb52d04dc20036dbd8313ed055.txt\";'
		);
		run_with_options("/this/file.txt", {
			useRelativePath: true,
			cssOutputPath: "/style",
			context: "/",
			webpackConfig: {
				_moduleIssuerContext: "/",
				output: {
					path: "/this/is/the/context/dist",
					filename: "[name].js",
				},
			},
		}).result.should.be.eql(
			'module.exports = __webpack_public_path__ + \"this/81dc9bdb52d04dc20036dbd8313ed055.txt\";'
		);
	});
});

describe("outputPath function", function() {
	it("should be supported", function() {
		outputFunc = function(value) {
			return("/path/set/by/func");
		};
		var options = {};
		options.outputPath = outputFunc;
		run_with_options("/this/is/the/context/file.txt", options).result.should.be.eql(
			'module.exports = __webpack_public_path__ + \"/path/set/by/func\";'
		);
	});
	it("should be ignored if you set useRelativePath", function() {
		outputFunc = function(value) {
			return("/path/set/by/func");
		};
		var options = {};
		options.outputPath = outputFunc;
		options.useRelativePath = true;
		run_with_options("/this/is/the/context/file.txt", options).result.should.be.eql(
			'module.exports = __webpack_public_path__ + \"81dc9bdb52d04dc20036dbd8313ed055.txt\";'
		);
	});
});
