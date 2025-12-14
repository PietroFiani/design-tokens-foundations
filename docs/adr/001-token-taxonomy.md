# ADR 001: Token Taxonomy
**Date:** 13/12/2025
**Status:** Accepted

## Summary

This ADR defines the complete hierarchical taxonomy for organizing design tokens across both primitive and semantic layers. We selected a **hybrid approach** where the layer identifier (`primitive` or `semantic`) is included in token paths, while platform and theme context is managed via folder structure. This provides optimal legibility, tool compatibility, and developer experience while maintaining W3C DTCG 2025.10 compliance.

**Key Decision**: Token format is `{layer}.{type/property}.{category/element}.{scale/variant}.{state?}` with maximum 5-level nesting. Platform and theme are managed via file organization, not in token paths.

## Context and Problem

A design token system requires a clear, hierarchical taxonomy that organizes tokens in a way that is:
- Easy to understand and navigate
- Compatible with development and design tools
- Scalable as the system grows
- Consistent across platforms and themes
- Aligned with W3C DTCG 2025.10 specification

Without a well-defined taxonomy, teams face:
- Inconsistent token naming across projects
- Difficulty finding the right token
- Poor tool compatibility
- Unclear organization of themes, platforms, and variants
- Maintenance challenges as the system scales

The taxonomy must answer fundamental questions:
- How do we organize primitive vs semantic tokens?
- Where do system name, platform, and theme fit in the structure?
- Should these be in token paths or managed via file organization?
- What is the complete hierarchical structure from root to leaf?

## Decision Criteria

- **W3C DTCG 2025.10 compliance**: Align with specification standards
- **Dev tools compatibility**: Work seamlessly with Style Dictionary, Tailwind, CSS-in-JS, etc.
- **Design tools compatibility**: Integrate with Figma, Tokens Studio, etc.
- **Developer experience**: Easy to use, understand, and remember
- **Legibility**: Token paths should be readable and self-documenting
- **Scalability**: Support growth in tokens, themes, platforms, and brands
- **Maintainability**: Easy to update and refactor
- **Platform agnostic**: Work across Web, iOS, Android, and other platforms
- **Theming support**: Enable easy theme switching
- **Clear separation**: Distinct layers (primitive vs semantic)

## Taxonomy Structure Options

### Option 1: File-Based Organization (Layer + Content Structure)

**Structure**: Layer identifier in token path, system/theme/platform via file organization

**Token Path Format**:
```
{layer}.{type/property}.{category/element}.{scale/variant}.{state?}
```

**File Organization**:
```
tokens/
├── primitive.json                           # All primitives
└── themes/
    ├── light/
    │   └── semantic.json                   # Light theme semantics
    ├── dark/
    │   └── semantic.json                   # Dark theme semantics
    └── high-contrast/
        └── semantic.json                   # High contrast semantics
```

**Alternative: Platform-specific folders**:
```
tokens/
├── primitive.json
└── platforms/
    ├── web/
    │   ├── light/
    │   │   └── semantic.json
    │   └── dark/
    │       └── semantic.json
    ├── ios/
    │   ├── light/
    │   │   └── semantic.json
    │   └── dark/
    │       └── semantic.json
    └── android/
        ├── light/
        │   └── semantic.json
        └── dark/
            └── semantic.json
```

**Example Token Paths**:
```
primitive.color.blue.500
primitive.spacing.md
primitive.fontSize.xl

semantic.color.text.base.default
semantic.color.background.brand.hover
semantic.spacing.inset.md
```

**Token Definition Example**:
```json
{
  "primitive": {
    "color": {
      "$type": "color",
      "blue": {
        "500": { "$value": "#3b82f6" }
      }
    }
  },
  "semantic": {
    "color": {
      "$type": "color",
      "text": {
        "base": {
          "default": { "$value": "{primitive.color.gray.900}" }
        }
      }
    }
  }
}
```

