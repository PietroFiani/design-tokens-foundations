# ADR 007: Typography Type Values
**Date:** 14/12/2025
**Status:** Accepted

## Summary

This ADR specifies the formats for all typography-related token types: fontFamily, fontWeight, lineHeight, letterSpacing, and composite typography tokens. We use platform-agnostic formats (arrays for fontFamily, numeric values for fontWeight, unitless multipliers for lineHeight) that enable consistent cross-platform transforms while maintaining accessibility and readability.

**Key Decisions**:
- **fontFamily**: Array of font names with fallbacks
- **fontWeight**: Numeric values (100-900)
- **lineHeight**: Unitless multipliers (e.g., 1.5)
- **letterSpacing**: Em units for relative scaling
- **typography (composite)**: Object combining all typography properties

## Context

Typography tokens require careful format decisions to ensure:
- Cross-platform compatibility (Web, iOS, Android)
- Variable font support
- Accessibility and readability
- Predictable inheritance and scaling

Without consistent formats, teams face difficulties with:
- Font fallbacks across platforms
- Variable font weight control
- Line height inheritance issues
- Typography system maintenance

---

## Token Type Formats

### 1. Font Family Type

**DTCG Type**: `fontFamily`

**Format**: Array of font names with fallbacks

```json
{
  "fontFamily": {
    "sans": {
      "$type": "fontFamily",
      "$value": ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      "$description": "Primary sans-serif font stack"
    }
  }
}
```

**Rationale**:
- ✅ DTCG recommended format
- ✅ Explicit fallback chain
- ✅ Tool compatibility
- ✅ Easy platform transforms

**Platform Transforms**:
- **Web (CSS)**: Join with commas → `"Inter", system-ui, -apple-system, sans-serif`
- **iOS**: Use first available → `UIFont(name: "Inter")`
- **Android**: Use first available → `fontFamily="Inter"`

---

### 2. Font Weight Type

**DTCG Type**: `fontWeight` (stored as `number`)

**Format**: Numeric values 100-900

```json
{
  "fontWeight": {
    "regular": {
      "$type": "number",
      "$value": 400,
      "$description": "Regular weight. Body text default."
    },
    "bold": {
      "$type": "number",
      "$value": 700,
      "$description": "Bold weight. Headings and emphasis."
    }
  }
}
```

**Valid values**: 100, 200, 300, 400, 500, 600, 700, 800, 900

**Rationale**:
- ✅ Universal cross-platform support
- ✅ Variable font compatibility
- ✅ Direct CSS mapping
- ✅ Avoids keyword ambiguity

**Platform Transforms**:
- **Web (CSS)**: Direct use → `font-weight: 700`
- **iOS**: Map to weight enum → `.bold`, `.semibold`
- **Android**: Map to textStyle → `android:textStyle="bold"`

---

### 3. Line Height Type

**DTCG Type**: `number`

**Format**: Unitless multipliers

```json
{
  "lineHeight": {
    "tight": {
      "$type": "number",
      "$value": 1.25,
      "$description": "Tight (1.25). Headings."
    },
    "normal": {
      "$type": "number",
      "$value": 1.5,
      "$description": "Normal (1.5). Body text default."
    }
  }
}
```

**Rationale**:
- ✅ CSS best practice (avoids inheritance issues)
- ✅ Proportional scaling with font size
- ✅ Platform agnostic
- ✅ Predictable behavior

**Platform Transforms**:
- **Web (CSS)**: Direct use → `line-height: 1.5`
- **iOS**: Multiply by font size → `lineHeight = fontSize * 1.5`
- **Android**: Use multiplier → `lineSpacingMultiplier="1.5"`

**Important**: Do NOT use px, rem, em, or percentages for line height in primitives.

---

### 4. Letter Spacing Type

**DTCG Type**: `dimension`

**Format**: Em units for relative scaling

```json
{
  "letterSpacing": {
    "tight": {
      "$type": "dimension",
      "$value": "-0.025em",
      "$description": "Tight letter spacing"
    },
    "wide": {
      "$type": "dimension",
      "$value": "0.05em",
      "$description": "Wide letter spacing"
    }
  }
}
```

**Rationale**:
- ✅ Scales with font size
- ✅ CSS standard format
- ✅ Figma compatibility
- ✅ Can be negative for tighter tracking

**Platform Transforms**:
- **Web (CSS)**: Direct use → `letter-spacing: 0.05em`
- **iOS**: Convert to points → Multiply by font size
- **Android**: Use tracking attribute

