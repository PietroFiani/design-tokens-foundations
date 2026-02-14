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

// Register custom transform for typography composite objects
StyleDictionary.registerTransform({
  name: 'dtcg/typography/css',
  type: 'value',
  transitive: true,
  filter: (token) => token.$type === 'typography',
  transform: (token, config) => {
    if (typeof token.$value === 'object') {
      const { fontWeight, fontSize, lineHeight, fontFamily } = token.$value;
      // Resolve references
      const resolveRef = (val) => {
        if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
          const path = val.slice(1, -1).split('.');
          let resolved = config.tokens;
          for (const key of path) {
            resolved = resolved?.[key];
          }
          return resolved?.$value || val;
        }
        return val;
      };

      const weight = resolveRef(fontWeight);
      const size = resolveRef(fontSize);
      const height = resolveRef(lineHeight);
      const family = resolveRef(fontFamily);

      // Convert dimension objects to strings
      const sizeStr = typeof size === 'object' && size.value ? `${size.value}${size.unit}` : size;
      const familyStr = Array.isArray(family) ? family.join(', ') : family;

      // CSS font shorthand: font-weight font-size/line-height font-family
      return `${weight} ${sizeStr}/${height} ${familyStr}`;
    }
    return token.$value;
  }
});

// Register custom transform for shadow objects
StyleDictionary.registerTransform({
  name: 'dtcg/shadow/css',
  type: 'value',
  transitive: true,
  filter: (token) => token.$type === 'shadow',
  transform: (token, config) => {
    if (typeof token.$value === 'object') {
      const { offsetX, offsetY, blur, spread, color, alpha } = token.$value;

      // Resolve color reference if needed
      const resolveRef = (val) => {
        if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
          const path = val.slice(1, -1).split('.');
          let resolved = config.tokens;
          for (const key of path) {
            resolved = resolved?.[key];
          }
          return resolved?.$value || val;
        }
        return val;
      };

      const resolvedColor = resolveRef(color);
      const hexColor = typeof resolvedColor === 'object' && resolvedColor.hex ? resolvedColor.hex : resolvedColor;

      // Convert hex to rgba with alpha
      const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };

      const colorWithAlpha = hexToRgba(hexColor, alpha);

      // CSS box-shadow: offsetX offsetY blur spread color
      return `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithAlpha}`;
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
      transforms: ['name/kebab', 'dtcg/color/hex', 'dtcg/dimension/px', 'dtcg/typography/css', 'dtcg/shadow/css'],
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

// Build tokens
await sd.buildAllPlatforms();
console.log('✅ Tokens built successfully!');
