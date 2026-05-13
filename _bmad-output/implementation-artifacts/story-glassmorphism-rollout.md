# Story: Rollout glassmorphism + compliance fix expiresAt

- **ID:** story-glassmorphism-rollout
- **Sessão:** 2026-05-13
- **Personas envolvidas:** Sally (UX), Amelia (Dev)
- **Epics relacionados:** Epic 3 (Onboarding instrutor), Epic 4 (Compliance/documentos), Epic 5 (Área aluno), Epic 6 (Busca pública), Epic 8 (Admin)
- **Fonte de demanda:** usuário relatou que "todo o restante da parte do onboarding continua com o layout antigo" e solicitou aplicação do design system glassmorphism em todas as superfícies remanescentes.
- **Status:** Done (backfill — artefato produzido após a implementação por violação de pipeline; ver CR e retro abaixo).

## Contexto

O redesign visual da landing (commit `a7b6f85`) introduziu o sistema glassmorphism (`.vl-mesh`, `.glass-card`, `.glass-lg`, `.vl-input`, tokens OKLCH em `--vl-accent`, `--vl-text-1/2/3`). Várias páginas pós-MVP do Epic 3-8 permaneceram com o layout pré-redesign (`bg-white`, `border-gray-200`, paleta neutra). Ao mesmo tempo, auditoria UX (Sally) identificou um P0: `DocumentUploadZone` não coletava `expiresAt`, deixando `processDocumentExpiryAlerts` sem dados para alertar instrutores sobre vencimento de CNH/CRLV — risco regulatório direto contra a Res. CONTRAN 1.020/2025.

## Acceptance Criteria

### Design system rollout

- **AC1** — Páginas de onboarding (`/instructor/onboarding`, `/instructor/onboarding/stripe`, `/instructor/onboarding/stripe/refresh`) usam `vl-mesh` + `glass-card` + `vl-input`.
- **AC2** — Páginas de gestão do instrutor (`/instructor/perfil`, `/instructor/veiculo`, `/instructor/agenda`, `/instructor/aulas`) adotam o mesmo sistema.
- **AC3** — Área do aluno (`/aulas`, `/aulas/[lessonId]`, `/agendar/[instructorId]`) adota o sistema, com empty states melhorados (CTA para `/instrutores`).
- **AC4** — Páginas públicas (`/instrutores`, `/instrutores/[id]`, `InstructorCard`) adotam o sistema; busca tem header sticky com backdrop-filter.
- **AC5** — Admin (`/admin/documentos`, `/admin/instrutores`) adota o sistema; status badges em OKLCH.
- **AC6** — Página `/403` + componente `ComplianceChecklist` adotam o sistema.

### Compliance / regulatório (P0)

- **AC7** — `DocumentUploadZone` exige `expiresAt` antes de submeter upload para os 5 tipos de documento (CNH_EAR, SENATRAN_CREDENTIAL, CRIMINAL_CERTIFICATE, TAX_CERTIFICATE, CRLV).
- **AC8** — `saveDocumentMetadata` aceita e persiste `expiresAt: string` (convertido para `Date`) tanto em `create` quanto em `update`.

### Plumbing

- **AC9** — `/verificar-email` envolto em `<Suspense>` (split em `page.tsx` + `verify-form.tsx`) para sair do erro de prerender com `useSearchParams()`.
- **AC10** — `scripts/seed-test-users.ts` cria `instrutor@teste.vialivre` + `aluno@teste.vialivre` (senha `Teste@2026`), usando `DIRECT_URL` (não pooler) e `PrismaPg` adapter.
- **AC11** — `searchInstructors` filtra por `stripeOnboardingDone: true` para não devolver instrutores incompletos.
- **AC12** — `registerInstructor` envia email de verificação e persiste CPF (apenas dígitos) no `instructorProfile`. Adiciona `verifyEmail(rawToken)` action com hash sha256, expiração e cleanup do token.
- **AC13** — Migração Prisma `add_cpf_to_instructor_profile` aplicada.

## Files affected

### Páginas redesenhadas

- `src/app/(instructor)/instructor/onboarding/page.tsx`
- `src/app/(instructor)/instructor/onboarding/stripe/page.tsx`
- `src/app/(instructor)/instructor/onboarding/stripe/refresh/page.tsx`
- `src/app/(instructor)/instructor/perfil/page.tsx`
- `src/app/(instructor)/instructor/veiculo/page.tsx`
- `src/app/(instructor)/instructor/agenda/page.tsx`
- `src/app/(instructor)/instructor/aulas/page.tsx`
- `src/app/(student)/aulas/page.tsx`
- `src/app/(student)/aulas/[lessonId]/page.tsx`
- `src/app/(student)/agendar/[instructorId]/page.tsx`
- `src/app/instrutores/page.tsx`
- `src/app/instrutores/[id]/page.tsx`
- `src/components/features/instructors/InstructorCard.tsx`
- `src/app/(admin)/admin/documentos/page.tsx`
- `src/app/(admin)/admin/instrutores/page.tsx`
- `src/app/403/page.tsx`
- `src/components/features/compliance/ComplianceChecklist.tsx`

### Compliance / regulatório

- `src/components/features/compliance/DocumentUploadZone.tsx` — coleta `expiresAt` antes do upload
- `src/actions/documents.ts` — `saveDocumentMetadata` persiste `expiresAt`

### Auth / verificação

- `src/app/(auth)/verificar-email/page.tsx` — Suspense wrapper
- `src/app/(auth)/verificar-email/verify-form.tsx` — client component com `useSearchParams()`
- `src/actions/auth.ts` — `verifyEmail()` action, envio de email de verificação no registro, persistência de CPF
- `src/proxy.ts` — `/verificar-email` adicionado a `PUBLIC_PREFIXES`

### Schema / dados

- `prisma/schema.prisma` — campo `cpf String?` em `InstructorProfile`
- `prisma/migrations/20260513102719_add_cpf_to_instructor_profile/migration.sql`
- `src/actions/search.ts` — filtro `stripeOnboardingDone: true`

### Tooling

- `scripts/seed-test-users.ts` — seed de usuários de teste

## Test plan

- ✅ `npx next build` zero erros TypeScript, 27 páginas geradas.
- ✅ Seed script roda e cria os dois usuários no banco Supabase.
- ⏳ Validação manual (cabe ao usuário): login com `instrutor@teste.vialivre` → verificar `/instructor/onboarding` + sub-páginas; login com `aluno@teste.vialivre` → verificar `/aulas` + busca; fluxo completo de upload de documento com `expiresAt`.
- ⏳ Validação visual em produção (`vialivre-br.vercel.app`) após deploy.

## Risks

- **R1 — Compliance:** documentos pré-existentes no banco continuam sem `expiresAt`. A migração não faz backfill. Mitigação: instrutores existentes precisam reupload + adicionar data. Aceitável porque a base ainda é seed-only.
- **R2 — Pipeline BMAD:** este story foi escrito após a implementação. Para evitar repetição, `AGENTS.md` agora exige artefato BMAD antes de qualquer código novo (vide hard rules).
- **R3 — Seed script usa `DIRECT_URL`:** scripts locais não funcionam se rodados sob o pooler. Já documentado por uso explícito no script.

## Definition of Done

- [x] AC1–AC13 atendidos
- [x] Build limpo
- [x] Seed executado com sucesso
- [x] CR produzido (`cr-glassmorphism-rollout.md`)
- [ ] Smoke test manual pelo usuário (em curso)
- [ ] Deploy em produção pós-merge
