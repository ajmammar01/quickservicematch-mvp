# Behaviour
- Use TypeScript and Next.js App Router.
- Keep code minimal, composable, and commented.
- Confirm file paths before overwriting.
- Prefer SQLite in dev, Supabase in prod.
- Write stepwise: plan -> code -> run -> test -> iterate.

# Workflows
## Feature workflow
1. Plan files + data types.
2. Generate minimal implementation.
3. Add validation + error handling.
4. Write a quick test or manual reproduction steps.

## API integration workflow
1. Read official docs (add to /context).
2. Create typed client + small probe script.
3. Handle auth + errors explicitly (no hardcoded mocks).
4. Add env vars to .env.local and document them in README.

# Style
- Follow modern, minimal UI with light/dark support.
- Keep dependencies lean; avoid heavy UI kits unless necessary.
