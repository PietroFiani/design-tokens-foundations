# Token Quality Standards

This guide defines quality criteria for creating individual design tokens. Follow these standards to ensure tokens are well-documented, accessible, and maintainable.

---

## Referenced ADRs

- **[ADR 001: Token Taxonomy](adr/001-token-taxonomy.md)** - Naming conventions and token structure
- **[ADR 002: Taxon Variants](adr/002-taxon-variants.md)** - Allowed values for each taxonomy level
- **[ADR 003: Type Values](adr/003-type-values.md)** - Formats and units for token values

---

## Table of Contents

- [Core Quality Principles](#core-quality-principles)
- [Mandatory Requirements](#mandatory-requirements)
- [Critical Questions](#critical-questions)
- [Best Practices by Token Type](#best-practices-by-token-type)
- [Quality Checklist](#quality-checklist)
- [Examples](#examples)

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
| Color | HEX (#RRGGBB) | `"#2563eb"` |
| Dimension | px with unit | `"16px"` |
| Font Family | Array of strings | `["Inter", "sans-serif"]` |
| Font Weight | Numeric (100-900) | `600` |
| Line Height | Unitless number | `1.5` |
| Duration | Milliseconds | `"200ms"` |

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

**Primitives** (ADR 003: HEX format):
```json
{
  "primitive": {
    "color": {
      "primary": {
        "600": {
          "$type": "color",
          "$value": "#2563eb",
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
        "0": { "$value": "#ffffff", "$description": "Pure white for light backgrounds." },
        "900": {
          "$value": "#171717",
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
- ✅ Use HEX format
- ✅ Provide full scale (50-950) per ADR 002
- ✅ Include neutral.0 and neutral.1000 anchors
- ✅ Document contrast ratios in $extensions.contrast property

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

**Primitives** (ADR 003: px format):
```json
{
  "primitive": {
    "dimension": {
      "spacing": {
        "0": { "$value": "0px", "$description": "Zero spacing." },
        "4": { "$value": "16px", "$description": "Base unit (16px). Foundation of spacing scale." },
        "8": { "$value": "32px", "$description": "Large spacing (32px). Section separation." }
      },
      "borderRadius": {
        "2": { "$value": "4px", "$description": "Small radius for buttons, inputs." },
        "full": { "$value": "9999px", "$description": "Fully rounded for pills, badges." }
      }
    }
  }
}
```

**Semantics** (t-shirt sizes):
```json
{
  "semantic": {
    "spacing": {
      "padding": {
        "sm": { "$value": "{primitive.dimension.spacing.2}", "$description": "Small padding (8px). Compact buttons." },
        "md": { "$value": "{primitive.dimension.spacing.4}", "$description": "Medium padding (16px). Default buttons, cards." }
      }
    },
    "border": {
      "radius": {
        "sm": { "$value": "{primitive.dimension.borderRadius.2}", "$description": "Small rounding for buttons, inputs." }
      }
    }
  }
}
```

**Best Practices**:
- ✅ Use px in primitives
- ✅ Use t-shirt sizes (xs, sm, md, lg, xl) in semantics
- ✅ Specify component types in descriptions

---

### Typography Tokens

**Primitives** (ADR 003 formats):
```json
{
  "primitive": {
    "fontFamily": {
      "sans": { "$value": ["Inter", "system-ui", "sans-serif"], "$description": "Primary UI font stack." }
    },
    "fontSize": {
      "md": { "$value": "16px", "$description": "Base size (16px). Default body text." },
      "5xl": { "$value": "48px", "$description": "XL size (48px). Hero headings." }
    },
    "fontWeight": {
      "regular": { "$value": 400, "$description": "Regular weight for body text." },
      "bold": { "$value": 700, "$description": "Bold weight for headings." }
    },
    "lineHeight": {
      "tight": { "$value": 1.25, "$description": "Tight (1.25) for headings." },
      "normal": { "$value": 1.5, "$description": "Normal (1.5) for body text." }
    }
  }
}
```

**Semantics** (composite):
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
          "$description": "Main page heading (H1). Use once per page. Examples: 'Dashboard', 'Settings'."
        }
      },
      "body": {
        "md": {
          "$type": "typography",
          "$value": {
            "fontFamily": "{primitive.fontFamily.sans}",
            "fontSize": "{primitive.fontSize.md}",
            "fontWeight": "{primitive.fontWeight.regular}",
            "lineHeight": "{primitive.lineHeight.normal}"
          },
          "$description": "Standard body text. Default for paragraphs, lists."
        }
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
- [ ] Primitives use absolute values (HEX, px, numeric)
- [ ] Semantics reference primitives via `{primitive.*}`
- [ ] Colors use HEX format
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
- **[ADR 003: Type Values](adr/003-type-values.md)** - Formats and units
- [TOKEN-SYSTEM-CREATION.md](TOKEN-SYSTEM-CREATION.md) - System architecture
- [W3C DTCG Specification](https://tr.designtokens.org/format/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
