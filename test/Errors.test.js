import loader from '../src';

describe('Errors', () => {
  test('Loader Error', () => {
    const err = () => loader.call({ emitFile: false });

    expect(err).toThrow();
    expect(err).toThrowErrorMatchingSnapshot();
  });

  test('Validation Error', () => {
    const err = () => loader.call({
      query: { useRelativePath: 1 },
      emitFile: true,
    });

    expect(err).toThrow();
    expect(err).toThrowErrorMatchingSnapshot();
  });
});
