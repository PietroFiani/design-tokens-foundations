# ADR 005: Dimension Value and Unit Separation
**Date:** 14/12/2025
**Status:** Accepted

## Summary

This ADR defines the structure for dimension token values to comply with the W3C DTCG specification. We mandate that **dimension values must use an object structure** with separated `value` (numeric) and `unit` (string) properties, rather than concatenated strings like `"16px"`. This provides better type safety, enables programmatic unit conversion, and aligns with the DTCG specification's recommended approach for dimension tokens.

**Key Decision**: All dimension tokens (`spacing`, `fontSize`, `borderRadius`, `borderWidth`) must use the object format: `{"value": number, "unit": "px"}`.

## Context and Problem

The W3C Design Tokens Community Group (DTCG) specification defines dimension tokens as tokens that represent sizes, spacing, and other dimensional properties. There are two common approaches to representing dimensional values:

### Approach 1: String Concatenation (Legacy)
```json
{
  "spacing": {
    "4": {
      "$type": "dimension",
      "$value": "16px"
    }
  }
}
```

### Approach 2: Object with Separated Properties (DTCG Spec)
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

**Problems with string concatenation**:
- Type ambiguity: Parsing requires string manipulation
- Unit conversion complexity: Must extract number from string
- Tool compatibility: Some tools expect structured data
- Validation difficulty: Hard to validate numeric values
- Platform transforms: Build tools must parse strings to convert units

**Benefits of separated structure**:
- Type safety: `value` is explicitly numeric, `unit` is explicitly string
- Easy unit conversion: Direct access to numeric value
- Better validation: Can validate value ranges independently
- Tool compatibility: Aligns with DTCG specification
- Platform transforms: Simpler arithmetic operations for unit conversion

## Decision Criteria

- **W3C DTCG 2025.10 compliance**: Follow specification standards for dimension tokens
- **Type safety**: Enable strong typing in TypeScript and other typed languages
- **Tool compatibility**: Work seamlessly with Style Dictionary, Figma Tokens, and other DTCG-compliant tools
- **Unit conversion**: Enable easy programmatic conversion (px → rem, pt, dp)
- **Maintainability**: Clear, unambiguous value representation
- **Validation**: Enable range validation and type checking

---

## Decision

All dimension tokens MUST use an **object structure with separated `value` and `unit` properties**.

### Format Specification

**Required structure**:
```json
{
  "$value": {
    "value": <number>,
    "unit": "<unit-string>"
  }
}
```

**Properties**:
- `value` (required): Numeric value as a number type (not string)
- `unit` (required): Unit identifier as a string

**Allowed units** (as per DTCG spec and ADR 003):
- `"px"` - Pixels (primary unit for all primitive dimensions)
- Platform-specific transforms will convert to `rem`, `pt`, `dp` during build

### Complete Examples

**Spacing tokens**:
```json
{
  "spacing": {
    "0": {
      "$type": "dimension",
      "$value": {
        "value": 0,
        "unit": "px"
      },
      "$description": "Zero spacing. Used for removing gaps."
    },
    "4": {
      "$type": "dimension",
      "$value": {
        "value": 16,
        "unit": "px"
      },
      "$description": "Medium spacing (16px). Default for most layouts."
    }
  }
}
```

**Font size tokens**:
```json
{
  "fontSize": {
    "md": {
      "$type": "dimension",
      "$value": {
        "value": 16,
        "unit": "px"
      },
      "$description": "Medium (16px). Base size for body text."
    },
    "xl": {
      "$type": "dimension",
      "$value": {
        "value": 20,
        "unit": "px"
      },
      "$description": "Extra large (20px). Small headings."
    }
  }
}
```

**Border radius tokens**:
```json
{
  "borderRadius": {
    "md": {
      "$type": "dimension",
      "$value": {
        "value": 4,
        "unit": "px"
      },
      "$description": "Medium radius (4px). Standard for buttons, inputs."
    },
    "full": {
      "$type": "dimension",
      "$value": {
        "value": 9999,
        "unit": "px"
      },
      "$description": "Fully rounded. Pills and badges."
    }
  }
}
```

**Border width tokens**:
```json
{
  "borderWidth": {
    "thin": {
      "$type": "dimension",
      "$value": {
        "value": 1,
        "unit": "px"
      },
      "$description": "Thin border (1px). Default for most borders."
    }
  }
}
```

---

## Rationale

### Why Separate Value and Unit?

1. **DTCG Specification Alignment**
   - The W3C DTCG specification recommends this structure
   - Ensures compatibility with spec-compliant tools
   - Future-proofs against specification updates

2. **Type Safety**
   ```typescript
   // With separated structure - type safe
   interface DimensionValue {
     value: number;  // Numeric type
     unit: string;   // String type
   }

   // With string concatenation - requires parsing
   type DimensionValue = string;  // "16px" - ambiguous
   ```

