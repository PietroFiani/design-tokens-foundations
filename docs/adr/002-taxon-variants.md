# ADR 002: Taxon Variants
**Date:** 13/12/2025
**Status:** Accepted

## Summary

This ADR catalogs all possible values for each level of the token taxonomy defined in ADR 001. It establishes **usage-based variant naming** (`base`, `muted`, `subtle`) instead of hierarchy-based naming (`primary`, `secondary`, `tertiary`) to eliminate ambiguity. It also defines a **brand-agnostic strategy** supporting 1-N brand colors through a two-layer approach: primitives use ordinal names (`primary`, `secondary`, `tertiary`) from the graphic charter, while semantics map to functional names (`brand`, `accent`, `highlight`) based on interface needs.

**Key Decision**: Usage-based variants for semantics, with `base` instead of `default` to avoid state collision. Brand colors handled via primitive→semantic mapping supporting extensible multi-brand systems.

## Context and Problem

ADR 001 defines the token taxonomy structure (`{layer}.{type/property}.{category/element}.{scale/variant}.{state?}`), but doesn't specify what values each taxon can take.

We need a comprehensive catalog of:
- All possible **layer** values (primitive, semantic)
- All **type** and **property** categories
- All **category** and **element** options within each type/property
- All **scale** and **variant** naming systems
- All **state** values for interactive elements
- Guidelines for extensibility and brand color handling

Without clear taxon definitions, teams will:
- Create inconsistent token names
- Struggle to find appropriate variants
- Have difficulty deciding where new tokens fit
- Create non-scalable custom variants

This ADR provides the complete vocabulary for each level of the taxonomy.

## Decision Criteria

- **Completeness**: Cover all common design system needs
- **Consistency**: Same patterns across similar taxons
- **Extensibility**: Easy to add new values as needs grow
- **Brand agnostic**: Support single or multiple brand colors
- **Clarity**: Unambiguous variant names
- **Industry alignment**: Follow established patterns from major design systems
- **W3C DTCG compliance**: Align with specification where applicable

---

## Layer Taxon

**Position**: First level of all tokens
**Format**: `{layer}.*`
**Requirement**: REQUIRED for all tokens

### Values

| Value | Description | Usage | Examples |
|-------|-------------|-------|----------|
| `primitive` | Raw, context-free design values | Foundation values not tied to any usage context | `primitive.color.blue.500`<br/>`primitive.spacing.md` |
| `semantic` | Context-aware tokens that reference primitives | Values with specific purpose/meaning | `semantic.color.text.base.default`<br/>`semantic.spacing.inset.md` |

### Guidelines

- **Always explicit**: Every token MUST start with layer identifier
- **No mixing**: Primitives reference only primitives; semantics reference only primitives
- **Clear purpose**:
  - Use `primitive` for design system palette/scale values
  - Use `semantic` for application-level contextual tokens

---

## Type/Property Taxon

**Position**: Second level of tokens
**Format**: `{layer}.{type/property}.*`
**Requirement**: REQUIRED for all tokens

### Primitive Types

Primitive tokens use **type** to categorize by DTCG value type.

| Type | DTCG Type | Description | Example Tokens |
|------|-----------|-------------|----------------|
| `color` | `color` | Color values (HEX, RGB, HSL, OKLCH) | `primitive.color.blue.500` |
| `spacing` | `dimension` | Spacing scale values | `primitive.spacing.md` |
| `fontSize` | `dimension` | Font size scale | `primitive.fontSize.xl` |
| `fontFamily` | `fontFamily` | Font family definitions | `primitive.fontFamily.sans` |
| `fontWeight` | `fontWeight` | Font weight scale | `primitive.fontWeight.bold` |
| `lineHeight` | `number` | Line height scale | `primitive.lineHeight.tight` |
| `letterSpacing` | `dimension` | Letter spacing scale | `primitive.letterSpacing.wide` |
| `borderRadius` | `dimension` | Border radius scale | `primitive.borderRadius.lg` |
| `borderWidth` | `dimension` | Border width scale | `primitive.borderWidth.thick` |
| `opacity` | `number` | Opacity scale (0-1) | `primitive.opacity.50` |
| `duration` | `duration` | Animation duration values | `primitive.duration.fast` |
| `zIndex` | `number` | Z-index layering scale | `primitive.zIndex.modal` |

### Semantic Properties

Semantic tokens use **property** to categorize by UI application.

