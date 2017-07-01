import { is, parsePath } from '../src/helper';

describe('is', () => {
  expect(is('String|Function', '/path/to/file.txt')).toBe(true);
  expect(is('String|Function', () => '/path/to/file.txt')).toBe(true);
  expect(is('Function', () => '/path/to/file.txt')).toBe(true);
  expect(is('String', () => '/path/to/file.txt')).toBe(false);
});

describe('parsePath', () => {
  const outputPath = filePath => `/path/to/${filePath}`;
  const publicPath = '/public/path/';
  const url = 'file.txt';

  it('should process function value correctly', () => {
    expect(parsePath(outputPath, url)).toBe(`/path/to/${url}`);
  });

  it('should process string value correctly', () => {
    expect(parsePath(publicPath, url)).toBe(publicPath + url);
  });

  it('should process void correctly', () => {
    expect(parsePath(undefined, url)).toBe(url);
  });
});
