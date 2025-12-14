# ADR 003: Token Type Values Overview
**Date:** 13/12/2025 (Updated: 14/12/2025)
**Status:** Accepted

## Summary

This ADR provides an overview of format and unit specifications for all W3C DTCG token types used in our design system. Each token type has been separated into focused Architecture Decision Records to improve maintainability and clarity.

**Key Principle**: Use **platform-agnostic formats in primitives** as the source of truth, enabling platform-specific transforms during build. This approach maintains tool compatibility (Figma, Style Dictionary) while supporting accessibility and responsive design.

## Context and Problem

Design tokens must use consistent formats and units for their values to ensure:
- **Cross-platform compatibility** (Web, iOS, Android)
- **Tool interoperability** (Style Dictionary, Figma, Tokens Studio)
- **Accessibility and scalability**
- **Maintainability** and predictable transforms

Each W3C DTCG token type (color, dimension, typography, etc.) can be represented in multiple formats. We must decide which format/unit to use as the **source of truth** in our primitive tokens, and how to transform them for different platforms.

**Example questions**:
- Colors: HEX, RGB, HSL, or OKLCH?
- Dimensions (spacing, fontSize, etc.): px, rem, or em?
- Line heights: unitless or with units?
- Durations: ms or seconds?

Without clear decisions, teams will:
- Use inconsistent formats across tokens
- Have difficulty transforming tokens to platform-specific outputs
- Struggle with tool compatibility
- Create accessibility issues

## Decision Criteria

All type-specific ADRs follow these criteria:

- **W3C DTCG 2025.10 compliance**: Follow specification standards
- **CSS standards alignment**: Match modern CSS best practices
- **Tool compatibility**: Work seamlessly with Style Dictionary, Figma, Tokens Studio
- **Platform compatibility**: Enable transforms to Web (CSS), iOS, Android
- **Accessibility**: Support user preferences and responsive scaling
- **Maintainability**: Predictable, consistent transform strategies
- **Future-proof**: Prepare for evolving standards (e.g., CSS Color Module Level 4)

---

## Token Types and Decisions

This overview links to detailed ADRs for each token type category.

### Visual Tokens

#### 1. Color (`color`)

**ADR**: [ADR 006: Color Type Values](006-color-type-values.md)

**Format**: HSL object with HEX convenience property

**Example**:
```json
{
  "color": {
    "primary": {
      "600": {
        "$type": "color",
        "$value": {
          "colorSpace": "hsl",
          "components": [217, 91, 60],
          "alpha": 1,
          "hex": "#2563eb"
        }
      }
    }
  }
}
```

**Applicable to**: All color tokens (`color.*`)

**Rationale**: HSL provides human-readable color adjustments while HEX ensures tool compatibility.

---

#### 2. Dimension (`dimension`)

**ADR**: [ADR 005: Dimension Value and Unit Separation](005-dimension-value-unit-separation.md)

**Format**: Object with separated `value` (number) and `unit` (string)

**Example**:
```json
{
  "spacing": {
    "4": {
      "$type": "dimension",
      "$value": {
        "value": 16,
        "unit": "px"
      }
    }
  }
}
```

**Applicable to**: `spacing.*`, `fontSize.*`, `borderRadius.*`, `borderWidth.*`

**Rationale**: Separated structure enables type safety, easy unit conversion, and DTCG compliance.

---

### Typography Tokens

**ADR**: [ADR 007: Typography Type Values](007-typography-type-values.md)

This ADR covers all typography-related token types:

#### 3. Font Family (`fontFamily`)

**Format**: Array of font names with fallbacks

**Example**:
```json
{
  "fontFamily": {
    "sans": {
      "$type": "fontFamily",
      "$value": ["Inter", "system-ui", "sans-serif"]
    }
  }
}
```

---

#### 4. Font Weight (`fontWeight`)

**Format**: Numeric values 100-900 (stored as `number` type)

**Example**:
```json
{
  "fontWeight": {
    "bold": {
      "$type": "number",
      "$value": 700
    }
  }
}
```

---

#### 5. Line Height

**Format**: Unitless multipliers (stored as `number` type)

**Example**:
```json
{
  "lineHeight": {
    "normal": {
      "$type": "number",
      "$value": 1.5
    }
  }
}
```

---

#### 6. Letter Spacing

**Format**: Em units for relative scaling (stored as `dimension` type)

**Example**:
```json
{
  "letterSpacing": {
    "wide": {
      "$type": "dimension",
      "$value": "0.05em"
    }
  }
}
```

---

#### 7. Typography Composite (`typography`)

**Format**: Object combining multiple typography properties

