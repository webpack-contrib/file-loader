/* eslint-disable no-useless-escape, no-unused-vars */
import loader from '../src';

const run = function run(resourcePath, query, content = new Buffer('1234')) {
  let file = null;

  const context = {
    resourcePath,
    query: `?${query || ''}`,
    options: {
      context: '/this/is/the/context',
    },
    emitFile(url, content2) {
      expect(content2).toEqual(content);
      file = url;
    },
  };

  const result = loader.call(context, content);

  return {
    file,
    result,
  };
};

function runWithOptions(resourcePath, options, content = new Buffer('1234')) {
  let file = null;

  const context = {
    resourcePath,
    query: options,
    options: {
      context: '/this/is/the/context',
    },
    emitFile(url, content2) {
      expect(content2).toEqual(content);
      file = url;
    },
  };

  const result = loader.call(context, content);

  return {
    file,
    result,
  };
}
const test = function test(excepted, resourcePath, query, content) {
  expect(run(resourcePath, query, content).file).toEqual(excepted);
};

describe('correct-filename', () => {
  it('should process defaults correctly', () => {
    test('81dc9bdb52d04dc20036dbd8313ed055.txt', '/file.txt', '');
    test('81dc9bdb52d04dc20036dbd8313ed055.png', '/file.png', '');
    test('81dc9bdb52d04dc20036dbd8313ed055.txt', 'file.txt', '');
    test('81dc9bdb52d04dc20036dbd8313ed055.bin', '', '');
  });

  it('should process name correctly', () => {
    test('file.txt', '/file.txt', 'name=[name].[ext]');
    test('file.png', '/file.png', 'name=[name].[ext]');
    test('file.txt', 'file.txt', 'name=[name].[ext]');
    test('file.bin', '', 'name=[name].[ext]');
    test('file', '/file.txt', 'name=[name]');
    test('81dc9bdb52d04dc20036dbd8313ed055', '/file.txt', 'name=[hash]');
    test('81dc9bdb52d04dc20036dbd8313ed055/file.txt', '/file.txt', 'name=[hash]/[name].[ext]');
    test('file.txt', '/this/is/the/context/file.txt', 'name=[path][name].[ext]');
    test('dir/file.txt', '/this/is/the/context/dir/file.txt', 'name=[path][name].[ext]');
    test('dir/sub/file.txt', '/this/is/the/context/dir/sub/file.txt', 'name=[path][name].[ext]');
    test('_/_/dir/sub/file.txt', '/this/is/dir/sub/file.txt', 'name=[path][name].[ext]');
    test('dir/sub/file.txt', '/this/is/dir/sub/file.txt', 'name=[path][name].[ext]&context=/this/is');
  });

  it('should process hash correctly', () => {
    test('d93591bdf7860e1e4ee2fca799911215.txt', '/file.txt', '', new Buffer('4321'));
  });

  it('should process hash options correctly', () => {
    test('81dc9.txt', '/file.txt', 'name=[hash:5].[ext]');
    test('d4045.txt', '/file.txt', 'name=[sha512:hash:5].[ext]');
    test('1lQ3UNSdIS0c9dQ5brCZO1.txt', '/file.txt', 'name=[hash:base64].[ext]');
    test('caYJDUvUOiGAdDsiHKffIEj.txt', '/file.txt', 'name=[hash:base52].[ext]');
    test('sntmopgidsdqrofkjywoyldtiij.txt', '/file.txt', 'name=[hash:base26].[ext]');
    test('sntmopgids.txt', '/file.txt', 'name=[hash:base26:10].[ext]');
  });
});

describe('publicPath option', () => {
  it('should be supported', () => {
    expect(run('/file.txt', 'publicPath=http://cdn/').result).toEqual(
      'module.exports = "http://cdn/81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
  });

  it('should override public path when given empty string', () => {
    expect(run('/file.txt', 'publicPath=').result).toEqual(
      'module.exports = "81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
  });

  it('should use webpack public path when not set', () => {
    expect(run('/file.txt').result).toEqual(
      'module.exports = __webpack_public_path__ + "81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
  });
});

describe('useRelativePath option', () => {
  it('should be supported', () => {
    expect(run('/this/is/the/context/file.txt', 'useRelativePath=true').result).toEqual(
      'module.exports = __webpack_public_path__ + \"./81dc9bdb52d04dc20036dbd8313ed055.txt\";',
    );

    expect(run('/this/is/file.txt', 'useRelativePath=true').result).toEqual(
      'module.exports = __webpack_public_path__ + \"../../81dc9bdb52d04dc20036dbd8313ed055.txt\";',
    );

    expect(run('/this/file.txt', 'context=/this/is/the/&useRelativePath=true').result).toEqual(
      'module.exports = __webpack_public_path__ + \"../../81dc9bdb52d04dc20036dbd8313ed055.txt\";',
    );

    expect(run('/this/file.txt', 'context=/&useRelativePath=true').result).toEqual(
      'module.exports = __webpack_public_path__ + \"this/81dc9bdb52d04dc20036dbd8313ed055.txt\";',
    );
  });
});

describe('outputPath function', () => {
  it('should be supported', () => {
    const options = {};
    options.outputPath = value => '/path/set/by/func';

    expect(runWithOptions('/this/is/the/context/file.txt', options).result)
      .toEqual(
        'module.exports = __webpack_public_path__ + \"/path/set/by/func\";',
      );
  });

  it('should be ignored if you set useRelativePath', () => {
    const options = {};
    options.outputPath = value => '/path/set/by/func';
    options.useRelativePath = true;

    expect(runWithOptions('/this/is/the/context/file.txt', options).result)
      .toEqual(
        'module.exports = __webpack_public_path__ + \"./81dc9bdb52d04dc20036dbd8313ed055.txt\";',
      );
  });
});
