/* eslint-disable
  prefer-destructuring,
*/
import webpack from '../helpers/compiler';

describe('Options', () => {
  describe('useRelativePath', () => {
    test('this.options.context', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            useRelativePath: true,
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const { source } = stats.toJson().modules[1];

      expect(source).toMatchSnapshot();
    });

    test('options.context', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            context: '/relative/',
            useRelativePath: true,
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const { source } = stats.toJson().modules[1];

      expect(source).toMatchSnapshot();
    });
  });
});
