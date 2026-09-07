# Security

## Automated scanning

| Job                         | What it checks                       | Fails on                           |
| --------------------------- | ------------------------------------ | ---------------------------------- |
| **Lint, typecheck & build** | ESLint, TypeScript, production build | Any error                          |
| **App-specific rules**      | `scripts/security-rules.mjs`         | Secrets exposed in client env, etc |

## Running locally

```bash
npm run lint && npm run typecheck
```

## Reporting a vulnerability

Email the technical contact at Banky Hotel & Suites rather than opening a public issue.

