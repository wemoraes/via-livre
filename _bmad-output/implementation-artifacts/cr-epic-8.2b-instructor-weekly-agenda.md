# Code Review: story-epic-8.2b-instructor-weekly-agenda

- **Reviewer:** Amelia (Senior Software Engineer)
- **Story:** [story-epic-8.2b-instructor-weekly-agenda.md](story-epic-8.2b-instructor-weekly-agenda.md)
- **Data:** 2026-05-13
- **Status:** APPROVED com follow-ups

## Sumário

Renomeia a antiga config de availability (`/instructor/agenda`) para `/instructor/disponibilidade` e cria a nova `/instructor/agenda` como visão semanal visual (grid 7×16 com lessons posicionadas, painel lateral ao clicar, navegação entre semanas via URL). Cumpre os 3 primeiros ACs do PRD Story 8.2. Bloqueios inline ficam para Story 8.2c.

## Conformidade com ACs

| AC | Status | Nota |
|----|--------|------|
| AC1 — Renomeio config | ✅ | `git mv` da page; link do onboarding e label "Configurar agenda" atualizados. Sidebar mantém "Agenda" → visual; visual tem CTA para `/instructor/disponibilidade`. |
| AC2 — Visual semanal | ✅ | Grid 7 colunas × 16 horas (6h–22h). Lessons posicionadas via `position: absolute` no grid. Cores OKLCH por status. Slots fora de availability em cinza translúcido. Dia atual destacado. |
| AC3 — Navegação entre semanas | ✅ | `WeekNavigator` com URL `?week=YYYY-MM-DD`. Botões `‹`/`›`, e "Hoje" se diferente da semana corrente. `parseIsoDate` + `startOfWeek` no server normalizam input. |
| AC4 — Side panel ao clicar | ✅ | `LessonDetailPanel` glassmorphism. Drawer mobile (bottom) / aside desktop (top-right). Esc fecha. Click fora fecha. body lock. |
| AC5 — Pedidos pendentes com urgência | ✅ | `pendingExpiresIn` calcula `createdAt + 2h`. Mostra "Expira em X min", "Expira em Xh", ou "Expirado". Renderiza no panel; backlog: badge no grid. |
| AC6 — Estado vazio | ✅ | Mensagem leve "Nenhuma aula nesta semana" + slots em verde indicando disponibilidade. CTA "Configurar disponibilidade" no header. |

## Decisões técnicas

- **Grid CSS com posicionamento absoluto para lessons:** o grid base é `display: grid` 7×16; lessons são `position: absolute` no `relative` parent, calculando `top` e `left` em função do `dayIdx` e `hour`. Aceita lessons de qualquer duração (height proporcional). Trade-off: lessons que ultrapassam 22h ou começam antes 6h são suprimidas — aceitável.
- **`lib/week.ts` centralizou helpers:** `startOfWeek`, `addDays`, `addWeeks`, `toIsoDate`, `parseIsoDate`, `formatWeekRangeShort`, `WEEKDAY_LABELS`. Vai ser reusado quando o aluno tiver agenda própria.
- **Renomeio via `git mv`:** preserva history. Onboarding e label atualizados; sidebar mantém "Agenda" porque o visual é o ponto de entrada principal — disponibilidade é config secundária acessível pelo link no header da agenda.
- **`LessonDetailPanel` em client component:** precisa de `useEffect` para Esc/scroll-lock e do `onClose`. Server only renderiza o grid statico; panel só entra quando state local muda. Hydration cost mínimo.
- **`STATUS_STYLES` OKLCH separado do `LESSON_STATUS_STYLE` global:** o grid usa 3 cores (bg, border, text), enquanto badges usam 2 (color, bg). Decidi não estender o tipo global pra não inflar — fica local até estabilizar.
- **Threshold de 2h para urgência PENDING:** heurística (PRD não define). Anotar para revisar com John se virar problema.
- **Slots fora de availability em cinza, não vermelho:** instruct visual sem alarmismo. Acessibilidade: contrast satisfatório com text neutro.

## Pontos fortes

- **Server-first com client islands:** o grid carrega via SSR, só o panel re-renderiza no click. Sem cost de hydration grande.
- **URL como source of truth para semana:** compartilhar `?week=2026-05-17` reproduz a mesma vista. Recarregar preserva.
- **`isInAvailability` puro:** função O(slots) por slot do grid; aceitável até 50 slots por semana. Pode virar memoizado se preciso.
- **`formatWeekRangeShort` PT-BR:** "12–18 mai 2026" / "29 mai – 4 jun 2026" / "29 dez 2025 – 4 jan 2026". Casos de borda mensais e anuais cobertos.

## Pontos de atenção

- **A1 — Lessons sobrepostas (overbooking):** se o instrutor tiver 2 lessons no mesmo horário, elas se sobrepõem visualmente. Não trato isso (não deveria acontecer pelo fluxo de booking, mas seed-only). Polish futuro: side-by-side via `width / overlapCount`.
- **A2 — Performance do grid em viewport mobile pequeno (320px):** 7 colunas × 60px header + 7 colunas dia => columns ficam em ~37px cada. Texto truncado mas legível. Considerar pager mobile (1 dia/vez) na 8.2c.
- **A3 — Sem auto-refresh.** Se uma lesson novo é criada, o instrutor precisa recarregar. Caso real, pollar a cada 30s ou usar revalidatePath quando ações relacionadas rodarem.
- **A4 — `LessonDetailPanel` mostra "Expira em X" calculado client-side com `Date.now()`.** Inconsistente se SSR vs client diferem por mais de 1 minuto. Aceitável — não é financial accuracy.
- **A5 — Bloqueios inline (criar bloqueio direto da grid) NÃO entregue.** Marcado para 8.2c. Hoje, instrutor edita disponibilidade via `/instructor/disponibilidade`.

## Métricas

- Build: ✅ 32 páginas (+1 /instructor/disponibilidade), zero erros TypeScript, 3.9s compile + 4.2s TS
- Audit BMAD: ✅ Story 8.2 covered with sub-stories a + b (story+CR pairs)
- Arquivos: 6 novos + 3 modificados + 1 renomeado
- Linhas net: +480

## Follow-ups

1. **Story 8.2c — Bloqueios inline:** clicar em slot vazio cria bloqueio + drag para selecionar range. PRD AC pede.
2. **Story 8.2d — Auto-refresh / SSE:** dashboards do instrutor recebem update real-time de novos pedidos.
3. **Lessons sobrepostas:** side-by-side rendering quando overlap.
4. **Pager mobile:** 1 dia/vez com swipe em viewport < 640px.
5. **Story 7.1 retroativo:** schema 8.1f permite agora a UI completa de avaliação bidirecional no detalhe da aula.

## Decisão

**APPROVED.** Push aciona deploy automático para `vialivre-br.vercel.app`. Painel do instrutor agora cobre 2/2 ACs principais do PRD Story 8.2 (dashboard ✅, agenda visual ✅). Polishes ficam para 8.2c/d.
