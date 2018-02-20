/* eslint-disable
  prefer-destructuring,
*/
import webpack from '../helpers/compiler';

describe('Options', () => {
  describe('outputPath', () => {
    test('{String}', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            outputPath: 'output_path/',
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const { assets, source } = stats.toJson().modules[1];

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{String} without trailing slash', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            outputPath: 'output_path',
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const { assets, source } = stats.toJson().modules[1];

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{String} with `options.name`', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            name: '[path][name].[ext]',
            outputPath: 'output_path/',
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const { assets, source } = stats.toJson().modules[1];

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{Function}', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            outputPath(url) {
              return `output_path_func/${url}`;
            },
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const { assets, source } = stats.toJson().modules[1];

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{Function} with `options.name`', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            name: '[name].[ext]',
            outputPath(url) {
              return `output_path_func/${url}`;
            },
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const { assets, source } = stats.toJson().modules[1];

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{String} with `publicPath` {String}', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            outputPath: 'output_path/',
            publicPath: 'public_path/',
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const { assets, source } = stats.toJson().modules[1];

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{String} with `publicPath` {String} without trailing slash', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            outputPath: 'output_path',
            publicPath: 'public_path',
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const { assets, source } = stats.toJson().modules[1];

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{Function} with `publicPath` {String}', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            publicPath: 'public_path/',
            outputPath(url) {
              return `output_path_func/${url}`;
            },
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const { assets, source } = stats.toJson().modules[1];

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{String} with `publicPath` {Function}', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            outputPath: 'output_path/',
            publicPath(url) {
              return `public_path_func/${url}`;
            },
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const { assets, source } = stats.toJson().modules[1];

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{Function} with `publicPath` {Function}', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            outputPath(url) {
              return `output_path_func/${url}`;
            },
            publicPath(url) {
              return `public_path_func/${url}`;
            },
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const { assets, source } = stats.toJson().modules[1];

      expect({ assets, source }).toMatchSnapshot();
    });
  });
});