**Pros**:
- ✅ **Clean token paths**: Moderate length (4-5 segments)
- ✅ **Layer clarity**: `primitive` vs `semantic` explicit in token name
- ✅ **DTCG alignment**: Separate files for themes recommended by spec
- ✅ **Tool compatibility**: Works with Style Dictionary, Figma Tokens Studio
- ✅ **Easy theming**: Switch files to change theme
- ✅ **Good legibility**: Clear, readable token paths
- ✅ **Scalable**: Easy to add new themes/platforms via folders
- ✅ **DX**: Straightforward mental model

**Cons**:
- ⚠️ **File management**: Need to maintain multiple theme files
- ⚠️ **Theme context**: Theme not visible in token path itself
- ⚠️ **Build complexity**: Requires build process to merge files

**Dev Tools Compatibility**:
- **Style Dictionary**: ✅ Excellent - native support for file-based themes
- **Tailwind CSS**: ✅ Good - can generate theme configs from files
- **CSS-in-JS**: ✅ Good - import different theme files
- **CSS Variables**: ✅ Excellent - generate different CSS files per theme

**Design Tools Compatibility**:
- **Figma Tokens Studio**: ✅ Excellent - supports file-based organization
- **Figma Variables**: ✅ Good - can import per theme
- **Sketch**: ✅ Good - compatible with most import tools

---

### Option 2: Path-Based Organization (Full Hierarchy in Token Path)

**Structure**: All context (system, platform, theme, layer) in token path

**Token Path Format**:
```
{system?}.{platform?}.{theme}.{layer}.{type/property}.{category/element}.{scale/variant}.{state?}
```

**File Organization**:
```
tokens/
└── tokens.json                             # All tokens in one file
```

**Example Token Paths**:
```
acme.web.light.primitive.color.blue.500
acme.ios.dark.primitive.spacing.md

acme.web.light.semantic.color.text.base.default
acme.ios.dark.semantic.color.background.brand.hover
```

**Token Definition Example**:
```json
{
  "acme": {
    "web": {
      "light": {
        "primitive": {
          "color": {
            "$type": "color",
            "blue": {
              "500": { "$value": "#3b82f6" }
            }
          }
        },
        "semantic": {
          "color": {
            "$type": "color",
            "text": {
              "base": {
                "default": { "$value": "{acme.web.light.primitive.color.gray.900}" }
              }
            }
          }
        }
      }
    }
  }
}
```

**Pros**:
- ✅ **Complete context**: All information in token path
- ✅ **Single source**: One file for all tokens
- ✅ **Explicit relationships**: Clear which theme/platform each token belongs to

**Cons**:
- ❌ **Very long paths**: 7-9 segments (e.g., `acme.web.light.semantic.color.text.base.default`)
- ❌ **Poor legibility**: Hard to read and understand at a glance
- ❌ **Repetitive**: System/platform/theme repeated in every token
- ❌ **Against DTCG**: Spec recommends file-based theme separation
- ❌ **Difficult theming**: Can't just swap files, need complex token resolution
- ❌ **Large file**: All variants in single file becomes unwieldy
- ❌ **Poor DX**: Developers have to type very long paths
- ❌ **Maintenance nightmare**: Changes to system/platform names require massive refactoring

**Dev Tools Compatibility**:
- **Style Dictionary**: ⚠️ Possible but not idiomatic
- **Tailwind CSS**: ⚠️ Awkward - very long class names
- **CSS-in-JS**: ⚠️ Verbose - long variable names
- **CSS Variables**: ⚠️ Creates extremely long CSS variable names

**Design Tools Compatibility**:
- **Figma Tokens Studio**: ⚠️ Works but creates very nested structure
- **Figma Variables**: ❌ Doesn't map well to Figma's structure
- **Sketch**: ⚠️ Overly complex for most import tools

---

### Option 3: Hybrid Approach (Platform/Theme via Folders, Layer in Path)

**Structure**: Platform and theme via folder structure, layer and content in path

**Token Path Format**:
```
{layer}.{type/property}.{category/element}.{scale/variant}.{state?}
```

