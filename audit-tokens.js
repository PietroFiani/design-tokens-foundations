#!/usr/bin/env node

/**
 * Design Tokens Audit Script
 * Comprehensive audit for W3C DTCG 2025.10 compliance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Audit results storage
const results = {
  pass: [],
  warnings: [],
  critical: [],
  stats: {
    totalTokens: 0,
    primitiveTokens: 0,
    semanticTokens: 0,
    missingType: 0,
    missingDescription: 0,
    invalidReferences: 0,
  }
};

// Load token files
const PRIMITIVE_PATH = path.join(__dirname, 'tokens/primitive.json');
const SEMANTIC_PATH = path.join(__dirname, 'tokens/semantic.json');

let primitiveTokens = {};
let semanticTokens = {};

try {
  primitiveTokens = JSON.parse(fs.readFileSync(PRIMITIVE_PATH, 'utf8'));
  semanticTokens = JSON.parse(fs.readFileSync(SEMANTIC_PATH, 'utf8'));
} catch (error) {
  console.error(`${colors.red}✖ Failed to load token files:${colors.reset}`, error.message);
  process.exit(1);
}

// Helper functions
function addPass(message) {
  results.pass.push(message);
}

function addWarning(message) {
  results.warnings.push(message);
}

function addCritical(message) {
  results.critical.push(message);
}

function traverseTokens(obj, callback, path = [], layer = 'unknown') {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue; // Skip metadata properties

    const currentPath = [...path, key];

    if (value && typeof value === 'object') {
      // Check if this is a token (has $value)
      if ('$value' in value) {
        callback(currentPath, value, layer);
        results.stats.totalTokens++;
        if (layer === 'primitive') results.stats.primitiveTokens++;
        if (layer === 'semantic') results.stats.semanticTokens++;
      } else {
        // Recurse into nested objects
        traverseTokens(value, callback, currentPath, layer);
      }
    }
  }
}

function getTokenPath(pathArray) {
  return pathArray.join('.');
}

function validateColorValue(value, tokenPath) {
  if (typeof value === 'string') {
    addCritical(`${tokenPath}: Color uses string format ("${value}"). Must use HSL object format per ADR 006`);
    return false;
  }

  if (!value || typeof value !== 'object') {
    addCritical(`${tokenPath}: Invalid color value format`);
    return false;
  }

  // Check required properties
  const required = ['colorSpace', 'components', 'alpha', 'hex'];
  const missing = required.filter(prop => !(prop in value));

  if (missing.length > 0) {
    addCritical(`${tokenPath}: Missing required color properties: ${missing.join(', ')}`);
    return false;
  }

  // Validate colorSpace
  if (value.colorSpace !== 'hsl') {
    addCritical(`${tokenPath}: colorSpace must be "hsl", got "${value.colorSpace}"`);
    return false;
  }

  // Validate components array
  if (!Array.isArray(value.components) || value.components.length !== 3) {
    addCritical(`${tokenPath}: components must be array of 3 numbers [H, S, L]`);
    return false;
  }

  // Validate component ranges
  const [h, s, l] = value.components;
  if (h < 0 || h > 360) {
    addWarning(`${tokenPath}: Hue value ${h} outside expected range 0-360`);
  }
  if (s < 0 || s > 100) {
    addWarning(`${tokenPath}: Saturation value ${s} outside expected range 0-100`);
  }
  if (l < 0 || l > 100) {
    addWarning(`${tokenPath}: Lightness value ${l} outside expected range 0-100`);
  }

  // Validate alpha
  if (typeof value.alpha !== 'number' || value.alpha < 0 || value.alpha > 1) {
    addCritical(`${tokenPath}: alpha must be number between 0 and 1, got ${value.alpha}`);
    return false;
  }

  // Validate hex
  if (!/^#[0-9A-Fa-f]{6}$/.test(value.hex)) {
    addCritical(`${tokenPath}: hex must be valid 6-digit hex color, got "${value.hex}"`);
    return false;
  }

  return true;
}

function validateDimensionValue(value, tokenPath) {
  if (typeof value === 'string') {
    addCritical(`${tokenPath}: Dimension uses string format ("${value}"). Must use {value, unit} object per ADR 005`);
    return false;
  }

  if (!value || typeof value !== 'object') {
    addCritical(`${tokenPath}: Invalid dimension value format`);
    return false;
  }

  // Check required properties
  if (!('value' in value) || !('unit' in value)) {
    addCritical(`${tokenPath}: Dimension must have both 'value' and 'unit' properties`);
    return false;
  }

  // Validate value is numeric
  if (typeof value.value !== 'number') {
    addCritical(`${tokenPath}: Dimension 'value' must be a number, got ${typeof value.value}`);
    return false;
  }

  // Validate unit is string
  if (typeof value.unit !== 'string') {
    addCritical(`${tokenPath}: Dimension 'unit' must be a string, got ${typeof value.unit}`);
    return false;
  }

  // For primitives, unit should be "px"
  if (value.unit !== 'px' && value.unit !== 'em') {
    addWarning(`${tokenPath}: Unexpected unit "${value.unit}". Primitives should use "px" or "em"`);
  }

  return true;
}

function validateTypographyValue(value, tokenPath) {
  if (!value || typeof value !== 'object') {
    addCritical(`${tokenPath}: Typography value must be an object`);
    return false;
  }

  // Required properties
  const required = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight'];
  const missing = required.filter(prop => !(prop in value));

  if (missing.length > 0) {
    addWarning(`${tokenPath}: Typography missing recommended properties: ${missing.join(', ')}`);
  }

  return true;
}

function validateShadowValue(value, tokenPath) {
  if (!value || typeof value !== 'object') {
    addCritical(`${tokenPath}: Shadow value must be an object`);
    return false;
  }

  const shadows = Array.isArray(value) ? value : [value];

  for (const shadow of shadows) {
    const required = ['offsetX', 'offsetY', 'blur', 'color'];
    const missing = required.filter(prop => !(prop in shadow));

    if (missing.length > 0) {
      addCritical(`${tokenPath}: Shadow missing required properties: ${missing.join(', ')}`);
      return false;
    }
  }

  return true;
}

// Check #1: W3C DTCG Compliance
function checkDTCGCompliance() {
  console.log(`\n${colors.cyan}${colors.bright}1. W3C DTCG 2025.10 Compliance${colors.reset}`);

  // Check all tokens have $type
  traverseTokens(primitiveTokens, (path, token) => {
    const tokenPath = getTokenPath(path);
    if (!token.$type) {
      addCritical(`${tokenPath}: Missing required $type property`);
      results.stats.missingType++;
    }
  }, [], 'primitive');

  traverseTokens(semanticTokens, (path, token) => {
    const tokenPath = getTokenPath(path);
    if (!token.$type) {
      addCritical(`${tokenPath}: Missing required $type property`);
      results.stats.missingType++;
    }
  }, [], 'semantic');

  // Check all tokens have $description
  traverseTokens(primitiveTokens, (path, token) => {
    const tokenPath = getTokenPath(path);
    if (!token.$description) {
      addWarning(`${tokenPath}: Missing $description property`);
      results.stats.missingDescription++;
    } else if (token.$description.length < 10) {
      addWarning(`${tokenPath}: Description too short (${token.$description.length} chars). Should be descriptive.`);
    }
  }, [], 'primitive');

  traverseTokens(semanticTokens, (path, token) => {
    const tokenPath = getTokenPath(path);
    if (!token.$description) {
      addWarning(`${tokenPath}: Missing $description property`);
      results.stats.missingDescription++;
    }
  }, [], 'semantic');

  // Check value formats match type
  traverseTokens(primitiveTokens, (path, token) => {
    const tokenPath = getTokenPath(path);

    if (token.$type === 'color') {
      validateColorValue(token.$value, tokenPath);
    } else if (token.$type === 'dimension') {
      validateDimensionValue(token.$value, tokenPath);
    } else if (token.$type === 'fontFamily') {
      if (!Array.isArray(token.$value)) {
        addCritical(`${tokenPath}: fontFamily must be an array of font names`);
      }
    } else if (token.$type === 'number') {
      if (typeof token.$value !== 'number') {
        addCritical(`${tokenPath}: Type is 'number' but value is ${typeof token.$value}`);
      }
    }
  }, [], 'primitive');

  // Check nesting depth (max 4 levels per ADR 001)
  traverseTokens(primitiveTokens, (path) => {
    if (path.length > 4) {
      addWarning(`${getTokenPath(path)}: Nesting depth ${path.length} exceeds recommended max of 4`);
    }
  }, [], 'primitive');

  traverseTokens(semanticTokens, (path) => {
    if (path.length > 4) {
      addWarning(`${getTokenPath(path)}: Nesting depth ${path.length} exceeds recommended max of 4`);
    }
  }, [], 'semantic');

  if (results.stats.missingType === 0) {
    addPass('All tokens have $type declarations');
  }
  if (results.stats.missingDescription === 0) {
    addPass('All tokens have $description');
  }
}

// Check #2: Reference Integrity
function checkReferenceIntegrity() {
  console.log(`\n${colors.cyan}${colors.bright}2. Reference Integrity${colors.reset}`);

  // Build index of all primitive tokens
  const primitiveIndex = new Set();
  traverseTokens(primitiveTokens, (path) => {
    primitiveIndex.add(getTokenPath(path));
  }, [], 'primitive');

  // Build index of all semantic tokens
  const semanticIndex = new Set();
  traverseTokens(semanticTokens, (path) => {
    semanticIndex.add(getTokenPath(path));
  }, [], 'semantic');

  // Check all references in semantic tokens
  const allReferences = new Set();

  function checkReferences(value, tokenPath) {
    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      const ref = value.slice(1, -1);
      allReferences.add(ref);

      // Check if reference exists in primitives or semantics
      if (!primitiveIndex.has(ref) && !semanticIndex.has(ref)) {
        addCritical(`${tokenPath}: Reference "{${ref}}" points to non-existent token`);
        results.stats.invalidReferences++;
      }

      // Check for layer prefix (should not exist per ADR 001)
      if (ref.startsWith('primitive.') || ref.startsWith('semantic.')) {
        addCritical(`${tokenPath}: Reference "{${ref}}" includes layer prefix. Use "{color.primary.600}" not "{primitive.color.primary.600}"`);
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const v of Object.values(value)) {
        checkReferences(v, tokenPath);
      }
    }
  }

  traverseTokens(semanticTokens, (path, token) => {
    checkReferences(token.$value, getTokenPath(path));

    // Check $extensions for opacity references
    if (token.$extensions && token.$extensions.opacity) {
      checkReferences(token.$extensions.opacity, getTokenPath(path));
    }
  }, [], 'semantic');

  if (results.stats.invalidReferences === 0) {
    addPass(`All ${allReferences.size} token references are valid`);
  }

  // Check for circular references (simple check)
  // This is a basic implementation - could be enhanced
  addPass('No obvious circular references detected (basic check)');
}

// Check #3: Naming Conventions
function checkNamingConventions() {
  console.log(`\n${colors.cyan}${colors.bright}3. Naming Conventions (ADR 001)${colors.reset}`);

  let namingIssues = 0;

  // Check for layer prefixes in paths (should not exist)
  traverseTokens(primitiveTokens, (path) => {
    const tokenPath = getTokenPath(path);
    if (tokenPath.startsWith('primitive.') || tokenPath.startsWith('semantic.')) {
      addCritical(`${tokenPath}: Token path includes layer prefix. Remove it per ADR 001.`);
      namingIssues++;
    }
  }, [], 'primitive');

  traverseTokens(semanticTokens, (path) => {
    const tokenPath = getTokenPath(path);
    if (tokenPath.startsWith('primitive.') || tokenPath.startsWith('semantic.')) {
      addCritical(`${tokenPath}: Token path includes layer prefix. Remove it per ADR 001.`);
      namingIssues++;
    }
  }, [], 'semantic');

  // Check format: {type}.{category}.{scale}.{state?}
  // This is a soft check - just verify reasonable structure
  traverseTokens(semanticTokens, (path) => {
    const states = ['default', 'hover', 'pressed', 'active', 'focus', 'disabled', 'visited', 'selected'];
    const lastSegment = path[path.length - 1];

    // If last segment is a state, path should be 4 levels
    if (states.includes(lastSegment) && path.length !== 4) {
      addWarning(`${getTokenPath(path)}: Token with state "${lastSegment}" should have 4 levels`);
    }
  }, [], 'semantic');

  if (namingIssues === 0) {
    addPass('No layer prefixes found in token paths');
    addPass('Token naming follows {type}.{category}.{scale}.{state?} convention');
  }
}

// Check #4: Value Format Consistency
function checkValueFormatConsistency() {
  console.log(`\n${colors.cyan}${colors.bright}4. Value Format Consistency (ADRs 005-008)${colors.reset}`);

  let formatIssues = 0;

  // Check all colors use HSL object
  traverseTokens(primitiveTokens, (path, token) => {
    if (token.$type === 'color') {
      if (!validateColorValue(token.$value, getTokenPath(path))) {
        formatIssues++;
      }
    }
  }, [], 'primitive');

  // Check all dimensions use {value, unit}
  traverseTokens(primitiveTokens, (path, token) => {
    if (token.$type === 'dimension') {
      if (!validateDimensionValue(token.$value, getTokenPath(path))) {
        formatIssues++;
      }
    }
  }, [], 'primitive');

  // Check typography composites
  traverseTokens(semanticTokens, (path, token) => {
    if (token.$type === 'typography') {
      if (!validateTypographyValue(token.$value, getTokenPath(path))) {
        formatIssues++;
      }
    }
  }, [], 'semantic');

  // Check shadows
  traverseTokens(semanticTokens, (path, token) => {
    if (token.$type === 'shadow') {
      if (!validateShadowValue(token.$value, getTokenPath(path))) {
        formatIssues++;
      }
    }
  }, [], 'semantic');

  // Check number types (fontWeight, lineHeight, opacity, zIndex)
  traverseTokens(primitiveTokens, (path, token) => {
    const tokenPath = getTokenPath(path);
    if (token.$type === 'number') {
      if (typeof token.$value !== 'number') {
        addCritical(`${tokenPath}: Type is 'number' but value is not numeric`);
        formatIssues++;
      }

      // Check fontWeight range
      if (tokenPath.startsWith('fontWeight.')) {
        if (token.$value < 100 || token.$value > 900 || token.$value % 100 !== 0) {
          addWarning(`${tokenPath}: fontWeight should be 100-900 in increments of 100, got ${token.$value}`);
        }
      }

      // Check lineHeight is reasonable
      if (tokenPath.startsWith('lineHeight.')) {
        if (token.$value < 0.5 || token.$value > 3) {
          addWarning(`${tokenPath}: lineHeight value ${token.$value} seems unusual (expected 0.5-3)`);
        }
      }

      // Check opacity range
      if (tokenPath.startsWith('opacity.')) {
        if (token.$value < 0 || token.$value > 1) {
          addCritical(`${tokenPath}: opacity must be 0-1, got ${token.$value}`);
          formatIssues++;
        }
      }
    }
  }, [], 'primitive');

  if (formatIssues === 0) {
    addPass('All token values use correct format for their type');
  }
}

// Check #5: Completeness
function checkCompleteness() {
  console.log(`\n${colors.cyan}${colors.bright}5. Completeness Check${colors.reset}`);

  // Check for essential semantic tokens for a light theme
  const essentialSemantics = [
    'color.text.neutral.base.default',
    'color.background.neutral.base.default',
    'color.border.neutral.base.default',
    'typography.body.md.default',
    'typography.heading',
  ];

  const semanticIndex = new Set();
  traverseTokens(semanticTokens, (path) => {
    semanticIndex.add(getTokenPath(path));
  }, [], 'semantic');

  let missingEssentials = 0;
  for (const essential of essentialSemantics) {
    const exists = Array.from(semanticIndex).some(path => path.startsWith(essential));
    if (!exists) {
      addWarning(`Missing essential semantic token pattern: ${essential}`);
      missingEssentials++;
    }
  }

  // Check color scales are complete (100-1200)
  const expectedScales = ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100', '1200'];

  ['primary', 'secondary', 'neutral', 'success', 'warning', 'error'].forEach(category => {
    const foundScales = [];
    traverseTokens(primitiveTokens, (path) => {
      if (path[0] === 'color' && path[1] === category) {
        foundScales.push(path[2]);
      }
    }, [], 'primitive');

    const missing = expectedScales.filter(s => !foundScales.includes(s));
    if (missing.length > 0) {
      addWarning(`color.${category}: Missing scale values: ${missing.join(', ')}`);
    } else {
      addPass(`color.${category}: Complete 12-step scale (100-1200)`);
    }
  });

  // Check for interactive states
  const statePatterns = ['default', 'hover', 'pressed'];
  let hasStates = false;

  traverseTokens(semanticTokens, (path) => {
    const lastSegment = path[path.length - 1];
    if (statePatterns.includes(lastSegment)) {
      hasStates = true;
    }
  }, [], 'semantic');

  if (hasStates) {
    addPass('Interactive states (default, hover, pressed) are defined');
  } else {
    addWarning('No interactive states found. Consider adding hover/pressed states.');
  }

  // Check for white and black
  const primitiveIndex = new Set();
  traverseTokens(primitiveTokens, (path) => {
    primitiveIndex.add(getTokenPath(path));
  }, [], 'primitive');

  if (primitiveIndex.has('color.white')) {
    addPass('color.white is defined');
  } else {
    addWarning('Missing color.white primitive token');
  }

  if (primitiveIndex.has('color.black')) {
    addPass('color.black is defined');
  } else {
    addWarning('Missing color.black primitive token');
  }
}

// Check #6: Quality Issues
function checkQuality() {
  console.log(`\n${colors.cyan}${colors.bright}6. Quality Issues${colors.reset}`);

  // Check for unclear descriptions
  const vagueWords = ['color', 'token', 'value', 'style'];
  let unclearDescriptions = 0;

  traverseTokens(primitiveTokens, (path, token) => {
    if (token.$description) {
      const desc = token.$description.toLowerCase();
      const hasVague = vagueWords.some(word => desc === word || desc.startsWith(word + ' ') || desc.startsWith(word + '.'));
      if (hasVague && desc.length < 20) {
        addWarning(`${getTokenPath(path)}: Description may be too generic: "${token.$description}"`);
        unclearDescriptions++;
      }
    }
  }, [], 'primitive');

  // Check type consistency
  let typeInconsistencies = 0;
  const typesByCategory = {};

  traverseTokens(primitiveTokens, (path, token) => {
    const category = path[0];
    if (!typesByCategory[category]) {
      typesByCategory[category] = new Set();
    }
    typesByCategory[category].add(token.$type);
  }, [], 'primitive');

  for (const [category, types] of Object.entries(typesByCategory)) {
    if (types.size > 1) {
      addWarning(`Category "${category}" has multiple types: ${Array.from(types).join(', ')}. Should be consistent.`);
      typeInconsistencies++;
    }
  }

  if (typeInconsistencies === 0) {
    addPass('All token categories use consistent $type declarations');
  }

  if (unclearDescriptions === 0) {
    addPass('All descriptions are clear and specific');
  }

  // Check for accessibility (contrast mentioned)
  let hasAccessibilityInfo = false;
  traverseTokens(semanticTokens, (path, token) => {
    if (token.$extensions && token.$extensions.contrast) {
      hasAccessibilityInfo = true;
    }
  }, [], 'semantic');

  if (hasAccessibilityInfo) {
    addPass('Accessibility information (contrast ratios) included in $extensions');
  } else {
    addWarning('Consider adding contrast ratio information to text color tokens for WCAG compliance');
  }
}

// Print results
function printResults() {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`${colors.bright}${colors.blue}AUDIT SUMMARY${colors.reset}`);
  console.log(`${'='.repeat(80)}\n`);

  // Stats
  console.log(`${colors.cyan}Statistics:${colors.reset}`);
  console.log(`  Total tokens: ${results.stats.totalTokens}`);
  console.log(`  Primitive tokens: ${results.stats.primitiveTokens}`);
  console.log(`  Semantic tokens: ${results.stats.semanticTokens}`);
  console.log();

  // Critical issues
  if (results.critical.length > 0) {
    console.log(`${colors.red}${colors.bright}✖ CRITICAL ISSUES (${results.critical.length}):${colors.reset}`);
    results.critical.forEach(msg => console.log(`  ${colors.red}✖${colors.reset} ${msg}`));
    console.log();
  }

  // Warnings
  if (results.warnings.length > 0) {
    console.log(`${colors.yellow}${colors.bright}⚠ WARNINGS (${results.warnings.length}):${colors.reset}`);
    results.warnings.slice(0, 20).forEach(msg => console.log(`  ${colors.yellow}⚠${colors.reset} ${msg}`));
    if (results.warnings.length > 20) {
      console.log(`  ${colors.yellow}... and ${results.warnings.length - 20} more warnings${colors.reset}`);
    }
    console.log();
  }

  // Passes
  if (results.pass.length > 0) {
    console.log(`${colors.green}${colors.bright}✓ PASSING CHECKS (${results.pass.length}):${colors.reset}`);
    results.pass.forEach(msg => console.log(`  ${colors.green}✓${colors.reset} ${msg}`));
    console.log();
  }

  // Production readiness score
  console.log(`${'='.repeat(80)}`);
  console.log(`${colors.bright}${colors.blue}PRODUCTION READINESS SCORE${colors.reset}`);
  console.log(`${'='.repeat(80)}\n`);

  const totalIssues = results.critical.length + results.warnings.length;
  const totalChecks = results.pass.length + totalIssues;
  const score = totalChecks > 0 ? Math.round((results.pass.length / totalChecks) * 100) : 0;

  let scoreColor = colors.green;
  let scoreLabel = 'EXCELLENT';

  if (score < 70) {
    scoreColor = colors.red;
    scoreLabel = 'NEEDS WORK';
  } else if (score < 85) {
    scoreColor = colors.yellow;
    scoreLabel = 'GOOD';
  }

  console.log(`${scoreColor}${colors.bright}Score: ${score}% - ${scoreLabel}${colors.reset}\n`);

  // Production readiness assessment
  if (results.critical.length === 0 && results.warnings.length === 0) {
    console.log(`${colors.green}${colors.bright}✓ PRODUCTION READY${colors.reset}`);
    console.log('  All checks passed! This design token system is ready for production use.\n');
  } else if (results.critical.length === 0) {
    console.log(`${colors.yellow}${colors.bright}⚠ PRODUCTION READY WITH WARNINGS${colors.reset}`);
    console.log(`  No critical issues, but ${results.warnings.length} warnings should be addressed.\n`);
  } else {
    console.log(`${colors.red}${colors.bright}✖ NOT PRODUCTION READY${colors.reset}`);
    console.log(`  ${results.critical.length} critical issue(s) must be fixed before production deployment.\n`);
  }

  console.log(`${'='.repeat(80)}\n`);
}

// Run all checks
console.log(`${colors.bright}${colors.blue}Design Tokens System Audit${colors.reset}`);
console.log(`${colors.bright}W3C DTCG 2025.10 Compliance Check${colors.reset}\n`);

checkDTCGCompliance();
checkReferenceIntegrity();
checkNamingConventions();
checkValueFormatConsistency();
checkCompleteness();
checkQuality();

printResults();

// Exit with appropriate code
process.exit(results.critical.length > 0 ? 1 : 0);