| Property | DTCG Type | Description | Example Tokens |
|----------|-----------|-------------|----------------|
| `color` | `color` | All color applications | `semantic.color.text.base.default` |
| `spacing` | `dimension` | All spacing applications | `semantic.spacing.inset.md` |
| `typography` | `typography` | Complete typography styles (composite) | `semantic.typography.h1` |
| `shadow` | `shadow` | Box shadow styles (composite) | `semantic.shadow.md` |
| `radius` | `dimension` | Border radius applications | `semantic.radius.button` |
| `borderWidth` | `dimension` | Border width applications | `semantic.borderWidth.default` |
| `opacity` | `number` | Opacity applications | `semantic.opacity.disabled` |
| `duration` | `duration` | Animation/transition timing | `semantic.duration.default` |

### Guidelines

- **DTCG alignment**: Type values SHOULD map to DTCG types where possible
- **Property-first**: Semantic properties organize by what attribute they control (color, spacing, etc.)
- **Consistency**: Use same property name across elements (all colors under `color`, all spacing under `spacing`)

---

## Category/Element Taxon

**Position**: Third level of tokens
**Format**: `{layer}.{type/property}.{category/element}.*`
**Requirement**: REQUIRED for all tokens

### Primitive Categories

Categories organize primitives within each type. Categories vary by type.

#### Color Categories

Organize color palette by hue and semantic purpose.

**Chromatic colors** (hue-based):
- `blue`, `red`, `green`, `yellow`, `orange`, `purple`, `pink`, `teal`, `cyan`, `indigo`

**Neutral colors**:
- `gray`, `white`, `black`

**Brand colors** (input from graphic charter):
- `primary` - First brand color from graphic charter
- `secondary` - Second brand color (if exists)
- `tertiary` - Third brand color (if exists)
- Can extend to `quaternary`, `quinary` etc. if needed

**Semantic colors** (special purpose):
- `success` - Success/positive states (typically green)
- `error` - Error/danger states (typically red)
- `warning` - Warning/caution states (typically yellow/orange)
- `info` - Informational states (typically blue)

**Example tokens**:
```
primitive.color.blue.500
primitive.color.gray.900
primitive.color.primary.600       # Brand color from graphic charter
primitive.color.secondary.600     # Second brand color
primitive.color.success.500
```

#### Spacing Categories

Single category with size-based scales.

**Category**: Direct size value (no intermediate category)

**Example tokens**:
```
primitive.spacing.xs
primitive.spacing.sm
primitive.spacing.md
primitive.spacing.lg
primitive.spacing.xl
```

#### Font Size Categories

Single category with size-based scales.

**Category**: Direct size value (no intermediate category)

**Example tokens**:
```
primitive.fontSize.xs
primitive.fontSize.sm
primitive.fontSize.md
primitive.fontSize.lg
primitive.fontSize.xl
primitive.fontSize.2xl
primitive.fontSize.3xl
```

#### Font Family Categories

**Categories**:
- `sans` - Sans-serif font stack
- `serif` - Serif font stack
- `mono` - Monospace font stack
- `display` - Display/heading font (optional)

**Example tokens**:
```
primitive.fontFamily.sans
primitive.fontFamily.serif
primitive.fontFamily.mono
```

#### Font Weight Categories

Single category with weight-based scales.

**Example tokens**:
```
primitive.fontWeight.thin
primitive.fontWeight.normal
primitive.fontWeight.medium
primitive.fontWeight.bold
primitive.fontWeight.black
```

### Semantic Elements

Elements organize semantics by UI application within each property.

#### Color Elements

| Element | Description | Used For |
|---------|-------------|----------|
| `text` | Text colors | All text content |
| `background` | Background colors | Backgrounds for pages, cards, buttons, etc. |
| `border` | Border and divider colors | Borders, dividers, outlines |
| `surface` | Elevated surface colors | Cards, modals, popovers |
| `icon` | Icon and symbol colors | Icons, decorative elements |

**Example tokens**:
```
semantic.color.text.base.default
semantic.color.background.brand.hover
semantic.color.border.default
semantic.color.surface.elevated
semantic.color.icon.muted
```

#### Spacing Elements

| Element | Description | Used For |
|---------|-------------|----------|
| `inline` | Horizontal spacing between elements | Gap between inline elements |
| `stack` | Vertical spacing between elements | Gap between stacked elements |
| `inset` | Padding inside containers | Padding within buttons, cards, etc. |
| `section` | Spacing between major sections | Large spacing between page sections |

