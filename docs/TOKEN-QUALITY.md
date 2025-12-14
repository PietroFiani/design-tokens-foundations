# Token Quality Standards

This guide defines quality criteria for creating individual design tokens. Follow these standards to ensure tokens are well-documented, accessible, and maintainable.

---

## Referenced ADRs

- **[ADR 001: Token Taxonomy](adr/001-token-taxonomy.md)** - Naming conventions and token structure
- **[ADR 002: Taxon Variants](adr/002-taxon-variants.md)** - Allowed values for each taxonomy level
- **[ADR 003: Type Values](adr/003-type-values.md)** - Formats and units for token values

---

## Table of Contents

- [Before You Start: Key Questions](#before-you-start-key-questions)
- [Core Quality Principles](#core-quality-principles)
- [Mandatory Requirements](#mandatory-requirements)
- [Critical Questions](#critical-questions)
- [Best Practices by Token Type](#best-practices-by-token-type)
- [Quality Checklist](#quality-checklist)
- [Examples](#examples)

---

## Before You Start: Architecture Questions

Before creating any tokens, answer these questions to define your system architecture:

### 1. How many platforms do you need to support?

- [ ] **One platform** (Web only, iOS only, or Android only)
- [ ] **Multiple platforms** (Web + iOS + Android)

**Impact**:
- One platform → No `platforms/` folder needed
- Multiple platforms → Use `platforms/{web,ios,android}/` structure

**See**: [TOKEN-SYSTEM-CREATION.md](TOKEN-SYSTEM-CREATION.md#directory-structure)

---

### 2. How many brand colors do you have?

- [ ] **1 brand color** (Primary only)
- [ ] **2 brand colors** (Primary + Secondary)
- [ ] **3+ brand colors** (Primary + Secondary + Tertiary)

**Impact**: Determines primitive color scale complexity

**Examples**:
- 1 color: `primitive.color.primary.*`
- 2 colors: `primitive.color.primary.*` + `primitive.color.secondary.*`
- 3+ colors: `primitive.color.primary.*` + `primitive.color.secondary.*` + `primitive.color.tertiary.*`

**Provide**: Exact HEX values for each brand color (e.g., Primary: #0A1128, Secondary: #00F5AB)

---

### 3. How many themes do you need?

- [ ] **One theme** (Light only OR Dark only)
- [ ] **Two themes** (Light + Dark)
- [ ] **Three+ themes** (Light + Dark + High-Contrast, or custom themes)

**Impact**:
- One theme → No `themes/` folder needed, use `semantic.json` at root or platform level
- Multiple themes → Use `themes/{light,dark,high-contrast}.json` structure

---

### 4. How many heading levels do you need?

- [ ] **2 levels** (H1, H2 - minimal)
- [ ] **3 levels** (H1, H2, H3 - standard)
- [ ] **4 levels** (H1, H2, H3, H4 - common)
- [ ] **6 levels** (H1-H6 - full HTML semantic hierarchy)

**Impact**: Determines `semantic.typography.heading.*` token structure

---

### 5. Do different platforms need different values?

- [ ] **No** → All platforms share identical token values
- [ ] **Yes** → Platforms have different fonts, spacing, or colors

**Impact**:
- No → Share single `primitive.json`
- Yes → Need `primitive-overrides.json` per platform

**Examples of platform differences**:
- Fonts: SF Pro (iOS), Roboto (Android), Inter (Web)
- Spacing: iOS may use 8px base, Android 4dp base
- Colors: Platform-specific accent colors

---

### 7. What is your baseline spacing unit?

- [ ] **4px** (tight, dense layouts)
- [ ] **8px** (most common, balanced)
- [ ] **16px** (spacious, generous whitespace)

**Impact**: Determines spacing scale progression (4, 8, 12, 16... vs 8, 16, 24, 32...)

---

### 8. How many body text sizes do you need?

- [ ] **1 size** (Single body text size - simplest)
- [ ] **2 sizes** (Default + Small - common)
- [ ] **3 sizes** (Small, Default, Large - standard)

**Impact**: Determines `semantic.typography.body.{sm,md,lg}` structure

---

## Core Quality Principles

### 1. Documentation First
Every token MUST have a `$description` explaining its purpose and usage. Tokens without descriptions lead to confusion and misuse.

### 2. Accessibility by Default
Consider WCAG compliance from the start. Document contrast ratios in descriptions.

### 3. Semantic Clarity
Token names and descriptions must clearly communicate purpose, not appearance.

### 4. Consistency Over Creativity
Follow ADR 001 and 002 taxonomy rather than inventing new patterns.

### 5. Platform Agnostic Values
Primitives use absolute values (HEX, px) that transform to any platform per ADR 003.

---

## Mandatory Requirements

### Token Descriptions (REQUIRED)

**Rule**: ALL tokens MUST include a `$description` property.

**Why**: Enables self-documentation, prevents misuse, supports design tools (Figma, Tokens Studio).

**Primitive Example**:
```json
{
  "primitive": {
    "color": {
      "primary": {
        "600": {
          "$type": "color",
          "$value": "#2563eb",
          "$description": "Primary brand color at 600 weight. Core brand identity from graphic charter."
        }
      }
    }
  }
}
```

**Semantic Example**:
```json
{
  "semantic": {
    "color": {
      "background": {
        "brand": {
          "default": {
            "$type": "color",
            "$value": "{primitive.color.primary.600}",
            "$description": "Brand background for primary CTAs. Use sparingly to maintain hierarchy. Contrast with white text: 4.5:1 (WCAG AA). Examples: 'Sign Up' button, primary navigation."
          }
        }
      }
    }
  }
}
```

**Description Best Practices**:
- **Be Specific**: State exact use case ("Brand background for primary CTAs" vs "A blue color")
- **Include Context**: When/where to use ("Use for CTAs and key UI elements")
- **Note Constraints**: Accessibility, usage limits ("Use sparingly", "WCAG AA", "Use once per page")
- **Provide Examples**: Concrete scenarios ("'Sign Up' button", "card backgrounds")
- **Document Accessibility**: WCAG levels and contrast ratios ("4.5:1 WCAG AA")

---

### Naming Conventions

Follow **ADR 001** and **ADR 002** taxonomy.

**Format**: `{layer}.{type/property}.{category/element}.{scale/variant}.{state?}`

**Maximum Depth**: 5 levels

**Examples**:
- ✅ `primitive.color.primary.600`
- ✅ `semantic.color.background.brand.default`
- ✅ `semantic.typography.heading.h1`
- ❌ `blueColor` (no layer, type, or scale)
- ❌ `semantic.button.primary.background` (component-level, too specific)

**Variant Naming** (ADR 002):
- ✅ **Semantics**: Use usage-based variants (`base`, `muted`, `subtle`)
- ❌ **Semantics**: Avoid hierarchy variants (`primary`, `secondary`, `tertiary`)
- ✅ **Primitives**: Use hierarchy for brand colors only (`primary`, `secondary`, `tertiary`)

---

### Value Formats

Follow **ADR 003**:

| Token Type | Format | Example |
|------------|--------|---------|
| Color | Object with colorSpace, components, alpha, hex | `{"colorSpace": "hsl", "components": [217, 91, 60], "alpha": 1, "hex": "#2563eb"}` |
| Dimension | px with unit | `"16px"` |
| Font Family | Array of strings | `["Inter", "sans-serif"]` |
| Font Weight | Numeric (100-900) | `600` |
| Line Height | Unitless number | `1.5` |
| Duration | Milliseconds | `"200ms"` |

**Color Value Requirements**:
- **Primary format**: Object with `colorSpace`, `components`, `alpha`, and `hex` properties in `$value`
- **Required color spaces**: HSL and OKLCH must be provided
- **Why**: Enables advanced color manipulation, perceptually uniform adjustments, and accessibility tools
- **Example**:
```json
{
  "$type": "color",
  "$value": {
    "colorSpace": "hsl",
    "components": [217, 91, 60],
    "alpha": 1,
    "hex": "#2563eb"
  }
}
```
- **Alternative representation**: OKLCH color space
```json
{
  "$type": "color",
  "$value": {
    "colorSpace": "oklch",
    "components": [0.55, 0.22, 264],
    "alpha": 1,
    "hex": "#2563eb"
  }
}
```

**Platform Transforms** (ADR 003):
- Primitives: **Absolute values** (HEX, px)
- Build tools transform for platforms:
  - Web: `px` → `rem` (÷16)
  - iOS: `px` → `pt` (1:1)
  - Android: `px` → `dp` (1:1)

---

## Critical Questions

### Should I Add Contrast Property for Semantic Colors?

**When to Ask**: Before creating semantic color tokens (background, text, border).

**Decision Tree**:
```
Need WCAG AAA compliance?
├─ YES → Add contrast variants
└─ NO → Do base colors meet WCAG AA?
    ├─ YES → No contrast variants needed
    └─ NO → Fix base colors OR add contrast variants
```

**Option 1: No Contrast Variants** (Most Common)

Use when base colors meet WCAG AA (4.5:1 for normal text).

```json
{
  "semantic": {
    "color": {
      "text": {
        "base": {
          "default": {
            "$type": "color",
            "$value": "{primitive.color.neutral.900}",
            "$description": "Primary text for body content and headings.",
            "$extensions": {
              "contrast": {
                "ratio": "15.8:1",
                "level": "AAA",
                "background": "{primitive.color.neutral.0}"
              }
            }
          }
        }
      }
    }
  }
}
```

**Pros**: Simpler, easier to implement, sufficient for most apps
**Cons**: Cannot achieve WCAG AAA without additional tokens

---

**Option 2: With Contrast Variants** (High Accessibility)

Use when WCAG AAA required (7:1 for normal text) - government, healthcare apps.

```json
{
  "semantic": {
    "color": {
      "text": {
        "base": {
          "default": {
            "$type": "color",
            "$value": "{primitive.color.neutral.900}",
            "$description": "Primary text for body content and headings.",
            "$extensions": {
              "contrast": {
                "ratio": "15.8:1",
                "level": "AAA",
                "background": "{primitive.color.neutral.0}"
              }
            }
          },
          "contrast": {
            "$type": "color",
            "$value": "{primitive.color.neutral.1000}",
            "$description": "High-contrast text. Pure black for accessibility mode.",
            "$extensions": {
              "contrast": {
                "ratio": "21:1",
                "level": "AAA",
                "background": "{primitive.color.neutral.0}"
              }
            }
          }
        }
      }
    }
  }
}
```

**Pros**: Meets WCAG AAA, supports vision-impaired users
**Cons**: More tokens, increased complexity

**Recommendation**:
- **Standard web app**: Option 1 (WCAG AA)
- **Government/healthcare**: Option 2 (WCAG AAA)

---

## Best Practices by Token Type

### Color Tokens

**Primitives** (ADR 003: Color object format):
```json
{
  "primitive": {
    "color": {
      "primary": {
        "600": {
          "$type": "color",
          "$value": {
            "colorSpace": "hsl",
            "components": [217, 91, 60],
            "alpha": 1,
            "hex": "#2563eb"
          },
          "$description": "Primary brand color at 600 weight.",
          "$extensions": {
            "contrast": {
              "ratio": "4.5:1",
              "level": "AA",
              "background": "#ffffff"
            }
          }
        }
      },
      "neutral": {
        "0": {
          "$type": "color",
          "$value": {
            "colorSpace": "hsl",
            "components": [0, 0, 100],
            "alpha": 1,
            "hex": "#ffffff"
          },
          "$description": "Pure white for light backgrounds."
        },
        "900": {
          "$type": "color",
          "$value": {
            "colorSpace": "hsl",
            "components": [0, 0, 9],
            "alpha": 1,
            "hex": "#171717"
          },
          "$description": "Near-black for text.",
          "$extensions": {
            "contrast": {
              "ratio": "15.8:1",
              "level": "AAA",
              "background": "#ffffff"
            }
          }
        }
      }
    }
  }
}
```

**Best Practices**:
- ✅ Use object format with `colorSpace`, `components`, `alpha`, and `hex`
- ✅ Provide both HSL and OKLCH color spaces (choose one as primary)
- ✅ Provide full scale (50-950) per ADR 002
- ✅ Include neutral.0 and neutral.1000 anchors
- ✅ Document contrast ratios in `$extensions.contrast` property

**Semantics** (usage-based variants):
```json
{
  "semantic": {
    "color": {
      "background": {
        "base": {
          "default": { "$value": "{primitive.color.neutral.0}", "$description": "Default page background." }
        },
        "brand": {
          "default": {
            "$value": "{primitive.color.primary.600}",
            "$description": "Brand background for CTAs.",
            "$extensions": {
              "contrast": {
                "ratio": "4.5:1",
                "level": "AA",
                "foreground": "{semantic.color.text.inverse.default}"
              }
            }
          },
          "hover": { "$value": "{primitive.color.primary.700}", "$description": "Brand background on hover." }
        }
      },
      "text": {
        "base": {
          "default": {
            "$value": "{primitive.color.neutral.900}",
            "$description": "Primary text.",
            "$extensions": {
              "contrast": {
                "ratio": "15.8:1",
                "level": "AAA",
                "background": "{semantic.color.background.base.default}"
              }
            }
          }
        },
        "muted": {
          "default": {
            "$value": "{primitive.color.neutral.600}",
            "$description": "Secondary text.",
            "$extensions": {
              "contrast": {
                "ratio": "4.6:1",
                "level": "AA",
                "background": "{semantic.color.background.base.default}"
              }
            }
          }
        }
      }
    }
  }
}
```

**Best Practices**:
- ✅ Always reference primitives
- ✅ Use usage-based variants (base, muted, subtle)
- ✅ Document contrast in $extensions.contrast property
- ❌ Don't use hierarchy variants (primary, secondary) in semantics

---

### Dimension Tokens

**Primitives** (ADR 003 units, ADR 005 structure):
```json
{
  "spacing": {
    "0": {
      "$type": "dimension",
      "$value": { "value": 0, "unit": "px" },
      "$description": "Zero spacing."
    },
    "4": {
      "$type": "dimension",
      "$value": { "value": 16, "unit": "px" },
      "$description": "Base unit (16px). Foundation of spacing scale."
    },
    "8": {
      "$type": "dimension",
      "$value": { "value": 32, "unit": "px" },
      "$description": "Large spacing (32px). Section separation."
    }
  },
  "borderRadius": {
    "md": {
      "$type": "dimension",
      "$value": { "value": 4, "unit": "px" },
      "$description": "Small radius for buttons, inputs."
    },
    "full": {
      "$type": "dimension",
      "$value": { "value": 9999, "unit": "px" },
      "$description": "Fully rounded for pills, badges."
    }
  }
}
```

**Semantics** (t-shirt sizes):
```json
{
  "spacing": {
    "padding": {
      "sm": {
        "$type": "dimension",
        "$value": "{spacing.2}",
        "$description": "Small padding (8px). Compact buttons."
      },
      "md": {
        "$type": "dimension",
        "$value": "{spacing.4}",
        "$description": "Medium padding (16px). Default buttons, cards."
      }
    }
  },
  "border": {
    "radius": {
      "md": {
        "$type": "dimension",
        "$value": "{borderRadius.md}",
        "$description": "Small rounding for buttons, inputs."
      }
    }
  }
}
```

**Best Practices**:
- ✅ Use separated value and unit structure for dimension tokens (ADR 005)
- ✅ Use px as the unit in all primitive dimension tokens (ADR 003)
- ✅ Use t-shirt sizes (xs, sm, md, lg, xl) in semantics
- ✅ Specify component types in descriptions

---

### Typography Tokens

**Primitives** (ADR 003 units, ADR 005 structure):
```json
{
  "fontFamily": {
    "sans": {
      "$type": "fontFamily",
      "$value": ["Inter", "system-ui", "sans-serif"],
      "$description": "Primary UI font stack."
    }
  },
  "fontSize": {
    "md": {
      "$type": "dimension",
      "$value": { "value": 16, "unit": "px" },
      "$description": "Base size (16px). Default body text."
    },
    "5xl": {
      "$type": "dimension",
      "$value": { "value": 48, "unit": "px" },
      "$description": "XL size (48px). Hero headings."
    }
  },
  "fontWeight": {
    "regular": {
      "$type": "number",
      "$value": 400,
      "$description": "Regular weight for body text."
    },
    "bold": {
      "$type": "number",
      "$value": 700,
      "$description": "Bold weight for headings."
    }
  },
  "lineHeight": {
    "tight": {
      "$type": "number",
      "$value": 1.25,
      "$description": "Tight (1.25) for headings."
    },
    "normal": {
      "$type": "number",
      "$value": 1.5,
      "$description": "Normal (1.5) for body text."
    }
  }
}
```

**Semantics** (composite):
```json
{
  "typography": {
    "heading": {
      "h1": {
        "$type": "typography",
        "$value": {
          "fontFamily": "{fontFamily.sans}",
          "fontSize": "{fontSize.5xl}",
          "fontWeight": "{fontWeight.bold}",
          "lineHeight": "{lineHeight.tight}"
        },
        "$description": "Main page heading (H1). Use once per page. Examples: 'Dashboard', 'Settings'."
      }
    },
    "body": {
      "md": {
        "$type": "typography",
        "$value": {
          "fontFamily": "{fontFamily.sans}",
          "fontSize": "{fontSize.md}",
          "fontWeight": "{fontWeight.regular}",
          "lineHeight": "{lineHeight.normal}"
        },
        "$description": "Standard body text. Default for paragraphs, lists."
      }
    }
  }
}
```

**Best Practices**:
- ✅ Use composite typography tokens
- ✅ Note usage frequency ("use once per page")
- ✅ Provide examples

---

### Duration Tokens

**Primitives** (ADR 003: milliseconds):
```json
{
  "primitive": {
    "duration": {
      "instant": { "$value": "0ms", "$description": "No transition. Immediate feedback." },
      "fast": { "$value": "100ms", "$description": "Fast (100ms). Hover states, tooltips." },
      "normal": { "$value": "200ms", "$description": "Normal (200ms). Modals, dropdowns." },
      "slow": { "$value": "300ms", "$description": "Slow (300ms). Complex animations." }
    }
  }
}
```

**Best Practices**:
- ✅ Use milliseconds (ms)
- ✅ Keep under 500ms for responsiveness
- ✅ Note use cases in descriptions

---

## Quality Checklist

Before committing tokens:

### Documentation
- [ ] All tokens have `$description` properties
- [ ] Descriptions explain purpose and usage
- [ ] Descriptions include examples
- [ ] Descriptions note WCAG levels and constraints

### Naming (ADR 001, 002)
- [ ] Follows taxonomy: `{layer}.{type}.{category}.{scale}.{state?}`
- [ ] Maximum 5-level depth
- [ ] Primitives use scale-based naming (50-950, xs-xl)
- [ ] Semantics use usage-based variants (base, muted, subtle)
- [ ] No component-specific tokens

### Values (ADR 003)
- [ ] Primitives use absolute values (color objects, px, numeric)
- [ ] Semantics reference primitives via `{primitive.*}`
- [ ] Primitive color tokens use object format with `colorSpace`, `components`, `alpha`, and `hex`
- [ ] Primitive color tokens provide both HSL and OKLCH color spaces
- [ ] Dimensions use px
- [ ] Font weights are numeric
- [ ] Line heights are unitless

### Accessibility
- [ ] Asked about contrast requirements
- [ ] Contrast ratios documented in $extensions.contrast property
- [ ] WCAG compliance level noted in $extensions.contrast.level
- [ ] Contrast variants added if needed

---

## Examples

### Complete Color Token
```json
{
  "semantic": {
    "color": {
      "background": {
        "brand": {
          "default": {
            "$type": "color",
            "$value": "{primitive.color.primary.600}",
            "$description": "Primary brand background. Use for CTAs and key interactive elements. Use sparingly (1-3 per screen) to maintain hierarchy. Examples: 'Sign Up' button, 'Add to Cart' CTA.",
            "$extensions": {
              "contrast": {
                "ratio": "4.5:1",
                "level": "AA",
                "foreground": "{semantic.color.text.inverse.default}"
              }
            }
          },
          "hover": {
            "$type": "color",
            "$value": "{primitive.color.primary.700}",
            "$description": "Brand background on hover. Provides clear interactive feedback.",
            "$extensions": {
              "contrast": {
                "ratio": "5.2:1",
                "level": "AA",
                "foreground": "{semantic.color.text.inverse.default}"
              }
            }
          }
        }
      }
    }
  }
}
```

### Complete Typography Token
```json
{
  "semantic": {
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
          "$description": "Primary page heading (H1). Use exactly once per page for main title. Large size (48px) creates strong hierarchy. Tight line height (1.25) optimized for single-line display. Examples: 'Dashboard', 'Settings'. Accessibility: Ensure logical heading structure (H1 → H2 → H3)."
        }
      }
    }
  }
}
```

### Contrast Variants Example
```json
{
  "semantic": {
    "color": {
      "text": {
        "base": {
          "default": {
            "$type": "color",
            "$value": "{primitive.color.neutral.900}",
            "$description": "Primary text. Near-black provides excellent readability. Use for body text, headings.",
            "$extensions": {
              "contrast": {
                "ratio": "15.8:1",
                "level": "AAA",
                "background": "{semantic.color.background.base.default}"
              }
            }
          },
          "contrast": {
            "$type": "color",
            "$value": "{primitive.color.neutral.1000}",
            "$description": "Maximum contrast text. Pure black for high-contrast mode. Enable via accessibility toggle.",
            "$extensions": {
              "contrast": {
                "ratio": "21:1",
                "level": "AAA",
                "background": "{semantic.color.background.base.default}"
              }
            }
          }
        }
      }
    }
  }
}
```

---

## References

- **[ADR 001: Token Taxonomy](adr/001-token-taxonomy.md)** - Naming and structure
- **[ADR 002: Taxon Variants](adr/002-taxon-variants.md)** - Allowed values
- **[ADR 003: Token Type Values Overview](adr/003-type-values.md)** - Overview of all token type formats
- **[ADR 005: Dimension Value and Unit Separation](adr/005-dimension-value-unit-separation.md)** - DTCG-compliant dimension structure
- **[ADR 006: Color Type Values](adr/006-color-type-values.md)** - HSL color format specification
- **[ADR 007: Typography Type Values](adr/007-typography-type-values.md)** - Font, weight, line height formats
- **[ADR 008: Duration, Number, and Shadow Type Values](adr/008-other-type-values.md)** - Utility token formats
- [TOKEN-SYSTEM-CREATION.md](TOKEN-SYSTEM-CREATION.md) - System architecture
- [W3C DTCG Specification](https://tr.designtokens.org/format/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
