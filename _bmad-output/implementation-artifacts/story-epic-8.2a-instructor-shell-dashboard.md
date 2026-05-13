# Story 8.2a — Instructor shell + dashboard

- **ID:** story-epic-8.2a-instructor-shell-dashboard
- **Epic:** 8 — Dashboards de Aluno e Instrutor
- **Parent Story (PRD):** Story 8.2 — Dashboard e Agenda do Instrutor (ACs sobre `/instructor/dashboard`; agenda visual semanal fica em 8.2b futura)
- **Personas:** Amelia (Dev)
- **Status:** In progress

## Contexto

Story 8.1 (Painel do Aluno) recém-entregue em sub-stories 8.1a–f. Story 8.2 espelha pelo lado do instrutor. Hoje `/instructor/aulas`, `/instructor/agenda`, `/instructor/perfil`, `/instructor/veiculo` existem mas:
- Sem layout shell unificado (nav persistente)
- Sem `/instructor/dashboard` (a rota canônica do PRD)
- Cada página com `<main>+vl-mesh+fontFamily` redundantes
- Proxy redireciona ACTIVE → `/instructor/aulas` (lista crua)

Esta story replica o trabalho do aluno: shell + dashboard MVP. Agenda visual semanal fica para 8.2b.

## Acceptance Criteria

### AC1 — Shell de navegação do instrutor

- **Given** instrutor autenticado acessa qualquer rota `(instructor)`
- **When** renderiza
- **Then** layout aplica `vl-mesh` único, `StudentHeader`-style header com avatar+logout, `StudentSidebar`-style sidebar (md+) e bottom nav (mobile)
- **And** 5 destinos canônicos: Dashboard, Aulas, Agenda, Perfil, Veículo
- **And** route group existing está mantido (`src/app/(instructor)/layout.tsx`)
- **And** auth guard preserva role INSTRUCTOR

### AC2 — Página `/instructor/dashboard` via SSR

- **Given** instrutor ACTIVE acessa `/instructor/dashboard`
- **When** carrega
- **Then** exibe saudação contextual ("Olá, {firstName}", subtitle dinâmica)
- **And** cards de estatística:
  - **Receita do mês corrente**: `SUM(lessons.priceAmount * 0.85 WHERE status = COMPLETED AND scheduledAt no mês)` formatado em BRL
  - **Aprovômetro atual**: `instructorProfile.aprovometro` + `aprovometroCount` amostras (ou "Novo Instrutor" se count < 5)
  - **Avaliação média**: `instructorProfile.avgRating` + count de ratings recebidos
- **And** todos os widgets carregam via Server Component (zero useEffect)

### AC3 — Próxima aula em destaque

- **Given** instrutor tem lessons CONFIRMED com `scheduledAt > now`
- **When** dashboard renderiza
- **Then** mostra hero `InstructorNextLessonCard` com: nome do aluno, data/hora, countdown JetBrains Mono, ponto de encontro, veículo, valor que vai receber (priceAmount * 0.85)
- **And** botões "Ver detalhes" → `/aulas/[id]` (a página já existe, é compartilhada)
- **And** badge "Aluno confirmou" se `studentConfirmed = true`

### AC4 — Pedidos pendentes (PendingRequestsCard)

- **Given** existem lessons com `status = PENDING` em que `instructorConfirmed = false`
- **When** dashboard renderiza
- **Then** seção destacada "Pedidos aguardando sua confirmação"
- **And** cada item: aluno, data, valor, botão "Ver pedido"
- **And** se houver 0, oculta a seção

### AC5 — Alerta de documentos próximos do vencimento

- **Given** o instrutor tem `Document` com `expiresAt < now + 90 dias` E `status = APPROVED`
- **When** dashboard renderiza
- **Then** banner sticky topo com cor de alerta (oklch amarelo/laranja)
- **And** lista os 5 docs mais próximos do vencimento
- **And** CTA "Renovar documento" → `/instructor/onboarding` (que tem o checklist)

