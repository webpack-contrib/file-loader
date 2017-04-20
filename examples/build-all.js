const fs = require("fs");
const ora = require("ora");
const path = require("path");
const exec = require("./exec");

const cmds = fs.readdirSync(__dirname).filter(dirname =>
	fs.statSync(path.join(__dirname, dirname)).isDirectory() && dirname !== "node_modules"
).sort().map(dirname => `cd ${dirname} && npm i && npm run build`);

const stack = [];
cmds.forEach(cmd => stack.push(exec(cmd)));

const spinner = ora("building...");
spinner.start();
module.exports = Promise.all(stack).then((values) => {
	spinner.stop();
	return values;
});
