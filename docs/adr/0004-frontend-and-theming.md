# ADR-0004: Next.js with semantic CSS-variable theming

**Status:** Proposed

## Context and drivers

Orbit needs public discovery, an interactive dashboard, responsive/accessibility quality, light/dark/system themes, and future themes without component rewrites.

## Options and trade-offs

- **Next.js + Tailwind + CSS variables:** productive, explicit semantic tokens, good public rendering; class discipline and initial theme script need care.
- **CSS Modules:** strong locality and low runtime; more repeated composition and no ready utility vocabulary.
- **Runtime CSS-in-JS/theme provider:** rich dynamic theming; hydration/runtime cost and server-rendering complexity.
- **Component suite/admin template:** fast scaffolding; generic appearance, dependency constraints, and theme overrides.

## Proposed decision

Use Next.js App Router, React, TypeScript, Tailwind utilities mapped to semantic CSS custom properties, and accessible headless primitives selectively. Resolve explicit cookie preference then system preference before paint. Tokens include color roles, typography, spacing, radius, elevation, focus, and motion.

## Consequences

Adding a theme means defining a complete token set and testing contrast/visuals, not editing features. Developers must avoid hardcoded colors and backend rules in components.

## Risks and mitigation

Prevent theme flash with server-readable cookie/prepaint script and CSP strategy. Lint/review hardcoded values; test contrast, focus, reduced motion, and all states in both themes.

## Reconsider when

Brand requirements demand runtime user-authored palettes, native targets dominate, or Tailwind becomes a constraint demonstrated by implementation—not preference.
