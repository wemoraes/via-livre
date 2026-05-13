# Story: Epic 3 cleanup — preparação para Epic 4

- **ID:** story-epic-3-cleanup
- **Origem:** action items P0 da retrospectiva Epic 3 ([epic-3-retro-2026-05-13.md](epic-3-retro-2026-05-13.md))
- **Epic-alvo:** Epic 3 (cleanup) + destravar Epic 4 (Descoberta)
- **Personas:** Amelia (Dev), Winston (Architect)
- **Status:** In progress

## Contexto

Antes de iniciar Epic 4 (Descoberta de Instrutores), três P0s da retro precisam ser fechados:

1. Duplicação de `STATUS_STYLE` em 4 arquivos (LessonStatus em 3, InstructorStatus em 1). Risco de divergência ao mudar a paleta.
2. Seed atual não tem instrutor `ACTIVE + stripeOnboardingDone:true` → `/instrutores` devolve vazio na demo, bloqueando smoke test do Epic 4.
3. Sem teste de fumaça que prove que `searchInstructors` devolve o instrutor ativo (regressão silenciosa possível).

## Acceptance Criteria

### AC1 — Extração do mapa de status

- **Given** os arquivos `src/app/(student)/aulas/page.tsx`, `src/app/(student)/aulas/[lessonId]/page.tsx`, `src/app/(instructor)/instructor/aulas/page.tsx`, `src/app/(admin)/admin/instrutores/page.tsx`
- **When** cada um declara `STATUS_LABEL` / `STATUS_STYLE` inline
- **Then** a duplicação deve ser eliminada movendo para `src/lib/status-colors.ts`
- **And** o módulo exporta: `LESSON_STATUS_LABEL`, `LESSON_STATUS_STYLE`, `INSTRUCTOR_STATUS_LABEL`, `INSTRUCTOR_STATUS_STYLE`
- **And** os 4 arquivos passam a importar do módulo único
- **And** zero declarações `STATUS_LABEL` ou `STATUS_STYLE` restantes em arquivos de página/componente

### AC2 — Seed com instrutor ACTIVE elegível para busca

- **Given** o script `scripts/seed-test-users.ts`
- **When** rodado
- **Then** cria/idempotentemente garante usuário `instrutor.ativo@teste.vialivre` com senha `Teste@2026`
- **And** `InstructorProfile.status = ACTIVE`
- **And** `InstructorProfile.stripeOnboardingDone = true`
- **And** `InstructorProfile.stripeAccountId = "acct_test_active_demo"` (mock)
- **And** todos os campos públicos preenchidos: bio (>50 chars), pricePerLesson, serviceRadius, city/state, areas (lista), lat/lng (São Paulo)
- **And** 1 veículo cadastrado (`Vehicle.active = true`, `isPrimary = true`)
- **And** todos os 5 `Document` aprovados (status APPROVED, `expiresAt` 1 ano à frente)
- **And** ao menos uma `Availability` ativa (dia útil 08:00–18:00)

### AC3 — Smoke test de `searchInstructors`

- **Given** o seed rodou com sucesso
- **When** executar `npx tsx scripts/smoke-test-search.ts`
- **Then** o script chama `searchInstructors({})` (sem filtros)
- **And** assert: `result.success === true`
- **And** assert: `result.data.instructors.length >= 1`
- **And** assert: pelo menos 1 instrutor com `id` correspondente ao `InstructorProfile` do `instrutor.ativo@teste.vialivre`
- **And** o script falha com exit code 1 e mensagem clara se qualquer assert quebrar

### AC4 — Build limpo

- `npx next build` retorna 0 erros TypeScript

## Files affected

- `src/lib/status-colors.ts` (novo)
- `src/app/(student)/aulas/page.tsx` (refactor import)
- `src/app/(student)/aulas/[lessonId]/page.tsx` (refactor import)
- `src/app/(instructor)/instructor/aulas/page.tsx` (refactor import)
- `src/app/(admin)/admin/instrutores/page.tsx` (refactor import)
- `scripts/seed-test-users.ts` (estende com 3º usuário ACTIVE + perfil completo)
- `scripts/smoke-test-search.ts` (novo)

## Test plan

- ✅ Build: `npx next build` zero erros
- ✅ Seed: `npx tsx scripts/seed-test-users.ts` cria/atualiza idempotentemente os 3 usuários
- ✅ Smoke: `npx tsx scripts/smoke-test-search.ts` passa
- ⏳ Smoke manual: login em `vialivre-br.vercel.app` como aluno, abrir `/instrutores`, ver o instrutor.ativo na busca

## Risks

- **R1:** `searchInstructors` usa Redis cache. Se o cache estiver populado de outras execuções, pode mascarar o resultado. Mitigação: smoke test usa key única ou limpa cache antes (verificar).
- **R2:** Seed com Stripe mock account (`acct_test_active_demo`) — não é uma conta Stripe real. Quando integrarmos webhook em produção, esses IDs não vão existir. Aceitável para demo seed-only.

## Definition of Done

- [ ] AC1: status-colors.ts criado, 4 arquivos refatorados, zero duplicação
- [ ] AC2: 3º usuário ACTIVE no seed
- [ ] AC3: smoke-test-search.ts executando com sucesso
- [ ] AC4: build limpo
- [ ] CR escrito (`cr-epic-3-cleanup.md`)
- [ ] Commit + push referenciando story
