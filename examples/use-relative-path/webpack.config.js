const path = require('path');
const Text = require('extract-text-webpack-plugin');
const Html = require('html-webpack-plugin');
const fileLoader = require.resolve('../../');

const resolve = (...args) => path.resolve(__dirname, ...args);

const OUTPUT = {
	bundle: 'dist/',
	img: 'media/images/',
	css: 'styles/',
	js: 'scripts/',
};

module.exports = (argv = {}) => ({
	entry: [
		'./source/index.css',
		'./source/index.js',
	],
	output: {
		path: resolve(OUTPUT.bundle),
		filename: `${OUTPUT.js}[name].js`,
	},
	devServer: {
		contentBase: resolve(OUTPUT.bundle),
		stats: 'errors-only',
		compress: true,
		open: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: Text.extract({
					publicPath: OUTPUT.bundle,
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
					cssOutputPath: OUTPUT.css,
					outputPath: OUTPUT.img,
					useRelativePath: true,
					name: '[name].[hash:7].[ext]',
				},
			},
		],
	},
	plugins: [
		new Text({
			filename: `${OUTPUT.css}theme.css`,
			disable: !!argv.dev,
			allChunks: true,
		}),
		new Html({
			title: 'Sample // useRelativePath',
			template: './source/index.html',
			hash: true,
		}),
	],
});
