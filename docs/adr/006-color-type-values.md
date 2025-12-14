# ADR 006: Color Type Values
**Date:** 14/12/2025
**Status:** Accepted

## Summary

This ADR specifies the format and structure for color token values. We use **HSL color space with object structure** as the source of truth in primitive tokens, with HEX provided as a convenience property. This approach provides human-readable color adjustments, perceptual uniformity, and excellent tool compatibility while supporting platform-specific transforms.

**Key Decision**: Color tokens use HSL object format `{"colorSpace": "hsl", "components": [H, S, L], "alpha": 1, "hex": "#RRGGBB"}` in primitives, with automated transforms to platform-specific formats.

## Context and Problem

Design tokens for colors can be represented in multiple formats (HEX, RGB, HSL, OKLCH), each with different trade-offs. We must decide:

1. **Which color space** to use as the source of truth
2. **What format structure** (string vs object)
3. **How to support** color adjustments and transformations
4. **How to ensure** accessibility and perceptual uniformity

**Questions**:
- Should we use HEX (`#3b82f6`), RGB, HSL, or OKLCH?
- String format or structured object?
- How do we support programmatic color adjustments (lightness, saturation)?
- How do we ensure WCAG compliance and perceptual uniformity?

**Problems without clear decisions**:
- Inconsistent color formats across tokens
- Difficulty adjusting colors programmatically
- Poor tool compatibility
- Accessibility challenges

## Decision Criteria

- **W3C DTCG 2025.10 compliance**: Follow specification standards
- **Human readability**: Enable intuitive color understanding and adjustments
- **Tool compatibility**: Work with Figma, Style Dictionary, Tokens Studio
- **Platform compatibility**: Support Web, iOS, Android transforms
- **Accessibility**: Enable WCAG contrast calculation and validation
- **Perceptual uniformity**: Support consistent color scales
- **Maintainability**: Predictable color manipulation and transforms

---

## Decision

Primitive colors MUST be defined using an **HSL object structure** with a HEX convenience property:

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
        },
        "$description": "Primary brand color"
      }
    }
  }
}
```

### Format Specification

**Required structure**:
```json
{
  "$value": {
    "colorSpace": "hsl",
    "components": [H, S, L],
    "alpha": <number 0-1>,
    "hex": "#RRGGBB"
  }
}
```

**Properties**:
- `colorSpace` (required): Must be `"hsl"`
- `components` (required): Array of three numbers `[Hue (0-360), Saturation (0-100), Lightness (0-100)]`
- `alpha` (required): Opacity value from 0 to 1
- `hex` (required): HEX color code for tool compatibility

### Alternative Formats

While HSL is our source of truth, other color spaces can be generated via transforms:

- **RGB**: `rgb(59, 130, 246)` - Platform output format
- **OKLCH**: `oklch(L% C H)` - For perceptually uniform color spaces (future support)
- **HEX only**: `#3b82f6` - Legacy format for simple color definitions

---

## Rationale

### Why HSL Object Structure?

1. **Human-Readable Adjustments**
   ```javascript
   // Easy to create color variations
   const lighterPrimary = {
     ...primaryColor,
     components: [primaryColor.components[0], primaryColor.components[1], 70] // Increase lightness
   };
   ```

2. **Consistent Color Scales**
   ```javascript
   // Generate consistent lightness scale
   [50, 100, 200, ..., 900].map(scale => ({
     colorSpace: "hsl",
     components: [217, 91, getLightness(scale)],
     alpha: 1
   }));
   ```

3. **WCAG Compliance**
   - HSL lightness directly correlates with perceived brightness
   - Easier to calculate contrast ratios
   - Better support for accessible color systems

4. **Tool Compatibility**
   - HEX property ensures Figma compatibility
   - Object structure enables programmatic manipulation
   - Transform-friendly for build tools

5. **Future-Proof**
   - Structure supports additional color spaces (OKLCH, Display P3)
   - Can add perceptual properties without breaking changes

### Why Not HEX String Only?

❌ **HEX limitations**:
- No semantic meaning (what is `#2563eb`?)
- Hard to adjust programmatically
- Requires parsing for color manipulation
- No direct lightness/saturation control

### Why Not RGB?

❌ **RGB limitations**:
- Not intuitive for color adjustments
- Components don't map to perceptual properties
- Harder to create consistent color scales

---

## Platform Transforms

| Platform | Transform | Output Format | Example |
|----------|-----------|---------------|---------|
| Web (CSS) | Convert to `rgb()` or use HEX | `rgb(37, 99, 235)` or `#2563eb` | `color: rgb(37, 99, 235)` |
| iOS | Convert to UIColor | Swift UIColor | `UIColor(hue: 217/360, saturation: 0.91, brightness: 0.60, alpha: 1)` |
| Android | Use HEX property | `#RRGGBB` | `<color name="primary">#2563eb</color>` |
| Figma | Use HEX property | HEX format | `#2563eb` |

### Style Dictionary Transform Example

```javascript
{
  type: 'value',
  name: 'color/hsl-to-rgb',
  matcher: (token) => token.type === 'color',
  transformer: (token) => {
    const { components, alpha } = token.value;
    const [h, s, l] = components;

    // Convert HSL to RGB
    const rgb = hslToRgb(h, s, l);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }
}
```

---

## Examples

### Complete Color Palette

