# Project coding guidelines

- Use component-based, feature-isolated architecture. Do not put an entire application in one page or component file.
- Route files compose feature entry points; cross-feature imports use public index.js modules.
- Separate UI, state hooks, domain utilities, content configuration and feature styles.
- Keep components focused and reuse shared primitives.
- All supported code, config and documentation must be Prettier formatted.
- ESLint must pass with zero warnings. Run format:check, lint, tests and production build.
- Preserve accessible keyboard controls, reduced-motion preferences and user-controlled audio.
- Public content and connected booking features must reflect real configured data.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
