# Claude Code Guidelines: Design Tokens Foundations

**Project**: W3C DTCG 2025.10 compliant design tokens system
**Platform**: Web only | **Theme**: Light only | **Brand Colors**: 3 (Primary, Secondary, Tertiary)

---

## Core Principles

1. **File-based layers**: Layer inferred from filename (`primitive.json` vs `semantic.json`)
2. **No wrapper groups**: No `primitive`/`semantic`/`dimension` wrappers
3. **Token format**: `{type}.{category}.{scale}.{state?}` (max 4 levels)
4. **No layer prefixes**: Use `{color.primary.600}` not `{primitive.color.primary.600}`

---

## Documentation Map

### Before Making Any Changes

**Always check in this order:**

1. **[ADR 001: Token Taxonomy](docs/adr/001-token-taxonomy.md)** - Naming, structure, nesting rules
2. **[ADR 003: Type Values Overview](docs/adr/003-type-values.md)** - Quick reference for all types
3. **Type-specific ADRs**:
   - Colors → [ADR 006](docs/adr/006-color-type-values.md)
   - Dimensions → [ADR 005](docs/adr/005-dimension-value-unit-separation.md)
   - Typography → [ADR 007](docs/adr/007-typography-type-values.md)
   - Duration/Shadow → [ADR 008](docs/adr/008-other-type-values.md)
4. **[TOKEN-QUALITY.md](docs/TOKEN-QUALITY.md)** - Quality guidelines, descriptions

---

## Token Type Formats (Quick Reference)

| Type | Format | Example | ADR |
|------|--------|---------|-----|
| **Color** | HSL object + hex | `{"colorSpace":"hsl","components":[217,91,60],"alpha":1,"hex":"#2563eb"}` | 006 |
| **Dimension** | `{value,unit}` | `{"value":16,"unit":"px"}` | 005 |
| **fontWeight** | Number 100-900 | `700` | 007 |
| **lineHeight** | Unitless number | `1.5` | 007 |
| **duration** | Milliseconds | `"200ms"` | 008 |

Full details: [ADR 003](docs/adr/003-type-values.md)

---

## Critical Rules

### ❌ Never
- Layer prefixes in paths or references
- Wrapper groups (`{"primitive":{"color":{...}}}`)
- String dimensions (`"16px"` instead of `{"value":16,"unit":"px"}`)
- HEX-only colors (must use HSL object)
- More than 4 nesting levels

### ✅ Always
- Include `$type` and `$description`
- Use HSL color format with hex property (ADR 006)
- Use separated value/unit for dimensions (ADR 005)
- Follow naming from ADR 001
- Check format in type-specific ADRs

---

## File Structure

```
tokens/
├── primitive.json    # Platform-agnostic values
└── semantic.json     # Light theme mappings

docs/
├── adr/              # Architecture decisions
│   ├── 001-token-taxonomy.md
│   ├── 003-type-values.md
│   ├── 005-dimension-value-unit-separation.md
│   ├── 006-color-type-values.md
│   ├── 007-typography-type-values.md
│   └── 008-other-type-values.md
└── TOKEN-QUALITY.md  # Quality guidelines
```

---

## Quick Decision Tree

**Adding a token?**
1. Check ADR 001 for naming → `{type}.{category}.{scale}.{state?}`
2. Check type-specific ADR (005-008) for format
3. Add to `primitive.json` OR `semantic.json` (not both)
4. Include `$type`, `$description`, correct format

**Modifying structure?**
→ Read ADR 001 first

**Changing color/dimension/typography format?**
→ Read relevant ADR (005-008) first

**Quality questions?**
→ Read TOKEN-QUALITY.md

---

**Last Updated**: 14/12/2025
