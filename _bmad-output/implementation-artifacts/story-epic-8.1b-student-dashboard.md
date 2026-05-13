# Story 8.1b — Dashboard do Aluno (cards + próxima aula)

- **ID:** story-epic-8.1b-student-dashboard
- **Epic:** 8 — Dashboards de Aluno e Instrutor
- **Parent Story (PRD):** Story 8.1 — Dashboard do Aluno
- **Sub-story scope:** preenche `/aluno` (placeholder vindo de 8.1a) com agregação real. Cobre ACs 8.1-AC1, AC2, AC3, AC5 do PRD. Não cobre AC4 (Aprovômetro pessoal — fica em 8.1c) nem AC6 (histórico — 8.1d).
- **Personas:** Amelia (Dev)
- **Status:** In progress

## Contexto

Story 8.1a entregou o shell de navegação. A rota `/aluno` ficou com placeholder "Em breve" porque a agregação real exige queries + componentes específicos. Esta story preenche a home do aluno com informação acionável: próxima aula em destaque + cards de estatística.

## Acceptance Criteria

### AC1 — Próxima aula em destaque (NextLessonCard)

- **Given** o aluno acessa `/aluno`
- **When** existe pelo menos uma `Lesson` com `studentId = aluno.id`, `status = CONFIRMED` e `scheduledAt > now`
- **Then** renderiza um card hero "Sua próxima aula" no topo
- **And** exibe: nome do instrutor, data formatada PT-BR (ex: "ter, 19 de mai · 14:00"), endereço de encontro, veículo (marca + modelo), valor pago
- **And** um countdown legível ("Em 2 dias", "Hoje", "Amanhã", "Em 4 horas")
- **And** botões "Ver detalhes" (linka para `/aulas/[id]`) e "Cancelar aula" (linka para `/aulas/[id]#cancelar`)
- **And** se houver `instructorConfirmed = true`, badge "Instrutor confirmou"

### AC2 — Cards de estatística (StatsCards)

- **Given** o aluno acessa `/aluno`
- **When** a página carrega via SSR
- **Then** exibe 3 cards estatísticos em grid responsivo (1col mobile / 3col md+):
  1. **Aulas concluídas** — `COUNT(lessons WHERE studentId AND status = COMPLETED)`
  2. **Próximas aulas** — `COUNT(lessons WHERE studentId AND status = CONFIRMED AND scheduledAt > now)`
  3. **Avaliação recebida** — `AVG(ratings.score WHERE targetId = userId AND role = INSTRUCTOR)` com ratingCount; "—" se sem amostras
- **And** cada card tem ícone lucide + número grande em JetBrains Mono + label curta
- **And** o card de "Avaliação recebida" tem tooltip explicativo: "Média das notas que os instrutores te deram"

### AC3 — Lista das demais próximas aulas (UpcomingLessons)

- **Given** existem 2+ aulas confirmadas futuras
- **When** o dashboard carrega
- **Then** abaixo do NextLessonCard exibe seção "Outras próximas" com até 5 lessons
- **And** cada item exibe: instrutor, data/hora compacta, status badge, link para `/aulas/[id]`
- **And** se houver mais de 5, mostra link "Ver todas em Minhas aulas" → `/aulas`

### AC4 — Estado vazio (sem aulas)

- **Given** o aluno tem `0` lessons
- **When** carrega `/aluno`
- **Then** ainda mostra os 3 StatsCards (com zeros / "—")
- **And** ao invés do NextLessonCard, mostra empty hero: "Sua jornada começa aqui" + CTA "Buscar instrutores" → `/instrutores`
- **And** texto educativo: "Encontre um instrutor credenciado e agende sua primeira aula. Pagamento em escrow — só liberamos para o instrutor após a aula confirmada."

### AC5 — Saudação contextual

- **Given** o aluno autenticado
- **When** entra em `/aluno`
- **Then** o título da página é "Olá, {primeiro_nome}" (não "Início")
- **And** abaixo, uma frase orientadora baseada em estado (ex: "Próxima aula em 2 dias" ou "Bora encontrar seu instrutor?")

### AC6 — Performance SSR

- **Given** a página é server component
- **When** renderiza
- **Then** todas as queries (próximas, count completed, count upcoming, avg rating) acontecem em uma única chamada agregada (`getStudentDashboardData`)
- **And** zero `useEffect` de fetch no client
- **And** zero loading spinner visível

## Files affected

### Novos
- `src/app/(student)/aluno/_data/dashboard.ts` — função `getStudentDashboardData(userId)`
- `src/app/(student)/aluno/_components/NextLessonCard.tsx`
- `src/app/(student)/aluno/_components/StatsCards.tsx`
- `src/app/(student)/aluno/_components/UpcomingLessonsCard.tsx`
- `src/app/(student)/aluno/_components/EmptyHero.tsx`
- `src/lib/datetime.ts` — helper `formatCountdown(date)` e `formatLessonDateTime(date)`

### Modificados
- `src/app/(student)/aluno/page.tsx` — substitui placeholder pela home real

## Test plan

- ✅ Build: `npx next build` zero erros
- ✅ Audit BMAD: `npm run audit:bmad:debt` exit 0
- ⏳ Smoke manual:
  - Login como `aluno@teste.vialivre` (Maria, 0 aulas) → ver empty hero + 3 cards com zeros
  - Login como `aluno@teste.vialivre` após agendar uma aula → ver NextLessonCard
  - Validar countdown PT-BR ("Em 2 dias", "Amanhã", "Hoje")

## Risks

- **R1:** query agregada com 4 sub-queries pode passar de 2s em 4G. Mitigação: usar `Promise.all` para paralelismo + Prisma `_count` em vez de COUNT manual. Lighthouse perf budget fica para 8.1e.
- **R2:** componentes server (data fetching) vs client (interatividade) — cuidado pra não importar lucide-react inside server sem necessidade. Mitigação: usar lucide-react diretamente em server components (suportado).
- **R3:** seed atual tem 0 aulas para `aluno@teste.vialivre`. Para validar manualmente NextLessonCard, vai precisar criar uma aula via UI ou seed. Aceitável — Story 8.1b entrega o código, validação manual é com aula criada.

## Definition of Done

- [ ] AC1: NextLessonCard renderizando com dados reais
- [ ] AC2: 3 StatsCards via SSR
- [ ] AC3: UpcomingLessonsCard com até 5 itens
- [ ] AC4: EmptyHero quando 0 aulas
- [ ] AC5: Saudação contextual
- [ ] AC6: SSR sem useEffect, zero loading
- [ ] Build limpo + audit ok
- [ ] CR (`cr-epic-8.1b-student-dashboard.md`)
- [ ] Commit + push
