# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Key Commands

### Testing

- `npm test` - Run all tests

### Code Quality

- `npm run format` - Auto-format code with Prettier
- `npm run lint` - Check code formatting with Prettier and run ESLint
- `npm run check` - Run svelte-check for TypeScript validation

## Development Notes

### Quality Gate Requirements

**CRITICAL: When finishing any task, you MUST run the complete quality sequence:**

```bash
npm run format && npm run lint && npm run check && npm test
```

**Rules:**

1. **Run ALL FOUR commands in sequence** - no shortcuts
2. **If ANY command fails/warns/errors** → fix the issue and **START OVER** from `npm run format`
3. **Only stop when all 4 commands pass cleanly in a single run**
4. **No exceptions** - even warnings from unchanged files must be fixed
5. **If unclear what to fix** → ask me, don't guess

**Example workflow:**

- Run sequence → lint fails → fix lint → **restart from format**
- Run sequence → test fails → fix test → **restart from format**
- Run sequence → all pass ✅ → **done!**

This ensures the codebase is always in a perfect state before any commit.

### Test Requirements

- **No skipped tests allowed** - All tests must run and pass
- If you encounter skipped tests (`.skip()` or similar), you must either:
  1. Fix them to run properly, or
  2. Inform me about the skipped tests and ask for guidance
- Skipped tests indicate incomplete test coverage and must be addressed
