import webpack from '../helpers/compiler';

describe('Options', () => {
  describe('publicPath', () => {
    test('{String}', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            publicPath: 'public_path/',
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const [module] = stats.toJson().modules;
      const { assets, source } = module;

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{String} - Without trailing slash', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            publicPath: 'public_path',
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const [module] = stats.toJson().modules;
      const { assets, source } = module;

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{String} - URL', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            publicPath: 'https://cdn.com/',
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const [module] = stats.toJson().modules;
      const { assets, source } = module;

      expect({ assets, source }).toMatchSnapshot();
    });

    test('{Function}', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            publicPath(url) {
              return `public_path/${url}`;
            },
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const [module] = stats.toJson().modules;
      const { assets, source } = module;

      expect({ assets, source }).toMatchSnapshot();
    });
  });
});
