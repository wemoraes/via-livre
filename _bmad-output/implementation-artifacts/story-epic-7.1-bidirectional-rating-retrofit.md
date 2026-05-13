# Story 7.1 — Avaliação bidirecional (retrofit)

- **ID:** story-epic-7.1-bidirectional-rating-retrofit
- **Epic:** 7 — Avaliações e Aprovômetro
- **Tipo:** Brownfield retrofit. Schema (8.1f) + server action (`submitRating`) + RatingForm do aluno já existem. Esta story completa o loop: UI do instrutor para avaliar o aluno.
- **Personas:** Amelia (Dev)
- **Status:** In progress

## Contexto

Story 7.1 do PRD declara avaliação bidirecional: aluno avalia instrutor + instrutor avalia aluno após cada aula. Estado atual:

- ✅ Schema: Story 8.1f permitiu 2 ratings por lesson (`@@unique([lessonId, authorId])`)
- ✅ `submitRating` server action: já é "role-aware" (decide target baseado no autor)
- ✅ `RatingForm` (client): existe mas SOMENTE em `(student)/aulas/[lessonId]/`, com texto fixo "Avalie o instrutor"
- ❌ UI do instrutor para rating: **inexistente**

Esta story:
1. Move o `RatingForm` para `src/components/features/ratings/` e parametriza `targetLabel`
2. Cria `/instructor/aulas/[lessonId]/page.tsx` com detalhe da lesson + `InstructorRatingForm`
3. Mostra ambas ratings (given/received) em ambas as views
4. Link da agenda visual + da lista de aulas para `/instructor/aulas/[id]`

## Acceptance Criteria

### AC1 — `RatingForm` parametrizado e reutilizável

- **Given** `RatingForm` é importado por uma página
- **When** chamado
- **Then** aceita props `lessonId` e `targetLabel` ("instrutor" ou "aluno")
- **And** título adapta: "Avalie o {targetLabel}"
- **And** placeholder do comentário: "Conte como foi a aula" (genérico)
- **And** móvel para `src/components/features/ratings/RatingForm.tsx`
- **And** import em `(student)/aulas/[lessonId]/page.tsx` atualizado

### AC2 — `/instructor/aulas/[lessonId]` página de detalhe

- **Given** instrutor autenticado clica em uma lesson
- **When** acessa `/instructor/aulas/[lessonId]`
- **Then** vê detalhe completo da lesson: nome do aluno, data/hora, ponto de encontro, veículo, valor (líquido + bruto), status
- **And** se status = COMPLETED:
  - Se ele ainda não avaliou: `RatingForm` com `targetLabel="aluno"`
  - Se ele já avaliou: exibe a nota dada
  - Se o aluno avaliou: exibe "Você foi avaliado: ★★★☆☆" (sem comentário se houver)
- **And** se status = CONFIRMED com `instructorConfirmed = false`: `InstructorConfirmButton` no topo
- **And** auth guard: 404 se a lesson não for desse instrutor

### AC3 — Lista do instrutor linka para o detalhe

- **Given** `(instructor)/aulas/page.tsx` renderiza lessons
- **When** o instrutor clica em uma lesson
- **Then** navega para `/instructor/aulas/[id]`

### AC4 — Agenda LessonDetailPanel linka para `/instructor/aulas/[id]`

- **Given** o instrutor clica em uma lesson na agenda visual
- **When** o painel lateral abre
- **Then** o botão "Ver detalhes" linka para `/instructor/aulas/[id]` (antes: `/aulas/[id]`, que é do aluno)

### AC5 — Side panel do detalhe na visão do aluno também mostra ambas ratings

- **Given** o aluno acessa `/aulas/[lessonId]`
- **When** a lesson tem ambas as ratings (aluno avaliou E instrutor avaliou)
- **Then** mostra ambas inline: "Você avaliou: ★★★★★ ·  Você foi avaliado: ★★★★☆"

### AC6 — Remover Story 7.1 da `.bmad-debt.json`

- **Given** a story 7.1 está em débito brownfield
- **When** este merge fecha o gap funcional
- **Then** remover "7.1" do array `allowed` em `.bmad-debt.json`
- **And** o audit passa (Story 7.1 agora tem story+CR via este arquivo)

## Files affected

### Novos
- `src/components/features/ratings/RatingForm.tsx` — movido + parametrizado
- `src/app/(instructor)/instructor/aulas/[lessonId]/page.tsx`
- `src/app/(instructor)/instructor/aulas/[lessonId]/_data/lesson.ts` — `getInstructorLessonDetail(id, instructorUserId)`

### Modificados
- `src/app/(student)/aulas/[lessonId]/page.tsx` — importa de `@/components/features/ratings/RatingForm`, passa `targetLabel="instrutor"`. Também passa a mostrar a nota recebida se houver.
- `src/app/(student)/aulas/[lessonId]/RatingForm.tsx` — DELETAR (movido)
- `src/app/(instructor)/instructor/aulas/page.tsx` — adicionar `<Link>` em cada item
- `src/app/(instructor)/instructor/agenda/_components/LessonDetailPanel.tsx` — botão "Ver detalhes" agora linka para `/instructor/aulas/[id]`
- `.bmad-debt.json` — remover "7.1"

## Test plan

- ✅ Build limpo
- ✅ Audit ok (7.1 sai do débito, vira DONE)
- ⏳ Smoke manual:
  - Aluno em /aulas/[id] de lesson COMPLETED sem rating → mostra form, envia
  - Instrutor em /instructor/aulas/[id] de mesma lesson → vê "Você foi avaliado: ★★★★★" + form pra avaliar o aluno
  - Após instrutor avaliar, aluno volta na sua view e vê ambas as notas

## Risks

- **R1:** O student page tinha `if (!isStudent) redirect("/entrar")`. O instructor agora tem sua própria detail page com lógica análoga — ambos os papéis convivem sem conflito.
- **R2:** RatingForm move pode quebrar imports não cobertos. Mitigação: grep para `from "./RatingForm"` antes de remover.
- **R3:** seed atual tem 0 lessons. Sem aulas reais, smoke manual é só visual (form renderiza, mas submit não testa). Aceito; quando primeira aula real for criada, validar end-to-end.

## Definition of Done

- [ ] AC1-AC6 atendidos
- [ ] Build limpo + audit ok
- [ ] CR escrito
- [ ] Commit + push
