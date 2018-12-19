import webpack from './helpers/compiler';

describe('when applied with `emitFile` option', () => {
  it('matches snapshot for `true` (`{Boolean}`) (default)', async () => {
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

  it('matches snapshot for `false` value  (`{Boolean}`)', async () => {
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

    // eslint-disable-next-line no-undefined
    expect(assets[0]).toBe(undefined);
  });
});
