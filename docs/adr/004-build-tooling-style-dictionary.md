# ADR 004: Build Tooling - Style Dictionary
**Date:** 13/12/2025
**Status:** Proposed

## Summary

This ADR evaluates build tooling options for transforming design tokens into platform-specific outputs. After comparing 6 alternatives (Style Dictionary, Theo, Cobalt UI, custom scripts, Token Transformer, and Supernova), we recommend **Style Dictionary** as our token build system. It provides proven multi-platform support, DTCG 2025.10 compliance, extensive transformation capabilities, and active community support—all while being free and open source.

**Key Decision**: Adopt Style Dictionary v4.0+ for automated token transformation, enabling px→rem conversions, multi-theme generation, and platform-specific outputs (CSS, Swift, XML) from a single source of truth.

## Context and Problem

Our design token system (defined in ADR 001, 002, and 003) requires a build process to:
- Transform primitive token formats (HEX colors, px dimensions) to platform-specific formats (rem, pt, dp)
- Generate platform-specific output files (CSS variables, iOS Swift, Android XML)
- Manage theme variations (light, dark, high-contrast)
- Handle token references and resolve aliases
- Validate token structure and format compliance
- Support multiple platforms (Web, iOS, Android) from a single source of truth

Without a robust build tool, teams must:
- Manually convert tokens for each platform
- Write custom transformation scripts
- Risk inconsistencies between platforms
- Spend significant time on token maintenance
- Struggle with theme management
- Have difficulty enforcing token standards

We need to decide: **Should we use Style Dictionary as our token build tool, or explore alternatives?**

## Decision Criteria

- **W3C DTCG 2025.10 compliance**: Support for latest design token specification
- **Platform support**: Generate outputs for Web (CSS), iOS (Swift), Android (Kotlin/XML)
- **Transformation capabilities**: Convert units (px→rem), formats (HEX→RGB), and handle references
- **Theme management**: Support multiple themes (light/dark) from single source
- **Extensibility**: Allow custom transforms and formats
- **Maintenance**: Active development, community support, documentation quality
- **Learning curve**: Ease of setup and configuration
- **Performance**: Build speed for large token sets
- **Integration**: Works with existing toolchain (npm, git, CI/CD)
- **Cost**: Open source vs. commercial licensing

## Alternatives Considered

### Option 1: Style Dictionary ✅ **RECOMMENDED**

**What it is**: Open-source build system for design tokens created by Amazon, now maintained by the community. Transforms design tokens into platform-specific formats.