**File Organization**:
```
tokens/
├── primitive.json                           # Shared primitives
└── platforms/
    ├── web/
    │   ├── themes/
    │   │   ├── light.json                  # semantic tokens
    │   │   ├── dark.json
    │   │   └── high-contrast.json
    │   └── platform-specific-primitives.json (optional)
    ├── ios/
    │   └── themes/
    │       ├── light.json
    │       └── dark.json
    └── android/
        └── themes/
            ├── light.json
            └── dark.json
```

**Example Token Paths** (same across platforms/themes):
```
primitive.color.blue.500
semantic.color.text.base.default
```

**Pros**:
- ✅ **Clean paths**: 4-5 segments only
- ✅ **Excellent legibility**: Easy to read
- ✅ **DTCG compliant**: File-based themes
- ✅ **Reusable tokens**: Same token name across platforms
- ✅ **Easy theming**: Just change which file you load
- ✅ **Great DX**: Short, clear paths
- ✅ **Platform flexibility**: Platform-specific overrides possible

**Cons**:
- ⚠️ **More files**: More complex folder structure
- ⚠️ **Build process**: Need to specify platform/theme during build
- ⚠️ **Context not in path**: Must know which file you're in

**Dev Tools Compatibility**:
- **Style Dictionary**: ✅ Excellent - perfect fit for SD's architecture
- **Tailwind CSS**: ✅ Excellent - clean theme configs
- **CSS-in-JS**: ✅ Excellent - import theme-specific files
- **CSS Variables**: ✅ Excellent - generate theme-specific CSS

**Design Tools Compatibility**:
- **Figma Tokens Studio**: ✅ Excellent - natural mapping to theme sets
- **Figma Variables**: ✅ Excellent - maps to collections
- **Sketch**: ✅ Good - standard approach

---

### Option 4: Flat Structure (No Layer Identifier)

**Structure**: No layer identifier in token path, inferred from file location

**Token Path Format**:
```
{type/property}.{category/element}.{scale/variant}.{state?}
```

**File Organization**:
```
tokens/
├── primitive/
│   ├── color.json
│   ├── spacing.json
│   └── typography.json
└── semantic/
    ├── light/
    │   ├── color.json
    │   └── spacing.json
    └── dark/
        ├── color.json
        └── spacing.json
```

**Example Token Paths**:
```
color.blue.500                              # primitive
spacing.md                                  # primitive

color.text.base.default                     # semantic
color.background.brand.hover                # semantic
```

**Pros**:
- ✅ **Shortest paths**: 3-4 segments
- ✅ **Very legible**: Minimal verbosity
- ✅ **Clean**: No redundant information

**Cons**:
- ❌ **Ambiguous layer**: Can't tell primitive vs semantic from token name
- ❌ **Name collisions**: `color.text.base` (semantic) could be confused with structure
- ❌ **References unclear**: `{color.blue.500}` doesn't show it's primitive
- ❌ **Poor DX**: Requires knowing file context
- ❌ **Tool confusion**: Some tools expect layer identification

**Dev Tools Compatibility**:
- **Style Dictionary**: ⚠️ Works but requires careful configuration
- **Tailwind CSS**: ⚠️ Need to distinguish primitive vs semantic manually
- **CSS-in-JS**: ⚠️ Imports don't show layer context
- **CSS Variables**: ⚠️ Generated variables lack layer info

**Design Tools Compatibility**:
- **Figma Tokens Studio**: ⚠️ Requires careful organization by groups
- **Figma Variables**: ⚠️ Collections need manual separation
- **Sketch**: ⚠️ No clear layer distinction

---

## Comparison Matrix

| Approach | Path Length | Legibility | DTCG Align | Tool Compat | DX | Theming | Scalability |
|----------|-------------|------------|------------|-------------|-------|---------|-------------|
| **File-Based (Layer in Path)** ✅ | 4-5 | ✅ Excellent | ✅ Yes | ✅ Excellent | ✅ Great | ✅ Easy | ✅ Excellent |
| **Path-Based (Full Hierarchy)** | 7-9 | ❌ Poor | ❌ No | ⚠️ Limited | ❌ Poor | ❌ Hard | ⚠️ Medium |
| **Hybrid (Folders + Layer)** | 4-5 | ✅ Excellent | ✅ Yes | ✅ Excellent | ✅ Excellent | ✅ Very Easy | ✅ Excellent |
| **Flat (No Layer)** | 3-4 | ✅ Good | ⚠️ Partial | ⚠️ Limited | ⚠️ Medium | ✅ Easy | ⚠️ Medium |

