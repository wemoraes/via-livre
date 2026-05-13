# Code Review: story-epic-8.1a-student-shell

- **Reviewer:** Amelia (Senior Software Engineer)
- **Story:** [story-epic-8.1a-student-shell.md](story-epic-8.1a-student-shell.md)
- **Data:** 2026-05-13
- **Status:** APPROVED com follow-ups

## Sumário

Primeira Story de Epic 8 a entrar formalmente no pipeline BMAD. Estabelece o shell de navegação do aluno (sidebar desktop, bottom nav mobile, header com avatar + logout) sob o route group `(student)`, com guardrails automáticos para impedir que o gap se repita: `scripts/spec-audit.ts` + `.bmad-debt.json` + pre-commit hook via `.git-hooks/pre-commit`.

## Conformidade com ACs

| AC | Status | Nota |
|----|--------|------|
| AC1 — Route group + layout + auth guard | ✅ | `src/app/(student)/layout.tsx` envolve todas as rotas do aluno; redireciona se role ≠ STUDENT. |
| AC2 — Sidebar com 5 links canônicos | ✅ | `StudentSidebar.tsx` + fonte única em `StudentNavLinks.tsx`; destaque OKLCH no link ativo. |
| AC3 — Mobile bottom nav | ✅ | `StudentBottomNav.tsx` fixed bottom; layout adiciona `pb-24 md:pb-8` no conteúdo. |
| AC4 — Header com avatar + dropdown | ✅ | `StudentHeader.tsx` client component; dropdown com Perfil + Sair (signOut callback "/"). |
| AC5 — Glassmorphism canônico | ✅ | Layout aplica `vl-mesh` único na viewport; sidebar usa `glass-card`; header sticky com backdrop-filter idêntico ao `/instrutores`. |
| AC6 — Redirect STUDENT → /aluno | ✅ | `src/proxy.ts` ajustado: linha 38 e 53 agora apontam para `/aluno`. |

## Decisões técnicas

- **Fonte única de links em `StudentNavLinks.tsx`:** evita divergência entre sidebar e bottom nav. `isStudentLinkActive()` trata `/aulas/*` e `/agendar/*` como sub-rotas do link "Minhas aulas".
- **Header em client component, layout em server component:** isolamento correto — server faz auth + fetch do User, passa name/avatarUrl como props para o componente client. Sem `useSession()` no client.
- **`signOut({ callbackUrl: "/" })`:** retorna o usuário pra landing, não pra `/entrar` (evita loop com proxy redirect).
- **5 links na bottom nav:** grid 5 colunas. Cabe em viewport 320px se shortLabel for curto (Início, Aulas, Histórico, Buscar, Perfil — máx 9 chars).
- **Páginas legadas (`/aulas`, `/aulas/[id]`, `/agendar/[id]`) refatoradas** para remover `<main>+vl-mesh+fontFamily` redundantes — o layout do route group já provê. Reduz duplicação em 40+ linhas.
- **Placeholders explícitos** em `/aluno`, `/aluno/historico`, `/aluno/perfil` referenciam as Stories 8.1b–e que vão preenchê-los. Não é debt silencioso, é roadmap visível na própria UI.

## Guardrails automáticos (anti-recorrência)

Este foi o trabalho mais importante da sessão, paralelo à Story:

1. **`scripts/spec-audit.ts`** — varre `epics.md`, extrai todas as Stories, confronta com `_bmad-output/implementation-artifacts/`. Reporta done/in-progress/missing. Three modes: report (default), `--debt` (exit 1 em violações novas), `--strict` (exit 1 em qualquer gap).
2. **`.bmad-debt.json`** — allowlist explícita das 41 Stories brownfield (Epics 1-7, 8.2, 9, 10 — código existe mas falta retrofit BMAD). Story 8.1 saiu da allowlist no momento em que esta story file foi criada.
3. **Pre-commit hook** em `.git-hooks/pre-commit` roda `npm run audit:bmad:debt` automaticamente. Bloqueia commit se uma Story nova for adicionada a `epics.md` sem story file (ou sem entrar na allowlist).
4. **`npm run audit:bmad`** disponível no dia-a-dia para checar conformidade sem bloquear.
5. **AGENTS.md** ampliado com seção "Automated guardrails" + "Anti-padrões proibidos" listando "declarar Epic done sem audit" como pecado capital.
6. **MEMORY corrigida** — `project-epics-progress` reescrita pra refletir realidade (0/42 done) ao invés da mentira anterior ("10 Epics implemented").

