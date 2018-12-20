import webpack from './helpers/compiler';

describe('loader', () => {
  it('should works without options', async () => {
    const config = {
      loader: {
        test: /(png|jpg|svg)/,
        options: {},
      },
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { source } = module;

    expect(source).toMatchSnapshot();
  });

  it('should works with `url-loader` when limit is less', async () => {
    const config = {
      rules: [
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1,
              },
            },
          ],
        },
      ],
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { source } = module;

    expect(source).toMatchSnapshot();
  });

  it('should works with `url-loader` when limit is more', async () => {
    const config = {
      rules: [
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },
      ],
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { source } = module;

    expect(source).toMatchSnapshot();
  });
});