**Website**: [https://styledictionary.com/](https://styledictionary.com/)

**Key Features**:
- Multi-platform output (CSS, SCSS, iOS, Android, React Native, Flutter, etc.)
- Custom transforms and formats
- Token references/aliases
- Theme management
- DTCG specification support (as of v4.0)
- Extensive community and plugins
- Configuration-based (JavaScript/JSON)

**Example Configuration**:
```javascript
// style-dictionary.config.js
module.exports = {
  source: [
    'tokens/primitive.json',
    'tokens/platforms/web/themes/light.json'
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables'
      }]
    },
    ios: {
      transformGroup: 'ios',
      buildPath: 'build/ios/',
      files: [{
        destination: 'Tokens.swift',
        format: 'ios-swift/class.swift',
        className: 'Tokens'
      }]
    },
    android: {
      transformGroup: 'android',
      buildPath: 'build/android/',
      files: [{
        destination: 'tokens.xml',
        format: 'android/resources'
      }]
    }
  }
};
```

**Pros**:
- ✅ **Mature and proven**: Used by Amazon, Microsoft, Adobe, and many others
- ✅ **Multi-platform**: Native support for Web, iOS, Android, React Native, Flutter
- ✅ **DTCG compliant**: Version 4.0+ supports W3C specification
- ✅ **Extensive transforms**: Built-in transforms for colors, dimensions, typography
- ✅ **Theme support**: Easy to build multiple themes from same source
- ✅ **Extensible**: Plugin system for custom transforms and formats
- ✅ **Well documented**: Comprehensive documentation and examples
- ✅ **Active community**: Large user base, regular updates
- ✅ **Free and open source**: MIT license
- ✅ **npm integration**: Easy to integrate into JavaScript/Node workflows
- ✅ **Custom formats**: Can create custom output formats as needed
- ✅ **Token references**: Handles `{token.reference}` syntax natively

**Cons**:
- ⚠️ **JavaScript/Node dependency**: Requires Node.js runtime
- ⚠️ **Configuration complexity**: Complex projects need extensive configuration
- ⚠️ **Learning curve**: Takes time to understand transform system
- ⚠️ **Performance**: Can be slow with very large token sets (10,000+ tokens)
- ⚠️ **DTCG adoption**: v4.0 is relatively new, some features still evolving

**Fit with our ADRs**:
- **ADR 001 (Taxonomy)**: ✅ Supports our hybrid file/path structure perfectly
- **ADR 002 (Variants)**: ✅ Can handle all variant types and brand color mapping
- **ADR 003 (Type Values)**: ✅ Native transforms for px→rem, HEX→RGB, etc.

**Cost**: Free (MIT license)

---

### Option 2: Theo (Salesforce)

**What it is**: Design token tooling from Salesforce, used in their Lightning Design System.

**Website**: [https://github.com/salesforce-ux/theo](https://github.com/salesforce-ux/theo)

**Key Features**:
- Multi-platform output
- Transform system
- Theme support
- Command-line and programmatic API

**Pros**:
- ✅ Proven at scale (Salesforce Lightning)
- ✅ Multi-platform support
- ✅ Good documentation
- ✅ Free and open source

**Cons**:
- ❌ **Less actively maintained**: Fewer updates than Style Dictionary
- ❌ **Smaller community**: Less community support and fewer examples
- ❌ **Limited DTCG support**: Not fully aligned with latest specification
- ❌ **Opinionated format**: Expects specific token structure
- ❌ **Less extensible**: Harder to customize than Style Dictionary

**Cost**: Free (BSD-3-Clause license)

---

### Option 3: Cobalt UI (formerly Tokens Studio)

**What it is**: Token transformation and build tool with focus on Figma integration.

**Website**: [https://cobalt-ui.pages.dev/](https://cobalt-ui.pages.dev/)

**Key Features**:
- DTCG specification support
- Figma tokens integration
- TypeScript-first
- Plugin system

**Pros**:
- ✅ **Modern**: Built for DTCG specification from the ground up
- ✅ **TypeScript support**: First-class TypeScript integration
- ✅ **Figma integration**: Works well with Tokens Studio plugin
- ✅ **DTCG compliant**: Native support for W3C specification

**Cons**:
- ⚠️ **Newer tool**: Less proven than Style Dictionary
- ⚠️ **Smaller ecosystem**: Fewer plugins and community resources
- ⚠️ **Limited platform support**: Primarily focused on web
- ⚠️ **Less documentation**: Still building out comprehensive docs
- ⚠️ **Uncertain longevity**: Smaller project, less certain future

**Cost**: Free (MIT license)

---

### Option 4: Custom Build Scripts

**What it is**: Write our own transformation scripts using Node.js, Python, or other languages.

**Pros**:
- ✅ **Full control**: Complete customization of build process
- ✅ **No dependencies**: No third-party tool dependencies
- ✅ **Lightweight**: Only build what we need
- ✅ **Custom logic**: Can implement any transformation logic

**Cons**:
- ❌ **High maintenance burden**: Must maintain all code ourselves
- ❌ **Reinventing the wheel**: Re-implementing common transforms
- ❌ **Time investment**: Significant development time required
- ❌ **Testing overhead**: Must test all transforms thoroughly
- ❌ **Limited platform support**: Must implement each platform output
- ❌ **No community**: Can't leverage community solutions
- ❌ **Documentation**: Must document custom build system
- ❌ **Bus factor**: Knowledge concentrated in few developers

**Cost**: Free but high time investment

---

### Option 5: Token Transformer (Figma Plugin)

**What it is**: Figma plugin for exporting tokens with some transformation capabilities.

**Website**: [https://github.com/tokens-studio/figma-plugin](https://github.com/tokens-studio/figma-plugin)

**Pros**:
- ✅ Direct Figma integration
- ✅ Visual token management
- ✅ DTCG format support

**Cons**:
- ❌ **Limited transformation**: Basic transforms only
- ❌ **Figma dependency**: Requires Figma for token management
- ❌ **Not a build tool**: Lacks comprehensive build pipeline
- ❌ **Platform limitations**: Limited platform output options
- ❌ **Manual process**: Requires manual export workflow

**Cost**: Free but limited without Tokens Studio Pro

---

### Option 6: Supernova

**What it is**: Commercial design system platform with token management and export.

**Website**: [https://www.supernova.io/](https://www.supernova.io/)

**Pros**:
- ✅ **Comprehensive platform**: Full design system management
- ✅ **Multi-platform**: Supports many output formats
- ✅ **Visual interface**: GUI for token management
- ✅ **Documentation integration**: Built-in docs generation

**Cons**:
- ❌ **Commercial**: Requires paid subscription
- ❌ **Vendor lock-in**: Proprietary platform
- ❌ **Overkill**: More than we need for just tokens
- ❌ **Learning curve**: Complex platform to learn
- ❌ **Cost**: Expensive for small/medium teams

**Cost**: Commercial (starts at $299/month)

---

## Comparison Matrix

| Tool | DTCG Support | Multi-Platform | Active Dev | Community | Extensibility | Cost | Maintenance |
|------|--------------|----------------|------------|-----------|---------------|------|-------------|
| **Style Dictionary** ✅ | ✅ Excellent (v4.0+) | ✅ Excellent | ✅ Very Active | ✅ Large | ✅ Excellent | Free | Low |
| **Theo** | ⚠️ Partial | ✅ Good | ⚠️ Moderate | ⚠️ Small | ⚠️ Limited | Free | Medium |
| **Cobalt UI** | ✅ Excellent | ⚠️ Web-focused | ✅ Active | ⚠️ Growing | ✅ Good | Free | Low |
| **Custom Scripts** | ✅ Full control | ⚠️ DIY | N/A | N/A | ✅ Full | Free | High |
| **Token Transformer** | ✅ Good | ⚠️ Limited | ✅ Active | ⚠️ Small | ❌ Limited | Free | Low |
| **Supernova** | ✅ Good | ✅ Excellent | ✅ Active | ⚠️ Commercial | ⚠️ Limited | $$$ | Low |

---

## Decision

**Selected: Style Dictionary (Option 1)**

We will adopt **Style Dictionary** as our design token build tool.

### Rationale

1. **Proven at scale**: Used by major companies (Amazon, Microsoft, Adobe) in production for years
2. **DTCG compliance**: Version 4.0+ provides excellent W3C Design Tokens specification support
3. **Perfect fit with our taxonomy**:
   - Supports our hybrid file structure (ADR 001)
   - Handles all our variant types (ADR 002)
   - Native transforms for all our type values (ADR 003)
4. **Multi-platform support**: Native output for all our target platforms (Web, iOS, Android)
5. **Extensibility**: Plugin system allows custom transforms and formats as needs evolve
6. **Active community**: Large community means better support and more examples
7. **Free and open source**: No licensing costs
8. **Future-proof**: Active development ensures compatibility with evolving standards

### Implementation Approach

#### 1. Installation

```bash
npm install --save-dev style-dictionary@4.0.0
```

#### 2. Configuration Structure

```
tokens/
├── primitive.json                          # Shared primitives
├── platforms/
│   ├── web/
│   │   ├── primitive-overrides.json       # Web-specific primitives (if needed)
│   │   └── themes/
│   │       ├── light.json                 # Light theme semantics
│   │       └── dark.json                  # Dark theme semantics
│   ├── ios/
│   │   └── themes/
│   │       ├── light.json
│   │       └── dark.json
│   └── android/
│       └── themes/
│           ├── light.json
│           └── dark.json
│
style-dictionary/
├── config/
│   ├── web-light.js                       # Web light theme config
│   ├── web-dark.js                        # Web dark theme config
│   ├── ios-light.js                       # iOS light theme config
│   └── android-light.js                   # Android light theme config
├── transforms/                            # Custom transforms
│   └── px-to-rem.js
└── formats/                               # Custom formats
    └── css-custom-properties.js
```

#### 3. Example Configuration (Web Light Theme)

```javascript
// style-dictionary/config/web-light.js
module.exports = {
  source: [
    'tokens/primitive.json',
    'tokens/platforms/web/primitive-overrides.json', // optional
    'tokens/platforms/web/themes/light.json'
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      transforms: [
        'attribute/cti',
        'name/cti/kebab',
        'time/seconds',
        'content/icon',
        'size/rem',
        'color/css'
      ],
      buildPath: 'build/css/',
      files: [
        {
          destination: 'tokens-light.css',
          format: 'css/variables',
          options: {
            outputReferences: true
          }
        },
        {
          destination: 'tokens-light.json',
          format: 'json/nested'
        }
      ]
    }
  }
};
```

#### 4. Custom Transform Example (px to rem)

```javascript
// style-dictionary/transforms/px-to-rem.js
module.exports = {
  name: 'size/rem',
  type: 'value',
  matcher: (token) => {
    return token.type === 'dimension' && token.value.endsWith('px');
  },
  transformer: (token) => {
    const baseFont = 16;
    const value = parseFloat(token.value);
    return `${value / baseFont}rem`;
  }
};
```

#### 5. Build Script

```json
// package.json
{
  "scripts": {
    "tokens:build": "npm run tokens:web && npm run tokens:ios && npm run tokens:android",
    "tokens:web": "style-dictionary build --config style-dictionary/config/web-light.js && style-dictionary build --config style-dictionary/config/web-dark.js",
    "tokens:ios": "style-dictionary build --config style-dictionary/config/ios-light.js && style-dictionary build --config style-dictionary/config/ios-dark.js",
    "tokens:android": "style-dictionary build --config style-dictionary/config/android-light.js"
  }
}
```

#### 6. Expected Output (Web CSS)

```css
/* build/css/tokens-light.css */
:root {
  /* Primitives */
  --primitive-color-blue-500: #3b82f6;
  --primitive-spacing-md: 1rem; /* transformed from 16px */

  /* Semantics */
  --semantic-color-text-base-default: var(--primitive-color-gray-900);
  --semantic-color-background-brand-default: var(--primitive-color-primary-600);
  --semantic-spacing-inset-md: var(--primitive-spacing-md);
}
```

### Migration Path

1. **Phase 1: Setup** (Week 1)
   - Install Style Dictionary
   - Create basic configuration for web/light theme
   - Test build output

2. **Phase 2: Core Transforms** (Week 2)
   - Implement px→rem transform
   - Implement color format transforms
   - Configure all platforms

3. **Phase 3: Theme Support** (Week 3)
   - Add dark theme configuration
   - Test theme switching
   - Validate consistency

4. **Phase 4: Platform Outputs** (Week 4)
   - Generate iOS Swift files
   - Generate Android XML resources
   - Validate platform-specific outputs

5. **Phase 5: CI/CD Integration** (Week 5)
   - Add build step to CI pipeline
   - Automate token validation
   - Setup automated releases

---

## Consequences

### Positive

- ✅ **Reduced manual work**: Automated transformation eliminates manual token conversion
- ✅ **Consistency**: Same source generates all platform outputs, ensuring consistency
- ✅ **Scalability**: Handles large token sets (1000+ tokens) efficiently
- ✅ **Theme management**: Easy to generate multiple themes from single source
- ✅ **Platform support**: Native support for Web, iOS, Android out of the box
- ✅ **Extensibility**: Can add custom transforms and formats as needed
- ✅ **Community support**: Large community provides examples and help
- ✅ **DTCG compliance**: Aligns with W3C specification
- ✅ **No cost**: Open source, no licensing fees
- ✅ **Future-proof**: Active development ensures long-term viability

### Negative

- ⚠️ **Node.js dependency**: Requires Node.js in build environment
- ⚠️ **Learning curve**: Team needs to learn Style Dictionary configuration
- ⚠️ **Build step added**: Adds complexity to build process
- ⚠️ **Configuration maintenance**: Must maintain configuration files
- ⚠️ **Initial setup time**: Takes time to configure initially

### Risks

- **Breaking changes**: Style Dictionary updates could introduce breaking changes
- **Performance**: Very large token sets (10,000+) might have slow build times
- **Custom needs**: May need custom transforms for unique requirements
- **Team knowledge**: Knowledge concentrated in team members who set it up

### Mitigation

1. **Version locking**: Pin Style Dictionary version, upgrade deliberately
2. **Documentation**: Document our configuration and custom transforms
3. **Testing**: Validate outputs in CI pipeline
4. **Training**: Train team on Style Dictionary basics
5. **Monitoring**: Monitor build performance as token set grows
6. **Backup plan**: Document how to migrate to different tool if needed (though unlikely)

---

## Validation

After implementation, we will validate:

- [ ] All primitive tokens transform correctly (px→rem, HEX→RGB)
- [ ] Token references resolve properly
- [ ] All platforms generate expected output (CSS, Swift, XML)
- [ ] Light and dark themes build successfully
- [ ] Build time is acceptable (<10 seconds for current token set)
- [ ] CI/CD integration works smoothly
- [ ] Team understands how to add new tokens and rebuild

---

## References

- [Style Dictionary Documentation](https://styledictionary.com/)
- [Style Dictionary GitHub](https://github.com/amzn/style-dictionary)
- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [Design Tokens Format Specification (DTCG 2025.10)](https://www.designtokens.org/TR/drafts/format/)
- [Theo (Salesforce)](https://github.com/salesforce-ux/theo)
- [Cobalt UI](https://cobalt-ui.pages.dev/)
- ADR 001: Token Taxonomy
- ADR 002: Taxon Variants
- ADR 003: Type Values

---

## Appendix: Alternative Tools Considered

For historical context and future reference, we evaluated but did not select:

- **Theo**: Less actively maintained, limited DTCG support
- **Cobalt UI**: Too new, smaller ecosystem, web-focused
- **Custom Scripts**: Too much maintenance burden
- **Token Transformer**: Not a full build tool
- **Supernova**: Commercial, overkill for our needs

If Style Dictionary ever becomes unsuitable, we would re-evaluate these options.
