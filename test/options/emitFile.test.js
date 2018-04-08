
import webpack from '../helpers/compiler';

describe('Options', () => {
  describe('emitFile', () => {
    describe('{Boolean}', () => {
      test('True (Default)', async () => {
        const config = {
          loader: {
            test: /(png|jpg|svg)/,
            options: {
              emitFile: true,
            },
          },
        };

        const stats = await webpack('emitFile/fixture.js', config);
        const [, module] = stats.toJson().modules;
        const { assets } = module;

        expect(assets[0]).toMatchSnapshot();
      });

      test('False', async () => {
        const config = {
          loader: {
            test: /(png|jpg|svg)/,
            options: {
              emitFile: false,
            },
          },
        };

        const stats = await webpack('emitFile/fixture.js', config);
        const [module] = stats.toJson().modules;
        const { assets } = module;

        expect(assets[0]).toBe(undefined);
      });
    });
  });
});
