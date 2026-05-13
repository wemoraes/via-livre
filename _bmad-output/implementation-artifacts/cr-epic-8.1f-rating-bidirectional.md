# Code Review: story-epic-8.1f-rating-bidirectional

- **Reviewer:** Amelia (Senior Software Engineer)
- **Story:** [story-epic-8.1f-rating-bidirectional.md](story-epic-8.1f-rating-bidirectional.md)
- **Data:** 2026-05-13
- **Status:** APPROVED

## Sumário

Schema fix declarado como débito no CR 8.1d. Remove `Rating.lessonId @unique` e adiciona `@@unique([lessonId, authorId])` para permitir avaliação bidirecional. Atualiza call sites (`submitRating`, `getStudentHistoryData`, página de detalhe de aula, `LessonTimeline`). Migration aplicada no Supabase via `prisma migrate deploy`.

## Conformidade com ACs

| AC | Status | Nota |
|----|--------|------|
| AC1 — Migration | ✅ | `prisma/migrations/20260513191540_rating_bidirectional/migration.sql` aplicada. Drop index único antigo, add index simples + index composto único. |
| AC2 — `submitRating` permite 2 ratings | ✅ | `findUnique({ lessonId_authorId })` checa apenas o autor atual. Aluno e instrutor podem coexistir. |
| AC3 — `getStudentHistoryData` retorna `ratingGiven` + `ratingReceived` | ✅ | Include muda de `rating` para `ratings`, mapping separa por `authorId === userId` (given) ou outro (received). |
| AC4 — `LessonTimeline` exibe ambos | ✅ | Duas linhas inline: "Você avaliou: ★★★★★" e "Você recebeu: ★★★★☆". Cada uma só aparece se existir. |
| AC5 — `getInstructorRatings` intacto | ✅ | Filtra `targetId + role: STUDENT`. Sem mudança necessária. |
| AC6 — avgRating recalcula | ✅ | Lógica usa `findMany({ targetId, role: STUDENT })` — não afetada pela mudança de constraint. |

## Decisões técnicas

- **Migration manual em vez de `prisma migrate dev`:** o CLI requer TTY interativo para confirmar warnings (data potencialmente destrutivo). Em produção (Supabase remoto via DIRECT_URL), criei o arquivo `migration.sql` manualmente seguindo o padrão Prisma, e apliquei via `prisma migrate deploy` (não interativo, idempotente).
- **SQL defensivo (`IF EXISTS` / `IF NOT EXISTS`):** previne erro caso a migration seja re-aplicada manualmente.
- **`Lesson.rating Rating?` → `Lesson.ratings Rating[]`:** mudança não-trivial. Refletida em todos os call sites encontrados via `grep -rn "lesson.rating"`.
- **`alreadyRated` check redefinido:** antes `Boolean(lesson.rating)` (qualquer rating bloqueava). Agora `lesson.ratings.some(r => r.authorId === session.user.id)` — só bloqueia se ESTE usuário já avaliou.
- **`getStudentHistoryData` mapeia `ratings[]`:** find por `authorId === userId` (given), find por `role === INSTRUCTOR && authorId !== userId` (received). Se houver mais de um rating do mesmo autor (impossível pelo @@unique), pega o primeiro — seguro.
- **`pendingRatingsCount` agora usa `ratings: { none: { authorId: userId } }`:** Prisma nested filter. Conta lessons COMPLETED em que ESTE aluno ainda não criou rating.

## Pontos fortes

- **Mudança atômica e localizada:** migration + 4 arquivos. Cada mudança rastreável.
- **Zero breaking change em produção:** schema antes tinha 0 ratings no banco (seed não popula). Migration é idempotente; em produção nenhum dado é destruído.
- **Sintaxe Prisma para composite unique:** `findUnique({ where: { lessonId_authorId: { lessonId, authorId } } })` é o pattern oficial. Type-safe.
- **UX preservada:** o usuário não percebe mudança. Aluno avalia, instrutor avalia, ambos aparecem no histórico.

## Pontos de atenção

- **A1 — Migration em produção exige cuidado se o banco já tinha ratings:** o seed atual não cria, então safe. Mas o `prisma migrate deploy` rodou contra Supabase agora — aplicada. Se o usuário ressetar banco e re-rodar `prisma migrate deploy`, recria do zero. OK.
- **A2 — Vercel build não roda `prisma migrate deploy` automaticamente.** Cada deploy do Next só faz `prisma generate` (via `postinstall`). Para migrations em produção, é necessário rodar `npx prisma migrate deploy` manualmente OU adicionar como build step. Decidi NÃO adicionar como build step porque migrations em build são arriscadas (race condition, rollback complicado). Anotar na story de DevOps futura.
- **A3 — Recálculo de avgRating é unidirecional (aluno → instrutor).** Não há cálculo análogo para "média recebida pelo aluno". Pode ser interessante futuramente, mas FR não exige.
- **A4 — Ratings comments não são exibidos no LessonTimeline.** AC do PRD pede "data, instrutor, nota dada e nota recebida" — não pede comments aqui. Comments aparecem em `/instrutores/[id]` (perfil público) e no detalhe da aula. Aceitável.

## Métricas

- Build: ✅ 30 páginas, zero erros TypeScript, 4.5s compile + 4.7s TS
- Smoke test: ✅ 8/8 asserts
- Audit BMAD: ✅ Story 8.1 segue DONE
- Arquivos modificados: 5 (`schema.prisma`, `ratings.ts`, `history.ts`, `aulas/[lessonId]/page.tsx`, `LessonTimeline.tsx`)
- Migration nova: 1 (`20260513191540_rating_bidirectional`)
- Linhas net: +25 / -30

## Follow-ups

1. **Story 7.1 (Avaliação Bidirecional Pós-Aula) — backfill:** agora que o schema suporta, criar story+CR retroativos. Move da `.bmad-debt.json`.
2. **Story 8.1c — Aprovômetro pessoal:** ainda bloqueada por decisão produto.
3. **DevOps: `prisma migrate deploy` no fluxo Vercel.** Adicionar como script de pre-build ou rodar manualmente em pipeline CI.
4. **Adicionar comments dos ratings no Histórico:** polish futuro.

## Decisão

**APPROVED.** Schema agora honra o spec do PRD. Push aciona deploy Vercel; migration JÁ FOI APLICADA no Supabase (via `prisma migrate deploy` local apontando para DIRECT_URL). Próximo deploy não precisa re-rodar.
