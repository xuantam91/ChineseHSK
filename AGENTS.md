# Guidelines for Coding Agents (Antigravity & Codex)

## Project Principles
1. **Never fabricate real curriculum content**: Seed data must be explicitly labeled `[DEMO]`. Real content must pass through the Notion import/staging pipeline.
2. **Never leak secrets or credentials**: Do not commit API tokens, service role keys, or OAuth secrets to Git or UI payloads.
3. **Strict Timezone Handling**: All daily unlocking calculations use local date in `Asia/Ho_Chi_Minh` timezone (`YYYY-MM-DD`). Never calculate unlock dates by dividing UTC timestamps by 86,400,000.
4. **Row-Level Security (RLS) & Server-side Authorization**:
   - Students cannot read future locked lessons or other students' progress.
   - Quiz correct answers are never sent down to client prior to submission.
   - Admin access is verified server-side using secure role claims.
5. **Safe Asset Handling**: All external URLs and Google Drive links must be sanitized to prevent SSRF and XSS.
6. **No Breaking Changes**: Code must compile with TypeScript strict mode, pass linting, and pass all Vitest suites.
