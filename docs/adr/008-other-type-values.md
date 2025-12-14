# ADR 008: Duration, Number, and Shadow Type Values
**Date:** 14/12/2025
**Status:** Accepted

## Summary

This ADR specifies the formats for duration, number (opacity, z-index), and shadow token types. These utility token types enable consistent animation timing, layering control, and elevation effects across platforms.

**Key Decisions**:
- **Duration**: Milliseconds (ms) for animation timing
- **Number (opacity)**: Decimal 0-1 for transparency
- **Number (z-index)**: Integers for layer stacking
- **Shadow**: Composite object with offset, blur, spread, and color

## Context

These token types provide essential functionality for modern UIs:
- **Duration**: Consistent animation and transition timing
- **Opacity**: Transparency for states and overlays
- **Z-index**: Layer management for overlays, modals, dropdowns
- **Shadow**: Depth and elevation visual cues

Without standardized formats, teams experience:
- Inconsistent animation speeds
- Z-index conflicts and stacking context issues
- Platform-specific shadow implementations
- Difficult maintenance of transition systems

---

## Token Type Formats

### 1. Duration Type

**DTCG Type**: `duration`

**Format**: Milliseconds (ms) as string

```json
{
  "duration": {
    "instant": {
      "$type": "duration",
      "$value": "0ms",
      "$description": "No transition. Immediate feedback."
    },
    "fast": {
      "$type": "duration",
      "$value": "100ms",
      "$description": "Fast (100ms). Hover states, tooltips."
    },
    "normal": {
      "$type": "duration",
      "$value": "200ms",
      "$description": "Normal (200ms). Standard transitions, modals."
    },
    "slow": {
      "$type": "duration",
      "$value": "300ms",
      "$description": "Slow (300ms). Complex animations."
    }
  }
}
```

**Rationale**:
- ✅ CSS standard format
- ✅ Human-readable (200ms clearer than 0.2s)
- ✅ Platform universal
- ✅ Precise control over timing

**Platform Transforms**:
- **Web (CSS)**: Direct use → `transition: 200ms`
- **iOS**: Convert to seconds → `duration: 0.2` (divide by 1000)
- **Android**: Use milliseconds → `android:duration="200"`

**Common values**:
- `0ms` - Instant (no animation)
- `100ms` - Fast micro-interactions
- `200ms` - Normal transitions
- `300ms` - Slower, deliberate animations
- `500ms` - Page transitions

---

### 2. Number Type (Opacity)

**DTCG Type**: `number`

**Format**: Decimal between 0 and 1

```json
{
  "opacity": {
    "transparent": {
      "$type": "number",
      "$value": 0,
      "$description": "Fully transparent"
    },
    "disabled": {
      "$type": "number",
      "$value": 0.4,
      "$description": "Disabled state opacity"
    },
    "subtle": {
      "$type": "number",
      "$value": 0.6,
      "$description": "Subtle transparency"
    },
    "opaque": {
      "$type": "number",
      "$value": 1,
      "$description": "Fully opaque"
    }
  }
}
```

**Valid range**: 0.0 (fully transparent) to 1.0 (fully opaque)

**Rationale**:
- ✅ CSS standard (0-1 scale)
- ✅ Platform universal
- ✅ Intuitive (percentage-based)
- ✅ Matches alpha channel convention

**Platform Transforms**:
- **Web (CSS)**: Direct use → `opacity: 0.6`
- **iOS**: Direct use → `alpha: 0.6`
- **Android**: Direct use → `android:alpha="0.6"`

**Common values**:
- `0` - Hidden
- `0.4` - Disabled elements
- `0.6` - Subtle overlays
- `0.8` - Semi-transparent backgrounds
- `1` - Fully visible

---

### 3. Number Type (Z-Index)

**DTCG Type**: `number`

**Format**: Integer values

```json
{
  "zIndex": {
    "base": {
      "$type": "number",
      "$value": 0,
      "$description": "Base layer. Default stacking context."
    },
    "dropdown": {
      "$type": "number",
      "$value": 1000,
      "$description": "Dropdown menus"
    },
    "modal": {
      "$type": "number",
      "$value": 2000,
      "$description": "Modal dialogs"
    },
    "toast": {
      "$type": "number",
      "$value": 3000,
      "$description": "Toast notifications. Always on top."
    }
  }
}
```

