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

## Reference

- Command/phase index: `_bmad/bmm/module-help.csv`
- BMM config: `_bmad/bmm/config.yaml`
- Existing artifacts: `_bmad-output/planning-artifacts/` (PRD, UX spec, architecture, epics, landing specs)
- Implementation outputs: `_bmad-output/implementation-artifacts/`
- Personas/skills: `_bmad/` (resolved via each skill's `customize.toml`)

## Communication language

Per `_bmad/bmm/config.yaml`: communication and document output in Portuguese (PT-BR).
