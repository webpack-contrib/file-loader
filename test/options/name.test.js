/* eslint-disable
  prefer-destructuring,
*/
import webpack from '../helpers/compiler';

describe('Options', () => {
  describe('name', () => {
    test('{String}', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            name: '[hash].[ext]',
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const [module] = stats.toJson().modules;
      const { source } = module;

      expect(source).toMatchSnapshot();
    });

    test('{Function}', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            name() {
              return '[hash].[ext]';
            },
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const [module] = stats.toJson().modules;
      const { source } = module;

      expect(source).toMatchSnapshot();
    });
  });
});