**Rationale**:
- ✅ Prevents z-index conflicts
- ✅ Clear layering hierarchy
- ✅ Semantic naming
- ✅ Easy to maintain

**Platform Transforms**:
- **Web (CSS)**: Direct use → `z-index: 1000`
- **iOS**: Map to view hierarchy
- **Android**: Map to elevation

**Recommended scale**:
- Use increments of 100 or 1000 for flexibility
- Reserve high values (9000+) for tooltips/modals
- Document layering hierarchy

**Common layers** (lowest to highest):
- `0` - Base content
- `100` - Sticky headers
- `1000` - Dropdowns, popovers
- `2000` - Modals, dialogs
- `3000` - Toast notifications
- `9999` - Debug/dev overlays

---

### 4. Shadow Type (Composite)

**DTCG Type**: `shadow`

**Format**: Object or array of shadow definitions

```json
{
  "shadow": {
    "sm": {
      "$type": "shadow",
      "$value": {
        "offsetX": "0px",
        "offsetY": "1px",
        "blur": "2px",
        "spread": "0px",
        "color": "{color.neutral.900}",
        "alpha": 0.05
      },
      "$description": "Small shadow. Subtle depth for cards."
    },
    "md": {
      "$type": "shadow",
      "$value": {
        "offsetX": "0px",
        "offsetY": "4px",
        "blur": "6px",
        "spread": "-1px",
        "color": "{color.neutral.900}",
        "alpha": 0.1
      },
      "$description": "Medium shadow. Standard elevation."
    }
  }
}
```

**Shadow properties**:
- `offsetX`: Horizontal offset (dimension)
- `offsetY`: Vertical offset (dimension)
- `blur`: Blur radius (dimension)
- `spread`: Spread radius (dimension, optional)
- `color`: Shadow color (color reference)
- `alpha`: Shadow opacity (0-1, optional)
- `inset`: Inner shadow flag (boolean, optional) - for inset/pressed effects

**Multiple shadows** (array):
```json
{
  "shadow": {
    "lg": {
      "$type": "shadow",
      "$value": [
        {
          "offsetX": "0px",
          "offsetY": "10px",
          "blur": "15px",
          "spread": "-3px",
          "color": "{color.neutral.900}",
          "alpha": 0.1
        },
        {
          "offsetX": "0px",
          "offsetY": "4px",
          "blur": "6px",
          "spread": "-2px",
          "color": "{color.neutral.900}",
          "alpha": 0.05
        }
      ],
      "$description": "Large shadow with layered effect"
    }
  }
}
```

**Rationale**:
- ✅ Complete shadow definition
- ✅ Platform agnostic
- ✅ Supports multiple shadows
- ✅ Color token references for consistency

**Platform Transforms**:
- **Web (CSS)**: Convert to `box-shadow` → `0px 4px 6px -1px rgba(23, 23, 23, 0.1)`
- **iOS**: Map to `layer.shadowOffset`, `shadowRadius`, `shadowColor`, `shadowOpacity`
- **Android**: Map to `elevation` (simplified) or custom shadow drawable

**Common shadow scales**:
- `sm` - Subtle depth (1-2px offset, 2-3px blur)
- `md` - Standard cards (3-4px offset, 6-8px blur)
- `lg` - Elevated elements (8-10px offset, 15-20px blur)
- `xl` - Modals/overlays (15-20px offset, 25-30px blur)

---

## Complete Examples

### Duration Tokens

```json
{
  "duration": {
    "instant": {
      "$type": "duration",
      "$value": "0ms",
      "$description": "No transition. Immediate state changes."
    },
    "fast": {
      "$type": "duration",
      "$value": "100ms",
      "$description": "Fast (100ms). Hover states, tooltips, subtle feedback."
    },
    "normal": {
      "$type": "duration",
      "$value": "200ms",
      "$description": "Normal (200ms). Default for most transitions, modals, dropdowns."
    },
    "slow": {
      "$type": "duration",
      "$value": "300ms",
      "$description": "Slow (300ms). Complex animations, drawer panels."
    },
    "slower": {
      "$type": "duration",
      "$value": "500ms",
      "$description": "Slower (500ms). Page transitions."
    }
  }
}
```

