import loader from '../src';

describe('errors', () => {
  it('validation errors', () => {
    const err = () =>
      loader.call({
        query: { useRelativePath: 1 },
        emitFile: true,
      });

    expect(err).toThrow();
    expect(err).toThrowErrorMatchingSnapshot();
  });
});
