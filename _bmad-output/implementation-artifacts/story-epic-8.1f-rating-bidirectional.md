# Story 8.1f — Schema fix: avaliação bidirecional (Rating)

- **ID:** story-epic-8.1f-rating-bidirectional
- **Epic:** 8 — Dashboards de Aluno e Instrutor (bug discovery)
- **Origem:** débito técnico A1 flagged em [cr-epic-8.1d-student-history.md](cr-epic-8.1d-student-history.md). Também impacta Story 7.1 do PRD (Avaliação Bidirecional Pós-Aula).
- **Personas:** Amelia (Dev), Winston (Architect)
- **Status:** In progress

## Contexto

PRD declara avaliação bidirecional: aluno avalia instrutor + instrutor avalia aluno após cada aula. Schema atual viola isso: `Rating.lessonId @unique` permite no máximo 1 rating por lesson. Implica:

- Se aluno avalia primeiro, instrutor não consegue avaliar.
- Se instrutor avalia primeiro, aluno não consegue avaliar.
- `getStudentHistoryData` (Story 8.1d) retorna apenas 1 rating com indicador de autoria — perde informação.

Esta story conserta o schema + ajusta as call sites afetadas.

## Acceptance Criteria

### AC1 — Migration Prisma

- **Given** `prisma/schema.prisma`
- **When** alterado
- **Then** `Rating.lessonId` perde `@unique`
- **And** adiciona `@@unique([lessonId, authorId])` no model Rating
- **And** `Lesson.rating Rating?` vira `Lesson.ratings Rating[]`
- **And** migration aplicada via `prisma migrate dev --name rating_bidirectional`
- **And** banco em produção (Supabase) aplicada via deploy

### AC2 — `submitRating` permite 2 ratings por lesson

- **Given** uma lesson COMPLETED
- **When** aluno chama `submitRating` E em seguida instrutor chama `submitRating`
- **Then** ambos persistem (`Rating[]` com 2 entries, uma por authorId)
- **And** a checagem de duplicata muda de `findUnique({lessonId})` para `findFirst({lessonId, authorId})`
- **And** mensagem de erro continua "Você já avaliou esta aula"

### AC3 — `getStudentHistoryData` retorna 2 ratings separados

- **Given** uma lesson concluída com rating do aluno E rating do instrutor
- **When** `getStudentHistoryData` busca
- **Then** retorna `ratingGiven` (autor = aluno) E `ratingReceived` (autor = instrutor) como campos distintos
- **And** ambos podem ser null se ainda não avaliados

### AC4 — `LessonTimeline` exibe ambos ratings

- **Given** o item da timeline tem `ratingGiven` E `ratingReceived`
- **When** renderiza
- **Then** exibe "Você avaliou: ★★★★★" + "Você recebeu: ★★★★☆"
- **And** se só um existir, mostra só esse com o label correto
- **And** se nenhum, mostra prompt pra avaliar (como antes)

### AC5 — `getInstructorRatings` continua funcionando

- **Given** chamada externa do perfil público do instrutor
- **When** busca ratings recebidos por um instrutor
- **Then** continua filtrando `role: STUDENT` (autor aluno) — comportamento idêntico

### AC6 — avgRating do instrutor continua atualizando

- **Given** aluno submete rating
- **When** transaction completa
- **Then** `InstructorProfile.avgRating` é recalculado e persistido
- **And** lógica não é afetada pelo fato de agora poder haver mais ratings na lesson

## Files affected

### Schema
- `prisma/schema.prisma` — alterar Rating + Lesson
- `prisma/migrations/XXXXXXXX_rating_bidirectional/migration.sql` — gerar

### Actions
- `src/actions/ratings.ts` — `findUnique` → `findFirst` em check de duplicata

### Data
- `src/app/(student)/aluno/historico/_data/history.ts` — `rating` → `ratings[]`, separar em given/received

### UI
- `src/app/(student)/aluno/historico/_components/LessonTimeline.tsx` — mostrar 2 ratings

## Test plan

- ✅ Build limpo
- ✅ Audit ok
- ✅ `npx prisma migrate dev` aplica sem erro
- ✅ `npx tsx scripts/smoke-test-search.ts` (não-relacionado, mas confirma nada quebrou)
- ⏳ Smoke manual: simular dois ratings na mesma lesson via banco e verificar UI

## Risks

- **R1:** Migration em produção (Supabase) precisa rodar. Como o banco está em uso por Prisma 7 com adapter-pg, `prisma migrate deploy` ou `prisma db push` pode ser necessário. Em ambiente serverless Vercel, isso normalmente é orquestrado em script de deploy. Para esta sessão, vou rodar `migrate dev` local (que cria migration e aplica no DIRECT_URL); depois o usuário ou eu rodamos `migrate deploy` em Supabase via CLI.
- **R2:** A constraint `@@unique([lessonId, authorId])` permite a mesma pessoa ter 2 papéis em lessons distintas (ok), mas IMPEDE de mudar AC `Rating.role` — porque o author/lesson combo é unique. Aceitável.
- **R3:** Compatibilidade com data existente: se houver Rating no banco com a constraint antiga, a migration deve ser idempotente. Como o banco hoje tem 0 ratings (seed not populating), zero risco.

## Definition of Done

- [ ] AC1-AC6 atendidos
- [ ] Build limpo + audit ok
- [ ] Migration aplicada em DIRECT_URL local
- [ ] CR escrito
- [ ] Commit + push (deploy a aplica em prod via Vercel — verificar deploy logs ou rodar `migrate deploy` manualmente)