**Example tokens**:
```
semantic.spacing.inline.sm
semantic.spacing.stack.md
semantic.spacing.inset.lg
semantic.spacing.section.xl
```

#### Typography Elements

Single element: semantic scale names (no intermediate element).

**Example tokens**:
```
semantic.typography.display
semantic.typography.h1
semantic.typography.h2
semantic.typography.body
semantic.typography.caption
semantic.typography.label
```

#### Shadow Elements

Single element: size-based (no intermediate element).

**Example tokens**:
```
semantic.shadow.sm
semantic.shadow.md
semantic.shadow.lg
semantic.shadow.xl
```

### Guidelines

- **Color categories**: Use semantic names at primitive level (`primary`, `secondary`) only for brand colors from graphic charter
- **Neutral naming**: Use `gray` for neutrals, not `neutral`
- **Consistency**: All similar categories should follow same naming pattern

---

## Scale/Variant Taxon

**Position**: Fourth level of tokens
**Format**: `{layer}.{type}.{category}.{scale}` (primitives) or `{layer}.{property}.{element}.{variant}` (semantics)
**Requirement**: REQUIRED for all tokens

### Primitive Scales

Different types use different scale systems.

#### Color Scales

**Numeric scale (50-950)**:
```
50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
```

- `50` - Lightest shade
- `500` - Base/middle value
- `900-950` - Darkest shades

**Example**:
```
primitive.color.blue.50       # Very light blue
primitive.color.blue.500      # Base blue
primitive.color.blue.900      # Very dark blue
```

**Rationale**: Industry standard from Tailwind, Material Design. Provides fine-grained control.

#### Spacing, Font Size, Radius Scales

**T-shirt sizes**:
```
xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl
```

**Example**:
```
primitive.spacing.xs           # Extra small spacing
primitive.spacing.md           # Medium spacing
primitive.spacing.xl           # Extra large spacing

primitive.fontSize.sm
primitive.fontSize.lg
primitive.fontSize.3xl
```

**Special values** (for radius):
- `none` - No radius (0)
- `full` - Fully rounded (9999px or 50%)

#### Font Weight Scales

**Semantic names**:
```
thin, extralight, light, normal, medium, semibold, bold, extrabold, black
```

**Or numeric values**:
```
100, 200, 300, 400, 500, 600, 700, 800, 900
```

**Example**:
```
primitive.fontWeight.normal    # 400
primitive.fontWeight.bold      # 700
primitive.fontWeight.black     # 900
```

#### Line Height Scales

**Semantic names**:
```
none, tight, snug, normal, relaxed, loose
```

**Example**:
```
primitive.lineHeight.tight     # 1.25
primitive.lineHeight.normal    # 1.5
primitive.lineHeight.loose     # 2
```

#### Duration Scales

**Semantic names**:
```
instant, fast, normal, slow, slower
```

**Example**:
```
primitive.duration.instant     # 50ms
primitive.duration.fast        # 150ms
primitive.duration.normal      # 300ms
primitive.duration.slow        # 500ms
```

### Semantic Variants

Semantic variants describe **usage context**, not appearance.

#### Usage-Based Variants

For general UI elements (text, backgrounds, icons).

| Variant | Description | When to Use |
|---------|-------------|-------------|
| `base` | Baseline, most frequent usage | Primary text, main backgrounds, standard icons |
| `muted` | Reduced emphasis, supporting content | Subheadings, captions, metadata, secondary info |
| `subtle` | Minimal contrast, rarely used | Helper text, hints, least important content |

**Example**:
```
semantic.color.text.base.default       # Most frequent text color
semantic.color.text.muted.default      # Supporting text color
semantic.color.text.subtle.default     # Minimal contrast text
```

**Why these names**:
- ❌ AVOID `primary`/`secondary`/`tertiary` - ambiguous (could mean frequency OR visual prominence)
- ✅ USE `base`/`muted`/`subtle` - clearly describes usage frequency and emphasis level
- `base` instead of `default` avoids collision with `default` state

#### Brand Variants

For expressing brand identity with single or multiple brand colors.

| Variant | Description | Maps to Primitive |
|---------|-------------|-------------------|
| `brand` | Primary brand expression | `primitive.color.primary.*` |
| `accent` | Secondary brand accent | `primitive.color.secondary.*` (if exists) |
| `highlight` | Tertiary brand highlight | `primitive.color.tertiary.*` (if exists) |