**Note**: While em is used here, pixels can also work in primitives with transforms to em for web.

---

### 5. Typography Composite Type

**DTCG Type**: `typography`

**Format**: Object combining multiple typography properties

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
        "$description": "Main page heading (H1). Use once per page."
      }
    }
  }
}
```

**Supported properties**:
- `fontFamily` (required)
- `fontSize` (required)
- `fontWeight` (optional)
- `lineHeight` (optional)
- `letterSpacing` (optional)

**Rationale**:
- ✅ Encapsulates complete typography styles
- ✅ Reduces duplication in component styles
- ✅ Maintains consistency across typography scales
- ✅ Single source of truth for text styles

**Platform Transforms**:
- **Web (CSS)**: Expand to individual properties
- **iOS**: Map to text style configuration
- **Android**: Create style resource

---

## Complete Examples

### Primitive Typography Tokens

```json
{
  "fontFamily": {
    "sans": {
      "$type": "fontFamily",
      "$value": ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      "$description": "Primary sans-serif font stack for UI and body text."
    },
    "serif": {
      "$type": "fontFamily",
      "$value": ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
      "$description": "Serif font stack for editorial content."
    },
    "mono": {
      "$type": "fontFamily",
      "$value": ["Menlo", "Monaco", "Courier New", "monospace"],
      "$description": "Monospace font stack for code."
    }
  },
  "fontWeight": {
    "light": { "$type": "number", "$value": 300 },
    "regular": { "$type": "number", "$value": 400 },
    "medium": { "$type": "number", "$value": 500 },
    "semibold": { "$type": "number", "$value": 600 },
    "bold": { "$type": "number", "$value": 700 }
  },
  "lineHeight": {
    "none": { "$type": "number", "$value": 1 },
    "tight": { "$type": "number", "$value": 1.25 },
    "snug": { "$type": "number", "$value": 1.375 },
    "normal": { "$type": "number", "$value": 1.5 },
    "relaxed": { "$type": "number", "$value": 1.625 },
    "loose": { "$type": "number", "$value": 2 }
  }
}
```

### Semantic Typography Tokens

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
        "$description": "Main page heading (H1). Use exactly once per page."
      },
      "h2": {
        "$type": "typography",
        "$value": {
          "fontFamily": "{fontFamily.sans}",
          "fontSize": "{fontSize.4xl}",
          "fontWeight": "{fontWeight.bold}",
          "lineHeight": "{lineHeight.tight}"
        },
        "$description": "Secondary heading (H2). Major section headings."
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
        "$description": "Standard body text (16px). Default for paragraphs."
      }
    },
    "code": {
      "inline": {
        "$type": "typography",
        "$value": {
          "fontFamily": "{fontFamily.mono}",
          "fontSize": "{fontSize.sm}",
          "fontWeight": "{fontWeight.regular}",
          "lineHeight": "{lineHeight.normal}"
        },
        "$description": "Inline code text within paragraphs."
      }
    }
  }
}
```

---

## Validation Rules

1. **fontFamily must be array**: Array of font names with generic fallback last
2. **fontWeight must be 100-900**: Increments of 100 only
3. **lineHeight must be unitless**: Number only, no px/rem/em
4. **letterSpacing uses em**: Relative units that scale with font size
5. **typography must include fontFamily and fontSize**: Required composite properties
6. **Type declarations required**: All tokens must include `$type`

---

## Consequences

### Positive

- **Cross-platform consistency**: Predictable behavior across all platforms
- **Variable font support**: Numeric weights enable fine-grained control
- **Scalability**: Unitless line heights scale proportionally
- **Maintainability**: Composite typography reduces duplication
- **Accessibility**: Predictable text scaling and contrast
- **Tool compatibility**: Works with Figma, Style Dictionary, design tools

### Negative

- **Learning curve**: Team must understand format requirements
- **Composite complexity**: Typography tokens require multiple token references
- **Platform differences**: Some platform-specific font matching may vary

### Mitigation

- Documentation with clear examples
- Validation tools and linting
- Platform-specific transform configurations
- Font availability testing across platforms

---

## References

- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [Design Tokens Format Specification (DTCG 2025.10)](https://www.designtokens.org/TR/drafts/format/)
- [CSS Fonts Module Level 4](https://www.w3.org/TR/css-fonts-4/)
- [MDN: line-height](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height)
- [MDN: letter-spacing](https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing)
- ADR 001: Token Taxonomy
- ADR 005: Dimension Value and Unit Separation
