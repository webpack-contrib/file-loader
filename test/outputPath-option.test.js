import webpack from './helpers/compiler';

describe('when applied with `outputPath` option', () => {
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

  it('matches snapshot for `{String}` value', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          outputPath: 'output_path/',
        },
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });

  it('matches snapshot for `{String}` value without trailing slash', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          outputPath: 'output_path',
        },
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });

  it('matches snapshot for `{String}` with `name` option', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          name: '[path][name].[ext]',
          outputPath: 'output_path/',
        },
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });

  it('matches snapshot for `{Function}` value', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          outputPath(url) {
            return `output_path_func/${url}`;
          },
        },
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });

  it('matches snapshot for `{Function}` value with `options.name`', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          name: '[name].[ext]',
          outputPath(url) {
            return `output_path_func/${url}`;
          },
        },
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });

  it('matches snapshot for `{String}` value with `publicPath` (`{String}`)', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          outputPath: 'output_path/',
          publicPath: 'public_path/',
        },
      },
    };

    const stats = await webpack('nested/fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });

  it('matches snapshot for `{String}` value with `publicPath` (`{String}`) without trailing slash', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          outputPath: 'output_path',
          publicPath: 'public_path',
        },
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });

  it('matches snapshot for `{Function}` value with `publicPath` (`{String}`)', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          publicPath: 'public_path/',
          outputPath(url) {
            return `output_path_func/${url}`;
          },
        },
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });

  it('matches snapshot for `{String}` value with `publicPath` (`{Function}`)', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          outputPath: 'output_path/',
          publicPath(url) {
            return `public_path_func/${url}`;
          },
        },
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });

  it('matches snapshot for `{Function}` value with `publicPath` (`{Function}`)', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          outputPath(url) {
            return `output_path_func/${url}`;
          },
          publicPath(url) {
            return `public_path_func/${url}`;
          },
        },
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });

  it('matches snapshot for `{Function}` value and pass `resourcePath`', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          outputPath(url, resourcePath) {
            expect(resourcePath).toMatch('file.png');

            return `output_path_func/${url}`;
          },
        },
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });

  it('matches snapshot for `{Function}` value and pass `context`', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          outputPath(url, resourcePath, context) {
            expect(context).toMatch('fixtures');

            return `output_path_func/${url}`;
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
