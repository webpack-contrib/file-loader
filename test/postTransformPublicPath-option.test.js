import webpack from './helpers/compiler';

describe('when applied with `postTransformPublicPath` option', () => {
  it('matches snapshot for returned input parameter value without modification', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          postTransformPublicPath: (p) => p,
        },
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });

  it('matches snapshot for appending to input parameter value', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {
          postTransformPublicPath: (p) => `${p} + "/test"`,
        },
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets, source } = module;

    expect({ assets, source }).toMatchSnapshot();
  });
});

describe('when applied with `publicPath` and `postTransformPublicPath` option', () => {
  describe('`{String}` value', () => {
    it('matches snapshot for returned input parameter value without modification', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            publicPath: 'public_path/',
            postTransformPublicPath: (p) => p,
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const [module] = stats.toJson().modules;
      const { assets, source } = module;

      expect({ assets, source }).toMatchSnapshot();
    });

    it('matches snapshot for appending to input parameter value', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            publicPath: 'public_path/',
            postTransformPublicPath: (p) => `${p} + "?test=test"`,
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const [module] = stats.toJson().modules;
      const { assets, source } = module;

      expect({ assets, source }).toMatchSnapshot();
    });

    it('matches snapshot for prefixing with __webpack_public_path__', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            publicPath: 'public_path/',
            postTransformPublicPath: (p) => `__webpack_public_path__ + ${p}`,
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const [module] = stats.toJson().modules;
      const { assets, source } = module;

      expect({ assets, source }).toMatchSnapshot();
    });
  });

  describe('`{Function}` value', () => {
    it('matches snapshot for returned input parameter value without modification', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            publicPath(url) {
              return `public_path/${url}`;
            },
            postTransformPublicPath: (p) => p,
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const [module] = stats.toJson().modules;
      const { assets, source } = module;

      expect({ assets, source }).toMatchSnapshot();
    });

    it('matches snapshot for appending to input parameter value', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            publicPath(url) {
              return `public_path/${url}`;
            },
            postTransformPublicPath: (p) => `${p} + "?test=test"`,
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const [module] = stats.toJson().modules;
      const { assets, source } = module;

      expect({ assets, source }).toMatchSnapshot();
    });

    it('matches snapshot for prefixing with string', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            publicPath: 'public_path/',
            postTransformPublicPath: (p) => `"path_prefix/" + ${p}`,
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const [module] = stats.toJson().modules;
      const { assets, source } = module;

      expect({ assets, source }).toMatchSnapshot();
    });

    it('matches snapshot for prefixing with __webpack_public_path__', async () => {
      const config = {
        loader: {
          test: /(png|jpg|svg)/,
          options: {
            publicPath: 'public_path/',
            postTransformPublicPath: (p) => `__webpack_public_path__ + ${p}`,
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
