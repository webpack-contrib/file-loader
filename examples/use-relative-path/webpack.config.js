const path = require('path');
const Text = require('extract-text-webpack-plugin');
const fileLoader = require.resolve('../../');

const resolve = (...args) => path.resolve(__dirname, ...args);
const cssOutputPath = 'styles/';
const jsOutputPath = 'scripts/';

module.exports = (argv = {}) => ({
	entry: [
		'./source/styles/index.css',
		'./source/index.js',
	],
	output: {
		path: resolve('dist'),
		filename: `${jsOutputPath}[name].js`,
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: Text.extract({
					fallback: 'style-loader',
					use: [{
						loader: 'css-loader',
						query: {
							minimize: false,
						},
					}],
				}),
			},
			{
				test: /\.(jpe?g|png|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
				loader: fileLoader,
				options: {
					cssOutputPath,
					useRelativePath: true,
				},
			},
		],
	},
	plugins: [
		new Text({
			filename: `${cssOutputPath}theme.css`,
			disable: !!argv.dev,
			allChunks: true,
		}),
	],
});
