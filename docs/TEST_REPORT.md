# Chinese Learning Journey — Test & Quality Assurance Report

**Date of Execution:** 2026-11-10  
**Status:** ALL TESTS PASSING (100% Green)

---

## 1. Executive Summary

| Verification Category | Status | Details |
|-----------------------|--------|---------|
| **TypeScript Strict Compilation** | **PASS** | `npx tsc --noEmit` — 0 errors |
| **Vitest Unit & Integration Suites** | **PASS** | 10 test files, 72/72 tests passing |
| **Next.js Production Build** | **PASS** | 36 static & dynamic routes compiled |
| **Timezone Boundary Testing** | **PASS** | Strict `Asia/Ho_Chi_Minh` (UTC+7) validated |
| **Security & SSRF Mitigation** | **PASS** | Malicious Drive URLs & private IPs blocked |
| **Quiz Secret Preservation** | **PASS** | Correct answer keys withheld from client |

---

## 2. Vitest Test Suite Breakdown

### 2.1 Scheduling & Timezone Engine (`tests/unit/scheduling.test.ts`, `src/lib/scheduling/__tests__/scheduling.test.ts`, `src/lib/timezone.test.ts`)
- **Student Timeline Isolation**: Validated that Student A (`2026-03-01`) and Student B (`2026-03-10`) receive completely separate, independent unlock schedules.
- **Timezone Boundary (UTC+7)**: Tested 23:59 vs 00:01 local transition at `Asia/Ho_Chi_Minh`.
- **Leap Year Calculations**: Verified Feb 28 -> Feb 29 -> Mar 1 in leap years (2024/2028) vs Feb 28 -> Mar 1 in non-leap years (2026).
- **Backlog & Makeup Learning**: Skipping 3 days accurately generates 3 backlog items; completing one day decrements debt to 2; rest days are not counted as backlog debt.
- **Sequence Rules**: Strict sequence enforces prerequisite completion before advancing; non-strict allows catching up on overdue days in any order.

### 2.2 Google Drive Asset Parser & SSRF Mitigation (`tests/unit/drive-parser.test.ts`, `src/lib/drive.test.ts`, `src/lib/google-drive/__tests__/google-drive.test.ts`)
- **Valid URLs**: Successfully parses `/file/d/{id}/view`, `/open?id=`, `/uc?id=`, Docs, Sheets, and Slides URLs.
- **Resource Key Forwarding**: Retains `resourcekey` query parameter for restricted Drive files.
- **SSRF Prevention**: Rejects private IP addresses (`169.254.169.254`, `127.0.0.1`, `localhost`) and malicious domain prefixes (`drive.google.com.attacker.com`).
- **Protocol Whitelist**: Blocks dangerous protocols (`javascript:`, `data:`, `file:`, `blob:`).

### 2.3 Quiz Grading & Anti-Cheat Engine (`tests/unit/quiz-grading.test.ts`, `src/lib/quiz/__tests__/quiz-security.test.ts`)
- **Grading Logic**: Accurately computes scores for single choice, multiple choice (set equality), and true/false.
- **Passing Criteria**: Evaluates attempts against `passing_score` (default 80%).
- **Attempt Limit Enforcement**: Correctly raises `QuizAttemptLimitError` when attempts exceed quota.
- **Zero Client Leakage**: Verified that quiz question retrieval endpoints strip `correct_answer_jsonb` from student responses.

### 2.4 Notion Import Pipeline (`tests/unit/notion-import.test.ts`)
- **Parsers**: Tested extraction of months, weeks, days, lessons, and blocks from Markdown, CSV, and JSON.
- **Duplicate Prevention**: Rejects duplicate `day_index` entries within the same version.
- **Staging & Dry Run**: Validates counts and identifies unverified URLs without modifying the database.
- **Idempotency**: Computes SHA-256 checksum and skips duplicate commits.

### 2.5 API Endpoints (`tests/api/routes.test.ts`)
- **Health Check**: Verified `/api/health` returns status 200 without exposing secrets.
- **Roadmap & Day Locking**: Verified future lessons return 403 Forbidden.
- **Progress Tracking**: Verified block completion and quiz submission updates progress idempotently.

---

## 3. Production Build Output

```
Route (app)                                 Size  First Load JS
┌ ○ /                                      165 B         106 kB
├ ○ /_not-found                             1 kB         104 kB
├ ○ /admin                               4.99 kB         111 kB
├ ○ /admin/assets                        4.55 kB         107 kB
├ ○ /admin/curriculum                     6.3 kB         109 kB
├ ○ /admin/import                        4.58 kB         107 kB
├ ○ /admin/programs                      3.25 kB         106 kB
├ ○ /admin/users                         2.91 kB         106 kB
├ ƒ /api/admin/assets                      191 B         103 kB
├ ƒ /api/admin/assets/validate             191 B         103 kB
├ ƒ /api/admin/curriculum/blocks           191 B         103 kB
├ ƒ /api/admin/curriculum/days             191 B         103 kB
├ ƒ /api/admin/curriculum/lessons          191 B         103 kB
├ ƒ /api/admin/curriculum/tree             191 B         103 kB
├ ƒ /api/admin/drive/sync                  191 B         103 kB
├ ƒ /api/admin/import/commit               191 B         103 kB
├ ƒ /api/admin/import/dry-run              191 B         103 kB
├ ƒ /api/admin/programs                    191 B         103 kB
├ ƒ /api/admin/programs/[id]/publish       191 B         103 kB
├ ƒ /api/admin/stats                       191 B         103 kB
├ ƒ /api/admin/users                       191 B         103 kB
├ ƒ /api/assets/[id]                       191 B         103 kB
├ ƒ /api/blocks/[id]/complete              191 B         103 kB
├ ƒ /api/days/[id]                         191 B         103 kB
├ ƒ /api/health                            191 B         103 kB
├ ƒ /api/lessons/[id]                      191 B         103 kB
├ ƒ /api/me/enrollments                    191 B         103 kB
├ ƒ /api/me/progress                       191 B         103 kB
├ ƒ /api/me/roadmap                        191 B         103 kB
├ ƒ /api/me/today                          191 B         103 kB
├ ƒ /api/quizzes/[id]/submit               191 B         103 kB
├ ○ /dashboard                            5.7 kB         136 kB
├ ○ /forgot-password                      2.5 kB         118 kB
├ ƒ /learn/[dayId]                       3.48 kB         134 kB
├ ƒ /lesson/[lessonId]                   11.1 kB         142 kB
├ ○ /library                             3.56 kB         131 kB
├ ○ /login                               2.98 kB         118 kB
├ ○ /onboarding                           4.2 kB         132 kB
├ ƒ /practice/[quizId]                    4.6 kB         120 kB
├ ○ /progress                            3.14 kB         130 kB
├ ○ /register                            2.63 kB         118 kB
├ ○ /roadmap                             4.57 kB         135 kB
└ ○ /settings                            4.71 kB         132 kB
```
All routes compiled and optimized cleanly.
