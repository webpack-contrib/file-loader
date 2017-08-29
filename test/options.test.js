import webpack from 'webpack';

describe('this.options', () => {
  it('should fail without options', (done) => {
    const compiler = webpack({
      entry: [
        require.resolve('../src'),
        `${__dirname}/fixture/entry.txt`,
      ].join('!'),
      output: { path: `${__dirname}/output` },
      plugins: [
        new webpack.LoaderOptionsPlugin({ options: undefined }),
      ],
    });

    compiler.run((err, stats) => {
      if (stats.hasErrors()) {
        throw new Error(stats.toString());
      }
      done();
    });
  });
});
