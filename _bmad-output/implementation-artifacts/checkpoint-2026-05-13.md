# Checkpoint — Sessão 2026-05-13

Snapshot do estado do projeto ao fim de uma sessão de ~3h ininterruptas. Use este doc como entry point ao retomar.

## 🎯 Onde paramos

**Epic 8 (Dashboards Aluno e Instrutor) funcionalmente completo** + Epic 7 (Avaliação Bidirecional) fechado em retrofit. Foi entregue:

- Painel completo do aluno (shell, dashboard, perfil, histórico)
- Painel completo do instrutor (shell, dashboard, agenda visual, bloqueios)
- Schema fix: rating bidirecional (`@@unique([lessonId, authorId])`)
- Pipeline BMAD restaurado com guardrails automáticos (`scripts/spec-audit.ts`, `.bmad-debt.json`, pre-commit hook)
- 9 commits push'ados, deploy automático Vercel ativo

## 📦 Stories desta sessão (em ordem cronológica)

| # | Story | Commit | Resumo |
|---|-------|--------|--------|
| 1 | `story-epic-3-cleanup` | `520c071` | Extract status-colors, seed ACTIVE instructor, smoke test |
| 2 | `story-epic-4-search-polish` | `420e61f` | Price pins, URL filters, AprovometroTag canônico |
| 3 | `story-epic-8.1a-student-shell` | `eef792e` | Shell aluno + BMAD audit guardrails |
| 4 | `story-epic-8.1b-student-dashboard` | `558ad6b` | NextLesson + StatsCards + Upcoming + EmptyHero |
| 5 | `story-epic-8.1e-student-profile` | `814fc87` | Editar nome/telefone/UF + avatar upload signed URL |
| 6 | `story-epic-8.1d-student-history` | `736a947` | LessonTimeline + RatingPrompt + filtros URL |
| 7 | `story-epic-8.1f-rating-bidirectional` | `e53fe96` | Schema: Rating `@@unique([lessonId, authorId])` |
| 8 | `story-epic-8.2a-instructor-shell-dashboard` | `b96c248` | Receita + Aprovômetro + Pedidos + DocExpiry |
| 9 | `story-epic-8.2b-instructor-weekly-agenda` | `df87a23` | Grid 7×16 + side panel + URL navigation |
| 10 | `story-epic-7.1-bidirectional-rating-retrofit` | `0c58680` | Instructor rating UI (loop fechado) |
| 11 | `story-epic-8.2c-time-blocks` | `0878547` | Model TimeBlock + dialog + render inline |

Cada story tem `story-epic-*.md` + `cr-epic-*.md` em `_bmad-output/implementation-artifacts/`.

## 🛡️ Estado do pipeline BMAD

- `scripts/spec-audit.ts` — auditoria contra `epics.md`. 3 modes (report/debt/strict).
- `.bmad-debt.json` — allowlist brownfield (39 stories).
- `.git-hooks/pre-commit` — roda `audit:bmad:debt` antes de cada commit. `core.hooksPath = .git-hooks` configurado.
- `AGENTS.md` endurecido com seção "BMAD pipeline is mandatory" + anti-padrões.

Conformidade: **5% (2/42 done — Story 8.1 + 8.2 cobertas por sub-stories, Story 7.1 retrofitada).**

## 🚨 Follow-up crítico pendente

### 8.2c-followup — Validar TimeBlock em `createBooking` (P0 antes de produção)

Estado: `src/actions/lessons.ts` action `createBooking` **não checa overlap com TimeBlock**. Aluno pode agendar em horário que o instrutor bloqueou. Não dói no demo (0 bookings reais), dói em produção.

Fix mínimo:
1. Antes de criar a `Lesson`, fazer `prisma.timeBlock.findFirst({ where: { instructorId, startsAt: { lt: lessonEnd }, endsAt: { gt: lessonStart } } })`
2. Se houver, retornar `err("Horário bloqueado pelo instrutor")`

## 🚧 Backlog explícito

### Epic 8 (resíduo)
- **8.1c — Aprovômetro pessoal do aluno** (BLOQUEADA). Precisa decisão de produto "instrutor principal" via `bmad-correct-course`. Sugestão: "instrutor com mais aulas concluídas, tie-break por mais recente".
- **8.2d — Motivação data-driven no dashboard do instrutor** ("Você está 0.3 aulas melhor que a média ViaLivre"). AC do PRD; nice-to-have.

### Brownfield (39 stories em `.bmad-debt.json`)
- Epics 1-7 + 9-10 têm código funcional mas faltam story+CR retroativos. Conforme cada uma for tocada, retrofit + remover do `allowed` array.
- Próximas candidatas naturais: Stories 4.x (busca) e 6.x (pagamento/escrow) — código mais maduro, retrofit rápido.

### Novos
- **Story sobre validação de booking vs TimeBlock** (8.2c-followup acima).
- Stripe webhook end-to-end test (Epic 6 sem confirmação real).
- Notificações push Web (Story 9.2 nunca tocada).

## 👤 Usuários de teste (válidos)

URL: https://vialivre-br.vercel.app · Senha: `Teste@2026`

| Email | Tipo | Estado |
|-------|------|--------|
| `instrutor.ativo@teste.vialivre` | Carlos — INSTRUCTOR ACTIVE | Aprovômetro 3.5 (8 amostras), avgRating 4.8, 5 docs APPROVED, veículo, 6 dias availability |
| `instrutor@teste.vialivre` | João — INSTRUCTOR PENDING | Onboarding zerado |
| `aluno@teste.vialivre` | Maria — STUDENT | Conta limpa, 0 aulas |

## 🔧 Setup pra retomar

```bash
# 1. Verificar estado real do pipeline
npm run audit:bmad

# 2. Smoke test do banco
npm run smoke:search

# 3. Dev server
npm run dev

# 4. Re-validar produção
curl -sI https://vialivre-br.vercel.app/entrar
```

## 📋 Próximas opções concretas (escolher uma ao retomar)

1. **8.2c-followup** (~30min): fechar gap funcional de booking vs TimeBlock antes de qualquer outra coisa.
2. **Validação manual no Vercel** (0 código): logar como Carlos + Maria, simular jornada, anotar gaps reais.
3. **8.1c — Aprovômetro pessoal**: rodar `bmad-correct-course` com John pra decidir "instrutor principal", então implementar.
4. **Backfill brownfield em massa**: retrofit das stories de Epic 4 (5 stories, código maduro, retrofit rápido). Conformidade BMAD sobe rapidamente.
5. **Epic 9.2 — Push notifications**: feature nova, alto valor de retenção.

## ⚠️ Decisões em aberto

- **"Instrutor principal" do aluno**: precisa de John (PM) elicitar via `bmad-correct-course`. Sugestão de heurística: instrutor com mais lessons COMPLETED, tie-break mais recente. Decisão final é de produto.
- **Política de cancelamento**: PRD menciona "reembolso conforme antecedência" sem definir janela. Não foi implementado ainda; provavelmente está em algum AC de Epic 5.4 brownfield.

## 🗂️ Convenções estabelecidas nesta sessão

- Sub-stories nomeadas `story-epic-X.Ya/b/c/d/e/f-slug.md` quando uma Story do PRD precisa decomposição.
- CRs sempre listam follow-ups numerados.
- Pre-commit hook é a fonte de verdade do pipeline. Não usar `--no-verify` salvo emergência.
- `.bmad-debt.json` é dívida explícita, não desculpa permanente — zerar incrementalmente.
- Migrations sempre via `prisma migrate deploy` (não `dev`) pra serverless.
