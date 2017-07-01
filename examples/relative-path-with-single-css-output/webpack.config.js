const path = require('path');
const Text = require('extract-text-webpack-plugin');
const Html = require('html-webpack-plugin');
const webpack = require('webpack');
const fileLoader = require.resolve('../../src/cjs');

const resolve = (...args) => path.resolve(__dirname, ...args);

const OUTPUT = {
  bundle: 'dist/',
  img: 'media/images/',
  css: 'styles/',
  js: 'scripts/',
};

module.exports = (argv = {}) => {
  return ({
    devtool: argv.dev ? '#eval-source-map' : '#source-map',
    entry: (argv.dev ? [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
    ] : []).concat([
      './source/index.css',
      './source/index.js',
    ]),
    output: {
      path: resolve(OUTPUT.bundle),
      filename: `${OUTPUT.js}[name].js`,
    },
    devServer: {
      contentBase: resolve(OUTPUT.bundle),
      historyApiFallback: true,
      stats: 'errors-only',
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
          NODE_ENV: `'${argv.dev ? 'development' : 'production'}'`,
        },
      }),
      new Text({
        filename: `${OUTPUT.css}theme.css`,
        disable: !!argv.dev,
        allChunks: true,
      }),
      new Html({
        title: 'file-loader // useRelativePath',
        template: './source/index.html',
      }),
      new webpack.HotModuleReplacementPlugin({ quiet: true }),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.NamedModulesPlugin(),
    ],
  });
};
