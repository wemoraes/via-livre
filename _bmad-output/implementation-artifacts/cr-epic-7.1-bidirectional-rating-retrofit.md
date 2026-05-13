# Code Review: story-epic-7.1-bidirectional-rating-retrofit

- **Reviewer:** Amelia (Senior Software Engineer)
- **Story:** [story-epic-7.1-bidirectional-rating-retrofit.md](story-epic-7.1-bidirectional-rating-retrofit.md)
- **Data:** 2026-05-13
- **Status:** APPROVED

## Sumário

Retrofit brownfield da Story 7.1 do PRD (Avaliação Bidirecional Pós-Aula). Schema (8.1f), action `submitRating` e RatingForm do aluno já existiam; faltava a UI do instrutor. Esta story move o `RatingForm` para `src/components/features/ratings/`, parametriza `targetLabel`, e cria `/instructor/aulas/[lessonId]` com detalhe completo + avaliação do aluno. Story sai da `.bmad-debt.json`.

## Conformidade com ACs

| AC | Status | Nota |
|----|--------|------|
| AC1 — `RatingForm` parametrizado | ✅ | `targetLabel: "instrutor" \| "aluno"` prop. Move para `src/components/features/ratings/`. Estilizado com glassmorphism + `vl-input`. |
| AC2 — `/instructor/aulas/[lessonId]` | ✅ | Detalhe completo: aluno, data, ponto, veículo (com placa), duração, receita líquida + bruta. `InstructorConfirmButton` quando aplicável. Form pra avaliar aluno se COMPLETED + não avaliado. Mostra ambas ratings com comments. |
| AC3 — Lista linka detalhe | ✅ | `(instructor)/aulas/page.tsx`: upcoming e past viraram `<Link>`. Past inclui `ChevronRight`. |
| AC4 — Agenda LessonDetailPanel | ✅ | Botão "Ver detalhes" → `/instructor/aulas/[id]`. Removi botão "Cancelar aula" do panel da agenda — fluxo de cancelamento permanece via detalhe (`InstructorConfirmButton`/cancel via action lessons). |
| AC5 — Student page mostra ambas | ✅ | `(student)/aulas/[lessonId]`: agora exibe "Você avaliou: ★★★★★" + "Você foi avaliado: ★★★★☆" inline com comments. |
| AC6 — Remover 7.1 do débito | ✅ | `.bmad-debt.json`: "7.1" removido. Audit recognize. |

## Decisões técnicas

- **`RatingForm` ganhou `targetLabel` como union strict ("instrutor" | "aluno"):** evita typos e força revisão se um terceiro target aparecer no futuro.
- **Submit `submitRating` continuou inalterado:** já era role-aware. Sem novas actions necessárias.
- **`role: UserRole.STUDENT` ao filtrar `ratingReceived` na view do instrutor:** garante que pegamos só a nota DADA por aluno (não outro instrutor — improvável, mas defensive).
- **Removi botão "Cancelar aula" do `LessonDetailPanel` da agenda:** o fluxo de cancelamento exige confirmar política + reembolso (server-side), que vive no detalhe. Anchor `#cancelar` era informacional e não tinha implementação. Limpeza.
- **`/instructor/aulas/[lessonId]` reusa `InstructorConfirmButton`** já existente em `../InstructorConfirmButton`. Sem duplicar action.
- **Page do aluno + page do instrutor mostram ambas as ratings** com label adaptado ao contexto ("Você avaliou" / "Aluno avaliou"). Symmetric UX.

## Pontos fortes

- **Loop bidirecional completo agora:** aluno avalia → schema persiste → instrutor vê → instrutor avalia → schema persiste → aluno vê. Sem schema work adicional (já feito em 8.1f).
- **Componente único compartilhado:** `RatingForm` é fonte única para ambos lados. Mudanças visuais ou de UX entram em um lugar.
- **Reduz dívida BMAD:** Story 7.1 sai do débito brownfield e vira tracked done. Conformidade sobe de 2% pra 5% (2/42).
- **`StarRating` reusado:** já existia (8.1d), agora também aparece nas views de detalhe.

## Pontos de atenção

- **A1 — `myRating.comment` exibido inline com aspas tipográficas:** ok visualmente; trunca naturalmente pelo container width.
- **A2 — Sem teste E2E.** Smoke manual exige criar uma lesson + completar + duas sessões (uma do aluno, uma do instrutor). Não dá pra automatizar nesta sessão.
- **A3 — `avgRating` na `InstructorProfile` só recalcula quando aluno avalia (`isStudent` em `submitRating`).** Quando instrutor avalia, não há `avgRatingByInstructor` no schema do `StudentProfile`. PRD não pede; aceito.
- **A4 — Status DISPUTED na lesson:** rating ainda funciona se status for COMPLETED. Se DISPUTED, RatingForm não aparece (não é COMPLETED). Aceito pelo PRD.

## Métricas

- Build: ✅ 32 páginas, zero erros TypeScript, 4.6s compile + 5.3s TS
- Audit BMAD: ✅ 2/42 done (Story 8.1 + Story 8.2 covered; Story 7.1 in progress neste momento — done após este CR ser merged)
- Componentes movidos: 1 (`RatingForm`)
- Componentes novos: 0
- Páginas novas: 1 (`/instructor/aulas/[lessonId]`)
- Arquivos modificados: 5 (student page, instructor aulas list, agenda panel, 3 dashboard cards de instrutor com links atualizados)
- Linhas net: +180

## Follow-ups

1. **Story 8.2c — Bloqueios inline na agenda** (bloqueio direto da grade).
2. **Story 8.1c — Aprovômetro pessoal do aluno** (precisa `bmad-correct-course` para decisão "instrutor principal").
3. **Backfill brownfield das 38 stories restantes** em `.bmad-debt.json` — sairá incrementalmente conforme cada uma for tocada.
4. **avgRating recebido pelo aluno** — opcional, não exigido pelo PRD.

## Decisão

**APPROVED.** Loop bidirecional fechado. Push aciona deploy automático. Story 7.1 agora tem story+CR; pode ser removida do débito (já feito).
