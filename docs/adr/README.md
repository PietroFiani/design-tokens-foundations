# Architecture Decision Records (ADR)

## What is an ADR?

An **Architecture Decision Record (ADR)** is a document that captures an important architectural decision made along with its context and consequences.

ADRs help teams:
- **Document the "why"** behind important decisions
- **Provide context** for future team members
- **Track evolution** of the design system over time
- **Avoid revisiting** already-settled debates
- **Share knowledge** across the organization

Each ADR describes a specific decision, the context that led to it, alternatives considered, and the implications of the choice.

---

## ADR Format

Each ADR follows a consistent structure:

```markdown
# ADR {number}: {Title}
**Date:** DD/MM/YYYY
**Status:** {Proposed | Accepted | Deprecated | Replaced by ADR-XXX}

## Summary
Brief 2-3 paragraph overview of the ADR:
- What problem does this solve?
- What approach was selected?
- Why was this approach chosen?

Include a "Key Decision" highlight summarizing the core choice.

## Context and Problem
What is the issue we're trying to solve? What constraints exist?

## Decision Criteria
What factors are we considering when making this decision?

## Alternatives Considered
What other options did we evaluate? (with pros/cons)

## Decision
What did we decide? What is the chosen approach?

## Consequences
What are the positive and negative outcomes of this decision?
- Positive
- Negative
- Risks
- Mitigation strategies

## References
Links to relevant resources, specifications, or other ADRs
```

---

## Table of Contents

| ADR | Title | Status | Date | Summary |
|-----|-------|--------|------|---------|
| [001](001-token-taxonomy.md) | Token Taxonomy | Accepted | 13/12/2025 | Defines the complete hierarchical structure for organizing tokens (primitive and semantic layers), file organization strategy, and system/theme/platform management |
| [002](002-taxon-variants.md) | Taxon Variants | Accepted | 13/12/2025 | Catalogs all possible values for each taxonomy level (layer, type/property, category/element, scale/variant, state) with brand color handling strategy |
| [003](003-type-values.md) | Type Values | Accepted | 13/12/2025 | Specifies formats and units for each W3C DTCG token type (color, dimension, typography, shadow, etc.) and platform transform strategies |
| [004](004-build-tooling-style-dictionary.md) | Build Tooling - Style Dictionary | Proposed | 13/12/2025 | Evaluates build tooling options for token transformation and selects Style Dictionary as the recommended build system for multi-platform token generation |

---

## ADR Process

### When to Create an ADR

Create an ADR when making decisions that:

- **Affect structure**: Changes to token taxonomy, naming conventions, or organization
- **Affect tooling**: Choices about build tools, design tool integrations, or workflows
- **Affect multiple teams**: Decisions that impact designers, developers, or platform teams
- **Have long-term impact**: Changes that are difficult or costly to reverse
- **Require explanation**: Complex decisions where the "why" isn't immediately obvious
- **Involve tradeoffs**: Situations where multiple valid approaches exist

**Examples**:
- Choosing between file-based and path-based theme organization (ADR 001)
- Deciding on variant naming systems (ADR 002)
- Selecting color formats and units (ADR 003)

### When NOT to Create an ADR

Don't create an ADR for:
- Minor token value changes (e.g., updating `blue.500` from `#3b82f6` to `#4b92ff`)
- Adding tokens that follow existing patterns
- Bug fixes or corrections
- Documentation updates
- Implementation details that don't affect architecture

### When to Modify an ADR

ADRs should be **immutable** once accepted. Instead of modifying:

1. **For corrections** (typos, clarifications):
   - Make minor edits if status is still "Proposed"
   - Once "Accepted", prefer creating a new ADR that supersedes the old one

2. **For status changes**:
   - Update the status field when decision status changes
   - Add a note explaining the status change

3. **For superseding decisions**:
   - Create a **new ADR** that references the old one
   - Mark the old ADR as "Superseded by ADR XXX"
   - Keep the old ADR in place for historical context

**Important**: **Never delete ADRs**. They provide valuable historical context.

---

## How to Create a New ADR

### Step 1: Copy the Template

Create a new file following the naming convention:
```
{number}-{short-title}.md
```

Example: `004-component-token-layer.md`

### Step 2: Fill in the Template

```markdown
# ADR {number}: {Title}
**Date:** {Current date in DD/MM/YYYY format}
**Status:** Proposed

## Summary
[2-3 paragraph overview explaining:
- What problem this solves
- What approach was selected
- Why this approach was chosen]

**Key Decision**: [One-sentence summary of the core decision]

## Context and Problem
[Describe the issue and constraints]

## Decision Criteria
[List the factors being considered]

## Alternatives Considered
[Document each option with pros/cons]

## Decision
[State the chosen approach and rationale]

## Consequences
### Positive
- [List positive outcomes]

### Negative
- [List negative outcomes]

### Risks
- [List potential risks]

### Mitigation
- [List mitigation strategies]

## References
- [Links to resources]
- [Links to related ADRs]
```

### Step 3: Propose and Review

1. Create a pull request or share the draft ADR
2. Gather feedback from stakeholders
3. Iterate on the content
4. Once consensus is reached, update status to "Accepted"

### Step 4: Update README

Add the new ADR to the Table of Contents in this README.

---

## How to Modify an Existing ADR

