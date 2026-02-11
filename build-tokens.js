import StyleDictionary from 'style-dictionary';

// Register custom transform for color HSL objects
StyleDictionary.registerTransform({
  name: 'dtcg/color/hex',
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
});

// Register custom transform for dimension objects
StyleDictionary.registerTransform({
  name: 'dtcg/dimension/px',
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
});

// Create Style Dictionary instance
const sd = new StyleDictionary({
  source: ['tokens/**/*.json'],
  preprocessors: ['dtcg'],
  platforms: {
    css: {
      buildPath: 'build/css/',
      transforms: ['name/kebab', 'dtcg/color/hex', 'dtcg/dimension/px'],
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true
          }
        }
      ]
    }
  }
});

// Build tokens
await sd.buildAllPlatforms();
console.log('✅ Tokens built successfully!');