**Example (single brand color)**:
```
semantic.color.background.brand.default    → {primitive.color.primary.600}
semantic.color.background.brand.hover      → {primitive.color.primary.700}
```

**Example (multiple brand colors - e.g., alan.com with decorative backgrounds)**:
```
semantic.color.background.brand.default    → {primitive.color.primary.600}
semantic.color.background.brand.hover      → {primitive.color.primary.700}

semantic.color.background.accent.default   → {primitive.color.secondary.600}
semantic.color.background.accent.hover     → {primitive.color.secondary.700}

semantic.color.background.highlight.default → {primitive.color.tertiary.500}
semantic.color.background.highlight.hover   → {primitive.color.tertiary.600}
```

**Extensibility**:
- Systems with 1 brand color: Use only `brand`
- Systems with 2 brand colors: Use `brand` + `accent`
- Systems with 3+ brand colors: Use `brand` + `accent` + `highlight` (+ more as needed)
- **Principle**: Number of brand variants driven by interface needs, not input brand palette size

**Guidelines**:
- At **primitive** level: Use `primary`, `secondary`, `tertiary` (from graphic charter)
- At **semantic** level: Map to functional names `brand`, `accent`, `highlight`
- Mapping example:
  ```
  primitive.color.primary.600   → semantic.color.background.brand.default
  primitive.color.secondary.600 → semantic.color.background.accent.default
  primitive.color.tertiary.500  → semantic.color.background.highlight.default
  ```

#### Functional Variants

For specific, well-defined purposes.

| Variant | Description | Usage |
|---------|-------------|-------|
| `link` | Hyperlink colors | Text links, navigation links |
| `placeholder` | Input placeholder colors | Form input placeholders |
| `overlay` | Overlay/scrim colors | Modal backdrops, dropdown overlays |
| `inverse` | Inverted contexts | Text/icons on dark backgrounds in light theme |
| `disabled` | Disabled state | Inactive/disabled elements |

**Example**:
```
semantic.color.text.link.default
semantic.color.text.placeholder.default
semantic.color.background.overlay
semantic.color.text.inverse.default
semantic.color.text.disabled
```

#### Status Variants

For semantic feedback states.

| Variant | Description | Typical Color |
|---------|-------------|---------------|
| `success` | Success/positive feedback | Green |
| `error` | Error/danger/negative feedback | Red |
| `warning` | Warning/caution | Yellow/Orange |
| `info` | Informational | Blue |

**Example**:
```
semantic.color.text.success.default
semantic.color.background.error.default
semantic.color.border.warning
semantic.color.text.info.default
```

#### Strength Variants (for borders/backgrounds)

For intensity variations.

| Variant | Description |
|---------|-------------|
| `subtle` | Minimal contrast |
| `default` | Standard contrast |
| `strong` | High contrast/emphasis |

**Example**:
```
semantic.color.border.subtle
semantic.color.border.default
semantic.color.border.strong
```

#### Size Variants (for spacing, typography, shadows)

**T-shirt sizes**:
```
xs, sm, md, lg, xl, 2xl, 3xl
```

**Example**:
```
semantic.spacing.inset.sm
semantic.spacing.stack.lg
semantic.shadow.md
```

**Typography scales** (semantic names):
```
display, h1, h2, h3, h4, h5, h6, body, bodySmall, caption, label, overline
```

**Example**:
```
semantic.typography.display
semantic.typography.h1
semantic.typography.body
semantic.typography.caption
```

### Variant Naming Philosophy

**Key principle**: Semantic variants describe **how and when to use**, NOT **how it looks**.

- ❌ AVOID hierarchy names (`primary`/`secondary`/`tertiary`) for usage-based variants - creates ambiguity
- ✅ USE usage-based names (`base`/`muted`/`subtle`) - clear intent
- Visual prominence comes from typography/sizing, NOT from color variants
- Separate usage context (variant) from visual appearance

---

## State Taxon

**Position**: Fifth level (optional, only for semantic tokens)
**Format**: `{layer}.{property}.{element}.{variant}.{state}`
**Requirement**: OPTIONAL (only for interactive elements)

### Values

