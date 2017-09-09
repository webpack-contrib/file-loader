import fileLoader from '../src';
import cjsFileLoader from '../src/cjs';

describe('cjs', () => {
  it('should export loader', () => {
    expect(cjsFileLoader).toEqual(fileLoader);
  });

  it('should export `raw` flag', () => {
    expect(cjsFileLoader.raw).toEqual(true);
  });
});
