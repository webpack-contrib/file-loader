import path from 'path';

import webpack from './helpers/compiler';

describe('pitch output path', () => {
  it('value should be the same as the eventual location its written to', async () => {
    const config = {
      rules: [
        {
          test: /\.(js)$/i,
          use: [
            {
              loader: path.resolve(__dirname, '../src/cjs'),
            },
            {
              loader: path.resolve(
                __dirname,
                './helpers/pitch-outputPath-loader'
              ),
            },
          ],
        },
      ],
    };

    const stats = await webpack('fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets } = module;
    const filePath = path.resolve(__dirname, stats.outputFolder, assets[0]);
    const content = stats.usedFileSystem.readFileSync(filePath).toString();

    expect(content).toEqual('[hash].js');
  });

  it('should handle [path][name].[ext] correctly when using nested folders', async () => {
    const config = {
      rules: [
        {
          test: /\.(js)$/i,
          use: [
            {
              loader: path.resolve(__dirname, '../src/cjs'),
              options: {
                name: '[path][name].[ext]',
              },
            },
            {
              loader: path.resolve(
                __dirname,
                './helpers/pitch-outputPath-loader'
              ),
            },
          ],
        },
      ],
    };

    const stats = await webpack('nested/fixture.js', config);
    const [module] = stats.toJson().modules;
    const { assets } = module;
    const filePath = path.resolve(__dirname, stats.outputFolder, assets[0]);
    const content = stats.usedFileSystem.readFileSync(filePath).toString();

    expect(content).toEqual('nested/fixture.js');
  });
});
