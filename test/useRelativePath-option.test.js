import webpack from './helpers/compiler';

describe('when applied with `useRelativePath` option', () => {
  it('matches snapshot for `false` value (`{Boolean}`)', async () => {
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

  it('matches snapshot for `true` value (`{Boolean}`)', async () => {
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

  it('matches snapshot for `true` value (`{Boolean}`) and with relative `context`', async () => {
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

  it('matches snapshot for `true` value (`{Boolean}`) and with absolute `context`', async () => {
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