---

## Decision

**Selected: Hybrid Approach (Option 3)**

We adopt a **hybrid file/path organization** where:
- **Layer** (`primitive` / `semantic`) is **in the token path**
- **Platform** and **Theme** are **managed via folder structure**
- **System name** is **optional** and managed at build/tooling level (not in token paths)

### Complete Taxonomy Structure

**Token Path Format**:
```
{layer}.{type/property}.{category/element}.{scale/variant}.{state?}
```

**Taxon Breakdown**:

1. **`layer`** (REQUIRED): Token abstraction level
   - Values: `primitive`, `semantic`
   - Purpose: Clearly distinguish raw values from semantic mappings

2. **`type` (primitives) / `property` (semantics)** (REQUIRED): Value type or property category
   - Primitive examples: `color`, `spacing`, `fontSize`, `fontWeight`
   - Semantic examples: `color`, `spacing`, `typography`, `shadow`
   - Purpose: Group tokens by value type

3. **`category` (primitives) / `element` (semantics)** (REQUIRED): Sub-categorization
   - Primitive examples: `blue`, `gray`, `red` (for colors), `xs`, `sm`, `md` (for spacing)
   - Semantic examples: `text`, `background`, `border`, `surface` (for colors)
   - Purpose: Further organize within type/property

4. **`scale` (primitives) / `variant` (semantics)** (REQUIRED): Specific value identifier
   - Primitive examples: `50`, `100`, `500`, `900` (for color scales)
   - Semantic examples: `base`, `muted`, `brand`, `error` (for variants)
   - Purpose: Final identification of specific token

5. **`state`** (OPTIONAL): Interactive state
   - Values: `default`, `hover`, `active`, `focus`, `disabled`, `visited`, `selected`
   - Purpose: Support interactive elements
   - Only used for semantic tokens

### File Organization Structure

```
tokens/
├── primitive.json                           # Shared primitives across all platforms/themes
│
└── platforms/                               # Platform-specific tokens
    ├── web/
    │   ├── themes/
    │   │   ├── light.json                  # Web light theme semantic tokens
    │   │   ├── dark.json                   # Web dark theme semantic tokens
    │   │   └── high-contrast.json          # Web high contrast theme
    │   └── primitive-overrides.json         # Optional: Web-specific primitive overrides
    │
    ├── ios/
    │   ├── themes/
    │   │   ├── light.json                  # iOS light theme semantic tokens
    │   │   └── dark.json                   # iOS dark theme semantic tokens
    │   └── primitive-overrides.json         # Optional: iOS-specific primitives (e.g., SF Pro font)
    │
    └── android/
        ├── themes/
        │   ├── light.json                  # Android light theme semantic tokens
        │   └── dark.json                   # Android dark theme semantic tokens
        └── primitive-overrides.json         # Optional: Android-specific primitives
```

### Token Path Examples

**Primitives** (shared across all platforms/themes):
```
primitive.color.blue.500
primitive.color.gray.900
primitive.spacing.md
primitive.fontSize.xl
primitive.fontWeight.bold
primitive.borderRadius.lg
```

**Semantics** (defined per platform/theme):
```
semantic.color.text.base.default
semantic.color.text.base.hover
semantic.color.background.brand.default
semantic.color.background.brand.hover
semantic.color.border.default
semantic.spacing.inset.md
semantic.typography.h1
semantic.shadow.md
```

### Token Reference Examples

**Light theme** (`platforms/web/themes/light.json`):
```json
{
  "semantic": {
    "color": {
      "$type": "color",
      "text": {
        "base": {
          "default": {
            "$value": "{primitive.color.gray.900}",
            "$description": "Base text color for regular content"
          }
        }
      },
      "background": {
        "base": {
          "default": {
            "$value": "{primitive.color.white}",
            "$description": "Base page background"
          }
        }
      }
    }
  }
}
```

