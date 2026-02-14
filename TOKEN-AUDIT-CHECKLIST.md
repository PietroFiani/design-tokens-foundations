# Design Tokens Audit Checklist

Quick reference checklist for auditing design tokens against W3C DTCG 2025.10 and internal ADRs.

---

## 1. W3C DTCG 2025.10 Compliance

### Required Properties
- [ ] Every token has `$type` declaration
- [ ] Every token has `$value` property
- [ ] Every token has `$description` field
- [ ] Token names don't start with `$` (reserved for metadata)

### Token Value Formats

#### Color Tokens (`$type: "color"`)
- [ ] Uses HSL object format: `{colorSpace, components, alpha, hex}`
- [ ] `colorSpace` is `"hsl"`
- [ ] `components` is array of 3 numbers `[H(0-360), S(0-100), L(0-100)]`
- [ ] `alpha` is number 0-1
- [ ] `hex` is valid 6-digit hex `#RRGGBB`
- [ ] NOT using string format like `"#3b82f6"`

#### Dimension Tokens (`$type: "dimension"`)
- [ ] Uses object format: `{value, unit}`
- [ ] `value` is numeric (not string)
- [ ] `unit` is string (e.g., `"px"`, `"em"`)
- [ ] NOT using string format like `"16px"`

#### Font Family (`$type: "fontFamily"`)
- [ ] Value is array of font names
- [ ] Includes fallback fonts
- [ ] Generic font family last (e.g., `sans-serif`, `serif`, `monospace`)

#### Font Weight (`$type: "number"`)
- [ ] Value is numeric 100-900
- [ ] Increments of 100 only
- [ ] NOT using keywords like `"bold"` or `"normal"`

#### Line Height (`$type: "number"`)
- [ ] Value is unitless multiplier (e.g., `1.5`)
- [ ] NOT using px, rem, em, or %

#### Letter Spacing (`$type: "dimension"`)
- [ ] Uses em units for relative scaling
- [ ] Can be negative for tighter spacing

#### Typography Composite (`$type: "typography"`)
- [ ] Includes required properties: `fontFamily`, `fontSize`
- [ ] Optional properties: `fontWeight`, `lineHeight`, `letterSpacing`
- [ ] All properties are token references (e.g., `"{fontFamily.sans}"`)

#### Duration (`$type: "duration"`)
- [ ] Value is string with `ms` unit (e.g., `"200ms"`)
- [ ] NOT using seconds

#### Opacity (`$type: "number"`)
- [ ] Value is decimal 0-1
- [ ] NOT using percentage

#### Z-Index (`$type: "number"`)
- [ ] Value is integer
- [ ] Uses consistent scale (e.g., increments of 100 or 1000)

#### Shadow (`$type: "shadow"`)
- [ ] Includes required properties: `offsetX`, `offsetY`, `blur`
- [ ] Optional properties: `spread`, `color`, `alpha`, `inset`
- [ ] Can be single object or array of objects
- [ ] Color references point to valid color tokens

---

## 2. Reference Integrity

### Token References
- [ ] All references use `{token.path}` syntax
- [ ] Referenced tokens exist (no broken references)
- [ ] NO layer prefixes: use `{color.primary.600}` NOT `{primitive.color.primary.600}`
- [ ] No circular references

### Special Cases
- [ ] Shadow `color` properties reference valid color tokens
- [ ] Overlay tokens with opacity reference valid opacity tokens
- [ ] Typography composites reference valid primitive tokens

---

## 3. Naming Conventions (ADR 001)

### File Organization
- [ ] Layer inferred from filename (`primitive.json` vs `semantic.json`)
- [ ] NO wrapper groups (no `{"primitive": {...}}` or `{"semantic": {...}}`)

### Token Paths
- [ ] NO layer prefixes in paths (not `primitive.color.blue.500`)
- [ ] Format: `{type}.{category}.{scale}` for primitives
- [ ] Format: `{property}.{element}.{variant}.{state?}` for semantics
- [ ] Maximum 4 nesting levels (guideline, 5 acceptable for complex semantics)

### Naming Rules
- [ ] Use lowercase and kebab-case for multi-word names
- [ ] Numeric scales use numbers (100, 200, ..., 900, 1000, 1100, 1200)
- [ ] T-shirt sizes use abbreviations (xs, sm, md, lg, xl, 2xl, etc.)
- [ ] State names: `default`, `hover`, `pressed`, `active`, `focus`, `disabled`

---

## 4. Value Format Consistency (ADRs 005-008)

### Primitives (primitive.json)
- [ ] Colors: HSL object with hex property
- [ ] Spacing: `{value, unit}` with `"px"` unit
- [ ] fontSize: `{value, unit}` with `"px"` unit
- [ ] borderRadius: `{value, unit}` with `"px"` unit
- [ ] borderWidth: `{value, unit}` with `"px"` unit
- [ ] letterSpacing: `{value, unit}` with `"em"` unit
- [ ] fontWeight: Numeric 100-900
- [ ] lineHeight: Unitless multiplier
- [ ] opacity: Decimal 0-1