3. **Easy Unit Conversion**
   ```javascript
   // Separated structure - simple arithmetic
   const remValue = dimensionToken.value / 16;

   // String concatenation - requires parsing
   const remValue = parseFloat(dimensionToken.replace('px', '')) / 16;
   ```

4. **Validation**
   ```javascript
   // Separated structure - direct validation
   if (dimensionToken.value < 0) throw new Error('Negative spacing not allowed');

   // String concatenation - must parse first
   const value = parseFloat(dimensionToken);
   if (value < 0) throw new Error('Negative spacing not allowed');
   ```

5. **Platform Transforms**
   Style Dictionary and other build tools can directly access the numeric value:
   ```javascript
   // Transform for web (px → rem)
   {
     type: 'value',
     matcher: (token) => token.type === 'dimension',
     transformer: (token) => {
       const { value, unit } = token.value;
       if (unit === 'px') {
         return { value: value / 16, unit: 'rem' };
       }
       return token.value;
     }
   }
   ```

---

## Implementation Guidelines

### Creating New Dimension Tokens

✅ **Correct**:
```json
{
  "spacing": {
    "8": {
      "$type": "dimension",
      "$value": {
        "value": 32,
        "unit": "px"
      }
    }
  }
}
```

❌ **Incorrect**:
```json
{
  "spacing": {
    "8": {
      "$type": "dimension",
      "$value": "32px"  // ❌ String concatenation
    }
  }
}
```

❌ **Incorrect**:
```json
{
  "spacing": {
    "8": {
      "$type": "dimension",
      "$value": {
        "value": "32",  // ❌ Value should be number, not string
        "unit": "px"
      }
    }
  }
}
```

### Token References

When referencing dimension tokens in semantic tokens, use the same reference syntax:

```json
{
  "spacing": {
    "padding": {
      "md": {
        "$type": "dimension",
        "$value": "{spacing.4}",
        "$description": "Medium padding. References spacing.4 primitive token."
      }
    }
  }
}
```

Build tools will resolve the reference and maintain the object structure.

---

## Consequences

### Positive

- **DTCG Compliant**: Follows W3C specification exactly
- **Type Safety**: Enables strong typing in TypeScript, Flow, and other type systems
- **Tool Compatibility**: Works seamlessly with DTCG-compliant tools
- **Simpler Transforms**: Build tools can directly access numeric values
- **Better Validation**: Can validate value ranges without parsing
- **Clear Intent**: Explicitly separates what is the value vs what is the unit
- **Future-Proof**: Aligns with evolving DTCG standards

### Negative

- **Verbosity**: More verbose than string concatenation (`"16px"` vs `{"value": 16, "unit": "px"}`)
- **Migration Required**: Existing tokens using string format must be updated
- **JSON Size**: Slightly larger JSON file sizes

### Migration Impact

**Affected tokens**:
- All `spacing.*` tokens
- All `fontSize.*` tokens
- All `borderRadius.*` tokens
- All `borderWidth.*` tokens
- Any semantic tokens that reference the above

**Migration strategy**:
1. Update primitive dimension tokens to use object structure
2. Verify all semantic token references still work
3. Update build tool configurations if needed
4. Test generated output across all platforms

---

## Validation Rules

1. **Value must be numeric**: `value` property MUST be a number type (not string)
2. **Unit must be string**: `unit` property MUST be a string
3. **Unit must be "px"**: For primitive tokens, unit MUST be `"px"` (as per ADR 003)
4. **Both properties required**: Both `value` and `unit` MUST be present
5. **Type declaration**: Dimension tokens MUST include `"$type": "dimension"`

---

## Tool Configuration

### Style Dictionary

Style Dictionary supports this structure natively. Example transform:

```javascript
{
  type: 'value',
  name: 'dimension/px-to-rem',
  matcher: (token) => token.type === 'dimension',
  transformer: (token) => {
    const { value, unit } = token.value;
    if (unit === 'px') {
      return `${value / 16}rem`;
    }
    return `${value}${unit}`;
  }
}
```

### Figma Tokens Studio

Figma Tokens Studio supports the object structure when using DTCG format:

```json
{
  "$type": "dimension",
  "$value": {
    "value": 16,
    "unit": "px"
  }
}
```

---

## References

- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [Design Tokens Format Specification (DTCG 2025.10)](https://www.designtokens.org/TR/drafts/format/)
- [DTCG Dimension Type Specification](https://tr.designtokens.org/format/#dimension)
- [Style Dictionary Documentation](https://styledictionary.com/)
- ADR 003: Type Values - Defines px as the primary unit for primitives
- ADR 001: Token Taxonomy - Defines token organization structure
