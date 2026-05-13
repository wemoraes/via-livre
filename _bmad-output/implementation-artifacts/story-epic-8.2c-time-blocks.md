# Story 8.2c — Bloqueios pontuais na agenda

- **ID:** story-epic-8.2c-time-blocks
- **Epic:** 8 — Dashboards de Aluno e Instrutor
- **Parent Story (PRD):** Story 8.2 — Dashboard e Agenda do Instrutor (AC: "instrutor pode adicionar bloqueios de horário diretamente da agenda")
- **Personas:** Amelia (Dev)
- **Status:** In progress

## Contexto

A Story 8.2b entregou agenda visual semanal mas sem bloqueios pontuais. O schema atual tem só `Availability` (recorrência semanal — ex: "seg-sex 08–18h"), insuficiente para bloqueios pontuais ("vou viajar dia 25"). Esta story adiciona o modelo `TimeBlock`, server actions, e UI para criar/remover bloqueios direto da grid.

## Acceptance Criteria

### AC1 — Schema: novo model `TimeBlock`

- **Given** `prisma/schema.prisma`
- **When** alterado
- **Then** adiciona model `TimeBlock` com: `id`, `instructorId`, `startsAt`, `endsAt`, `reason?`, timestamps
- **And** `InstructorProfile` ganha relação `timeBlocks TimeBlock[]`
- **And** migration aplicada via `prisma migrate deploy`

### AC2 — Server actions

- **Given** instrutor autenticado
- **When** chama `createTimeBlock({ startsAt, endsAt, reason? })`
- **Then** valida Zod, garante `endsAt > startsAt`, persiste no banco
- **And** `removeTimeBlock(id)` apaga apenas se o bloqueio for desse instrutor
- **And** ambos retornam `ActionResult<T>`

### AC3 — Data layer

- **Given** `getInstructorWeekData(userId, weekStart)`
- **When** roda
- **Then** retorna também `timeBlocks: WeekTimeBlock[]` cobrindo a semana (`startsAt < end AND endsAt > start`)
- **And** cada bloco tem `id, startsAt, endsAt, reason?`

### AC4 — UI: criar bloqueio ao clicar slot vazio

- **Given** instrutor clica em slot vazio (sem aula, sem bloqueio existente)
- **When** o click chega
- **Then** abre dialog "Bloquear este horário?" com:
  - Data e hora pré-preenchidas (slot clicado, 1h)
  - Campo opcional "Motivo" (max 80 chars)
  - Botões "Bloquear" e "Cancelar"
- **And** ao confirmar, chama `createTimeBlock`, fecha dialog, `router.refresh()`

### AC5 — UI: render dos bloqueios na grid

- **Given** existem `TimeBlock` na semana
- **When** a agenda renderiza
- **Then** cada bloco aparece como `<button>` cinza no slot apropriado
- **And** ao clicar, abre dialog com data/motivo + botão "Remover bloqueio"
- **And** ao remover, chama `removeTimeBlock`, fecha, `router.refresh()`

### AC6 — Slots fora da `Availability` continuam visualmente "fora do horário"

- **Given** slots fora de `Availability` (sem bloqueio explícito)
- **When** renderizam
- **Then** mantém background cinza translúcido + click ainda permite criar bloqueio explícito (caso instrutor queira reforçar)

### AC7 — Validação no booking (RACE)

- **Given** este escopo NÃO inclui validar TimeBlock no fluxo de `createBooking`
- **When** entregar 8.2c
- **Then** documentar como follow-up: action `createBooking` precisa checar overlap com TimeBlock
- **And** essa validação fica para 8.2d ou story dedicada

## Files affected

### Schema / Migration
- `prisma/schema.prisma` — adicionar `model TimeBlock`, atualizar `InstructorProfile`
- `prisma/migrations/<ts>_time_block/migration.sql`

### Actions
- `src/actions/availability.ts` (novo OU dentro de `instructor.ts` futuro) — `createTimeBlock`, `removeTimeBlock`

### Data
- `src/app/(instructor)/instructor/agenda/_data/week.ts` — adicionar `timeBlocks` na resposta

### UI
- `src/app/(instructor)/instructor/agenda/_components/WeeklyGrid.tsx` — render TimeBlocks + handler de click empty slot
- `src/app/(instructor)/instructor/agenda/_components/TimeBlockDialog.tsx` (novo) — modal de criar/remover

## Test plan

- ✅ Build limpo
- ✅ Audit ok
- ✅ Migration aplicada Supabase
- ⏳ Smoke manual: instrutor clica slot vazio → bloqueia → renderiza cinza → click → remove

## Risks

- **R1:** Migration cria nova tabela com FK; idempotente. Como sempre, `prisma migrate deploy` apenas (não interactive).
- **R2:** Booking não valida overlap ainda. Documentado como follow-up. Em produção, criaria gap (instrutor bloqueia horário, aluno consegue agendar mesmo assim). Aceitável agora pois seed only.
- **R3:** Sobreposição de bloqueio com lesson existente — UX permite (não bloqueia). Trade-off: simplicidade > completude. Anotar.

## Definition of Done

- [ ] AC1-AC7 atendidos
- [ ] Build + audit ok
- [ ] CR escrito
- [ ] Commit + push