```json
{
  "color": {
    "primary": {
      "50": {
        "$type": "color",
        "$value": {
          "colorSpace": "hsl",
          "components": [217, 91, 95],
          "alpha": 1,
          "hex": "#eff6ff"
        },
        "$description": "Lightest primary shade"
      },
      "600": {
        "$type": "color",
        "$value": {
          "colorSpace": "hsl",
          "components": [217, 91, 60],
          "alpha": 1,
          "hex": "#2563eb"
        },
        "$description": "Primary brand color"
      },
      "900": {
        "$type": "color",
        "$value": {
          "colorSpace": "hsl",
          "components": [217, 91, 21],
          "alpha": 1,
          "hex": "#1e3a8a"
        },
        "$description": "Darkest primary shade"
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
        "$description": "Pure white"
      },
      "900": {
        "$type": "color",
        "$value": {
          "colorSpace": "hsl",
          "components": [0, 0, 9],
          "alpha": 1,
          "hex": "#171717"
        },
        "$description": "Near black"
      }
    }
  }
}
```

### Semantic Color References

```json
{
  "color": {
    "text": {
      "base": {
        "default": {
          "$type": "color",
          "$value": "{color.neutral.900}",
          "$description": "Primary text color"
        }
      }
    },
    "background": {
      "brand": {
        "default": {
          "$type": "color",
          "$value": "{color.primary.600}",
          "$description": "Primary brand background"
        }
      }
    }
  }
}
```

---

## Implementation Guidelines

### Creating Color Tokens

✅ **Correct**:
```json
{
  "color": {
    "brand": {
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
```

❌ **Incorrect** (string format):
```json
{
  "color": {
    "brand": {
      "$type": "color",
      "$value": "#2563eb"  // ❌ Missing HSL structure
    }
  }
}
```

❌ **Incorrect** (missing HEX):
```json
{
  "color": {
    "brand": {
      "$type": "color",
      "$value": {
        "colorSpace": "hsl",
        "components": [217, 91, 60],
        "alpha": 1
        // ❌ Missing hex property
      }
    }
  }
}
```

### Color Adjustments

Generate lighter/darker variations:

```javascript
// Lighten by increasing L component
const lighter = {
  ...baseColor.value,
  components: [
    baseColor.value.components[0],  // Keep hue
    baseColor.value.components[1],  // Keep saturation
    Math.min(baseColor.value.components[2] + 10, 100)  // Increase lightness
  ]
};

// Desaturate by decreasing S component
const muted = {
  ...baseColor.value,
  components: [
    baseColor.value.components[0],  // Keep hue
    baseColor.value.components[1] - 20,  // Decrease saturation
    baseColor.value.components[2]   // Keep lightness
  ]
};
```

### Transparency and Overlays

Use the `alpha` property for transparent colors:

```json
{
  "overlay": {
    "modal": {
      "$type": "color",
      "$value": {
        "colorSpace": "hsl",
        "components": [0, 0, 0],
        "alpha": 0.6,
        "hex": "#000000"
      },
      "$description": "Modal backdrop (60% black opacity)"
    }
  }
}
```

**Guidelines**:
- Alpha values from 0 (transparent) to 1 (opaque)
- Use semantic overlay tokens for consistent transparency
- Common overlay opacities: 0.05 (hover), 0.1 (dropdown), 0.6 (modal)

---

## Validation Rules

1. **colorSpace must be "hsl"**: Only HSL color space is supported
2. **components must be array of 3 numbers**: `[H (0-360), S (0-100), L (0-100)]`
3. **alpha must be 0-1**: Opacity value between 0 and 1
4. **hex must be valid**: Must match HEX format `#RRGGBB` or `#RRGGBBAA`
5. **HSL and HEX must match**: HEX property must represent the same color as HSL values
6. **Type declaration**: Color tokens MUST include `"$type": "color"`

---

## Consequences

### Positive

- **Intuitive color manipulation**: Easy to adjust lightness, saturation, hue
- **Consistent scales**: Generate predictable color variations
- **Accessibility**: Direct lightness control aids WCAG compliance
- **Tool compatibility**: HEX property ensures Figma support
- **Type safety**: Object structure enables validation and type checking
- **Transform-friendly**: Easy for build tools to convert formats
- **Future-proof**: Structure supports additional color spaces

### Negative

- **Verbosity**: More verbose than simple HEX strings
- **Learning curve**: Team must understand HSL color space
- **Validation complexity**: Must ensure HSL/HEX values match
- **File size**: Slightly larger JSON files

### Risks

- **HSL/HEX mismatch**: Manual edits could create inconsistencies
- **Conversion errors**: Rounding during HSL↔HEX conversion
- **Tool support**: Some tools may not support object format

### Mitigation

1. **Validation tools**: Automated checks for HSL/HEX consistency
2. **Generation scripts**: Tools to generate tokens from HSL values
3. **Documentation**: Clear examples and conversion utilities
4. **Linting**: JSON schema validation for color token structure

---

## References

- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [Design Tokens Format Specification (DTCG 2025.10)](https://www.designtokens.org/TR/drafts/format/)
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/)
- [HSL Color Space](https://en.wikipedia.org/wiki/HSL_and_HSV)
- [OKLCH Color Space](https://oklch.com/)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- ADR 001: Token Taxonomy
- ADR 002: Taxon Variants
