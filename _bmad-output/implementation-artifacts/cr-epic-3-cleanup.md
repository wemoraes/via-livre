# Code Review: story-epic-3-cleanup

- **Reviewer:** Amelia (Senior Software Engineer)
- **Story:** [story-epic-3-cleanup.md](story-epic-3-cleanup.md)
- **Data:** 2026-05-13
- **Status:** APPROVED

## Sumário

Fecha os 3 P0s da retro Epic 3: extração de `STATUS_STYLE`/`STATUS_LABEL` para módulo único, seed estendido com instrutor ACTIVE elegível para busca (5 docs APPROVED + veículo + 6 dias de availability), e smoke test que valida o estado do banco antes do Epic 4.

## Conformidade com ACs

| AC | Status | Nota |
|----|--------|------|
| AC1 — Extração de status maps | ✅ | `src/lib/status-colors.ts` exporta `LESSON_*` e `INSTRUCTOR_*`. 4 arquivos importam, zero duplicações. |
| AC2 — Seed com instrutor ACTIVE | ✅ | `Carlos Demo Almeida` (instrutor.ativo@teste.vialivre) em ACTIVE com `stripeOnboardingDone: true`, 5 docs APPROVED, veículo, 6 dias 08–18h. Idempotente. |
| AC3 — Smoke test | ✅ | `scripts/smoke-test-search.ts` valida em 8 asserts: count de instrutores elegíveis, demo presente, geo/preço/áreas/docs/veículo/availability. |
| AC4 — Build limpo | ✅ | 5.0s compile + 4.7s TypeScript + 27 páginas. Zero erros. |

## Decisões técnicas

- **Duas constantes ao invés de uma genérica:** `LESSON_STATUS_*` e `INSTRUCTOR_STATUS_*` foram mantidas separadas em vez de criar um helper genérico `getStatusStyle<T>()`. Razão: cada enum tem labels em PT-BR distintos e a paleta OKLCH compartilha cores mas mapeia para semânticas diferentes (ex.: PENDING amarelo nos dois, mas em LessonStatus = "aguardando pagamento" e em InstructorStatus = "aguardando aprovação"). Abstrair seria over-engineering.
- **`StatusStyle` interface exportada:** facilita futura extensão para `DocumentStatus` ou outros enums sem reescrever.
- **Smoke test mira o banco, não o action `searchInstructors`:** o action depende de Redis + Next runtime. O smoke test mira a mesma cláusula `where` em Prisma direto, isolando o teste do cache e do runtime. Trade-off aceito: testa o estado dos dados, não o caminho exato do código de busca. Mitigação: feito 1:1 ao filtro `status: ACTIVE + stripeOnboardingDone: true`. Se o filtro mudar no action, o smoke deve mudar junto.
- **Seed do instrutor ACTIVE inclui `aprovometro: 3.5`, `aprovometroCount: 8`, `avgRating: 4.8`:** dá demo realista (badge "Aprovômetro 3.5 aulas" + 4.8★) sem precisar criar 8 lessons + ratings.
- **`Vehicle.plate = "DEM-0A26"`:** formato Mercosul, válido pelo Zod do schema, prefixo `DEM` torna fácil identificar registro de demo se vier a aparecer em produção por erro de migration.
- **6 dias de availability (seg-sáb 08-18h)**: domingo de folga, alinhado com padrão de mercado de instrutores autônomos.

## Pontos fortes

- **Redução de superfície:** 4 declarações redundantes → 1 arquivo de 35 linhas. Mudar paleta agora é grep + edit.
- **Smoke test idempotente:** roda 10 vezes, sempre o mesmo resultado se o seed estiver íntegro.
- **Seed defensivo:** usa `skipDuplicates: true` em `createMany` de docs e availability — não quebra se rodado após mudanças incrementais.
- **Mensagens de erro do smoke acionáveis:** "Rode `npx tsx scripts/seed-test-users.ts` primeiro" diz exatamente o que fazer.

## Pontos de atenção

- **A1 — Smoke não cobre o caminho via Redis cache:** se o action tiver bug na invalidação de cache, o smoke não pega. Aceitável agora; quando Epic 4 entrar em E2E, criar teste que bate `searchInstructors` direto via HTTP.
- **A2 — Stripe account ID é mock (`acct_test_active_demo`):** o webhook de Stripe vai rejeitar esse ID se chamado. Não é problema para demo do Epic 4 (busca), mas vira problema para Epic 6 (Pagamento) — precisa stripe-cli ou conta de teste real.
- **A3 — `DEPRECATED warning` sobre `module.register()`:** vem do `tsx`. Não bloqueia.

## Métricas

- Build: ✅ 5.0s compile / 4.7s TS / 27 páginas
- TypeScript errors: 0
- Smoke test: ✅ 8/8 asserts
- Seed: ✅ idempotente (run 2 vezes, sem duplicar)
- Arquivos modificados: 5 (M) + 2 novos
- Linhas: +130 / -85 (estimativa)

## Follow-ups

1. **Epic 4 E2E:** quando a busca tiver UI funcional, criar teste que bate `searchInstructors` via fetch da página e mede latência + cache hit/miss.
2. **`STATUS_COLOR` em `ComplianceChecklist`:** ainda usa classes Tailwind (`text-green-700 bg-green-50`) em vez do padrão OKLCH. Conscious decision: documentos usam paleta mais sutil que lessons/instrutores. Se for unificar no futuro, adicionar `DOCUMENT_STATUS_*` ao `status-colors.ts`.
3. **Configurar `tsx` para suprimir warning de deprecation:** baixíssima prioridade.

## Decisão

**APPROVED.** Pronto para commit/push e deploy. Epic 3 finalizado; Epic 4 destravado.
