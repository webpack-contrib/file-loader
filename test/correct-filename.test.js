/* eslint-disable no-useless-escape, no-unused-vars */
import queryString from 'querystring';
import fileLoader from '../src';

function run(resourcePath, query, content = new Buffer('1234')) {
  let file = null;

  const queryObject = queryString.parse(query);
  const webpackConfig = Object.assign({}, queryObject.webpackConfig);
  delete queryObject.webpackConfig;

  const context = {
    resourcePath,
    query: `?${query}`,
    options: {
      context: '/this/is/the/context',
      output: webpackConfig.output,
    },
    _module: {
      issuer: {
        context: webpackConfig._moduleIssuerContext, // eslint-disable-line no-underscore-dangle
      },
    },
    emitFile(url, content2) {
      expect(content2).toEqual(content);
      file = url;
    },
  };

  const result = fileLoader.call(context, content);
  return { file, result };
}

function runWithOptions(resourcePath, config, content = new Buffer('1234')) {
  let file = null;

  const options = Object.assign({}, config);
  const webpackConfig = Object.assign({}, options.webpackConfig);
  delete options.webpackConfig;

  const context = {
    resourcePath,
    options: {
      fileLoader: options,
      context: '/this/is/the/context',
      output: webpackConfig.output,
    },
    _module: {
      issuer: {
        context: webpackConfig._moduleIssuerContext, // eslint-disable-line no-underscore-dangle
      },
    },
    emitFile(url, content2) {
      expect(content2).toEqual(content);
      file = url;
    },
  };

  const result = fileLoader.call(context, content);
  return { file, result };
}

function test(excepted, resourcePath, query, content) {
  expect(run(resourcePath, query, content).file).toEqual(excepted);
}

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
      'export default = "http://cdn/81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
  });
  it('should override public path when given empty string', () => {
    expect(run('/file.txt', 'publicPath=').result).toEqual(
      'export default = "81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
  });
  it('should use webpack public path when not set', () => {
    expect(run('/file.txt').result).toEqual(
      'export default = __webpack_public_path__ + "81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
  });
});

describe('useRelativePath option', () => {
  it('should be supported', () => {
    expect(runWithOptions('/this/is/the/context/file.txt', {
      useRelativePath: true,
      webpackConfig: {
        _moduleIssuerContext: '/this/is/the/context',
        output: {
          filename: '[name].js',
        },
      },
    }).result).toEqual(
      'export default = __webpack_public_path__ + "81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
    expect(runWithOptions('/this/is/file.txt', {
      useRelativePath: true,
      webpackConfig: {
        _moduleIssuerContext: '/this/is/the/context',
        output: {
          filename: '[name].js',
        },
      },
    }).result).toEqual(
      'export default = __webpack_public_path__ + "../81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
    expect(runWithOptions('/this/file.txt', {
      useRelativePath: true,
      context: '/this/is/the/',
      webpackConfig: {
        _moduleIssuerContext: '/this/is/the/',
        output: {
          filename: '[name].js',
        },
      },
    }).result).toEqual(
      'export default = __webpack_public_path__ + "../81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
    expect(runWithOptions('/this/file.txt', {
      useRelativePath: true,
      context: '/',
      webpackConfig: {
        _moduleIssuerContext: '/',
        output: {
          filename: '[name].js',
        },
      },
    }).result).toEqual(
      'export default = __webpack_public_path__ + "this/81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
  });
});

describe('cssOutputPath option', () => {
  it('should be supported', () => {
    expect(runWithOptions('/this/is/the/context/dist/file.txt', {
      useRelativePath: true,
      cssOutputPath: 'style',
      webpackConfig: {
        _moduleIssuerContext: '/this/is/the/context/source',
        output: {
          path: '/this/is/the/context/dist',
        },
      },
    }).result).toEqual(
      'export default = __webpack_public_path__ + "../dist/81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
    expect(runWithOptions('/this/is/file.txt', {
      useRelativePath: true,
      cssOutputPath: '',
      webpackConfig: {
        _moduleIssuerContext: '/this/is',
        output: {
          path: '/this/is/the/context',
        },
      },
    }).result).toEqual(
      'export default = __webpack_public_path__ + "81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
    expect(runWithOptions('/this/file.txt', {
      useRelativePath: true,
      cssOutputPath: '/this/is/the/style',
      context: '/this/is/the/',
      webpackConfig: {
        _moduleIssuerContext: '/this/is/the/',
        output: {
          path: '/this/is/the/context/dist',
        },
      },
    }).result).toEqual(
      'export default = __webpack_public_path__ + "../../../../../81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
    expect(runWithOptions('/this/file.txt', {
      useRelativePath: true,
      cssOutputPath: '/style',
      context: '/',
      webpackConfig: {
        _moduleIssuerContext: '/',
        output: {
          path: '/this/is/the/context/dist',
        },
      },
    }).result).toEqual(
      'export default = __webpack_public_path__ + "../this/81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
  });
});

describe('outputPath function', () => {
  it('should be supported', () => {
    const outputFunc = value => '/path/set/by/func';
    const options = {};
    options.outputPath = outputFunc;
    expect(runWithOptions('/this/is/the/context/file.txt', options).result).toEqual(
      'export default = __webpack_public_path__ + "/path/set/by/func";',
    );
  });
  it('should be ignored if you set useRelativePath', () => {
    const outputFunc = value => '/path/set/by/func';
    const options = {};
    options.outputPath = outputFunc;
    options.useRelativePath = true;
    expect(runWithOptions('/this/is/the/context/file.txt', options).result).toEqual(
      'export default = __webpack_public_path__ + "81dc9bdb52d04dc20036dbd8313ed055.txt";',
    );
  });
});
