const fs = require("fs");
const ora = require("ora");
const path = require("path");
const exec = require("./exec");

const examples = fs.readdirSync(__dirname).filter(dirname =>
	fs.statSync(path.join(__dirname, dirname)).isDirectory()
).map(dirname => path.join(__dirname, dirname));

const stack = examples.map(dirname =>
	`cd ${dirname} && npm i --silent && npm run build`
).map(cmd => exec(cmd));

const spinner = ora("building...");
spinner.start();
module.exports = Promise.all(stack).then((response) => {
	spinner.stop();
	return response;
}).catch((reason) => {
	spinner.stop();
	console.error(reason.stack);
	process.exit(1);
});