**Example**:
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
        }
      }
    }
  }
}
```

---

### Utility Tokens

**ADR**: [ADR 008: Duration, Number, and Shadow Type Values](008-other-type-values.md)

This ADR covers utility token types:

#### 8. Duration (`duration`)

**Format**: Milliseconds (ms)

**Example**:
```json
{
  "duration": {
    "normal": {
      "$type": "duration",
      "$value": "200ms"
    }
  }
}
```

**Applicable to**: `duration.*`

---

#### 9. Number (Opacity, Z-Index)

**Format**: Decimal (0-1 for opacity) or Integer (for z-index)

**Examples**:
```json
{
  "opacity": {
    "disabled": {
      "$type": "number",
      "$value": 0.4
    }
  },
  "zIndex": {
    "modal": {
      "$type": "number",
      "$value": 2000
    }
  }
}
```

**Applicable to**: `opacity.*`, `zIndex.*`

---

#### 10. Shadow (`shadow`)

**Format**: Object or array with offset, blur, spread, and color

**Example**:
```json
{
  "shadow": {
    "md": {
      "$type": "shadow",
      "$value": {
        "offsetX": "0px",
        "offsetY": "4px",
        "blur": "6px",
        "spread": "-1px",
        "color": "{color.neutral.900}",
        "alpha": 0.1
      }
    }
  }
}
```

**Applicable to**: `shadow.*`

---

## Quick Reference

| Token Type | DTCG Type | Format | Example | Detailed ADR |
|------------|-----------|--------|---------|--------------|
| **Color** | `color` | HSL object | `{"colorSpace": "hsl", "components": [217, 91, 60], "alpha": 1, "hex": "#2563eb"}` | [ADR 006](006-color-type-values.md) |
| **Dimension** | `dimension` | Object `{value, unit}` | `{"value": 16, "unit": "px"}` | [ADR 005](005-dimension-value-unit-separation.md) |
| **Font Family** | `fontFamily` | Array | `["Inter", "sans-serif"]` | [ADR 007](007-typography-type-values.md) |
| **Font Weight** | `number` | Integer 100-900 | `700` | [ADR 007](007-typography-type-values.md) |
| **Line Height** | `number` | Unitless decimal | `1.5` | [ADR 007](007-typography-type-values.md) |
| **Letter Spacing** | `dimension` | Em units | `"0.05em"` | [ADR 007](007-typography-type-values.md) |
| **Typography** | `typography` | Composite object | `{"fontFamily": "...", "fontSize": "..."}` | [ADR 007](007-typography-type-values.md) |
| **Duration** | `duration` | Milliseconds | `"200ms"` | [ADR 008](008-other-type-values.md) |
| **Opacity** | `number` | Decimal 0-1 | `0.6` | [ADR 008](008-other-type-values.md) |
| **Z-Index** | `number` | Integer | `1000` | [ADR 008](008-other-type-values.md) |
| **Shadow** | `shadow` | Object | `{"offsetX": "0px", "offsetY": "4px", ...}` | [ADR 008](008-other-type-values.md) |

---

## Platform Transform Strategy

Our token system follows a consistent transform strategy:

### Primitives → Platform Outputs

| Primitive Format | Web (CSS) | iOS | Android |
|------------------|-----------|-----|---------|
| **Color (HSL)** | `rgb()` or HEX | `UIColor` | HEX |
| **Dimension (px)** | `rem` (÷16) | `pt` (1:1) | `dp` (1:1) |
| **Font Weight** | Direct | `.bold` enum | `textStyle` |
| **Line Height** | Direct | Multiply by font size | `lineSpacingMultiplier` |
| **Duration (ms)** | Direct | ÷1000 to seconds | Direct |

### Transform Tools

- **Style Dictionary**: Primary build tool for platform transforms
- **Custom transforms**: See each type-specific ADR for transform examples
- **Validation**: JSON schema and linting ensure format compliance

---

## Consequences

### Positive

- **Modular documentation**: Each token type has focused, detailed ADR
- **Easier maintenance**: Updates to specific types don't affect others
- **Clear guidelines**: Teams can reference specific type documentation
- **DTCG compliance**: All formats follow W3C specification
- **Cross-platform consistency**: Predictable platform transforms
- **Tool compatibility**: Works with modern design and build tools

### Negative

- **Multiple documents**: More files to manage than single ADR
- **Cross-references**: Must navigate between ADRs for complete picture
- **Learning curve**: Team must understand format requirements per type

### Mitigation

- This overview ADR provides quick reference and navigation
- Each type ADR includes complete examples and rationale
- Quick reference table for at-a-glance format lookup
- Validation tools ensure format compliance automatically

---

## Type-Specific ADRs

For detailed specifications, rationale, examples, and platform transforms for each token type, refer to:

1. **[ADR 005: Dimension Value and Unit Separation](005-dimension-value-unit-separation.md)**
   - Dimension tokens (spacing, fontSize, borderRadius, borderWidth)
   - Separated value/unit structure

2. **[ADR 006: Color Type Values](006-color-type-values.md)**
   - Color tokens
   - HSL object format with HEX

3. **[ADR 007: Typography Type Values](007-typography-type-values.md)**
   - Font family, weight, line height, letter spacing
   - Typography composite tokens

4. **[ADR 008: Duration, Number, and Shadow Type Values](008-other-type-values.md)**
   - Duration (animations)
   - Number (opacity, z-index)
   - Shadow (elevation effects)

---

## References

- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [Design Tokens Format Specification (DTCG 2025.10)](https://www.designtokens.org/TR/drafts/format/)
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/)
- [Style Dictionary Documentation](https://styledictionary.com/)
- ADR 001: Token Taxonomy
- ADR 002: Taxon Variants
- ADR 005: Dimension Value and Unit Separation
- ADR 006: Color Type Values
- ADR 007: Typography Type Values
- ADR 008: Duration, Number, and Shadow Type Values