## Pontos fortes

- **Glassmorphism preservado e centralizado:** mesh único na layout do route group, não 3 cópias.
- **Acessibilidade ok:** `aria-label`, `aria-haspopup`, `aria-expanded`, click-outside no dropdown via `useRef` + `mousedown` listener.
- **Mobile-first respeitado:** bottom nav só aparece `md:hidden`, sidebar é `hidden md:flex`, content tem padding ajustado.
- **Auditoria executável:** `npm run audit:bmad` é o oposto de "memory promete". Filesystem responde.
- **Story file refatorada com escopo de sub-stories (8.1a–e):** Amelia já decompôs no encontro anterior; o roadmap está visível em planning.

## Pontos de atenção

- **A1 — Layout faz query Prisma (`user.findUnique`) em todo navegação para o aluno.** Custo: ~1 query extra por SSR de rota student. Aceitável; quando 8.1b chegar, posso bater o User junto com o dashboard data em uma query agregada.
- **A2 — `signOut` é call client-side.** Se o pre-existing flow já tinha redirect próprio, validar manualmente. Senão funciona normal (Auth.js v5 default).
- **A3 — Placeholders de `/aluno/historico` e `/aluno/perfil` quebram expectativa.** Aceito porque sinalizam roadmap explícito ("Story 8.1d em construção"). Quando chegarmos em 8.1d/e, substituir.
- **A4 — `proxy.ts` ainda permite acesso direto a `/aulas` sem passar por `/aluno`.** Não é bug — é compatibilidade com links pré-existentes (ex.: emails de notificação). Documentar quando rodar Story 8.1b.
- **A5 — Avatar fallback usa inicial do nome.** Se nome for vazio (defensivo já cobre via `?? "Aluno"`), inicial vira "A". Aceitável.

## Métricas

- Build: ✅ 30 páginas (era 27), zero erros TypeScript
- Audit BMAD (modo `--debt`): ✅ exit 0 — 41 stories em débito autorizado, 0 violações novas
- Arquivos novos: 4 componentes student + 3 placeholders + 2 docs BMAD (story + CR)
- Arquivos modificados: 3 páginas legadas (refatoradas pra usar o layout) + `proxy.ts` + `package.json` + `AGENTS.md`

## Follow-ups

1. **Story 8.1b — Dashboard do Aluno** (próxima): preenche `/aluno` com NextLessonCard + StatsCards + UpcomingLessons. Depende desta Story. Estimativa: 1.5d.
2. **Story 8.1c — Aprovômetro pessoal**: precisa decisão de produto sobre "instrutor principal" (elicitar com John via `bmad-correct-course` antes de codar).
3. **Story 8.1d — Histórico + LessonTimeline + RatingPrompt**: preenche `/aluno/historico`.
4. **Story 8.1e — Perfil editável + perf budget**: preenche `/aluno/perfil`; adiciona Lighthouse CI.
5. **Retroativo Epic 8.2** (Dashboard do Instrutor): a Story 8.2 ainda está na `.bmad-debt.json`. Quando atacada, retrofitar story+CR.

## Decisão

**APPROVED.** Sai 1/9 ACs da Story 8.1 do PRD (a Story 8.1a entrega o shell; 8.1b–e completam o restante). Mais importante: **o pipeline BMAD agora tem guardrail automático.** O erro que motivou esta sessão (Epic 8 esquecido) é mecanicamente impossível de repetir sem violar o pre-commit hook.

Push aciona deploy Vercel automático para `vialivre-br.vercel.app`.
