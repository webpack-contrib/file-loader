import loader from '../src';

const run = function run(resourcePath, query, content = new Buffer('1234')) {
  let result = false;

  const context = {
    resourcePath,
    query: `?${query || ''}`,
    options: {
      context: '/this/is/the/context',
    },
    emitFile() {
      result = true;
    },
  };

  loader.call(context, content);

  return result;
};

describe('optional-emission', () => {
  it('should emit a file by default', () => {
    expect(run('whatever.txt', '')).toBe(true);
  });

  it('should not emit a file if disabled', () => {
    expect(run('whatever.txt', 'emitFile=false')).toBe(false);
  });
});
