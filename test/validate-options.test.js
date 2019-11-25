import { getCompiler, compile } from './helpers';

describe('validate options', () => {
  const tests = {
    name: {
      success: ['[path][name].[ext]', () => '[path][name].[ext]'],
      failure: [true],
    },
    outputPath: {
      success: ['assets', () => 'assets'],
      failure: [true],
    },
    publicPath: {
      success: ['assets', () => 'assets'],
      failure: [true],
    },
    context: {
      success: ['assets'],
      failure: [true],
    },
    emitFile: {
      success: [true, false],
      failure: ['true'],
    },
    regExp: {
      success: [/image\.png/, 'image.png'],
      failure: [true],
    },
    esModule: {
      success: [true, false],
      failure: ['true'],
    },
    unknown: {
      success: [1, true, false, 'test', /test/, [], {}, { foo: 'bar' }],
      failure: [],
    },
  };

  function stringifyValue(value) {
    if (
      Array.isArray(value) ||
      (value && typeof value === 'object' && value.constructor === Object)
    ) {
      return JSON.stringify(value);
    }

    return value;
  }

  async function createTestCase(key, value, type) {
    it(`should ${
      type === 'success' ? 'successfully validate' : 'throw an error on'
    } the "${key}" option with "${stringifyValue(value)}" value`, async () => {
      const compiler = getCompiler('simple.js', { [key]: value });

      let stats;

      try {
        stats = await compile(compiler);
      } finally {
        if (type === 'success') {
          expect(stats.hasErrors()).toBe(false);
        } else if (type === 'failure') {
          const {
            compilation: { errors },
          } = stats;

          expect(errors).toHaveLength(1);
          expect(() => {
            throw new Error(errors[0].error.message);
          }).toThrowErrorMatchingSnapshot();
        }
      }
    });
  }

  for (const [key, values] of Object.entries(tests)) {
    for (const type of Object.keys(values)) {
      for (const value of values[type]) {
        createTestCase(key, value, type);
      }
    }
  }
});
