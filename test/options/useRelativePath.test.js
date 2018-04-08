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
      const [module] = stats.toJson().modules;
      const { assets, source } = module;

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
      const [module] = stats.toJson().modules;
      const { assets, source } = module;

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
      const [module] = stats.toJson().modules;
      const { assets, source } = module;

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
      const [module] = stats.toJson().modules;
      let { assets, source } = module;

      if (process.env.CIRCLECI) {
        assets = [assets[0].replace('project', 'file-loader')];
        source = source.replace('project', 'file-loader');
      }

      expect({ assets, source }).toMatchSnapshot();
    });
  });
});
