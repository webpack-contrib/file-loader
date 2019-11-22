import path from 'path';

import {
  compile,
  execute,
  getCompiler,
  normalizeErrors,
  readAsset,
} from './helpers';

describe('"context" option', () => {
  it('should work without value', async () => {
    const compiler = getCompiler('simple.js', {
      name: '[path][name].[ext]',
      context: __dirname,
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

  it('should work with "String" value', async () => {
    const compiler = getCompiler('simple.js', {
      name: '[path][name].[ext]',
      context: path.resolve(__dirname, '../'),
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
});
