import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: ['tokens/**/*.json'],
  preprocessors: ['dtcg'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      transforms: ['name/kebab', 'dtcg/color/hex', 'dtcg/dimension/pixelToRem'],
      files: [
        {
          destination: 'primitive.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('primitive.json'),
          options: {
            outputReferences: false
          }
        },
        {
          destination: 'semantic.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('semantic.json'),
          options: {
            outputReferences: true
          }
        }
      ]
    }
  }
});

export default sd.extend({
  transform: {
    'dtcg/color/hex': {
      type: 'value',
      transitive: true,
      filter: (token) => token.$type === 'color',
      transform: (token) => {
        // Handle HSL object with hex property
        if (typeof token.$value === 'object' && token.$value.hex) {
          return token.$value.hex;
        }
        return token.$value;
      }
    },
    'dtcg/dimension/pixelToRem': {
      type: 'value',
      transitive: true,
      filter: (token) => token.$type === 'dimension',
      transform: (token) => {
        // Handle dimension object with value and unit
        if (typeof token.$value === 'object' && token.$value.value !== undefined) {
          return `${token.$value.value}${token.$value.unit}`;
        }
        return token.$value;
      }
    }
  }
});