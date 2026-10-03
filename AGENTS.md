# AGENTS.md

Либа `@timmi0-o/frontend-core`. Канон для Cursor, Claude Code, Codex, Gemini, Copilot, Windsurf.

Правило пакета: `.cursor/rules/public-api.mdc`.

Меняй только публичные `exports`. Не добавляй домен приложений, next-auth, `API_ROUTES` и mapper конкретного API. Коммит только по просьбе.

Потребители (`my-master-next-app`, `my-master-admin-panel`) подключают либу **только** версией из npm registry — без `file:` / локальных `.tgz`. См. `pack-tgz.mdc` и `frontend-core-npm-only.mdc` у приложений.