| State | Description | Typical Usage |
|-------|-------------|---------------|
| `default` | Default/resting state | All interactive elements at rest |
| `hover` | Hover/pointer-over state | Mouse hover |
| `active` | Active/pressed state | Click/tap in progress |
| `focus` | Focused state | Keyboard focus, input focus |
| `disabled` | Disabled/inactive state | Non-interactive disabled elements |
| `visited` | Visited state | Previously visited links |
| `selected` | Selected state | Selected items in lists, tabs, etc. |

### Examples

```
semantic.color.text.base.default
semantic.color.text.base.hover

semantic.color.background.brand.default
semantic.color.background.brand.hover
semantic.color.background.brand.active

semantic.color.border.focus
semantic.color.text.disabled
semantic.color.text.link.visited
```

### Guidelines

- **Only for semantics**: Primitive tokens MUST NOT use states
- **Always define default**: If any state exists, `default` MUST also exist
- **State progression**: Define states in logical order (default → hover → active)
- **Not all variants need states**: Non-interactive elements (like base backgrounds) often only need `default`

---

## Brand Color Strategy

### Problem

Design systems must accommodate varying numbers of brand colors from the graphic charter:
- Single brand color (most common)
- Dual brand colors (primary + secondary)
- Triple brand colors (primary + secondary + tertiary)
- More complex brand systems

The taxonomy must be **agnostic** to the input while enabling **functional usage** at the semantic layer.

### Solution: Two-Layer Approach

#### Layer 1: Primitives (Input from Graphic Charter)

At the primitive level, use **ordinal names** matching the graphic charter:

```
primitive.color.primary.{scale}      # First brand color from charter
primitive.color.secondary.{scale}    # Second brand color (if exists)
primitive.color.tertiary.{scale}     # Third brand color (if exists)
```

**Example**:
```
primitive.color.primary.50           # Lightest shade of primary brand color
primitive.color.primary.500          # Base primary brand color
primitive.color.primary.900          # Darkest shade of primary brand color

primitive.color.secondary.500        # Base secondary brand color (if exists)
primitive.color.tertiary.500         # Base tertiary brand color (if exists)
```

#### Layer 2: Semantics (Functional Mapping)

At the semantic level, map to **functional names** based on interface needs:

```
semantic.color.{element}.brand.{state}      # Primary brand expression
semantic.color.{element}.accent.{state}     # Secondary brand accent
semantic.color.{element}.highlight.{state}  # Tertiary brand highlight
```

**Mapping**:
- `brand` → references `primitive.color.primary.*`
- `accent` → references `primitive.color.secondary.*` (if needed)
- `highlight` → references `primitive.color.tertiary.*` (if needed)

### Examples

**Single Brand Color System**:

Primitives:
```json
{
  "primitive": {
    "color": {
      "primary": {
        "500": { "$value": "#3b82f6" },
        "600": { "$value": "#2563eb" }
      }
    }
  }
}
```

Semantics:
```json
{
  "semantic": {
    "color": {
      "background": {
        "brand": {
          "default": { "$value": "{primitive.color.primary.600}" },
          "hover": { "$value": "{primitive.color.primary.700}" }
        }
      },
      "text": {
        "brand": {
          "default": { "$value": "{primitive.color.primary.600}" }
        }
      }
    }
  }
}
```

**Multi-Brand Color System (e.g., decorative backgrounds)**:

Primitives:
```json
{
  "primitive": {
    "color": {
      "primary": {
        "500": { "$value": "#3b82f6" },
        "600": { "$value": "#2563eb" }
      },
      "secondary": {
        "500": { "$value": "#8b5cf6" },
        "600": { "$value": "#7c3aed" }
      },
      "tertiary": {
        "500": { "$value": "#ec4899" },
        "600": { "$value": "#db2777" }
      }
    }
  }
}
```

Semantics (for decorative backgrounds like alan.com):
```json
{
  "semantic": {
    "color": {
      "background": {
        "brand": {
          "default": { "$value": "{primitive.color.primary.600}" },
          "hover": { "$value": "{primitive.color.primary.700}" }
        },
        "accent": {
          "default": { "$value": "{primitive.color.secondary.600}" },
          "hover": { "$value": "{primitive.color.secondary.700}" }
        },
        "highlight": {
          "default": { "$value": "{primitive.color.tertiary.500}" },
          "hover": { "$value": "{primitive.color.tertiary.600}" }
        }
      }
    }
  }
}
```

### Guidelines

