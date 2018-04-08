
import webpack from '../helpers/compiler';

describe('Options', () => {
  describe('context', () => {
    test('{String}', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            context: `${__dirname}`,
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
