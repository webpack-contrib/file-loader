import path from 'path';

export default (asset, compiler, stats) => {
  const usedFs = compiler.outputFileSystem;
  const outputPath = stats.compilation.outputOptions.path;
  let data = '';

  try {
    data = usedFs.readFileSync(path.join(outputPath, asset)).toString();
  } catch (error) {
    data = error.toString();
  }

  return data;
};