**Dark theme** (`platforms/web/themes/dark.json`):
```json
{
  "semantic": {
    "color": {
      "$type": "color",
      "text": {
        "base": {
          "default": {
            "$value": "{primitive.color.gray.100}",
            "$description": "Base text color for regular content"
          }
        }
      },
      "background": {
        "base": {
          "default": {
            "$value": "{primitive.color.gray.900}",
            "$description": "Base page background"
          }
        }
      }
    }
  }
}
```

### Rationale

**Why this approach wins**:

1. **Optimal legibility**: 4-5 segment paths are readable and self-documenting
   - ✅ `semantic.color.text.base.default` is clear and understandable
   - ❌ `acme.web.light.semantic.color.text.base.default` is overwhelming

2. **Excellent tool compatibility**:
   - Style Dictionary: Perfect fit for platform/theme builds
   - Figma Tokens Studio: Natural mapping to theme sets
   - CSS-in-JS: Import theme files as needed
   - Tailwind: Generate clean theme configurations

3. **Superior developer experience**:
   - Short, memorable paths
   - Clear layer distinction (primitive vs semantic)
   - Easy theme switching (load different file)
   - IntelliSense-friendly

4. **DTCG compliance**:
   - Follows spec recommendation for file-based themes
   - Proper use of token references
   - Clean separation of concerns

5. **Scalability**:
   - Easy to add new platforms (new folder)
   - Easy to add new themes (new file in themes/)
   - No token path changes when adding platforms/themes
   - Optional platform-specific overrides

6. **Maintainability**:
   - Changes to system name don't affect tokens
   - Platform-specific tokens isolated
   - Theme variations clearly organized

### Maximum Nesting Depth

- **Primitives**: 4 levels (`primitive.color.blue.500`)
- **Semantics without state**: 4 levels (`semantic.color.text.base`)
- **Semantics with state**: 5 levels (`semantic.color.text.base.default`)

**Guideline**: Never exceed 5 levels of nesting.

---

## File Organization Guidelines

### 1. Primitive Tokens

**File**: `tokens/primitive.json`

**Contains**: All platform-agnostic primitive values

**Structure**:
```json
{
  "primitive": {
    "color": {
      "$type": "color",
      "$description": "Primitive color palette",
      "blue": { ... },
      "gray": { ... },
      "red": { ... }
    },
    "spacing": {
      "$type": "dimension",
      "$description": "Primitive spacing scale",
      "xs": { "$value": "0.25rem" },
      "sm": { "$value": "0.5rem" },
      "md": { "$value": "1rem" }
    }
  }
}
```

### 2. Platform-Specific Primitive Overrides (Optional)

**File**: `tokens/platforms/{platform}/primitive-overrides.json`

**Purpose**: Override or extend primitives for specific platforms

**Example** (iOS-specific fonts):
```json
{
  "primitive": {
    "fontFamily": {
      "$type": "fontFamily",
      "sans": {
        "$value": ["SF Pro", "system-ui", "sans-serif"],
        "$description": "iOS uses SF Pro as default sans-serif"
      }
    }
  }
}
```

### 3. Semantic Tokens (Per Platform/Theme)

**File**: `tokens/platforms/{platform}/themes/{theme}.json`

**Contains**: Semantic mappings referencing primitives

**Example**:
```json
{
  "semantic": {
    "color": {
      "$type": "color",
      "text": {
        "base": {
          "default": { "$value": "{primitive.color.gray.900}" }
        }
      }
    }
  }
}
```

### 4. Build Process

Build tools (e.g., Style Dictionary) should:
1. Load `primitive.json` (base primitives)
2. Optionally merge platform-specific `primitive-overrides.json`
3. Load appropriate theme file from `platforms/{platform}/themes/{theme}.json`
4. Resolve all token references
5. Generate platform-specific output (CSS, JSON, iOS, Android)

**Example Style Dictionary config**:
```javascript
module.exports = {
  source: [
    'tokens/primitive.json',
    'tokens/platforms/web/primitive-overrides.json',
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
    }
  }
};
```

---

