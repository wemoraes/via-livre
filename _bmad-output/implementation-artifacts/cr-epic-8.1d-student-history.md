# Code Review: story-epic-8.1d-student-history

- **Reviewer:** Amelia (Senior Software Engineer)
- **Story:** [story-epic-8.1d-student-history.md](story-epic-8.1d-student-history.md)
- **Data:** 2026-05-13
- **Status:** APPROVED com débito técnico de schema rastreado

## Sumário

Substitui o placeholder de `/aluno/historico` por timeline real de aulas passadas (concluídas, canceladas, em disputa), com banner proativo de avaliações pendentes (RatingPrompt) e filtros por status persistidos em URL. Componente `<StarRating />` reusável criado em `src/components/ui/`.

## Conformidade com ACs

| AC | Status | Nota |
|----|--------|------|
| AC1 — SSR com aulas passadas | ✅ | `getStudentHistoryData` filtra por status terminal + CONFIRMED com `scheduledAt < now`. Order DESC, take 30. |
| AC2 — Item completo (data, instrutor, status, nota) | ⚠️ parcial | "nota dada" E "nota recebida" pelo schema atual SÃO O MESMO REGISTRO (Rating.lessonId @unique). Exibimos a única nota disponível + indicador de autoria ("Você avaliou" vs "Você foi avaliado"). Débito técnico abaixo. |
| AC3 — RatingPrompt proativo | ✅ | Banner sticky topo conta `lesson.rating === null && status === COMPLETED`. Click → scrollIntoView para item marcado `data-pending-rating="true"`. |
| AC4 — Filtros via URL | ✅ | `HistoryFilters` client component. Chips "Todas", "Concluídas", "Canceladas", "Disputas". Server `searchParams` lê e re-renderiza. `scroll={false}` no `<Link>` para evitar scroll-to-top. |
| AC5 — Estado vazio | ✅ | `EmptyHistory` com CTA "Agendar primeira aula". Diferente do estado "filtro sem resultados" (mensagem leve sem CTA). |
| AC6 — SSR sem N+1 | ✅ | `Promise.all([findMany_com_include, count, count_pending])` em 3 round-trips paralelas. Cada lesson traz `rating` em include — zero loops com query lateral. |

## Decisões técnicas

- **Schema constraint `Rating.lessonId @unique`** → 1 rating por lesson. O PRD (linha 902) descreve "nota dada e nota recebida" como se fossem dois registros separados, mas isso requer schema diferente (`@@unique([lessonId, authorId])`). Não vou fazer migration nesta story — fica como **débito técnico explícito**, com workaround visual (badge "Você avaliou" / "Você foi avaliado").
- **`STATUS_FILTER_TO_WHERE` separado de WHERE base:** clausula reutilizável. Status "ALL" agrega COMPLETED + CANCELLED + DISPUTED + CONFIRMED-passado (CONFIRMED-passado = aula que aconteceu mas não foi confirmada como concluída, fica em limbo até admin/instrutor decidir).
- **`data-pending-rating="true"` no `<li>`** atua como anchor target para o `scrollIntoView` do `RatingPrompt`. Eu prefiro data attributes a id porque há múltiplos itens pendentes; pego o primeiro via `querySelector`.
- **`scroll={false}` no Link do HistoryFilters:** o Next por default scrolla pro topo em navegação client. Aqui o usuário está num filtro — preserva scroll.
- **`StarRating` em `src/components/ui/`** (não em features): é primitivo, vai ser usado em outras superfícies (perfil público do instrutor, futuro).
- **`isOwnAuthor` no rating data:** booleano calculado server-side. Cliente já recebe a decisão pronta. Evita acoplamento do componente ao session.
- **Pagina suporta filtro mesmo com 0 lessons:** se filtro retornar vazio mas o aluno tem outras aulas, mostra mensagem leve e mantém os chips. Se total = 0, mostra `EmptyHistory` completo.

## Pontos fortes

- **Banner RatingPrompt converte UX em comportamento:** banner clicável que rola até o primeiro item pendente, com destaque visual no item (boxShadow accent + badge "Avaliar agora"). Fecha o loop de qualidade que alimenta o Aprovômetro.
- **Filtros URL-driven:** compartilhar link `/aluno/historico?status=CANCELLED` funciona; recarregar preserva.
- **Aria-label semântico:** `<nav aria-label="Filtros de histórico">`, `<aria-label="${score} de 5 estrelas">`. Acessibilidade básica respeitada.
- **Lesson item resiliente a status terminal raro (DISPUTED):** badge OKLCH canônico já cobre via `LESSON_STATUS_STYLE`.

## Pontos de atenção / Débito técnico

### A1 — Schema: Rating.lessonId @unique (CRÍTICO)

PRD (Story 7.1 e 8.1) pede avaliação **bidirecional** (aluno avalia instrutor + instrutor avalia aluno). Schema atual permite só 1 rating por lesson. Implicações:

- Se o aluno avalia primeiro, o instrutor não consegue avaliar (constraint violation).
- Se o instrutor avalia primeiro (caso raro), o aluno também não consegue avaliar.
- O CR atual mostra "Você avaliou: 5" OU "Você foi avaliado: 4" — nunca os dois.

**Fix recomendado em Story 8.1f (a criar):**
- Migration: remover `Rating.lessonId @unique`
- Adicionar `@@unique([lessonId, authorId])` ou `@@unique([lessonId, role])`
- Atualizar `submitRating` server action para suportar 2 ratings por lesson
- Atualizar AprovômetroTag e queries derivadas

Isso bate na Story 7.1 (brownfield) também. Vale `bmad-correct-course` antes de mexer.

### A2 — `scrollIntoView` falha graciosamente se nenhum item pendente

Se o user clicar no banner antes do hydrate completo, `querySelector` retorna null. Aceitável — banner só renderiza se `pendingCount > 0`, o que implica que tem pelo menos um item com `data-pending-rating="true"`.

### A3 — Anchor `#avaliar` é informacional

`/aulas/[id]#avaliar` não abre o RatingForm em foco automaticamente (o componente sempre renderiza se `!alreadyRated`). Polish futuro: scroll para o form via anchor.

### A4 — Sem paginação no item 31+

`take: 30`. Se um aluno tiver mais de 30 lessons no histórico (caso futuro), os mais antigos não aparecem. Aceito; Story 8.1f pode adicionar paginação cursor-based.

## Métricas

- Build: ✅ 30 páginas, zero erros TypeScript, 4.2s compile + 4.0s TS
- Audit BMAD: ✅ Story 8.1 segue DONE
- Componentes novos: 5 (`LessonTimeline`, `RatingPrompt`, `HistoryFilters`, `EmptyHistory`, `StarRating`)
- Server data novo: 1 (`getStudentHistoryData`)
- Linhas: ~310

## Follow-ups

1. **🔴 Schema fix (Story 8.1f — a criar):** `Rating.lessonId @unique` deve virar `@@unique([lessonId, authorId])`. Migration + ajuste em actions + ajuste em `getStudentHistoryData` (retorna 2 ratings em vez de 1).
2. **Story 8.1c — Aprovômetro pessoal:** ainda bloqueada por decisão de produto "instrutor principal".
3. **`/aulas/[id]#avaliar` real:** scroll para RatingForm via anchor.
4. **Paginação histórico:** cursor-based pra >30 lessons.

## Decisão

**APPROVED com débito explícito.** Push aciona deploy automático. O painel do aluno agora tem: shell (8.1a) + dashboard (8.1b) + perfil (8.1e) + histórico (8.1d). Falta 8.1c (Aprovômetro pessoal, bloqueada por produto) e a Story 8.1f de schema fix.