### Minor Corrections (Typos, Clarifications)

**If status is "Proposed"**:
1. Make edits directly to the ADR
2. Update the date if substantial changes were made
3. Note changes in commit message

**If status is "Accepted"**:
1. For typos/grammar: Make direct edits (minimal changes only)
2. For substantial changes: Create a new ADR that supersedes the old one

### Changing Decision Status

Update the status field at the top of the ADR:

**For deprecation** (no replacement):
```markdown
**Status:** Deprecated
**Deprecated Date:** 15/01/2026
**Reason:** Technology no longer in use; migrated to different approach
```

**For replacement** (new ADR replaces this one):
```markdown
**Status:** Replaced by ADR-006
**Replaced Date:** 15/01/2026
**Reason:** New approach introduces three-layer token architecture
```

### Replacing an ADR

When a new decision replaces an old one:

1. **Create new ADR** (e.g., ADR 006)
2. **In the new ADR**, reference the old one:
   ```markdown
   ## Context and Problem
   This ADR replaces ADR 002 by introducing...

   ## References
   - ADR 002: Taxon Variants (replaced by this ADR)
   ```

3. **In the old ADR**, update the status with specific ADR number:
   ```markdown
   **Status:** Replaced by ADR-006
   **Replaced Date:** 15/01/2026
   **Reason:** New approach introduces three-layer token architecture
   ```

4. **Do NOT delete** the old ADR - keep it for historical context

---

## ADR Statuses

| Status | Description | When to Use |
|--------|-------------|-------------|
| **Proposed** | Draft under discussion | Initial ADR creation, gathering feedback |
| **Accepted** | Decision approved and adopted | Consensus reached, ready to implement |
| **Deprecated** | No longer recommended, but not replaced | Decision outdated but no replacement exists |
| **Replaced by ADR-XXX** | Replaced by a newer ADR with specific reference | New ADR addresses same concern with updated approach. Must include ADR number |

### Status Lifecycle

```
Proposed → Accepted → [Deprecated or Replaced by ADR-XXX]
```

**Proposed**:
- ADR is under active discussion
- Content may change based on feedback
- Not yet binding

**Accepted**:
- Team has agreed on the decision
- Implementation should follow this ADR
- Changes require creating a new ADR

**Deprecated**:
- Decision no longer applies or recommended
- May be due to changed requirements, technology evolution, etc.
- No specific replacement ADR exists
- Keep for historical reference

**Replaced by ADR-XXX**:
- A newer ADR replaces this one
- Status MUST include the specific ADR number (e.g., "Replaced by ADR-006")
- Original ADR kept for context
- Clear migration path to new decision

---

## Best Practices

### Writing ADRs

1. **Be specific**: Focus on one decision per ADR
2. **Provide context**: Explain the problem thoroughly
3. **Document alternatives**: Show you considered multiple options
4. **Explain tradeoffs**: Be honest about pros and cons
5. **Keep it concise**: Aim for clarity over length
6. **Use examples**: Include code examples where helpful
7. **Link to resources**: Reference specs, articles, other ADRs

### Maintaining ADRs

1. **Never delete**: Keep all ADRs for historical context
2. **Update status**: Mark deprecated/superseded ADRs clearly
3. **Cross-reference**: Link related ADRs together
4. **Update table of contents**: Keep README current
5. **Review periodically**: Ensure ADRs still reflect reality
6. **Archive if needed**: Move very old ADRs to `archive/` subfolder if desired, but keep accessible

### Reviewing ADRs

When reviewing a proposed ADR, check:
- [ ] Is the problem clearly stated?
- [ ] Are decision criteria explicit?
- [ ] Were alternatives seriously considered?
- [ ] Is the rationale sound?
- [ ] Are consequences honestly assessed?
- [ ] Does it follow the standard format?
- [ ] Are references provided?
- [ ] Is it focused on a single decision?

---

## Example Workflow

### Scenario: Adding a new token layer

1. **Identify the need**: Team wants to add a component token layer
2. **Create ADR draft**: `004-component-token-layer.md` with status "Proposed"
3. **Share for feedback**: Team reviews and discusses
4. **Iterate**: Update based on feedback
5. **Reach consensus**: Team agrees on the approach
6. **Mark as accepted**: Update status to "Accepted"
7. **Update README**: Add ADR 004 to table of contents
8. **Implement**: Begin using the new component token layer

### Scenario: Changing an existing decision

1. **Identify change need**: Current approach has issues
2. **Create new ADR**: `005-updated-variant-naming.md`
3. **Reference old ADR**: Mention ADR 002 in context
4. **Complete new ADR**: Follow standard process
5. **Accept new ADR**: Mark ADR 005 as "Accepted"
6. **Update old ADR**: Mark ADR 002 as "Replaced by ADR-005" with date and reason
7. **Update README**: Update table showing both ADRs
8. **Migrate**: Transition from old to new approach

---

## Questions?

If you're unsure whether to create an ADR or how to structure one:

1. **Ask the team**: Discuss in your design system channel
2. **Review existing ADRs**: Look at 001-003 as examples
3. **Start with a draft**: Better to capture the decision than not
4. **Iterate**: ADRs can evolve during the proposal phase

---

## References

- [ADR GitHub Organization](https://adr.github.io/)
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR Tools](https://github.com/npryce/adr-tools)
- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
