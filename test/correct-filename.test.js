var should = require("should");
var path = require("path");
var fileLoader = require("../");

function run(resourcePath, query, content) {
	content = content || new Buffer("1234");
	var result = null;
	var context = {
		resourcePath: resourcePath,
		query: "?" + query,
		options: {
			context: "/this/is/the/context"
		},
		emitFile: function(url, content2) {
			content2.should.be.eql(content);
			result = url;
		}
	};
	fileLoader.call(context, content);
	return result;
}

function test(excepted, resourcePath, query, content) {
	run(resourcePath, query, content).should.be.eql(excepted);
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