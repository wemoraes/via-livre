# Story 8.1d — Histórico do aluno com LessonTimeline + RatingPrompt

- **ID:** story-epic-8.1d-student-history
- **Epic:** 8 — Dashboards de Aluno e Instrutor
- **Parent Story (PRD):** Story 8.1 — Dashboard do Aluno (AC6 explícito sobre `/aluno/historico` e prompt de avaliação)
- **Sub-story scope:** preenche `/aluno/historico` (placeholder da 8.1a) com timeline de aulas passadas (concluídas, canceladas, em disputa) + banner proativo de avaliações pendentes.
- **Personas:** Amelia (Dev)
- **Status:** In progress

## Contexto

Story 8.1 do PRD declara explicitamente (linha 902 dos epics.md):
> "o painel de histórico em `/aluno/historico` lista todas as aulas com: data, instrutor, nota dada e nota recebida"
> "ao clicar em uma aula passada sem avaliação, um prompt 'Avaliar esta aula?' é exibido"

Essa story entrega esses dois ACs explícitos + componente `LessonTimeline` referenciado na UX spec (linha 213) que nunca foi implementado.

## Acceptance Criteria

### AC1 — `/aluno/historico` mostra aulas passadas via SSR

- **Given** o aluno autenticado acessa `/aluno/historico`
- **When** a página carrega
- **Then** exibe todas as `Lesson` com `studentId = self` e (`status = COMPLETED` OR `status = CANCELLED` OR `status = DISPUTED` OR (`status = CONFIRMED` AND `scheduledAt < now`))
- **And** ordenadas por `scheduledAt DESC`
- **And** paginadas em batches de 30; primeiros 30 são SSR

### AC2 — Cada item da timeline mostra dados completos

- **Given** um item da timeline
- **When** renderiza
- **Then** exibe:
  - data formatada PT-BR ("ter, 19 mai · 14:00")
  - nome do instrutor
  - status badge (OKLCH canônico via `LESSON_STATUS_STYLE`)
  - nota DADA pelo aluno (1-5 estrelas) — null se não avaliou
  - nota RECEBIDA do instrutor (1-5 estrelas) — null se não foi avaliado
  - link `/aulas/[id]` para detalhe completo

### AC3 — RatingPrompt proativo

- **Given** existem `N >= 1` aulas concluídas SEM rating dado pelo aluno
- **When** carrega `/aluno/historico`
- **Then** banner sticky no topo: "Você tem {N} aula{s} para avaliar"
- **And** subtexto: "Suas avaliações ajudam outros alunos a escolherem bem"
- **And** ao clicar, scroll suave até a primeira lesson pendente
- **And** o item da lesson pendente tem destaque visual e CTA "Avaliar agora" → `/aulas/[id]#avaliar`

### AC4 — Filtros por status via URL

- **Given** o aluno está em `/aluno/historico`
- **When** clica em chip de filtro (Todas, Concluídas, Canceladas)
- **Then** a URL atualiza com `?status=COMPLETED` etc
- **And** a página re-renderiza filtrada
- **And** recarregar preserva o filtro

### AC5 — Estado vazio

- **Given** o aluno tem 0 aulas passadas
- **When** carrega `/aluno/historico`
- **Then** exibe empty state: "Você ainda não tem aulas no histórico" + CTA "Agendar primeira aula" → `/instrutores`

### AC6 — Performance SSR sem N+1

- **Given** a query agregada
- **When** roda
- **Then** usa `include` com `rating` (autoria do aluno) E sub-query para `rating` (autoria do instrutor) em uma round-trip
- **And** zero N+1 querias por lesson

## Files affected

### Novos
- `src/app/(student)/aluno/historico/_data/history.ts` — `getStudentHistoryData(userId, filters)`
- `src/app/(student)/aluno/historico/_components/LessonTimeline.tsx`
- `src/app/(student)/aluno/historico/_components/RatingPrompt.tsx`
- `src/app/(student)/aluno/historico/_components/HistoryFilters.tsx`
- `src/app/(student)/aluno/historico/_components/EmptyHistory.tsx`
- `src/components/ui/StarRating.tsx` — readonly star display (5 estrelas, fill por score)

### Modificados
- `src/app/(student)/aluno/historico/page.tsx` — substitui placeholder

## Test plan

- ✅ Build limpo
- ✅ Audit ok
- ⏳ Smoke manual:
  - Maria (aluno sem aulas) → empty state
  - Adicionar lessons COMPLETED no seed com rating dado e sem → ver timeline + RatingPrompt
  - Filtrar por status via URL → preserva

## Risks

- **R1:** Modelo `Rating` tem `lessonId @unique` — então cada lesson tem max 1 rating. Mas o rating pode ser do aluno (role=STUDENT, target=instructor) OU do instrutor (role=INSTRUCTOR, target=student). Para diferenciar "nota dada pelo aluno" vs "nota recebida do instrutor", precisa de query lateral. Possível solução: 2 sub-queries em paralelo: `ratingGivenByStudent` (Rating WHERE lesson AND author=studentUser) e `ratingReceivedByStudent` (Rating WHERE lesson AND target=studentUser AND role=INSTRUCTOR).
- **R2:** Anchor `#avaliar` precisa ser tratado em `/aulas/[id]` para realmente abrir RatingForm em foco. Aceito que neste primeiro pass o link só leva ao detalhe (RatingForm já aparece se !alreadyRated). Anchor é informacional/futuro polish.

## Definition of Done

- [ ] AC1-AC6 atendidos
- [ ] Build limpo + audit ok
- [ ] CR escrito
- [ ] Commit + push
