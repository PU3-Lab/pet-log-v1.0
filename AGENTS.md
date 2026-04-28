# Repository Agents Guide

Keep this file short and repo-wide. Put workflow details in repo-local skills and harness docs.

## What

- Pet Log is an AI-first pet care product. The MVP should prove analysis and action suggestions, not just manual record storage.
- Canonical product source: `기획.md`.
- Canonical visual references: `pet-log-ui.png` and `펫로그_20260428/*`.
- Harness entry point: `.agents/skills/pet-log-mvp-orchestrator/SKILL.md`.
- Team contract: `docs/harness/pet-log-mvp/team-spec.md`.

## Why

- The product differentiator is the loop from record input to interpretation to practical care guidance.
- MVP work should protect that differentiator by prioritizing home summary, natural-language logging, timeline, analysis, AI suggestions, and pet profile.
- Community, commerce, hospital integration, IoT, map, shared care, and money management are expansion candidates unless a task explicitly changes scope.

## How

- Use `_workspace/` markdown handoffs for product, UX, AI, build, and QA artifacts.
- Prefer repo-local Pet Log skills under `.agents/skills/` before generic planning or implementation workflows.
- There is no app stack yet. Do not invent build or test commands until the implementation scaffold exists.
