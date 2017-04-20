const { exec } = require("child_process");

module.exports = (cmd, options = {}) => {
	return new Promise((resolve, reject) => {
		const child = exec(cmd, options, (err, stdout, stderr) =>
			err ? reject(err) : resolve({ out: stdout, err: stderr })
		);
		if (options.stdout) {
			child.stdout.pipe(options.stdout);
		}
		if (options.stderr) {
			child.stderr.pipe(options.stderr);
		}
	});
};
