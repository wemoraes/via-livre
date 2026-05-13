# Story 8.2b — Agenda visual semanal do instrutor

- **ID:** story-epic-8.2b-instructor-weekly-agenda
- **Epic:** 8 — Dashboards de Aluno e Instrutor
- **Parent Story (PRD):** Story 8.2 — Dashboard e Agenda do Instrutor (AC explícito sobre `/instructor/agenda` visual)
- **Sub-story scope:** preenche `/instructor/agenda` com visão semanal (7 dias × horas). Painel lateral ao clicar em lesson. Pedidos pendentes com indicação de urgência. Bloqueios inline ficam para 8.2c.
- **Personas:** Sally (UX), Amelia (Dev)
- **Status:** In progress

## Contexto

PRD Story 8.2 linha 920 declara:
> "a agenda visual em `/instructor/agenda` exibe visão semanal com aulas confirmadas (verde), pendentes (amarelo) e bloqueios (cinza)"
> "ao clicar em uma aula na agenda, abre painel lateral com: dados do aluno, local de encontro, valor, e ações (confirmar realização, cancelar)"

Hoje `/instructor/agenda` é a página de configuração de disponibilidade semanal (dias × horários). Esta story renomeia a config para `/instructor/disponibilidade` e cria a agenda visual real em `/instructor/agenda`.

## Acceptance Criteria

### AC1 — Renomeio: configuração de disponibilidade

- **Given** o instrutor acessa o link "Configurar disponibilidade"
- **When** clica
- **Then** navega para `/instructor/disponibilidade` (rota nova, mesmo código da antiga `/instructor/agenda`)
- **And** todos os links no onboarding e na sidebar que apontavam para `/instructor/agenda` (config) agora apontam para `/instructor/disponibilidade`

### AC2 — Nova `/instructor/agenda` é visual semanal

- **Given** o instrutor acessa `/instructor/agenda`
- **When** a página carrega
- **Then** exibe um grid 7 colunas (dom–sáb) × N linhas (slots de 1h, horário de 6h às 22h)
- **And** lessons da semana são posicionadas no slot correto baseado em `scheduledAt`
- **And** cores por status: CONFIRMED verde (`oklch(55% 0.17 145 / opacity)`), PENDING amarelo (`oklch(55% 0.12 85)`), COMPLETED azul (`oklch(45% 0.12 235)`), CANCELLED red (`oklch(50% 0.15 25)`)
- **And** o dia atual tem destaque visual
- **And** slots fora da `Availability` configurada renderizam com cinza translúcido (indica "fora do horário de atendimento")

### AC3 — Navegação entre semanas

- **Given** o instrutor está na agenda
- **When** clica em ‹ (semana anterior) ou › (próxima semana)
- **Then** URL atualiza com `?week=YYYY-MM-DD` (sábado anterior ao início da semana)
- **And** o servidor refaz query e renderiza nova semana
- **And** botão "Hoje" volta para semana atual

### AC4 — Side panel ao clicar em lesson

- **Given** o instrutor clica em um bloco de lesson
- **When** o painel lateral abre (drawer mobile / aside desktop)
- **Then** exibe: nome do aluno, data/hora, ponto de encontro, veículo, valor líquido + bruto, status, botões "Ver detalhes" → `/aulas/[id]` e "Cancelar aula" (linka para detalhe com `#cancelar`)
- **And** fecha clicando fora do painel ou pelo botão X

### AC5 — Pedidos pendentes com indicação de urgência

- **Given** existem `Lesson` com `status = PENDING` (pedidos aguardando confirmação do instrutor)
- **When** renderizam na grid
- **Then** o bloco tem badge "Pendente" + indicador "Expira em X" baseado em `createdAt + 2h`
- **And** se expirou (> 2h sem confirmação), badge muda para "Expirado" cinza
- **And** estilização chama atenção (border accent piscante via CSS keyframe)

### AC6 — Estado vazio

- **Given** o instrutor não tem lessons nessa semana
- **When** a página carrega
- **Then** o grid renderiza vazio (sem lessons) mas com slots de disponibilidade visíveis
- **And** mensagem leve "Nenhuma aula esta semana"
- **And** CTA "Atualizar disponibilidade" → `/instructor/disponibilidade`

## Files affected

### Novos
- `src/app/(instructor)/instructor/agenda/_data/week.ts` — `getInstructorWeekData(userId, weekStartIso)`
- `src/app/(instructor)/instructor/agenda/_components/WeeklyGrid.tsx`
- `src/app/(instructor)/instructor/agenda/_components/LessonBlock.tsx`
- `src/app/(instructor)/instructor/agenda/_components/LessonDetailPanel.tsx`
- `src/app/(instructor)/instructor/agenda/_components/WeekNavigator.tsx`
- `src/lib/week.ts` — helpers `startOfWeek(date)`, `addWeeks(date, n)`, etc.

### Movidos
- `src/app/(instructor)/instructor/agenda/page.tsx` (config antigo) → `src/app/(instructor)/instructor/disponibilidade/page.tsx`

### Modificados
- `src/app/(instructor)/instructor/agenda/page.tsx` — novo conteúdo (visual)
- `src/components/features/instructor/InstructorNavLinks.tsx` — adicionar link "Disponibilidade" se útil OU manter "Agenda" só como visual e linkar disponibilidade pela própria agenda
- `src/app/(instructor)/instructor/onboarding/page.tsx` — link agenda → disponibilidade

## Test plan

- ✅ Build limpo
- ✅ Audit ok
- ⏳ Smoke manual:
  - Carlos (sem lessons) → ver grid vazio com slots de disponibilidade
  - Navegação semana anterior/próxima
  - Configurar disponibilidade ainda funciona em /disponibilidade

## Risks

- **R1:** Quebrar URLs que apontam para `/instructor/agenda` (emails, bookmarks). Aceito: a página antiga existia há pouco tempo, sem produção real ainda.
- **R2:** Cálculo de "expira em X" para PENDING depende de `Lesson.createdAt + 2h`. O PRD não define o threshold; vou usar 2h como heurística razoável.
- **R3:** Grid 16 linhas × 7 colunas em mobile fica apertado. Mitigação: vertical scroll dentro do grid, ou em mobile mostrar 1 dia por vez com pager.

## Definition of Done

- [ ] AC1-AC6 atendidos
- [ ] Build limpo + audit ok
- [ ] CR escrito
- [ ] Commit + push
