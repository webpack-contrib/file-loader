import path from 'path';

import loaderUtils from 'loader-utils';
import validateOptions from 'schema-utils';

import schema from './options.json';

function getOptions() {
  const options = loaderUtils.getOptions(this) || {};

  validateOptions(schema, options, 'File Loader');

  return options;
}

function createUrl(context, options, content) {
  return loaderUtils.interpolateName(this, options.name, {
    context,
    content,
    regExp: options.regExp,
  });
}

function createOutputPath(url, options, context) {
  let outputPath = url;

  if (options.outputPath) {
    if (typeof options.outputPath === 'function') {
      outputPath = options.outputPath(url, this.resourcePath, context);
    } else {
      outputPath = path.posix.join(options.outputPath, url);
    }
  }

  return outputPath;
}

export default function loader(content) {
  const options = getOptions.call(this);
  const context = options.context || this.rootContext;
  const url = createUrl.call(this, context, options, content);

  const outputPath = createOutputPath.call(this, url, options, context);
  let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

  if (options.publicPath) {
    if (typeof options.publicPath === 'function') {
      publicPath = options.publicPath(url, this.resourcePath, context);
    } else {
      publicPath = `${
        options.publicPath.endsWith('/')
          ? options.publicPath
          : `${options.publicPath}/`
      }${url}`;
    }

    publicPath = JSON.stringify(publicPath);
  }

  if (typeof options.emitFile === 'undefined' || options.emitFile) {
    this.emitFile(outputPath, content);
  }

  // TODO revert to ES2015 Module export, when new CSS Pipeline is in place
  return `module.exports = ${publicPath};`;
}

export const raw = true;

export function getOutputPath(loaderInstance) {
  const options = getOptions.call(loaderInstance);
  const context = options.context || loaderInstance.rootContext;
  const url = createUrl.call(loaderInstance, context, options, null);

  return createOutputPath.call(loaderInstance, url, options);
}
