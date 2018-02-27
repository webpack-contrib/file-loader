/* eslint-disable
  prefer-destructuring,
*/
import webpack from '../helpers/compiler';

describe('Options', () => {
  describe('useRelativePath', () => {
    test('{Boolean} - `false`', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            useRelativePath: false,
          },
        },
      };

      const stats = await webpack('nested/fixture.js', config);
      const { assets, source } = stats.toJson().modules[1];

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{Boolean} - `true`', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            useRelativePath: true,
          },
        },
      };

      const stats = await webpack('nested/fixture.js', config);
      const { assets, source } = stats.toJson().modules[1];

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{Boolean} - `true` with relative `context`', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            context: './test/fixtures/nested/',
            useRelativePath: true,
          },
        },
      };

      const stats = await webpack('nested/fixture.js', config);
      const { assets, source } = stats.toJson().modules[1];

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{Boolean} - `true` with absolute `context`', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            context: '../nested/',
            useRelativePath: true,
          },
        },
      };

      const stats = await webpack('nested/fixture.js', config);
      const { assets, source } = stats.toJson().modules[1];

      expect({ assets, source }).toMatchSnapshot();
    });
  });
});
