var should = require("should");
var fileLoaderLocals = require("../locals");

function run(loader, content) {
  var callCount = 0;
  var context = {
    resourcePath: "/this/is/dir/sub/file.txt",
    query: "?name=[path][name].[ext]",
    options: {
      context: "/this/is/the/context"
    },
    emitFile: function() {
      callCount += 1;
    }
  };
  fileLoaderLocals.call(context, content);
  return callCount;
}

describe("locals", function() {
  it('should not emit a file', function () {
    run(new Buffer("1234")).should.eql(0);
  });
});