1. **Primitives match charter**: Use `primary`, `secondary`, `tertiary` matching graphic charter input
2. **Semantics match needs**: Only create semantic brand variants (`brand`, `accent`, `highlight`) if interface needs them
3. **Extensible pattern**: Can add more (`quaternary` → `accent2`, etc.) if needed
4. **No compound names**: Don't use `brandPrimary`, `brandSecondary` - use `brand`, `accent`
5. **Consistent nesting**: All brand variants at same depth (4 levels)

---

## Complete Examples

### Primitive Tokens

```
primitive.color.blue.500
primitive.color.gray.900
primitive.color.primary.600           # Brand from charter
primitive.color.secondary.600         # Second brand from charter
primitive.spacing.md
primitive.fontSize.xl
primitive.fontFamily.sans
primitive.fontWeight.bold
primitive.lineHeight.normal
primitive.borderRadius.lg
primitive.duration.fast
```

### Semantic Tokens

```
semantic.color.text.base.default
semantic.color.text.muted.default
semantic.color.text.brand.default
semantic.color.text.link.default
semantic.color.text.error.default

semantic.color.background.base.default
semantic.color.background.muted.default
semantic.color.background.brand.default
semantic.color.background.brand.hover
semantic.color.background.accent.default     # If multiple brand colors needed
semantic.color.background.success.default

semantic.color.border.default
semantic.color.border.strong
semantic.color.border.focus

semantic.spacing.inline.sm
semantic.spacing.stack.md
semantic.spacing.inset.lg

semantic.typography.h1
semantic.typography.body
semantic.typography.caption

semantic.shadow.md
semantic.radius.button
```

---

## Extensibility Guidelines

### Adding New Primitive Categories

1. Identify if it fits an existing type (e.g., new color category)
2. Follow naming pattern of existing categories
3. Define complete scale for the category
4. Document in this ADR

### Adding New Semantic Variants

1. Determine if it's:
   - Usage-based (base/muted/subtle pattern)
   - Functional (specific purpose like link/placeholder)
   - Status (success/error/warning/info)
   - Brand (brand/accent/highlight)
2. Ensure it doesn't duplicate existing variant
3. Use clear, unambiguous name
4. Document usage guidelines

### Adding New Brand Colors

**At primitive level**:
- Add `quaternary`, `quinary` etc. as needed in graphic charter

**At semantic level**:
- Only add semantic variants if interface requires them
- Extend with `accent2`, `accent3`, etc. if needed
- Or create domain-specific variants (e.g., `partner`, `affiliate`)

---

## Validation Rules

1. **Layer required**: All tokens MUST start with `primitive` or `semantic`
2. **Type/property required**: All tokens MUST have type (primitives) or property (semantics)
3. **Category/element required**: All tokens MUST have category (primitives) or element (semantics)
4. **Scale/variant required**: All tokens MUST have scale (primitives) or variant (semantics)
5. **State only on semantics**: Primitive tokens MUST NOT have state
6. **State requires default**: If any non-default state exists, `default` state MUST also exist
7. **Consistent scales**: Same type should use same scale system (all colors 50-950, all spacing xs-xl)
8. **No orphan values**: Don't create one-off custom values outside documented patterns

---

## Consequences

### Positive

- **Complete vocabulary**: Clear list of all possible taxon values
- **Consistent naming**: Patterns apply across similar tokens
- **Brand flexibility**: Supports single or multiple brand colors
- **Extensible**: Clear guidelines for adding new variants
- **Unambiguous**: Usage-based naming removes confusion
- **Tool-friendly**: Standard patterns work well with tooling

### Negative

- **Many options**: Large vocabulary to learn
- **Documentation needed**: Teams need reference guide
- **Discipline required**: Must follow patterns consistently

### Risks

- **Variant explosion**: Teams create too many custom variants
- **Pattern drift**: New tokens don't follow established patterns
- **Brand confusion**: Misunderstanding primitive vs semantic brand naming

### Mitigation

1. **Linting**: Validate tokens match documented patterns
2. **Templates**: Provide token templates
3. **Reviews**: Review new tokens for pattern compliance
4. **Documentation**: Maintain clear examples and guidelines
5. **Training**: Educate team on variant usage

---

## References

- [Material Design Color Roles](https://m3.material.io/styles/color/roles)
- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [Chakra UI Semantic Tokens](https://chakra-ui.com/docs/styled-system/semantic-tokens)
- [Primer Design System Primitives](https://primer.style/primitives/storybook/)
- [Radix Colors](https://www.radix-ui.com/colors)
- ADR 001: Token Taxonomy
- ADR 003: Type Values
