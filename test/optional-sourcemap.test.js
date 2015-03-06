var should = require("should");
var fileLoader = require("../");

function run(resourcePath, query, contextSourceMap, map) {
	var content = new Buffer("1234");
	var result = [];
	var context = {
		resourcePath: resourcePath,
		query: "?name=[name].[ext]&" + query,
		options: {
			context: "/this/is/the/context"
		},
		emitFile: function(url, content) {
			result.push([ url, content ]);
		},
		sourceMap: contextSourceMap
	};
	fileLoader.call(context, content, map);
	return result;
}

describe("optional-sourcemap", function() {
	it("should emit a sourcemap when requested", function() {
		var files = run("whatever.txt", "sourceMap", true, {});
		files.length.should.equal(2);
		files[0].should.eql([ "file.txt.map", "{}" ]);
		files[1][0].should.equal("file.txt");
		files[1][1].toString().should.equal(
			"1234\n//# sourceMappingURL=file.txt.map"
		);
	});

	it("should use css comment when file has css extension", function() {
		var files = run("whatever.css", "sourceMap", true, { v: 1 });
		files.length.should.equal(2);
		files[0].should.eql([ "file.css.map", '{"v":1}' ]);
		files[1][0].should.equal("file.css");
		files[1][1].toString().should.equal(
			"1234\n/*# sourceMappingURL=file.css.map*/"
		);
	});

	it("should not emit a sourcemap without query parameter", function() {
		var files = run("whatever.txt", "", true, {});
		files.length.should.equal(1);
	});

	it("should not emit a sourcemap without loader context with sourceMap", function() {
		var files = run("whatever.txt", "sourceMap", false, {});
		files.length.should.equal(1);
	});

	it("should not emit a sourcemap without recieving a sourcemap", function() {
		var files = run("whatever.txt", "sourceMap", true, null);
		files.length.should.equal(1);
	});

	it("should not emit a sourcemap when emitFile=false", function() {
		var files = run("whatever.txt", "sourceMap&emitFile=false", true, {});
		files.length.should.equal(0);
	});

	it("should emit only the file by default", function() {
		var files = run("whatever.txt", "", false, null);
		files.length.should.equal(1);
	});
});
