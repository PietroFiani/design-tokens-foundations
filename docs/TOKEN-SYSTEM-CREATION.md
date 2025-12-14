# Token System Architecture

This guide outlines how to architect and organize a design token system, including file structure, layer organization, theme management, and platform configuration.

---

## Referenced ADRs

- **[ADR 001: Token Taxonomy](adr/001-token-taxonomy.md)** - Hierarchical structure, file organization, system/theme/platform management
- **[ADR 002: Taxon Variants](adr/002-taxon-variants.md)** - Allowed values for taxonomy levels
- **[ADR 003: Type Values](adr/003-type-values.md)** - Token formats, units, platform transforms
- **[ADR 004: Build Tooling](adr/004-build-tooling-style-dictionary.md)** - Style Dictionary build system

---

## Table of Contents

- [Before You Start: Architecture Questions](#before-you-start-architecture-questions)
- [System Architecture Overview](#system-architecture-overview)
- [File Organization](#file-organization)
- [Layer Architecture](#layer-architecture)
- [Theme Management](#theme-management)
- [Platform Configuration](#platform-configuration)
- [System Creation Process](#system-creation-process)
- [Examples](#examples)

---

## Before You Start: Architecture Questions

**IMPORTANT**: Answer these questions BEFORE creating any files or folders. Your answers determine the entire system structure.

### 1. How many platforms do you need to support?

- [ ] **One platform** → No `platforms/` folder
- [ ] **Multiple platforms** → Use `platforms/{web,ios,android}/`

---

### 2. How many brand colors do you have?

- [ ] **1 brand color** (Primary only)
- [ ] **2 brand colors** (Primary + Secondary)
- [ ] **3+ brand colors** (Primary + Secondary + Tertiary)

**Provide HEX values**: (e.g., Primary: #0A1128, Secondary: #00F5AB, Tertiary: #3B5DCE)

---

### 3. How many themes do you need?

- [ ] **One theme** → No `themes/` folder
- [ ] **Two themes** (Light + Dark) → Use `themes/` folder
- [ ] **Three+ themes** → Use `themes/` folder with named files

---

### 4. How many heading levels do you need?

- [ ] **2 levels** (H1, H2)
- [ ] **3 levels** (H1, H2, H3)
- [ ] **4 levels** (H1, H2, H3, H4)
- [ ] **6 levels** (H1-H6)

---

### 5. Do you need WCAG AAA compliance?

- [ ] **No** (WCAG AA - 4.5:1)
- [ ] **Yes** (WCAG AAA - 7:1) → Add contrast variants

---

### 6. Do platforms need different values?

- [ ] **No** → Single `primitive.json`
- [ ] **Yes** → Add `primitive-overrides.json` per platform

---

### 7. What is your baseline spacing unit?

- [ ] **4px**
- [ ] **8px** (most common)
- [ ] **16px**

---

### 8. How many body text sizes?

- [ ] **1 size** (md only)
- [ ] **2 sizes** (sm, md)
- [ ] **3 sizes** (sm, md, lg)

---

**Next**: Based on your answers, proceed to [System Creation Process](#system-creation-process) to create the appropriate structure.

---

## System Architecture Overview

The token system follows a **two-layer architecture** as defined in ADR 001:

**Layer 1: Primitives**
- Raw absolute values (HEX, px, numeric)
- Platform-agnostic, no contextual meaning
- Single source of truth

**Layer 2: Semantics**
- References to primitives via `{primitive.*}`
- Contextual meaning (purpose, not appearance)
- Theme-specific, platform-specific variations

**Key Architectural Decisions** (ADR 001):
- **Hybrid approach**: Layer identifier in paths, platform/theme via folders
- **Maximum depth**: 5-level nesting
- **Token format**: `{layer}.{type}.{category}.{scale}.{state?}`

---

## File Organization

### Directory Structure

Per **ADR 001**, the structure adapts based on your requirements:

**Full Structure** (Multi-platform, Multi-theme):
```
tokens/
├── primitive.json
└── platforms/
    ├── web/
    │   ├── themes/
    │   │   ├── light.json
    │   │   └── dark.json
    │   └── primitive-overrides.json # Optional
    ├── ios/
    │   └── themes/
    │       ├── light.json
    │       └── dark.json
    └── android/
        └── themes/
            ├── light.json
            └── dark.json
```

**Single Platform, Multi-theme** (e.g., Web only with light/dark):
```
tokens/
├── primitive.json
└── platforms/
    └── web/
        └── themes/
            ├── light.json
            └── dark.json
```

**Single Platform, Single Theme** (Simplest):
```
tokens/
├── primitive.json
└── semantic.json      # No platforms or themes folders needed
```

**Conditional Rules**:
- **One platform only**: Skip `platforms/` folder, place semantic file at root
- **One theme only**: Skip `themes/` folder, place semantic file directly in platform folder
- **Multiple themes**: Use `themes/` folder with named files (light.json, dark.json)
- **Multiple platforms**: Use `platforms/` folder with platform subfolders

**Why This Structure?** (ADR 001):
- ✅ Layer explicit via `primitive.*` and `semantic.*` prefixes
- ✅ Theme via folders: Easy to add/remove without touching token names
- ✅ Platform via folders: Clear separation for platform builds
- ✅ Simplified structure for simple projects
- ✅ Tool compatibility: Works with Style Dictionary, Figma Tokens, Tokens Studio

---

### File Naming Conventions

**Primitive File**: `primitive.json`
- Always at root of tokens directory
- Single file for all platform-agnostic primitives
- Never duplicated across platforms

**Semantic Theme Files**: `{theme-name}.json`
- Named after theme (light, dark, high-contrast)
- Located in `platforms/{platform}/themes/`
- Contains only semantic tokens for that theme

**Platform Override Files** (Optional): `primitive-overrides.json`
- Platform-specific primitive adjustments
- Use sparingly - most primitives should be shared
- Example: iOS-specific fonts, Android-specific spacing

---

## Layer Architecture

### Primitive Layer

**Purpose**: Define raw, absolute values as building blocks.

**Characteristics** (ADR 001, 003):
- Absolute values only (HEX, px, numeric)
- No token references
- Platform-agnostic formats
- Scale-based organization (50-950, xs-xl)

**File**: `tokens/primitive.json`

**Structure**:
```json
{
  "primitive": {
    "color": {
      "primary": {
        "600": { "$type": "color", "$value": "#2563eb", "$description": "Primary brand at 600 weight." }
      },
      "neutral": {
        "0": { "$value": "#ffffff", "$description": "Pure white." },
        "900": { "$value": "#171717", "$description": "Near-black." }
      }
    },
    "dimension": {
      "spacing": {
        "4": { "$value": "16px", "$description": "Base unit (16px)." }
      }
    },
    "fontFamily": {
      "sans": { "$value": ["Inter", "sans-serif"], "$description": "Primary UI font." }
    },
    "fontSize": {
      "md": { "$value": "16px", "$description": "Base size for body text." }
    },
    "fontWeight": {
      "regular": { "$value": 400, "$description": "Regular weight." }
    },
    "lineHeight": {
      "normal": { "$value": 1.5, "$description": "Normal line height." }
    }
  }
}
```

**Required Primitives** (minimum):
- **Colors**: primary, neutral, success, warning, error
- **Dimensions**: spacing (0-32), borderRadius, borderWidth
- **Typography**: fontFamily, fontSize (xs-6xl), fontWeight (100-900), lineHeight
- **Duration**: instant, fast, normal, slow

---

### Semantic Layer

**Purpose**: Define purpose-driven tokens referencing primitives.

**Characteristics** (ADR 001):
- References primitives via `{primitive.*}`
- Theme-specific values (light vs dark)
- Usage-based naming (base, muted, subtle) per ADR 002
- Contextual meaning (background.brand, text.base)

**Files**: `tokens/platforms/{platform}/themes/{theme}.json`

**Structure**:
```json
{
  "semantic": {
    "color": {
      "background": {
        "base": {
          "default": { "$value": "{primitive.color.neutral.0}", "$description": "Default page background." }
        },
        "brand": {
          "default": { "$value": "{primitive.color.primary.600}", "$description": "Brand background for CTAs." }
        }
      },
      "text": {
        "base": {
          "default": { "$value": "{primitive.color.neutral.900}", "$description": "Primary text." }
        }
      }
    },
    "typography": {
      "heading": {
        "h1": {
          "$type": "typography",
          "$value": {
            "fontFamily": "{primitive.fontFamily.sans}",
            "fontSize": "{primitive.fontSize.5xl}",
            "fontWeight": "{primitive.fontWeight.bold}",
            "lineHeight": "{primitive.lineHeight.tight}"
          },
          "$description": "Main page heading (H1). Use once per page."
        }
      }
    }
  }
}
```

**Required Semantics** (minimum):
- **Colors**: background (base, brand), text (base, muted), border (base)
- **Spacing**: padding, gap (sm, md, lg)
- **Border**: radius, width
- **Typography**: heading (h1-h3), body, label

---

## Theme Management

### Single Theme

**When to Use**: Application doesn't need dark mode, simplest architecture for MVPs.

**Structure**:
```
tokens/
├── primitive.json
└── platforms/web/themes/light.json
```

---

### Multi-Theme (Light/Dark)

**When to Use** (Most Common): Modern applications with theme switching, OS-level theme integration.

**Structure**:
```
tokens/
├── primitive.json
└── platforms/web/themes/
    ├── light.json
    └── dark.json
```

**Architecture Strategy**:
- Same primitives for both themes
- Inverted semantics: Light uses neutral.0→900, dark uses neutral.950→50
- Different brand shades: Light uses primary.600, dark uses primary.500 (lighter for contrast)

**Inversion Pattern** (ADR 002):

| Semantic Token | Light Theme | Dark Theme |
|----------------|-------------|------------|
| background.base | neutral.0 | neutral.950 |
| background.muted | neutral.50 | neutral.900 |
| text.base | neutral.900 | neutral.50 |
| text.muted | neutral.600 | neutral.400 |
| brand.default | primary.600 | primary.500 |

---

### High-Contrast Themes

**When to Use**: WCAG AAA compliance required (government/healthcare), accessibility mode for vision-impaired users.

**Structure**:
```
tokens/
├── primitive.json
└── platforms/web/themes/
    ├── light.json
    ├── dark.json
    └── high-contrast.json
```

**Architecture Strategy**:
- Use extreme ends of scales (neutral.0, neutral.1000)
- Ensure 7:1 contrast ratios (WCAG AAA)
- Avoid mid-tones that reduce contrast

---

## Platform Configuration

### Web Platform

**Directory**: `tokens/platforms/web/`

**Output Formats** (ADR 004): CSS custom properties, SCSS variables, JavaScript/TypeScript objects

**Transforms** (ADR 003):
- `px` → `rem` (÷16)
- HEX → HEX (no transform)
- Composite tokens → Expanded CSS properties

**Style Dictionary Config**:
```javascript
// style-dictionary.config.js
module.exports = {
  source: ['tokens/primitive.json', 'tokens/platforms/web/themes/light.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{ destination: 'tokens-light.css', format: 'css/variables' }],
      transforms: ['name/cti/kebab', 'size/px-to-rem', 'color/hex']
    }
  }
};
```

**Generated Output**:
```css
:root {
  --primitive-color-primary-600: #2563eb;
  --semantic-color-background-base-default: #ffffff;
  --semantic-spacing-padding-md: 1rem; /* 16px → 1rem */
}
```

---

### iOS Platform

**Directory**: `tokens/platforms/ios/`

**Output Formats** (ADR 004): Swift code (UIColor, CGFloat), JSON

**Transforms** (ADR 003):
- `px` → `pt` (1:1)
- HEX → UIColor RGB
- Font families → iOS-specific names

**Generated Output**:
```swift
import UIKit
public class Tokens {
    public static let primitiveColorPrimary600 = UIColor(hex: "#2563eb")
    public static let semanticSpacingPaddingMd: CGFloat = 16.0
}
```

---

### Android Platform

**Directory**: `tokens/platforms/android/`

**Output Formats** (ADR 004): XML resources (colors.xml, dimens.xml), Kotlin objects

**Transforms** (ADR 003):
- `px` → `dp` (1:1)
- HEX → Android color format
- Font weights → Android font family references

**Generated Output**:
```xml
<!-- colors.xml -->
<resources>
    <color name="primitive_color_primary_600">#2563eb</color>
</resources>

<!-- dimens.xml -->
<resources>
    <dimen name="semantic_spacing_padding_md">16dp</dimen>
</resources>
```

---

### Multi-Platform Systems

**When to Use**: Design system shared across web, iOS, Android for consistent brand experience.

**Structure**:
```
tokens/
├── primitive.json                    # Shared primitives
└── platforms/
    ├── web/
    │   ├── themes/{light,dark}.json
    │   └── primitive-overrides.json  # Web-specific fonts
    ├── ios/
    │   ├── themes/{light,dark}.json
    │   └── primitive-overrides.json  # iOS-specific fonts (SF Pro)
    └── android/
        ├── themes/{light,dark}.json
        └── primitive-overrides.json  # Android-specific fonts (Roboto)
```

**Build Strategy** (ADR 004):
1. Load shared `primitive.json`
2. Load platform-specific `primitive-overrides.json` (if exists)
3. Load theme file (e.g., `light.json`)
4. Apply platform-specific transforms
5. Generate platform-specific output files

---

## Critical Architecture Questions

Before creating your token system, answer these questions:

### 1. How many themes do you need?

- [ ] Light only
- [ ] Dark only
- [ ] Light + Dark
- [ ] Light + Dark + High-Contrast
- [ ] Custom brand themes

**Impact**: Determines number of theme files per platform.

---

### 2. Which platforms need support?

- [ ] Web only
- [ ] iOS only
- [ ] Android only
- [ ] Web + iOS + Android
- [ ] Design tools (Figma, Sketch)

**Impact**: Determines platform folder structure and build configurations.

---

### 3. Do platforms need different token values?

- [ ] All platforms share identical values
- [ ] Platforms have slight variations (fonts, spacing)
- [ ] Platforms have significant differences

**Impact**: Determines if you need `primitive-overrides.json` files.

---

### 4. How many brand colors?

- [ ] 1 (primary only)
- [ ] 2 (primary + secondary)
- [ ] 3+ (primary + secondary + tertiary)

**Impact**: Determines primitive color scale complexity.

---

### 5. Will themes switch at runtime?

- [ ] Yes - user can toggle themes
- [ ] No - theme set once (per deployment)
- [ ] System preference only (prefers-color-scheme)

**Impact**: Affects build strategy and runtime implementation.

---

## System Creation Process

### Step 1: Determine Architecture

Answer the critical questions above to decide:
1. Number of themes needed
2. Platforms to support
3. Level of platform-specific customization
4. Brand color complexity

### Step 2: Create Directory Structure

Based on your answers from Step 1, create the appropriate structure:

**Single Platform, Single Theme** (Simplest):
```bash
mkdir -p tokens
touch tokens/primitive.json tokens/semantic.json
```

**Single Platform, Multi-Theme** (e.g., Web with light/dark):
```bash
mkdir -p tokens/platforms/web/themes
touch tokens/primitive.json
touch tokens/platforms/web/themes/{light,dark}.json
```

**Multi-Platform, Single Theme**:
```bash
mkdir -p tokens/platforms/{web,ios,android}
touch tokens/primitive.json
touch tokens/platforms/web/semantic.json
touch tokens/platforms/ios/semantic.json
touch tokens/platforms/android/semantic.json
```

**Multi-Platform, Multi-Theme** (Full structure):
```bash
mkdir -p tokens/platforms/{web,ios,android}/themes
touch tokens/primitive.json
touch tokens/platforms/{web,ios,android}/themes/{light,dark}.json
```

**Remember**: Only create the folders and files you actually need based on your requirements.

### Step 3: Create Primitive Tokens

Populate `tokens/primitive.json` with raw values following ADR 003 formats.

**See**: [TOKEN-QUALITY.md](TOKEN-QUALITY.md) for quality standards.

### Step 4: Create Semantic Tokens

For each theme file, create semantic tokens referencing primitives.

- **Light Theme**: Lighter primitives for backgrounds, darker for text
- **Dark Theme**: Invert - darker backgrounds, lighter text

**See**: ADR 002 for semantic variant naming (base, muted, subtle).

### Step 5: Configure Build Tool

Set up Style Dictionary configuration per ADR 004.

**See**: [ADR 004](adr/004-build-tooling-style-dictionary.md) for complete setup.

### Step 6: Generate Platform Outputs

```bash
npx style-dictionary build --config style-dictionary.config.js
```

### Step 7: Validate and Test

- [ ] All tokens have descriptions (TOKEN-QUALITY.md)
- [ ] Naming follows ADR 001 taxonomy
- [ ] Values follow ADR 003 formats
- [ ] Generated files compile without errors
- [ ] Themes display correctly
- [ ] Platform-specific outputs work on target platforms

---

## Examples

### Example 1: Simplest System (Single Platform, Single Theme)

**Requirements**: Web platform, light theme only, 1 brand color

**Structure**:
```
tokens/
├── primitive.json
└── semantic.json      # No platforms/ or themes/ folders
```

**Build Config**:
```javascript
module.exports = {
  source: ['tokens/primitive.json', 'tokens/semantic.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{ destination: 'tokens.css', format: 'css/variables' }]
    }
  }
};
```

**When to use**: MVPs, prototypes, single-platform applications with no theme switching

---

### Example 2: Multi-Theme Web System

**Requirements**: Web platform, light + dark themes, 1 brand color

**Structure**:
```
tokens/
├── primitive.json
└── platforms/web/themes/
    ├── light.json
    └── dark.json
```

**Build Config** (generates 2 CSS files):
```javascript
module.exports = {
  source: ['tokens/primitive.json'],
  platforms: {
    cssLight: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{
        destination: 'tokens-light.css',
        format: 'css/variables',
        filter: (token) => token.filePath.includes('light.json')
      }]
    },
    cssDark: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{
        destination: 'tokens-dark.css',
        format: 'css/variables',
        filter: (token) => token.filePath.includes('dark.json')
      }]
    }
  }
};
```

**Usage**:
```html
<link rel="stylesheet" href="tokens-light.css" id="theme-stylesheet">
<script>
  if (localStorage.theme === 'dark') {
    document.getElementById('theme-stylesheet').href = 'tokens-dark.css';
  }
</script>
```

---

### Example 3: Multi-Platform System

**Requirements**: Web + iOS + Android, light + dark themes, platform-specific fonts

**Structure**:
```
tokens/
├── primitive.json
└── platforms/
    ├── web/themes/{light,dark}.json & primitive-overrides.json
    ├── ios/themes/{light,dark}.json & primitive-overrides.json
    └── android/themes/{light,dark}.json & primitive-overrides.json
```

**Platform-Specific Override Example**:
```json
// tokens/platforms/ios/primitive-overrides.json
{
  "primitive": {
    "fontFamily": {
      "sans": {
        "$value": ["SF Pro", "-apple-system", "sans-serif"],
        "$description": "iOS-specific font stack using SF Pro"
      }
    }
  }
}
```

**Build Config** (simplified - repeat for dark themes):
```javascript
module.exports = {
  source: ['tokens/primitive.json'],
  platforms: {
    webLight: {
      transformGroup: 'css',
      buildPath: 'build/web/',
      files: [{
        destination: 'tokens-light.css',
        format: 'css/variables',
        filter: (token) => token.filePath.includes('web/themes/light')
      }]
    },
    iosLight: {
      transformGroup: 'ios',
      buildPath: 'build/ios/',
      files: [{
        destination: 'TokensLight.swift',
        format: 'ios-swift/class.swift',
        filter: (token) => token.filePath.includes('ios/themes/light')
      }]
    },
    androidLight: {
      transformGroup: 'android',
      buildPath: 'build/android/',
      files: [
        { destination: 'colors-light.xml', format: 'android/colors' },
        { destination: 'dimens-light.xml', format: 'android/dimens' }
      ]
    }
  }
};
```

---

## References

- **[ADR 001: Token Taxonomy](adr/001-token-taxonomy.md)** - File organization and naming
- **[ADR 002: Taxon Variants](adr/002-taxon-variants.md)** - Token variants
- **[ADR 003: Type Values](adr/003-type-values.md)** - Formats and units
- **[ADR 004: Build Tooling](adr/004-build-tooling-style-dictionary.md)** - Style Dictionary setup
- [TOKEN-QUALITY.md](TOKEN-QUALITY.md) - Token-level quality criteria
- [W3C DTCG Specification](https://tr.designtokens.org/format/)
