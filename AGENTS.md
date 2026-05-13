<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# BMAD pipeline is mandatory

This project is managed under BMAD-METHOD v6.6.0 (BMM module). Any new implementation, refactor, redesign, or non-trivial bug fix MUST flow through the BMAD pipeline. Skipping it is a process violation — even when the user gives a single "do it" instruction.

## Phase map

The full command/phase index lives at `_bmad/bmm/module-help.csv`. The phases are:

1. **1-analysis** — research, briefs, PRFAQ. Outputs to `_bmad-output/planning-artifacts/`.
2. **2-planning** — PRD (CP), UX design (CU). Outputs to `_bmad-output/planning-artifacts/`.
3. **3-solutioning** — architecture (CA), epics & stories (CE), readiness check (IR).
4. **4-implementation** — sprint planning (SP) → create story (CS) → validate story (VS) → dev story (DS) → code review (CR) → retrospective (ER). Outputs to `_bmad-output/implementation-artifacts/`.

For small, well-scoped work, `bmad-quick-dev` (QQ) is the unified intent-in / code-out flow. It still writes artifacts to `_bmad-output/implementation-artifacts/`. Use it instead of going off-pipeline.

For corrections to in-flight plans, use `bmad-correct-course` (CC).

## Mandatory order for any implementation request

1. **Identify phase** — Is this a UI redesign? UX phase (Sally). Architecture? 3-solutioning (Winston). New feature scope? PRD (John). Bug fix on shipped code? Create a story directly in 4-implementation.
2. **Write the artifact first** — Before touching code, produce the corresponding BMAD doc. For implementation, that means a story file under `_bmad-output/implementation-artifacts/story-<slug>.md` with: title, source/why, acceptance criteria (AC IDs), files affected, test plan, risks.
3. **Implement against the story** — Reference AC IDs as you work. Mark each AC as done in the story file when complete.
4. **Code review note** — On completion, write `_bmad-output/implementation-artifacts/cr-<slug>.md` summarizing what shipped, files touched, test results, follow-ups.
5. **Commit referencing the story** — Commit message must include the story slug (e.g. `feat(redesign-glassmorphism): ...`).

## Hard rules

- Never write production code without a corresponding artifact in `_bmad-output/`.
- Never commit without the commit message referencing the BMAD story/spec.
- If the user asks for something off-pipeline ("just fix it", "go ahead"), explicitly propose the BMAD path before executing — do not assume consent to skip.
- Use the BMAD personas (Sally for UX, Winston for architecture, Amelia for dev, etc.) by invoking the corresponding skill, not by inventing your own framing.
- Brownfield retrofits (work already done outside the pipeline) MUST be backfilled with story + CR docs before committing.
- **Epic is "done" ONLY when every Story under it has both `story-epic-X.Y-*.md` AND `cr-epic-X.Y-*.md` in `_bmad-output/implementation-artifacts/`.** Build green ≠ Epic done. Code shipped ≠ Epic done. The audit is the single source of truth.

## Automated guardrails

The project enforces the pipeline via `scripts/spec-audit.ts`:

```bash
npm run audit:bmad         # report-only, dia-a-dia
npm run audit:bmad:debt    # exit 1 se houver Story nova fora da allowlist (pre-commit usa isso)
npm run audit:bmad:strict  # exit 1 se houver QUALQUER Story sem story+CR (uso em CI)
```

- `.bmad-debt.json` na raiz lista Stories conhecidas como brownfield (código existe, falta retrofit dos artifacts). Stories NOVAS em `epics.md` que não estiverem na allowlist quebram o commit.
- O hook `git config core.hooksPath .git-hooks` está ativo — `.git-hooks/pre-commit` roda `npm run audit:bmad:debt`. **Nunca usar `--no-verify` salvo emergência declarada pelo usuário.**
- A allowlist é dívida explícita, não desculpa permanente. Conforme cada Story for retroativamente coberta com story+CR, remova o ID de `.bmad-debt.json`.

## Anti-padrões proibidos

- Declarar "Epic X implementado" sem rodar `npm run audit:bmad:strict` antes — declarações baseadas em "build passa" mascararam o gap inteiro do painel do aluno (Epic 8) no MVP.
- Implementar feature nova sem antes criar `story-epic-X.Y-*.md` — o pipeline existe pra isso.
- Adicionar Story nova em `epics.md` sem em paralelo criar o story file OU explicitamente adicioná-la à allowlist com justificativa.
- Pular `bmad-sprint-planning` (SP) e ir direto pra `bmad-dev-story` — sem sprint plan, ACs caem no esquecimento.
- Confiar em sumários memorizados ("todos os 10 Epics implementados") sem rodar o audit. Memória mente; o filesystem não.

## Reference

- Command/phase index: `_bmad/bmm/module-help.csv`
- BMM config: `_bmad/bmm/config.yaml`
- Existing artifacts: `_bmad-output/planning-artifacts/` (PRD, UX spec, architecture, epics, landing specs)
- Implementation outputs: `_bmad-output/implementation-artifacts/`
- Personas/skills: `_bmad/` (resolved via each skill's `customize.toml`)

## Communication language

Per `_bmad/bmm/config.yaml`: communication and document output in Portuguese (PT-BR).