### Semantics (semantic.json)
- [ ] Color references point to primitives
- [ ] Spacing references point to primitives
- [ ] Typography composites reference primitives
- [ ] Consistent use of references vs. direct values

---

## 5. Completeness Check

### Essential Primitives
- [ ] White color (`color.white`)
- [ ] Black color (`color.black`)
- [ ] Neutral color scale (100-1200 or similar)
- [ ] Primary brand color scale
- [ ] Secondary brand color scale (if applicable)
- [ ] Success color scale
- [ ] Warning color scale
- [ ] Error color scale
- [ ] Spacing scale (0, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40)
- [ ] Font size scale (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl)
- [ ] Font weights (regular/400, medium/500, semibold/600, bold/700)
- [ ] Line heights (tight, snug, normal)
- [ ] Border radius scale (none, sm, md, lg, xl, full)

### Essential Semantics
- [ ] Text colors (base, muted, subtle, inverse)
- [ ] Background colors (base, muted, inverse)
- [ ] Border colors (base, muted, emphasis)
- [ ] Brand colors (primary, secondary if applicable)
- [ ] Intent colors (success, warning, error)
- [ ] Typography scales (display, heading, body, label)
- [ ] Interactive states (default, hover, pressed)

### Color Scale Completeness
- [ ] Primary: 12-step scale (100-1200)
- [ ] Secondary: 12-step scale (if applicable)
- [ ] Neutral: 12-step scale
- [ ] Success: 12-step scale
- [ ] Warning: 12-step scale
- [ ] Error: 12-step scale

### Interactive States
- [ ] Default state defined for interactive tokens
- [ ] Hover state defined
- [ ] Pressed/active state defined
- [ ] Optional: focus, disabled, selected states

---

## 6. Quality Checks

### Descriptions
- [ ] All tokens have descriptions
- [ ] Descriptions are meaningful (not just repeating token name)
- [ ] Descriptions include usage guidance
- [ ] Length: Minimum 10 characters, ideally 20-100 characters

### Type Consistency
- [ ] All tokens in same category use same `$type`
- [ ] No mixed types within a token group

### Accessibility
- [ ] Text colors include contrast ratios in `$extensions` (optional but recommended)
- [ ] Contrast levels specified (AA, AAA)
- [ ] Background references included for context

### Value Ranges
- [ ] HSL hue: 0-360
- [ ] HSL saturation: 0-100
- [ ] HSL lightness: 0-100
- [ ] Alpha: 0-1
- [ ] Opacity: 0-1
- [ ] Font weight: 100-900 (increments of 100)
- [ ] Line height: Typically 1.0-2.0

---

## 7. Build & Transform Readiness

### Style Dictionary Compatibility
- [ ] Token structure compatible with SD transformers
- [ ] Platform-specific transforms configured
- [ ] Reference resolution works correctly

### Figma / Tokens Studio Compatibility
- [ ] Token naming compatible with Figma variables
- [ ] HSL + hex format works with import tools
- [ ] Semantic references resolve correctly

### Platform Outputs
- [ ] Web (CSS): Transforms configured for rem, CSS variables
- [ ] iOS (Swift): Transforms for UIColor, CGFloat
- [ ] Android (XML): Transforms for color resources, dimensions

---

## 8. Documentation

### ADR Compliance
- [ ] ADR 001: Token Taxonomy - file-based organization
- [ ] ADR 003: Type Values Overview - correct formats
- [ ] ADR 005: Dimension separation - {value, unit}
- [ ] ADR 006: Color HSL format - object structure
- [ ] ADR 007: Typography formats - arrays, numbers, unitless
- [ ] ADR 008: Duration, number, shadow formats

### Internal Documentation
- [ ] CLAUDE.md updated with current guidelines
- [ ] TOKEN-QUALITY.md reflects actual token structure
- [ ] README includes usage examples

---

## Quick Pass/Fail Criteria

### ✅ Production Ready If:
- Zero critical issues (all required properties present)
- All token references valid (no broken links)
- Value formats match declared types
- No layer prefixes in token paths
- Complete color scales for brand and semantic colors
- Essential semantic tokens defined

### ⚠️ Production Ready with Warnings If:
- Minor warnings (e.g., nesting depth, description quality)
- Non-critical structural inconsistencies
- Missing optional tokens (e.g., focus states)

### ❌ NOT Production Ready If:
- Missing required properties ($type, $value, $description)
- Broken token references
- Invalid value formats for declared types
- Incomplete color scales
- Missing essential semantic tokens

---

## Automated Audit Tool

Run the audit script:
```bash
node audit-tokens.js
```

This will check all items above and provide:
- Detailed issue report
- Production readiness score
- Prioritized action items

---

**Last Updated**: 2026-02-14
**Reference**: AUDIT-REPORT.md for latest audit results
