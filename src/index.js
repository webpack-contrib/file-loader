import path from 'path';
import loaderUtils from 'loader-utils';
import validateOptions from 'schema-utils';
import schema from './options.json';

export default function loader(content) {
  if (!this.emitFile) throw new Error('File Loader\n\nemitFile is required from module system');

  const options = loaderUtils.getOptions(this) || {};

  validateOptions(schema, options, 'File Loader');

  const context = options.context || this.rootContext || this.options && this.options.context

  let url = loaderUtils.interpolateName(this, options.name, {
    context,
    content,
    regExp: options.regExp,
  });

  let outputPath = '';

  if (options.outputPath) {
    // support functions as outputPath to generate them dynamically
    outputPath = (
      typeof options.outputPath === 'function' ? options.outputPath(url) : options.outputPath
    );
  }

  const filePath = this.resourcePath;

  if (options.useRelativePath) {
    const issuerContext = (this._module && this._module.issuer
      && this._module.issuer.context) || context;

    const relativeUrl = issuerContext && path.relative(issuerContext, filePath).split(path.sep).join('/');

    const relativePath = relativeUrl && `${path.dirname(relativeUrl)}/`;
    // eslint-disable-next-line no-bitwise
    if (~relativePath.indexOf('../')) {
      outputPath = path.posix.join(outputPath, relativePath, url);
    } else {
      outputPath = relativePath + url;
    }

    url = relativePath + url;
  } else if (options.outputPath) {
    // support functions as outputPath to generate them dynamically
    outputPath = typeof options.outputPath === 'function' ? options.outputPath(url) : options.outputPath + url;

    url = outputPath;
  } else {
    outputPath = url;
  }

  let publicPath = `__webpack_public_path__ + ${JSON.stringify(url)}`;

  if (options.publicPath !== undefined) {
    // support functions as publicPath to generate them dynamically
    publicPath = JSON.stringify(
      typeof options.publicPath === 'function' ? options.publicPath(url) : options.publicPath + url,
    );
  }

  if (options.emitFile === undefined || options.emitFile) {
    this.emitFile(outputPath, content);
  }
  // TODO revert to ES2015 Module export, when new CSS Pipeline is in place
  return `module.exports = ${publicPath};`;
}

export const raw = true;