### AC6 — Estado vazio

- **Given** instrutor ACTIVE sem nenhuma lesson
- **When** dashboard carrega
- **Then** mostra empty hero motivacional: "Pronto para receber o primeiro aluno?" + dicas (atualize foto, complete bio)
- **And** cards de estatística ainda aparecem (com zeros / "—")

### AC7 — Redirect ACTIVE → /instructor/dashboard

- **Given** instrutor com `status = ACTIVE` faz login ou volta ao app
- **When** o proxy intercepta
- **Then** redireciona para `/instructor/dashboard` (não mais `/instructor/aulas`)
- **And** páginas instrutor não-ACTIVE continuam indo pra `/instructor/onboarding`

### AC8 — Refactor das páginas legadas

- **Given** layout do route group agora provê mesh + font + chrome
- **When** páginas `aulas`, `agenda`, `perfil`, `veiculo` renderizam
- **Then** removem o `<main>+vl-mesh+fontFamily` redundante (mesmo padrão do aluno na 8.1a)
- **And** continuam funcionais

## Files affected

### Novos
- `src/components/features/instructor/InstructorNavLinks.tsx`
- `src/components/features/instructor/InstructorSidebar.tsx`
- `src/components/features/instructor/InstructorBottomNav.tsx`
- `src/components/features/instructor/InstructorHeader.tsx`
- `src/app/(instructor)/instructor/dashboard/page.tsx`
- `src/app/(instructor)/instructor/dashboard/_data/dashboard.ts`
- `src/app/(instructor)/instructor/dashboard/_components/RevenueCard.tsx`
- `src/app/(instructor)/instructor/dashboard/_components/AprovometroCard.tsx`
- `src/app/(instructor)/instructor/dashboard/_components/RatingCard.tsx`
- `src/app/(instructor)/instructor/dashboard/_components/NextLessonCard.tsx`
- `src/app/(instructor)/instructor/dashboard/_components/PendingRequestsCard.tsx`
- `src/app/(instructor)/instructor/dashboard/_components/DocumentExpiryAlert.tsx`
- `src/app/(instructor)/instructor/dashboard/_components/UpcomingLessonsList.tsx`
- `src/app/(instructor)/instructor/dashboard/_components/EmptyInstructorHero.tsx`

### Modificados
- `src/app/(instructor)/layout.tsx` — adiciona shell completo
- `src/app/(instructor)/instructor/aulas/page.tsx` — remove main+mesh+font redundantes
- `src/app/(instructor)/instructor/agenda/page.tsx` — idem
- `src/app/(instructor)/instructor/perfil/page.tsx` — idem
- `src/app/(instructor)/instructor/veiculo/page.tsx` — idem
- `src/proxy.ts` — redirect ACTIVE → `/instructor/dashboard`

## Test plan

- ✅ Build limpo
- ✅ Audit ok
- ⏳ Smoke manual:
  - Login `instrutor.ativo@teste.vialivre` (Carlos, ACTIVE) → redireciona `/instructor/dashboard`
  - Ver cards (sem lessons hoje, todos zerados — mas estrutura visível)
  - Login `instrutor@teste.vialivre` (PENDING) → continua em `/instructor/onboarding`

## Risks

- **R1:** Carlos seed tem `aprovometro: 3.5`, `aprovometroCount: 8`, `avgRating: 4.8` — então AprovometroCard e RatingCard mostram dados realistas. Receita do mês fica em R$ 0,00 (sem lessons COMPLETED no seed). Aceitável; é estado real.
- **R2:** Documentos do Carlos têm `expiresAt: +1 ano`. DocumentExpiryAlert NÃO dispara (threshold de 90 dias). Aceitável; comportamento correto.
- **R3:** Refactor das páginas legadas pode atrapalhar dimensões — mas o aluno passou pelo mesmo refactor sem issue. Confiável.

## Definition of Done

- [ ] AC1-AC8 atendidos
- [ ] Build limpo + audit ok
- [ ] CR escrito
- [ ] Commit + push
