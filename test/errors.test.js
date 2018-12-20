import loader from '../src';

describe('validation', () => {
  it('errors', () => {
    const validate = (options) =>
      loader.call(
        Object.assign(
          {},
          {
            resourcePath: 'image.png',
            query: options,
            emitFile: () => {},
          }
        ),
        'a { color: red; }'
      );

    expect(() =>
      validate({ unknown: 'unknown' })
    ).toThrowErrorMatchingSnapshot();

    expect(() => validate({ name: '[path][name].[ext]' })).not.toThrow();
    expect(() =>
      validate({
        name: () => '[hash].[ext]',
      })
    ).not.toThrow();
    expect(() => validate({ name: true })).toThrowErrorMatchingSnapshot();

    expect(() => validate({ outputPath: 'assets' })).not.toThrow();
    expect(() =>
      validate({
        outputPath: () => 'assets',
      })
    ).not.toThrow();
    expect(() => validate({ outputPath: true })).toThrowErrorMatchingSnapshot();

    expect(() => validate({ publicPath: 'assets' })).not.toThrow();
    expect(() =>
      validate({
        publicPath: () => 'assets',
      })
    ).not.toThrow();
    expect(() => validate({ publicPath: true })).toThrowErrorMatchingSnapshot();

    expect(() => validate({ context: 'assets' })).not.toThrow();
    expect(() => validate({ context: true })).toThrowErrorMatchingSnapshot();

    expect(() => validate({ emitFile: true })).not.toThrow();
    expect(() => validate({ emitFile: false })).not.toThrow();
    expect(() => validate({ emitFile: 'true' })).toThrowErrorMatchingSnapshot();

    expect(() => validate({ regExp: /image\.png/ })).not.toThrow();
    expect(() => validate({ regExp: 'image\\.png' })).not.toThrow();
    expect(() => validate({ regExp: true })).toThrowErrorMatchingSnapshot();
  });
});
