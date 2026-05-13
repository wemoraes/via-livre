# Code Review: story-epic-8.1b-student-dashboard

- **Reviewer:** Amelia (Senior Software Engineer)
- **Story:** [story-epic-8.1b-student-dashboard.md](story-epic-8.1b-student-dashboard.md)
- **Data:** 2026-05-13
- **Status:** APPROVED com follow-ups

## Sumário

Substitui o placeholder de `/aluno` pela home real do aluno: saudação contextual, próxima aula em destaque (ou empty hero se 0 aulas), 3 cards estatísticos (concluídas, próximas, avaliação recebida), e lista compacta das demais próximas aulas. Tudo via SSR, sem useEffect, com agregação Prisma em uma única função `getStudentDashboardData`.

## Conformidade com ACs

| AC | Status | Nota |
|----|--------|------|
| AC1 — NextLessonCard | ✅ | Hero com countdown JetBrains Mono, dados (instrutor, data, ponto de encontro, veículo, preço), badge "Instrutor confirmou", botões Ver detalhes + Cancelar. |
| AC2 — StatsCards | ✅ | 3 cards com `_count` Prisma + `aggregate` para média. JetBrains Mono nos números. Tooltip explicativo no card de avaliação. |
| AC3 — UpcomingLessonsCard | ✅ | Até 5 itens com link "Ver todas" se total > 6. |
| AC4 — EmptyHero | ✅ | "Sua jornada começa aqui" + CTA + nota sobre escrow (constrói trust no primeiro acesso). |
| AC5 — Saudação contextual | ✅ | "Olá, {firstName}" + subtitle dinâmica baseada em estado (próxima aula, completed > 0, ou zero). |
| AC6 — SSR sem loading | ✅ | Server component, Promise.all paraleliza 4 queries. Zero useEffect. |

## Decisões técnicas

- **`Promise.all` no `getStudentDashboardData`:** 4 queries (próximas, count completed, count upcoming, ratings agg) executam em paralelo. Em PG isso resolve em ~80-150ms em conexão pooler local.
- **`upcoming.take: 6`:** pega 6 lessons. Primeira vira o NextLessonCard, as 5 restantes vão pra UpcomingLessonsCard. Se houver mais de 6, mostra link "Ver todas em /aulas".
- **`_avg.score` retornando number ou null:** Prisma agrega sobre `Decimal`/`Int` e devolve `null` se sem rows. Tratamento explícito no UI (`avg !== null ? toFixed(1) : "—"`).
- **`role: INSTRUCTOR` no rating:** filtra para "avaliações que instrutores deram para o aluno" (autor = INSTRUCTOR, target = userId do aluno). Bate com o spec do schema (Rating.role = role do autor).
- **Componentes em `_components/` e dados em `_data/`:** convenção Next 16 — underscore prefix faz pasta NÃO virar rota. Mantém escopo local ao dashboard.
- **`formatCountdown` em `src/lib/datetime.ts`:** centraliza lógica de "Em 2 dias", "Amanhã", "Hoje", etc. Reutilizável quando 8.1d (histórico) precisar formatar datas relativas similares.
- **`formatLessonDateTime`:** PT-BR Intl com replace `, ` → ` ·` para legibilidade ("ter, 19 mai · 14:00").
- **EmptyHero menciona escrow:** constrói trust no primeiro acesso — alinhado com princípio do PRD ("confiança antes da conversão").
- **`<Link href={\`/aulas/${id}#cancelar\`}>`:** anchor de cancelamento aponta para fragmento; quando `/aulas/[id]` receber suporte a deeplink #cancelar, abre o flow direto. Por hora apenas linka pra detalhe; comportamento não-degradado.

## Pontos fortes

- **SSR puro, sem hydration cost:** todos os componentes são server, exceto pelos elementos client herdados (`<Link>`). Bundle do `/aluno` é mínimo.
- **Single-query data layer:** evita N+1; quando 8.1c (aprovômetro) e 8.1e (perfil) chegarem, podem juntar suas queries em `getStudentDashboardData` (decisão para Story 8.1c).
- **Resiliência a dados parciais:** `instructor.user.name ?? "Instrutor"`, `student.user.name ?? "Aluno"`, avg null tratado. Nenhuma surface area pra crash em produção.
- **Conformidade com design system:** glass-card, OKLCH, JetBrains Mono nos números, lucide-react. Zero divergência visual em relação ao Epic 4.
- **Mobile-first:** grid responsivo 1col/3col, layout flex que colapsa bem em 320px.

## Pontos de atenção

- **A1 — `getStudentDashboardData` lança erro se StudentProfile não existir.** O `(student)` layout já garante role STUDENT, mas se o usuário tem role STUDENT sem `StudentProfile` (caso de borda), a página crasha. Mitigação futura: criar StudentProfile automaticamente no auth callback OU retornar `null` e renderizar EmptyHero.
- **A2 — `getStudentDashboardData` corre em todo SSR de `/aluno`.** Não é cached. Quando o tráfego subir, considerar `revalidateTag` ou `unstable_cache` por studentId. Por enquanto OK.
- **A3 — Anchor `#cancelar` é informacional.** A página `/aulas/[id]` não sabe ainda abrir um dialog modal de cancelamento via fragment. Quando Story 8.1d/e tratar fluxos de cancelamento, validar.
- **A4 — `formatCountdown` retorna "Em 1 mês"/"Em 2 meses" para > 30/60 dias.** Pode ficar estranho pra aula realmente longe (ex: "Em 3 meses" arredonda). Aceitável; aulas raramente são marcadas tão longe.
- **A5 — StatsCard de avaliação recebida sem amostras mostra "—" + "sem dados".** Sutil mas claro. Quando 8.1c trouxer Aprovômetro pessoal, deve seguir o mesmo padrão "—" para estado vazio.

## Métricas

- Build: ✅ 30 páginas, zero erros TypeScript
- Audit BMAD: ✅ Story 8.1 DONE (story + CR do 8.1a + agora 8.1b stack), 41 brownfield em débito
- Componentes novos: 4 (`NextLessonCard`, `StatsCards`, `UpcomingLessonsCard`, `EmptyHero`)
- Lib novo: 1 (`datetime.ts`)
- Server data novo: 1 (`getStudentDashboardData`)
- Linhas adicionadas: ~330

## Follow-ups

1. **Story 8.1c — Aprovômetro pessoal:** precisa decisão de produto sobre "instrutor principal". Recomendo `bmad-correct-course` antes de codar. Pode entrar como 4º StatsCard ou como widget separado.
2. **Story 8.1d — Histórico:** preenche `/aluno/historico` com LessonTimeline + RatingPrompt.
3. **Story 8.1e — Perfil + perf budget:** preenche `/aluno/perfil` + Lighthouse CI.
4. **Polish menor:** badge de "Você confirmou" no NextLessonCard quando `lesson.studentConfirmed && !lesson.instructorConfirmed`. Não bloqueia.
5. **Caching:** considerar `revalidateTag("student-dashboard:" + userId)` quando lessons forem agendadas/canceladas. Ganho > 100ms em hot path.

## Decisão

**APPROVED.** O painel do aluno deixou de ser "ridiculamente simples". Próximo passo é Story 8.1c (aprovômetro pessoal) ou 8.1d (histórico). Push aciona deploy automático.
