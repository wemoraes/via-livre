# Code Review: story-epic-8.2a-instructor-shell-dashboard

- **Reviewer:** Amelia (Senior Software Engineer)
- **Story:** [story-epic-8.2a-instructor-shell-dashboard.md](story-epic-8.2a-instructor-shell-dashboard.md)
- **Data:** 2026-05-13
- **Status:** APPROVED com follow-ups

## Sumário

Espelha o trabalho do aluno (8.1a + 8.1b) pelo lado do instrutor em uma única Story. Cria shell de navegação (sidebar/bottom nav/header) + dashboard com receita do mês, Aprovômetro, avaliação média, próxima aula, pedidos pendentes, alerta de documentos próximos do vencimento. Refatora páginas legadas (aulas/agenda/perfil/veículo) para remover wrappers redundantes. Atualiza proxy para mandar instrutor ACTIVE para `/instructor/dashboard`.

## Conformidade com ACs

| AC | Status | Nota |
|----|--------|------|
| AC1 — Shell de navegação | ✅ | `(instructor)/layout.tsx` integra Header + Sidebar + BottomNav. 5 destinos canônicos. |
| AC2 — `/instructor/dashboard` SSR | ✅ | `getInstructorDashboardData` retorna saudação + 3 cards (Receita, Aprovômetro, Avaliação). |
| AC3 — NextLessonCard | ✅ | Hero da próxima aula CONFIRMED com countdown, dados e valor líquido (priceAmount × 0.85). |
| AC4 — PendingRequestsCard | ✅ | Lista lessons PENDING + `instructorConfirmed: false`. Oculta se 0. |
| AC5 — DocumentExpiryAlert | ✅ | Lista docs com `expiresAt < now + 90 dias`. Cores escalonadas (vermelho ≤30, amarelo ≤60, neutro >60). |
| AC6 — EmptyInstructorHero | ✅ | Motivacional + dicas (foto, bio) + CTA "Completar perfil". |
| AC7 — Redirect ACTIVE → dashboard | ✅ | `src/proxy.ts` linhas 34 e 50 atualizadas. |
| AC8 — Refactor páginas legadas | ✅ | aulas, agenda, perfil, veiculo: removidos `<main>+vl-mesh+fontFamily`. |

## Decisões técnicas

- **Componentes espelham o aluno mas não compartilham implementação:** `InstructorSidebar` e `StudentSidebar` divergem só em links e role guard. Manter separados evita acoplamento prematuro; se 3º role aparecer, refatorar para genérico aí.
- **`INSTRUCTOR_SHARE = 1 - VIALIVRE_FEE`** (0.85) declarado no data layer. Centraliza o valor; quando regulação ViaLivre mudar, muda em um lugar.
- **Header carrega foto + nome via Prisma na própria layout:** evita useSession + flicker. Custo: 1 query extra por SSR de qualquer rota instrutor — aceitável pra MVP, optimização via cache pode entrar depois.
- **Aprovômetro card adapta texto ao estado:** "Novo Instrutor" se `aprovometroCount < 5` (consistente com regra do PRD e com `AprovometroTag` da busca).
- **DocumentExpiryAlert cores escalonadas:** ≤30 dias vermelho (urgente), ≤60 amarelo (atenção), >60 neutro (informativo). Visual hierarquiza a ação.
- **Não criamos `actions/instructor.ts` ainda:** ações como `confirmLesson` já existem em `lessons.ts` (compartilhada). Cuidado pra não duplicar lógica.
- **Mantemos `/instructor/aulas` como rota de lista:** o dashboard é o hub; a lista detalhada continua acessível pelo link "Minhas aulas" na sidebar.
- **Refactor das páginas legadas em uma única passada:** padrão estabelecido na 8.1a. Reduz divergência visual.

## Pontos fortes

- **Carlos Demo Almeida (seed) já alimenta o dashboard com dados realistas:** Aprovômetro 3.5 (8 amostras), avgRating 4.8 — o dashboard "ganha vida" no smoke test.
- **Valor líquido sempre visível:** instrutor entende imediatamente o que vai receber (taxa transparente).
- **DocumentExpiryAlert é parte da entrega regulatória do Epic 3.5 sendo finalmente visível na UI** (antes só rodava no cron de email).
- **Saudação contextual prioriza ação concreta:** "Próxima aula em 2 dias" / "Pedidos aguardando" / "Bons ventos" — texto adapta ao estado.

## Pontos de atenção

- **A1 — Vista semanal `/instructor/agenda` continua na configuração antiga.** Story 8.2b vai entregar a agenda visual com bloqueios + painel lateral conforme AC do PRD. Por enquanto `/instructor/agenda` é configuração de availability (legado funcional).
- **A2 — `aprovometroCount` no schema é "número de amostras" do Aprovômetro.** Carlos seed tem 8 — consistente.
- **A3 — Painel mobile bottom nav cobre 5 itens em grid 5col.** Aceita ate viewport 320px com short labels.
- **A4 — Sem instrumentação de performance** (Lighthouse CI). Story 8.1e mencionou isso como follow-up; idem para instrutor.

## Métricas

- Build: ✅ 31 páginas (+1 da rota /instructor/dashboard), zero erros TypeScript, 6.3s compile + 4.1s TS
- Audit BMAD: ✅ continua com 41 stories em débito autorizado, 0 violações novas
- Componentes novos: 11 (shell × 4 + dashboard × 7)
- Server data novo: 1 (`getInstructorDashboardData`)
- Arquivos modificados: 5 (4 páginas legadas + proxy.ts)
- Linhas adicionadas: ~750

## Follow-ups

1. **Story 8.2b — Agenda visual semanal:** AC explícita do PRD. Visão semanal com aulas (verde/amarelo/cinza), painel lateral, bloqueios inline.
2. **Story 8.1c — Aprovômetro pessoal:** ainda bloqueada por decisão produto "instrutor principal".
3. **Story 7.1 retroativo** (Avaliação bidirecional ACs do PRD): com schema 8.1f, agora dá para criar a story brownfield e remover da allowlist.
4. **Cache do Header:** `prisma.user.findUnique` em todo SSR do layout instructor. Considerar `unstable_cache` por userId.

## Decisão

**APPROVED.** Painel do instrutor agora espelha o do aluno. Push aciona deploy automático. Próximo passo natural: Story 8.2b (agenda visual) ou backfill brownfield das outras stories.
