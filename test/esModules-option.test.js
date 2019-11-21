import webpack from './helpers/compiler';

describe('when applied with `esModules` option', () => {
  it('matches snapshot without value', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });

  it('matches snapshot for `true` value', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          esModules: true,
        },
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });

  it('matches snapshot for `false` value', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          esModules: false,
        },
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });
});