### Opacity Tokens

```json
{
  "opacity": {
    "transparent": {
      "$type": "number",
      "$value": 0,
      "$description": "Fully transparent. Hidden elements."
    },
    "disabled": {
      "$type": "number",
      "$value": 0.4,
      "$description": "Disabled state (40%). For non-interactive elements."
    },
    "muted": {
      "$type": "number",
      "$value": 0.6,
      "$description": "Muted (60%). Secondary content, subtle overlays."
    },
    "opaque": {
      "$type": "number",
      "$value": 1,
      "$description": "Fully opaque. Default state."
    }
  }
}
```

### Z-Index Tokens

```json
{
  "zIndex": {
    "base": {
      "$type": "number",
      "$value": 0,
      "$description": "Base layer. Default stacking context."
    },
    "sticky": {
      "$type": "number",
      "$value": 100,
      "$description": "Sticky headers, fixed navigation."
    },
    "dropdown": {
      "$type": "number",
      "$value": 1000,
      "$description": "Dropdown menus, popovers."
    },
    "modal": {
      "$type": "number",
      "$value": 2000,
      "$description": "Modal dialogs, overlays."
    },
    "toast": {
      "$type": "number",
      "$value": 3000,
      "$description": "Toast notifications. Always on top."
    }
  }
}
```

### Shadow Tokens

```json
{
  "shadow": {
    "sm": {
      "$type": "shadow",
      "$value": {
        "offsetX": "0px",
        "offsetY": "1px",
        "blur": "3px",
        "spread": "0px",
        "color": "{color.neutral.900}",
        "alpha": 0.1
      },
      "$description": "Small shadow (1px offset, 3px blur). Subtle depth."
    },
    "md": {
      "$type": "shadow",
      "$value": {
        "offsetX": "0px",
        "offsetY": "4px",
        "blur": "6px",
        "spread": "-1px",
        "color": "{color.neutral.900}",
        "alpha": 0.1
      },
      "$description": "Medium shadow (4px offset, 6px blur). Standard cards."
    },
    "lg": {
      "$type": "shadow",
      "$value": {
        "offsetX": "0px",
        "offsetY": "10px",
        "blur": "15px",
        "spread": "-3px",
        "color": "{color.neutral.900}",
        "alpha": 0.1
      },
      "$description": "Large shadow (10px offset, 15px blur). Elevated elements."
    }
  }
}
```

---

## Validation Rules

1. **Duration must use "ms"**: Always use milliseconds, not seconds
2. **Opacity must be 0-1**: Decimal values only, no percentages
3. **Z-index must be integers**: Whole numbers only
4. **Shadow must include all required properties**: offsetX, offsetY, blur required
5. **Shadow colors should reference tokens**: Use `{color.*}` references for consistency
6. **Type declarations required**: All tokens must include `$type`

---

## Consequences

### Positive

- **Consistent timing**: Standardized animation durations
- **No z-index conflicts**: Clear layering hierarchy
- **Cross-platform shadows**: Predictable elevation effects
- **Maintainability**: Centralized opacity and timing values
- **Accessibility**: Consistent interaction feedback timing

### Negative

- **Shadow complexity**: Platform-specific shadow rendering may vary
- **Z-index management**: Requires discipline to maintain hierarchy
- **Limited shadow control**: Some platforms have simplified shadow models

### Mitigation

- Document z-index hierarchy clearly
- Test shadows across platforms
- Provide fallbacks for unsupported shadow features
- Use semantic naming for clarity

---

## References

- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [Design Tokens Format Specification (DTCG 2025.10)](https://www.designtokens.org/TR/drafts/format/)
- [MDN: CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)
- [MDN: box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)
- [MDN: z-index](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)
- ADR 001: Token Taxonomy
- ADR 006: Color Type Values