## Taxon Optionality

| Taxon | Primitive | Semantic | Notes |
|-------|-----------|----------|-------|
| **layer** | ✅ Required | ✅ Required | Always `primitive` or `semantic` |
| **type/property** | ✅ Required | ✅ Required | `color`, `spacing`, `typography`, etc. |
| **category/element** | ✅ Required | ✅ Required | Category for primitives, element for semantics |
| **scale/variant** | ✅ Required | ✅ Required | Scale value or variant name |
| **state** | ❌ Not used | ⚠️ Optional | Only for interactive semantic tokens |
| **system name** | ❌ Not in path | ❌ Not in path | Managed at build/tooling level |
| **platform** | ❌ Not in path | ❌ Not in path | Managed via folder structure |
| **theme** | ❌ Not in path | ❌ Not in path | Managed via folder structure |

---

## Implementation Guidelines

### Adding a New Theme

1. Create new file: `tokens/platforms/{platform}/themes/{theme-name}.json`
2. Define all semantic tokens
3. Reference existing primitives using `{primitive.*}` syntax
4. Add to build configuration

### Adding a New Platform

1. Create folder: `tokens/platforms/{platform-name}/`
2. Create themes subfolder: `tokens/platforms/{platform-name}/themes/`
3. Optionally add `primitive-overrides.json` for platform-specific primitives
4. Create theme files (at minimum `light.json` and `dark.json`)
5. Configure build tool for new platform output

### Adding Platform-Specific Primitives

Only add to `primitive-overrides.json` when:
- Platform requires different font families (e.g., iOS SF Pro)
- Platform has specific dimension units (e.g., iOS points vs CSS rem)
- Platform needs unique values (e.g., Android elevation values)

Otherwise, use shared `primitive.json` for consistency.

---

## Validation Rules

1. **Layer must be present**: All tokens MUST start with `primitive` or `semantic`
2. **Maximum depth**: Never exceed 5 levels (`layer.type.category.scale.state`)
3. **State only on semantics**: Primitive tokens MUST NOT have state suffix
4. **References must be complete**: Use full path including layer (e.g., `{primitive.color.blue.500}`)
5. **Themes define same structure**: All theme files MUST define the same semantic token structure
6. **Primitives are theme-agnostic**: Primitive tokens MUST NOT vary by theme
7. **File names lowercase**: Use `light.json`, not `Light.json` or `LIGHT.json`

---

## Consequences

### Positive

- **Clear layer distinction**: `primitive` vs `semantic` always visible in token name
- **Readable paths**: Short, understandable token identifiers
- **DTCG compliant**: File-based theme management as recommended
- **Tool-friendly**: Works excellently with Style Dictionary, Figma, and other tools
- **Easy theming**: Just load different theme file
- **Platform flexibility**: Add platforms without changing token names
- **Good DX**: Developers quickly learn and remember structure
- **Maintainable**: Changes isolated to appropriate files
- **Scalable**: Grows well with more themes/platforms

### Negative

- **File management**: More files to maintain than single-file approach
- **Build process**: Requires build tool to merge files
- **Context external**: Theme/platform not visible in token path itself

### Risks

- **File sync**: Themes could drift if structure not validated
- **Build complexity**: Need proper build configuration per platform/theme
- **Documentation**: Team must understand file organization

### Mitigation

1. **Automated validation**: Use linting to ensure all themes define same structure
2. **Templates**: Provide theme file templates
3. **Documentation**: Clear docs on file organization
4. **Tooling**: Use Style Dictionary or similar to handle build complexity
5. **Coverage reports**: Generate reports showing token coverage per theme

---

## References

- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [Design Tokens Format Specification (DTCG 2025.10)](https://www.designtokens.org/TR/drafts/format/)
- [Style Dictionary Documentation](https://styledictionary.com/)
- [Figma Tokens Studio](https://tokens.studio/)
- [Material Design Token System](https://m3.material.io/foundations/design-tokens/overview)
- [Tailwind CSS Theming](https://tailwindcss.com/docs/theme)
- ADR 002: Taxon Variants
- ADR 003: Type Values
