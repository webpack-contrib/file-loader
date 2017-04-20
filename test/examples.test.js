const path = require("path");
const should = require("should");
const buildAll = require("../examples/build-all");
const exec = require("../examples/exec");

describe("examples", function() {
	let examples;
	it('should compile everything', function(done) {
		this.timeout(0);
		buildAll.then(response => {
			examples = response.filter(std => !std.err);
			examples.should.be.instanceOf(Array).and.have.lengthOf(response.length);
			done();
		}).catch(done);
	});
});