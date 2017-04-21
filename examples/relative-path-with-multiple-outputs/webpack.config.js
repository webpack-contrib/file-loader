const ip = require('ip');
const path = require('path');
const Text = require('extract-text-webpack-plugin');
const Html = require('html-webpack-plugin');
const webpack = require('webpack');
const fileLoader = require.resolve('../../');

const resolve = (...args) => path.resolve(__dirname, ...args);

const OUTPUT = {
	bundle: 'dist/',
	img: 'media/images/',
	css: 'styles/',
	js: 'scripts/',
};

module.exports = (argv = {}) => {

	const config = {
		devtool: argv.dev ? '#cheap-module-eval-source-map' : '#source-map',
		entry: {
			desktop: ['./source/scripts/desktop.js', './source/styles/desktop.css'],
			mobile: ['./source/scripts/mobile.js', './source/styles/mobile.css'],
		},
		output: {
			path: resolve(OUTPUT.bundle),
			filename: `${OUTPUT.js}[name].js`,
		},
		devServer: {
			contentBase: resolve(OUTPUT.bundle),
			historyApiFallback: true,
			stats: 'errors-only',
			host: ip.address(),
			port: 3000,
		},
		module: {
			rules: [
				{
					test: /\.css$/,
					use: Text.extract({
						publicPath: argv.dev && OUTPUT.bundle,
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
						useRelativePath: true,

						/*
						|* If you need a multiple output path for any reason
						|* @see https://github.com/webpack-contrib/file-loader/issues/149#issuecomment-294290509
						`*/
						cssOutputPath: OUTPUT.css,

						outputPath: OUTPUT.img,
						name: '[name].[hash:7].[ext]',
					},
				},
			],
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: `'${argv.dev ? "development" : "production" }'`,
				},
			}),
			new Text({
				filename: `${OUTPUT.css}[name]${argv.dev ? '' : '.[chunkhash]'}.css`,
				disable: !!argv.dev,
				allChunks: true,
			}),
			new Html({
				title: 'file-loader // useRelativePath // mobile',
				template: './source/views/mobile.html',
				filename: 'mobile.html',
				chunks: ['mobile'],
			}),
			new Html({
				title: 'file-loader // useRelativePath // desktop',
				template: './source/views/desktop.html',
				filename: 'index.html',
				chunks: ['desktop'],
			}),
			new webpack.HotModuleReplacementPlugin({ quiet: true }),
			new webpack.NoEmitOnErrorsPlugin(),
			new webpack.NamedModulesPlugin(),
		],
	};

	if (argv.dev) {
		const host = config.devServer.host;
		const port = config.devServer.port;
		Object.keys(config.entry).forEach((entry) => {
			config.entry[entry] = [
				`webpack-dev-server/client?http://${host}:${port}`,
				'webpack/hot/only-dev-server',
			].concat(config.entry[entry]);
		});
	}

	return config;
};
