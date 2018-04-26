/* eslint-disable
  prefer-destructuring,
*/
import webpack from '../helpers/compiler';

describe('Options', () => {
  describe('stringifyPublicPath', () => {
    describe('{Boolean}', () => {
      test('True (Default)', async () => {
        const config = {
          loader: {
            test: /(png|jpg|svg)/,
            options: {
              publicPath: url => `some/path/${url}`,
              stringifyPublicPath: true,
            },
          },
        };

        const stats = await webpack('fixture.js', config);
        const { assets, source } = stats.toJson().modules[1];

        expect({ assets, source }).toMatchSnapshot();
      });

      test('False', async () => {
        const config = {
          loader: {
            test: /(png|jpg|svg)/,
            options: {
              publicPath: url => `(window.CDN_PATH ? window.CDN_PATH + "${url}" : "${url}")`,
              stringifyPublicPath: false,
            },
          },
        };

        const stats = await webpack('fixture.js', config);
        const { assets, source } = stats.toJson().modules[1];

        expect({ assets, source }).toMatchSnapshot();
      });
    });
  });
});
