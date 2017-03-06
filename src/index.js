/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
import loaderUtils from 'loader-utils';

export default function fileLoader(content) {
  this.cacheable && this.cacheable(); // eslint-disable-line no-unused-expressions

  if (!this.emitFile) throw new Error('emitFile is required from module system');

  const query = loaderUtils.getOptions(this) || {};
  const configKey = query.config || 'fileLoader';
  const options = this.options[configKey] || {};

  const config = {
    publicPath: false,
    name: '[hash].[ext]',
  };

  // options takes precedence over config
  Object.keys(options).forEach((attr) => {
    config[attr] = options[attr];
  });

  // query takes precedence over config and options
  Object.keys(query).forEach((attr) => {
    config[attr] = query[attr];
  });

  const url = loaderUtils.interpolateName(this, config.name, {
    context: config.context || this.options.context,
    content,
    regExp: config.regExp,
  });

  let outputPath = url;

  let publicPath = `__webpack_public_path__ + ${JSON.stringify(url)}`;

  if (config.outputPath) {
    // support functions as outputPath to generate them dynamically
    outputPath = typeof config.outputPath === 'function' ? config.outputPath(url) : config.outputPath + url;
  }

  if (config.publicPath) {
    // support functions as publicPath to generate them dynamically
    publicPath = JSON.stringify(
      typeof config.publicPath === 'function' ? config.publicPath(url) : config.publicPath + url,
    );
  }

  if (query.emitFile === undefined || query.emitFile) { // eslint-disable-line no-undefined
    this.emitFile(outputPath, content);
  }

  return `export default = ${publicPath};`;
}
export const raw = true;
