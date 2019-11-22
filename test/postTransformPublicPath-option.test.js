import path from 'path';

import {
  compile,
  execute,
  getCompiler,
  normalizeErrors,
  readAsset,
} from './helpers';

describe('"postTransformPublicPath" option', () => {
  it('should work without value', async () => {
    const compiler = getCompiler('simple.js');
    const stats = await compile(compiler);

    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(normalizeErrors(stats.compilation.warnings)).toMatchSnapshot(
      'warnings'
    );
    expect(normalizeErrors(stats.compilation.errors)).toMatchSnapshot('errors');
  });

  it('should work with "Function" where return input parameter value without modification', async () => {
    const compiler = getCompiler('simple.js', {
      postTransformPublicPath: (p) => p,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(normalizeErrors(stats.compilation.warnings)).toMatchSnapshot(
      'warnings'
    );
    expect(normalizeErrors(stats.compilation.errors)).toMatchSnapshot('errors');
  });

  it('should work with "Function" where append to input parameter value', async () => {
    const compiler = getCompiler('simple.js', {
      postTransformPublicPath: (p) => `${p} + "/test"`,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(normalizeErrors(stats.compilation.warnings)).toMatchSnapshot(
      'warnings'
    );
    expect(normalizeErrors(stats.compilation.errors)).toMatchSnapshot('errors');
  });

  it('should work with "Function" where return input parameter value without modification and use "publicPath" option', async () => {
    const compiler = getCompiler('simple.js', {
      publicPath: 'public_path/',
      postTransformPublicPath: (p) => p,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(normalizeErrors(stats.compilation.warnings)).toMatchSnapshot(
      'warnings'
    );
    expect(normalizeErrors(stats.compilation.errors)).toMatchSnapshot('errors');
  });

  it('should work with "Function" where append to input parameter value and use "publicPath" option', async () => {
    const compiler = getCompiler('simple.js', {
      publicPath: 'public_path/',
      postTransformPublicPath: (p) => `${p} + "?test=test"`,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(normalizeErrors(stats.compilation.warnings)).toMatchSnapshot(
      'warnings'
    );
    expect(normalizeErrors(stats.compilation.errors)).toMatchSnapshot('errors');
  });

  it('should work with "Function" and "publicPath" option as "Function"', async () => {
    const compiler = getCompiler('simple.js', {
      publicPath(url) {
        return `public_path/${url}`;
      },
      postTransformPublicPath: (p) => p,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(normalizeErrors(stats.compilation.warnings)).toMatchSnapshot(
      'warnings'
    );
    expect(normalizeErrors(stats.compilation.errors)).toMatchSnapshot('errors');
  });

  it('should work with "Function" where append to input parameter value and "publicPath" option as "Function"', async () => {
    const compiler = getCompiler('simple.js', {
      publicPath(url) {
        return `public_path/${url}`;
      },
      postTransformPublicPath: (p) => `${p} + "?test=test"`,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(normalizeErrors(stats.compilation.warnings)).toMatchSnapshot(
      'warnings'
    );
    expect(normalizeErrors(stats.compilation.errors)).toMatchSnapshot('errors');
  });

  it('should work with "Function" where prepend path and "publicPath" option as "String"', async () => {
    const compiler = getCompiler('simple.js', {
      publicPath: 'public_path/',
      postTransformPublicPath: (p) => `"path_prefix/" + ${p}`,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(normalizeErrors(stats.compilation.warnings)).toMatchSnapshot(
      'warnings'
    );
    expect(normalizeErrors(stats.compilation.errors)).toMatchSnapshot('errors');
  });

  it('should work with "Function" where prepend "__webpack_public_path__" and "publicPath" option as "String"', async () => {
    const compiler = getCompiler(
      'simple.js',
      {
        publicPath: 'public_path/',
        postTransformPublicPath: (p) => `__webpack_public_path__ + ${p}`,
      },
      {
        output: {
          publicPath: 'http://code.com/',
          path: path.resolve(__dirname, 'outputs'),
          filename: '[name].bundle.js',
          chunkFilename: '[name].chunk.js',
        },
      }
    );
    const stats = await compile(compiler);

    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(normalizeErrors(stats.compilation.warnings)).toMatchSnapshot(
      'warnings'
    );
    expect(normalizeErrors(stats.compilation.errors)).toMatchSnapshot('errors');
  });
});
