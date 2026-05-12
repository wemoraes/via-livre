---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-05-12'
project_name: 'via-livre'
user_name: 'Wmoraes'
date: '2026-05-12'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/product-brief.md
  - _bmad-output/planning-artifacts/domain-research-legal.md
  - _bmad-output/planning-artifacts/market-research.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# Documento de Arquitetura — ViaLivre

**Autor:** Wmoraes  
**Data:** 2026-05-12  
**Versão:** 1.0  
**Status:** Completo — Pronto para Implementação

---

## Análise do Contexto do Projeto

### Visão Geral dos Requisitos

**Requisitos Funcionais — Resumo Arquitetural:**

O PRD define 50 FRs organizados em 10 áreas de capacidade. As implicações arquiteturais centrais são:

| Área de Capacidade | Complexidade | Impacto Arquitetural |
|---|---|---|
| Descoberta e Busca geolocalizada | Alta | Google Maps JS API + PostGIS ou geocoding; índice espacial no DB |
| Aprovômetro — cálculo e exibição | Média | Agregação no DB; cache invalidado por evento de aula confirmada |
| Agendamento com slots de disponibilidade | Alta | Estado complexo de calendário; concorrência (double-booking) |
| Pagamento com escrow + split | Muito Alta | Gateway marketplace (Stripe Connect); webhook processing seguro |
| Onboarding de compliance documental | Alta | Upload seguro (Supabase Storage); estado de machine de aprovação; alertas periódicos |
| Avaliação bidirecional | Baixa | Triggering pós-confirmação de aula; sem edição pelo avaliado |
| Dashboard financeiro (instrutor) | Média | Agregação por período; reconciliação com gateway |
| Notificações (push + email) | Média | Fila assíncrona; deduplicação; retry |
| Painel Admin | Média | RBAC; auditoria de ações; gestão de estados de compliance |
| Autenticação dual (aluno / instrutor / admin) | Alta | Roles distintos; sessão segura; onboarding flow por role |

**Requisitos Não-Funcionais — Implicações:**

- **Performance < 2s em 4G:** SSR (Next.js Server Components) para conteúdo inicial; Google Maps renderização client-side isolada
- **WCAG 2.1 AA:** shadcn/ui como base acessível; testes com VoiceOver/NVDA nos fluxos críticos
- **Segurança (LGPD + PCI):** documentos de compliance em Supabase Storage com signed URL; dados de pagamento never-stored; bcrypt/argon2 para senhas; TLS 1.3
- **Disponibilidade ≥ 99,5%:** Vercel Edge Network + PostgreSQL managed (Supabase ou Railway) com réplica de leitura
- **Escalabilidade 10x:** caching de resultados de busca geolocalizada com Redis; arquitetura stateless no Next.js

**Escala e Complexidade:**

- Complexidade: **Alta** — marketplace two-sided regulado com pagamentos, compliance e geolocalização
- Domínio primário: **Full-stack web** (mobile-first responsive, sem app nativo no MVP)
- Componentes arquiteturais estimados: 12–15 módulos funcionais
- Cross-cutting concerns: autenticação/autorização, compliance documental, notificações assíncronas, auditoria, LGPD

### Restrições Técnicas e Dependências

- **Gateway de pagamento deve suportar split marketplace desde o MVP** — Stripe Connect escolhido (decisão arquitetural crítica do product brief)
- **Google Maps JS API** — substituição do Mapbox; melhor cobertura no Brasil, Google Geocoding API integrada
- **shadcn/ui + Tailwind CSS v4 + tokens OKLCH** — definidos pelo UX spec, vinculante
- **Tipografia:** Instrument Serif + Plus Jakarta Sans + JetBrains Mono (Google Fonts)
- **Armazenamento de documentos:** nunca no banco de dados — apenas referências (paths Supabase Storage) no DB
- **Compliance documental:** estado de aprovação por documento, validação manual inicial, alertas por prazo
- **LGPD:** minimização de dados; dados sensíveis (documentos) segregados em storage com controle de acesso

### Cross-Cutting Concerns Identificados

1. **Autenticação e Autorização (RBAC):** 3 roles principais (student, instructor, admin); fluxos de onboarding distintos por role
2. **Compliance Documental:** máquina de estado de documentos (pending → submitted → under_review → approved | rejected); vencimento com alertas
3. **Processamento de Pagamento:** webhooks Stripe assíncronos; escrow lógico no banco; reconciliação; política de cancelamento aplicada automaticamente
4. **Notificações Assíncronas:** fila de jobs (email + push); deduplicação; retry com exponential backoff
5. **Geolocalização:** indexação espacial; geocoding de endereços; caching de resultados
6. **Aprovômetro:** cálculo por evento (não real-time); invalidação de cache por aula confirmada
7. **Auditoria:** log de ações críticas (compliance, moderação, pagamentos) com actor + timestamp + before/after

---

## Avaliação de Starter Template

### Domínio Tecnológico Primário

**Full-stack web marketplace** com SSR/SSG para performance de SEO e First Contentful Paint, API routes para processamento server-side, e Client Components isolados para interações ricas (mapa, calendário, formulários de pagamento).

### Starter Selecionado: `create-next-app` — Next.js 15 com App Router

**Rationale para Seleção:**

Next.js 15 com App Router é o único framework que oferece na mesma base: Server Components (HTML no servidor para FCP < 1,5s), Client Components isolados (Google Maps, Stripe Elements), Server Actions (mutations seguras sem API extra), API Routes (webhooks, integrações), e ecosystem completo de deploy na Vercel (zero-config, edge, analytics).

**Comando de Inicialização:**

```bash
npx create-next-app@latest via-livre \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

Pós-inicialização:

```bash
# shadcn/ui
npx shadcn@latest init

# Dependências core
npm install prisma @prisma/client
npm install next-auth@beta
npm install stripe
npm install @vis.gl/react-google-maps
npm install resend
npm install @upstash/redis
npm install zod
npm install @tanstack/react-query
npm install date-fns
npm install react-hook-form @hookform/resolvers
```

**Decisões Arquiteturais Providas pelo Starter:**

| Categoria | Decisão | Versão |
|---|---|---|
| Language | TypeScript | 5.x |
| Framework | Next.js App Router | 15.x |
| Styling | Tailwind CSS | v4.x |
| Linting | ESLint + Next.js config | integrado |
| Build | Turbopack (dev) / Webpack (prod) | integrado |
| Roteamento | App Router com layouts aninhados | integrado |
| Server Components | Por padrão — opt-in para Client | integrado |

**Nota:** A inicialização do projeto com este comando deve ser a primeira história de implementação do Epic de Setup.

---

## Decisões Arquiteturais Core

### Análise de Prioridade

**Decisões Críticas (bloqueiam a implementação):**

1. PostgreSQL como banco de dados principal com extensão PostGIS
2. Stripe Connect como gateway de pagamento marketplace
3. Auth.js (NextAuth v5) para autenticação com roles
4. Prisma como ORM e camada de migração
5. Supabase Storage para documentos de compliance

**Decisões Importantes (moldam a arquitetura):**

6. Redis (Upstash) para caching e filas de jobs
7. Resend para email transacional
8. Google Maps JS API para mapa (isolado em Client Component via `@vis.gl/react-google-maps`)
9. Feature-based folder structure
10. Zod para validação de schemas (compartilhada entre client e server)

**Decisões Deferidas (Pós-MVP):**

- API SENATRAN: integração quando disponível publicamente
- Seguradora (seguro parametrizado): Fase 2, hook arquitetural já previsto no agendamento
- App nativo: Fase 3, API REST desacoplada já facilita

---

### Arquitetura de Dados

**Banco de Dados:** PostgreSQL 16 (gerenciado — Supabase ou Railway)

**Rationale:** Marketplace com relacionamentos complexos (aluno ↔ aula ↔ instrutor ↔ pagamento ↔ avaliação), queries de geolocalização (PostGIS), compliance com LGPD (foreign keys + audit trail), e transações ACID para escrow são todos requisitos naturais para SQL relacional. PostGIS habilita busca por raio sem índice externo.

**ORM:** Prisma 6.x

**Rationale:** Type-safety end-to-end com inferência de tipos do schema; migrations declarativas; integração nativa com Next.js Server Actions; Prisma Accelerate disponível para pooling de conexões no Vercel (serverless).

**Schema de Dados — Entidades Principais:**

```prisma
// Simplificado — schema completo no arquivo prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  role          UserRole  // STUDENT | INSTRUCTOR | ADMIN
  profile       Profile?
  createdAt     DateTime  @default(now())
}

model InstructorProfile {
  id              String    @id @default(cuid())
  userId          String    @unique
  status          InstructorStatus  // PENDING | UNDER_REVIEW | ACTIVE | SUSPENDED | INACTIVE
  aprovometro     Float?    // null = Novo Instrutor (< 5 alunos)
  totalLessons    Int       @default(0)
  avgRating       Float?
  pricePerLesson  Decimal
  lat             Float?    // PostGIS point alternative
  lng             Float?
  serviceRadius   Int       @default(10) // km
  vehicles        Vehicle[]
  documents       Document[]
  lessons         Lesson[]
  availability    Availability[]
}

model Document {
  id           String         @id @default(cuid())
  instructorId String
  type         DocumentType   // CNH | EAR | SENATRAN | CRIMINAL_CERTIFICATE | TAX_CERTIFICATE | CRLV
  status       DocumentStatus // PENDING | SUBMITTED | UNDER_REVIEW | APPROVED | REJECTED | EXPIRED
  storageKey   String         // Supabase Storage path — never expose directly, always signed URL
  expiresAt    DateTime?
  reviewedBy   String?
  reviewNote   String?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}

model Lesson {
  id           String       @id @default(cuid())
  studentId    String
  instructorId String
  vehicleId    String
  status       LessonStatus // PENDING | CONFIRMED | COMPLETED | CANCELLED | DISPUTED
  scheduledAt  DateTime
  meetingPoint String
  priceAmount  Decimal
  escrowStatus EscrowStatus // HELD | RELEASED | REFUNDED
  stripePaymentIntentId String?
  studentConfirmed    Boolean @default(false)
  instructorConfirmed Boolean @default(false)
  examResult          ExamResult? // null | PASSED | FAILED — para Aprovômetro
  cancelledBy         String?
  cancelReason        String?
}

model Rating {
  id           String   @id @default(cuid())
  lessonId     String   @unique
  authorId     String
  targetId     String
  role         UserRole // quem avaliou: STUDENT | INSTRUCTOR
  score        Int      // 1–5
  comment      String?
  createdAt    DateTime @default(now())
}
```

**Estratégia de Migração:** Prisma Migrate em todos os ambientes. Migrations geradas e versionadas no repositório. Rollback via migration inversa documentada.

**Estratégia de Caching:** Redis (Upstash Serverless) para:
- Resultados de busca geolocalizada por região (TTL 5min; invalidado quando novo instrutor ativo na área)
- Rate limiting em endpoints críticos (auth, pagamento)
- Sessões de usuário (complementar ao cookie JWT do Auth.js)

---

### Autenticação e Segurança

**Autenticação:** Auth.js (NextAuth) v5 (beta estável)

**Rationale:** Integração nativa com Next.js App Router e Server Actions; suporte a JWT + Database sessions; Prisma adapter disponível; Role-Based Access Control por middleware Next.js; suporte a email magic link para onboarding suave.

**Estratégia de Roles:**

```typescript
// Três roles principais
type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'

// Middleware Next.js aplica proteção por prefixo de rota
// /student/* → apenas STUDENT autenticado
// /instructor/* → apenas INSTRUCTOR autenticado + status ACTIVE
// /admin/* → apenas ADMIN
```

**Fluxo de Autenticação:**

- Cadastro com email + senha (bcrypt custo 12) ou Magic Link (email)
- Separação de onboarding por role: aluno (simples, 2 telas) vs instrutor (compliance checklist)
- JWT em httpOnly cookie; refresh token para sessões longas
- Proteção CSRF em todas as mutations (Server Actions geram token automaticamente)

**Autorização (RBAC):**

- Middleware Next.js intercepta rotas por prefixo de role
- Checks de ownership em cada Server Action/API Route (ex: `lesson.studentId === session.user.id`)
- Admin tem acesso de leitura a todos os recursos; escrita limitada a ações de moderação

**Segurança de Documentos:**

- Upload direto para Supabase Storage via signed URL (instrutor → Storage, nunca via servidor)
- URLs de acesso assinadas com expiração de 15 minutos (admin review)
- Metadados (tipo, status, storageKey) no PostgreSQL; payload de arquivo nunca no banco

**PCI DSS:**

- Stripe Elements: dados de cartão processados pelo SDK Stripe no browser; ViaLivre nunca vê dados crus
- PaymentIntent ID armazenado; não PAN, CVV ou dados de cartão
- Webhooks Stripe validados por assinatura (STRIPE_WEBHOOK_SECRET)

---

### Padrões de API e Comunicação

**Padrão Principal:** Next.js Server Actions para mutations (form submissions, confirmações, cancelamentos)

**Rationale:** Type-safety end-to-end; progressive enhancement; sem client-side fetch boilerplate; ideal para formulários complexos (agendamento, pagamento, onboarding).

**API Routes para:** webhooks externos (Stripe, email bounce), integrações futuras (SENATRAN, seguradora), e endpoints que precisam de controle de cache HTTP explícito.

**Design de API REST (API Routes):**

- Plural, snake_case em query params: `/api/instructors?city_id=&max_approvo=`
- Prefixo `/api/v1/` para versionamento desde o início
- Recursos aninhados com limite de 2 níveis: `/api/v1/lessons/:id/ratings`

**Formato de Resposta Padrão:**

```typescript
// Sucesso
{ data: T, meta?: { pagination, total } }

// Erro
{ error: { code: string, message: string, details?: Record<string, string[]> } }
```

**Formato de Erros HTTP:**

- 400: validação de input (Zod) — inclui `details` com campos e mensagens
- 401: não autenticado
- 403: autorização negada (role inválido ou ownership)
- 404: recurso não encontrado
- 409: conflito de estado (ex: slot já reservado)
- 422: regra de negócio violada (ex: cancelamento fora do prazo)
- 500: erro interno — mensagem genérica, detalhes no log (nunca expor stack trace)

**Processamento de Webhooks Stripe:**

```
POST /api/webhooks/stripe
→ Validar assinatura (STRIPE_WEBHOOK_SECRET)
→ Enfileirar job assíncrono por tipo de evento
→ Retornar 200 imediatamente (< 5s para Stripe)
→ Job processa: atualizar escrow, notificar partes, registrar auditoria
```

**Comunicação Assíncrona (Jobs):**

- Fila simples via Upstash QStash ou pg-boss (jobs no PostgreSQL) no MVP
- Jobs: envio de email, push notification, atualização de Aprovômetro, alertas de vencimento
- Retry automático com exponential backoff (máx 3 tentativas)

---

### Arquitetura Frontend

**Paradigma:** React com Next.js App Router — Server Components por padrão, Client Components explicitamente marcados com `'use client'`

**Regra de ouro:** Nenhum dado é buscado no cliente se pode ser buscado no servidor. Client Components existem apenas para: interatividade (mapa, calendário, formulários), estado local (UI state), e bibliotecas que requerem APIs do browser (Google Maps).

**Gestão de Estado:**

- **Server State (remoto):** TanStack Query v5 para dados mutáveis buscados no cliente (disponibilidade em tempo real, status de agendamento)
- **Form State:** React Hook Form + Zod resolver (validação isomórfica — mesmo schema no server)
- **Global UI State:** Zustand (apenas para estado de UI global: sidebar aberta, mapa vs lista toggle, filtros de busca)
- **Server Components:** dados "estáticos suficientes" (perfil de instrutor, histórico de aulas) buscados direto com `async/await` + Prisma

**Componentes-Chave (mapeados do UX Spec):**

| Componente | Tipo | Responsabilidade |
|---|---|---|
| `MapView` | Client | Google Maps JS API (`@vis.gl/react-google-maps`); pins de preço; sincronização com lista |
| `InstructorCard` | Server | Card de instrutor com Aprovômetro; renderizado no servidor |
| `AprovometroTag` | Server | Tag verde com número JetBrains Mono + contagem de amostras |
| `AvailabilityCalendar` | Client | Seleção de data/hora; fetch de slots disponíveis |
| `EscrowPaymentFlow` | Client | Stripe Elements + explicação do escrow |
| `ComplianceChecklist` | Client | Upload de documentos com status por item |
| `DocumentUploadZone` | Client | Upload direto para Supabase Storage via signed URL |
| `NewInstructorBadge` | Server | Badge de novo instrutor quando Aprovômetro indisponível |

**Roteamento:**

```
/                       → Landing page (SSG)
/buscar                 → Busca de instrutores (SSR + Client para mapa)
/instrutor/[slug]       → Perfil do instrutor (SSR)
/agendar/[instructorId] → Agendamento (SSR + Client para calendário)
/pagamento/[lessonId]   → Pagamento (Client — Stripe Elements)
/aluno/dashboard        → Dashboard do aluno (SSR, autenticado)
/aluno/historico        → Histórico de aulas (SSR)
/instrutor/dashboard    → Dashboard do instrutor (SSR, autenticado + ACTIVE)
/instrutor/agenda       → Gestão de agenda (Client)
/instrutor/financeiro   → Dashboard financeiro (SSR)
/instrutor/onboarding   → Onboarding com checklist (Client)
/admin/*                → Painel admin (SSR + Client, role ADMIN)
```

**Performance Frontend:**

- Imagens de instrutores: `next/image` com lazy loading, AVIF/WebP
- Fontes: `next/font` com Google Fonts (Instrument Serif, Plus Jakarta Sans, JetBrains Mono) — sem FOUT
- Google Maps: carregado apenas na rota `/buscar` (dynamic import com `ssr: false`)
- Bundle splitting: Stripe.js carregado apenas em `/pagamento/*`

---

### Infraestrutura e Deploy

**Hosting Frontend + API:** Vercel

**Rationale:** Deploy zero-config para Next.js; Edge Network global (CDN + Edge Functions); preview deploys automáticos por PR; analytics integrado; serverless functions com cold start aceitável para o MVP.

**Banco de Dados:** Supabase (PostgreSQL 16 gerenciado)

**Rationale:** PostgreSQL com extensão PostGIS disponível; Prisma Accelerate para connection pooling em ambiente serverless; painel de administração de DB; point-in-time recovery; gratuito no tier inicial.

**Alternativa:** Railway (PostgreSQL) — mais simples, sem lock-in de features Supabase que não serão usadas.

**File Storage:** Supabase Storage

**Rationale:** Já na stack — SDK Supabase unificado, sem conta extra. Suporta presigned URLs via `createSignedUrl()`, RLS nativo para controle de acesso (mesmo modelo do banco), gratuito até 1GB. Para MVP de documentos de compliance (PDFs ~2–5MB, acesso restrito a admin), é a escolha mais simples. Migração para R2 posterior é direta se o volume de egress virar custo.

**Cache e Jobs:** Upstash (Redis Serverless + QStash)

**Rationale:** Serverless-native; sem servidor de Redis dedicado no MVP; QStash para filas de jobs com retry e webhook delivery.

**Email Transacional:** Resend

**Rationale:** API simples + React Email para templates type-safe; suporte a SPF/DKIM automático; tier gratuito generoso.

**Monitoramento e Observabilidade:**

- **Erros:** Sentry (frontend + backend) — captura de erros com contexto de usuário
- **Analytics de performance:** Vercel Analytics (Web Vitals por rota)
- **Logs:** Vercel Log Drain → Logtail ou similar para persistência

**CI/CD:**

```
GitHub → Vercel (deploy automático)
  PR aberto → preview deploy (URL única por PR)
  Merge em main → deploy em produção
  
Pipeline GitHub Actions:
  - Lint (ESLint)
  - Type check (tsc --noEmit)
  - Testes unitários (Vitest)
  - Prisma migrate diff (valida migration sem aplicar)
```

**Ambientes:**

- `development`: local com `.env.local`, banco local (Docker) ou Supabase dev
- `preview`: Vercel preview, banco de staging (Supabase staging branch)
- `production`: Vercel production, banco Supabase production

**Variáveis de Ambiente Críticas:**

```env
# Database
DATABASE_URL=
DIRECT_URL=          # Prisma Accelerate bypass para migrations

# Auth
AUTH_SECRET=
AUTH_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Storage (Supabase Storage — usa o mesmo projeto Supabase do banco)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=   # chave privada para presigned URL no servidor
SUPABASE_STORAGE_BUCKET=compliance-documents

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Email
RESEND_API_KEY=

# Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Jobs
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=
```

---

## Padrões de Implementação e Regras de Consistência

### Pontos de Conflito Potencial Identificados

12 áreas onde agentes IA poderiam fazer escolhas diferentes. Padrões abaixo são obrigatórios.

---

### Padrões de Nomenclatura

**Banco de Dados (Prisma Schema):**

```
Tabelas:    PascalCase singular (User, Lesson, InstructorProfile)
Campos:     camelCase (createdAt, pricePerLesson, stripePaymentIntentId)
IDs:        sempre 'id' (tipo: cuid() por padrão)
Foreign keys: nomeCampo + 'Id' (studentId, instructorId, vehicleId)
Enums:      PascalCase (UserRole, LessonStatus, DocumentStatus)
Enum values: SCREAMING_SNAKE_CASE (UNDER_REVIEW, PAYMENT_INTENT_HELD)
```

**API Routes e Endpoints:**

```
Recursos:   kebab-case, plural: /api/v1/instructors, /api/v1/lessons
Parâmetros de rota: camelCase: /api/v1/instructors/[instructorId]
Query params: snake_case: ?city_id=&max_approvo=&min_rating=
Headers HTTP: kebab-case padrão: Content-Type, Authorization
```

**Código TypeScript:**

```
Componentes React:  PascalCase, sufixo descritivo: InstructorCard, AprovometroTag
Arquivos de componentes: PascalCase.tsx: InstructorCard.tsx
Hooks:      camelCase com prefixo 'use': useAvailability, useAprovometro
Server Actions: camelCase com verbo: bookLesson, confirmLessonCompleted, uploadDocument
Funções utilitárias: camelCase com verbo: calculateAprovometro, formatCurrency
Types/Interfaces: PascalCase, sem prefixo 'I': LessonWithParticipants, InstructorSearchResult
Constantes: SCREAMING_SNAKE_CASE: MAX_SEARCH_RADIUS_KM, ESCROW_RELEASE_DELAY_HOURS
```

**Rotas Next.js:**

```
Segmentos de rota: kebab-case: /instrutor/onboarding, /aluno/historico
Route groups:    parênteses: (student), (instructor), (admin), (public)
Dynamic segments: camelCase: [instructorId], [lessonId]
```

---

### Padrões de Estrutura

**Organização de Componentes:**

```
src/components/
  ui/              → shadcn/ui componentes base (Button, Input, Card, etc.)
  shared/          → componentes compartilhados entre roles (Navigation, Avatar, etc.)
  student/         → componentes específicos do aluno
  instructor/      → componentes específicos do instrutor
  admin/           → componentes do painel admin
  features/        → componentes de funcionalidade cross-cutting
    map/           → MapView, MapPin, MapFilters
    booking/       → AvailabilityCalendar, BookingConfirmation
    payment/       → EscrowPaymentFlow, StripePaymentForm
    compliance/    → ComplianceChecklist, DocumentUploadZone
    rating/        → RatingForm, RatingDisplay
    aprovometro/   → AprovometroTag, AprovometroExplainer
```

**Localização de Testes:**

```
Testes unitários: co-localizados com o arquivo
  src/components/features/aprovometro/AprovometroTag.test.tsx
  src/lib/aprovometro.test.ts

Testes de integração: src/__tests__/integration/
  src/__tests__/integration/booking-flow.test.ts
  src/__tests__/integration/payment-webhook.test.ts

Testes E2E: tests/e2e/
  tests/e2e/student-booking.spec.ts
  tests/e2e/instructor-onboarding.spec.ts
```

**Organização de Server Actions:**

```
src/actions/
  lessons.ts       → bookLesson, cancelLesson, confirmLessonCompleted
  payments.ts      → createPaymentIntent, processRefund
  instructors.ts   → updateInstructorProfile, updateAvailability
  documents.ts     → submitDocument, getPresignedUploadUrl
  ratings.ts       → submitRating
  admin/
    compliance.ts  → approveDocument, rejectDocument, suspendInstructor
```

---

### Padrões de Formato

**Formato de Resposta de Server Actions:**

```typescript
// Todas as Server Actions retornam este tipo
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

// Exemplo de uso
async function bookLesson(input: BookLessonInput): Promise<ActionResult<{ lessonId: string }>> {
  const parsed = bookLessonSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Dados inválidos', fieldErrors: parsed.error.flatten().fieldErrors }
  }
  // ...
  return { success: true, data: { lessonId: lesson.id } }
}
```

**Formato de Datas:**

```typescript
// Banco de dados: DateTime do Prisma (UTC)
// API JSON: ISO 8601 string: "2026-06-15T10:00:00.000Z"
// Exibição ao usuário: formatado com date-fns + locale pt-BR
// NUNCA: timestamps Unix em APIs públicas
// NUNCA: Date sem timezone em contextos de agendamento
```

**Formato de Valores Monetários:**

```typescript
// Banco de dados: Decimal do Prisma (precisão 10, escala 2)
// Código: nunca usar float para dinheiro — sempre Decimal ou inteiro centavos
// Stripe: sempre em centavos (inteiro): priceAmount * 100
// Exibição: Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
// Exemplo: R$ 120,00 (non-breaking space padrão pt-BR)
```

**Campos JSON em APIs:**

```typescript
// camelCase em respostas de API e Server Actions
// snake_case apenas em query parameters (conveniência de URL)
// Consistência: nunca misturar no mesmo endpoint
```

---

### Padrões de Comunicação

**Padrão de Eventos de Negócio:**

```typescript
// Eventos internos (para auditoria e side effects)
type BusinessEvent =
  | { type: 'lesson.booked'; payload: { lessonId: string; studentId: string; instructorId: string } }
  | { type: 'lesson.confirmed'; payload: { lessonId: string; confirmedBy: UserRole } }
  | { type: 'lesson.completed'; payload: { lessonId: string; examResult?: ExamResult } }
  | { type: 'payment.released'; payload: { lessonId: string; amount: Decimal } }
  | { type: 'document.approved'; payload: { documentId: string; instructorId: string } }

// Nomenclatura: resource.action em snake_case
// Payload: IDs nunca omitidos, contexto mínimo suficiente para o handler
```

**Padrão de Notificações:**

```typescript
// Toda notificação passa pela fila (nunca disparada direto na Server Action)
type NotificationJob = {
  channel: 'email' | 'push' | 'both'
  recipientId: string
  template: NotificationTemplate  // enum tipado
  data: Record<string, unknown>
  idempotencyKey: string          // previne duplicatas em retry
}
```

---

### Padrões de Processo

**Tratamento de Erros:**

```typescript
// Erros de domínio: classes tipadas
class BusinessRuleError extends Error {
  constructor(public code: string, message: string) { super(message) }
}

class NotFoundError extends BusinessRuleError {}
class UnauthorizedError extends BusinessRuleError {}
class ConflictError extends BusinessRuleError {}  // double-booking, documento já enviado

// Em Server Actions: capturar BusinessRuleError e retornar ActionResult de erro
// Em API Routes: mapear para status HTTP correspondente
// Nunca: expor stack trace ou mensagens internas de DB ao usuário
// Sempre: logar no Sentry com contexto (userId, lessonId, etc.) antes de retornar erro genérico
```

**Padrão de Loading State:**

```typescript
// React: useTransition para Server Actions (não useState + fetch)
const [isPending, startTransition] = useTransition()
// TanStack Query: isLoading, isFetching, isPending para queries
// Shadcn/ui Button: prop disabled={isPending} + indicador visual (spinner)
// NUNCA: loading state global para ações locais
// SEMPRE: feedback visual dentro de 300ms (usuário percebe delay > 300ms)
```

**Validação de Input:**

```typescript
// Schema Zod definido uma vez, usado em client (React Hook Form) e server (Server Action)
// src/lib/schemas/lesson.ts
export const bookLessonSchema = z.object({
  instructorId: z.string().cuid(),
  scheduledAt: z.string().datetime(),
  meetingPoint: z.string().min(5).max(200),
})
export type BookLessonInput = z.infer<typeof bookLessonSchema>

// Client: zodResolver(bookLessonSchema)
// Server: bookLessonSchema.safeParse(input)
```

**Regras de Enforcement (Todos os Agentes DEVEM):**

- Usar `ActionResult<T>` em todas as Server Actions — sem throws não capturados
- Validar input com Zod no servidor mesmo que já validado no cliente
- Verificar ownership antes de qualquer mutation (ex: `if (lesson.studentId !== session.user.id) throw new UnauthorizedError(...)`)
- Nunca armazenar dados de cartão, senha em texto plano, ou URL de Supabase Storage pública sem expiração
- Emitir evento de auditoria para: aprovação/rejeição de documentos, suspensão de instrutor, liberação de escrow, cancelamento de aula
- Usar `date-fns` para todas as operações de data (nunca `new Date()` para comparações de agendamento)
- Formatar valores monetários com `Intl.NumberFormat` — nunca concatenação de string

---

## Estrutura do Projeto e Fronteiras

### Estrutura Completa de Diretórios

```
via-livre/
├── README.md
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local                    # Não commitado
├── .env.example                  # Template commitado
├── .gitignore
├── .eslintrc.json
├── vitest.config.ts
├── playwright.config.ts
│
├── .github/
│   └── workflows/
│       ├── ci.yml               # Lint, type-check, testes, migration diff
│       └── preview.yml          # Deploy preview em PRs
│
├── prisma/
│   ├── schema.prisma            # Schema completo (ver acima)
│   └── migrations/              # Migrations versionadas
│       └── 0001_init/
│
├── public/
│   ├── fonts/                   # Se necessário self-host
│   └── images/
│       ├── logo.svg
│       └── og-image.png
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── globals.css          # Tailwind v4 + tokens OKLCH
│   │   ├── layout.tsx           # Root layout (fonts, providers)
│   │   ├── page.tsx             # Landing page (SSG)
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   │
│   │   ├── (public)/            # Rotas sem autenticação
│   │   │   ├── buscar/
│   │   │   │   ├── page.tsx     # Search page (SSR + Client mapa)
│   │   │   │   └── loading.tsx
│   │   │   ├── instrutor/
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx # Perfil público do instrutor (SSR)
│   │   │   │       └── loading.tsx
│   │   │   └── como-funciona/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (auth)/              # Fluxos de autenticação
│   │   │   ├── entrar/
│   │   │   │   └── page.tsx
│   │   │   ├── cadastro/
│   │   │   │   ├── page.tsx     # Seleção de role
│   │   │   │   ├── aluno/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── instrutor/
│   │   │   │       └── page.tsx
│   │   │   └── verificar/
│   │   │       └── page.tsx     # Magic link verification
│   │   │
│   │   ├── (student)/           # Rotas do aluno (auth: STUDENT)
│   │   │   ├── layout.tsx       # Verifica role STUDENT
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── agendar/
│   │   │   │   └── [instructorId]/
│   │   │   │       ├── page.tsx # Agendamento (SSR + Client calendário)
│   │   │   │       └── loading.tsx
│   │   │   ├── pagamento/
│   │   │   │   └── [lessonId]/
│   │   │   │       └── page.tsx # Stripe Elements (Client)
│   │   │   ├── historico/
│   │   │   │   └── page.tsx
│   │   │   └── avaliacao/
│   │   │       └── [lessonId]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── (instructor)/        # Rotas do instrutor (auth: INSTRUCTOR + ACTIVE)
│   │   │   ├── layout.tsx       # Verifica role + status ACTIVE (redirect para onboarding se PENDING)
│   │   │   ├── onboarding/
│   │   │   │   ├── page.tsx     # Checklist de compliance (Client)
│   │   │   │   └── loading.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── agenda/
│   │   │   │   ├── page.tsx     # Gestão de agenda (Client)
│   │   │   │   └── configurar/
│   │   │   │       └── page.tsx
│   │   │   ├── financeiro/
│   │   │   │   └── page.tsx
│   │   │   ├── perfil/
│   │   │   │   └── page.tsx
│   │   │   └── veiculo/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (admin)/             # Painel admin (auth: ADMIN)
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx     # Métricas operacionais
│   │   │   ├── instrutores/
│   │   │   │   ├── page.tsx     # Lista de instrutores + status compliance
│   │   │   │   └── [instructorId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── documentos/
│   │   │   │           └── page.tsx # Revisão de documentos
│   │   │   ├── denuncias/
│   │   │   │   └── page.tsx
│   │   │   └── configuracoes/
│   │   │       └── checklist/
│   │   │           └── page.tsx # Checklist por UF
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts # Auth.js handler
│   │       ├── v1/
│   │       │   ├── instructors/
│   │       │   │   ├── route.ts             # GET /api/v1/instructors (busca paginada)
│   │       │   │   └── [instructorId]/
│   │       │   │       ├── route.ts         # GET /api/v1/instructors/:id
│   │       │   │       └── availability/
│   │       │   │           └── route.ts     # GET /api/v1/instructors/:id/availability
│   │       │   └── lessons/
│   │       │       └── [lessonId]/
│   │       │           └── route.ts         # GET /api/v1/lessons/:id
│   │       └── webhooks/
│   │           └── stripe/
│   │               └── route.ts             # POST webhook do Stripe
│   │
│   ├── actions/                 # Next.js Server Actions
│   │   ├── auth.ts              # signIn, signUp, signOut
│   │   ├── lessons.ts           # bookLesson, cancelLesson, confirmLessonCompleted, reportExamResult
│   │   ├── payments.ts          # createPaymentIntent, requestPayout
│   │   ├── instructors.ts       # updateProfile, updateAvailability, blockSlot
│   │   ├── documents.ts         # getPresignedUploadUrl, submitDocumentForReview
│   │   ├── ratings.ts           # submitRating
│   │   └── admin/
│   │       ├── compliance.ts    # approveDocument, rejectDocument, suspendInstructor
│   │       ├── moderation.ts    # reviewReport, resolveDispute
│   │       └── metrics.ts       # getOperationalMetrics
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui (auto-gerado, não editar manualmente)
│   │   ├── shared/
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── RatingStars.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── features/
│   │   │   ├── map/
│   │   │   │   ├── MapView.tsx              # 'use client' — Google Maps JS API
│   │   │   │   ├── MapView.test.tsx
│   │   │   │   ├── PricePin.tsx
│   │   │   │   └── MapFilters.tsx
│   │   │   ├── booking/
│   │   │   │   ├── AvailabilityCalendar.tsx  # 'use client'
│   │   │   │   ├── BookingConfirmation.tsx
│   │   │   │   └── CancellationPolicy.tsx
│   │   │   ├── payment/
│   │   │   │   ├── EscrowPaymentFlow.tsx    # 'use client' — Stripe Elements
│   │   │   │   ├── EscrowExplainer.tsx
│   │   │   │   └── PaymentStatus.tsx
│   │   │   ├── compliance/
│   │   │   │   ├── ComplianceChecklist.tsx  # 'use client'
│   │   │   │   ├── DocumentUploadZone.tsx   # 'use client' — upload via presigned URL
│   │   │   │   └── DocumentStatusBadge.tsx
│   │   │   ├── rating/
│   │   │   │   ├── RatingForm.tsx           # 'use client'
│   │   │   │   └── RatingList.tsx
│   │   │   └── aprovometro/
│   │   │       ├── AprovometroTag.tsx       # Server Component
│   │   │       ├── AprovometroTag.test.tsx
│   │   │       ├── AprovometroExplainer.tsx
│   │   │       └── NewInstructorBadge.tsx
│   │   ├── instructor/
│   │   │   ├── InstructorCard.tsx           # Server Component
│   │   │   ├── InstructorCard.test.tsx
│   │   │   ├── InstructorProfile.tsx
│   │   │   ├── InstructorDashboard.tsx
│   │   │   └── VehicleCard.tsx
│   │   ├── student/
│   │   │   ├── StudentDashboard.tsx
│   │   │   └── LessonHistory.tsx
│   │   └── admin/
│   │       ├── InstructorComplianceTable.tsx
│   │       ├── DocumentReviewPanel.tsx
│   │       └── OperationalMetrics.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts              # Auth.js config + callbacks
│   │   ├── db.ts                # Prisma client singleton
│   │   ├── stripe.ts            # Stripe client singleton
│   │   ├── storage.ts           # Supabase Storage signed URL generation
│   │   ├── redis.ts             # Upstash Redis client
│   │   ├── email.ts             # Resend client + helpers
│   │   ├── maps.ts              # Google Geocoding API helpers (server-side)
│   │   ├── aprovometro.ts       # Cálculo do Aprovômetro + invalidação de cache
│   │   ├── aprovometro.test.ts
│   │   ├── notifications.ts     # Enfileiramento de notificações
│   │   ├── audit.ts             # Registro de eventos de auditoria
│   │   └── utils.ts             # formatCurrency, formatDate, etc.
│   │
│   ├── lib/schemas/             # Schemas Zod (client + server)
│   │   ├── lesson.ts
│   │   ├── instructor.ts
│   │   ├── document.ts
│   │   ├── rating.ts
│   │   └── auth.ts
│   │
│   ├── middleware.ts             # Auth.js middleware + proteção de rotas por role
│   │
│   └── types/
│       ├── next-auth.d.ts       # Extensão de tipos do Auth.js (role no session)
│       └── index.ts             # Tipos compartilhados (InstructorWithAprovometro, etc.)
│
├── tests/
│   ├── __mocks__/               # Mocks globais (Prisma, Stripe, Supabase Storage)
│   └── e2e/                     # Playwright
│       ├── student-booking.spec.ts
│       ├── instructor-onboarding.spec.ts
│       ├── payment-flow.spec.ts
│       └── admin-compliance.spec.ts
│
└── emails/                      # React Email templates
    ├── LessonConfirmation.tsx
    ├── LessonReminder.tsx
    ├── PaymentReleased.tsx
    ├── DocumentApproved.tsx
    ├── DocumentRejected.tsx
    └── DocumentExpiryAlert.tsx
```

### Fronteiras Arquiteturais

**Fronteiras de API:**

```
Público (sem auth):
  GET /api/v1/instructors        → busca paginada com filtros
  GET /api/v1/instructors/:id    → perfil público

Autenticado (qualquer role):
  GET /api/v1/instructors/:id/availability

Autenticado STUDENT:
  Server Actions: bookLesson, cancelLesson, confirmLessonCompleted, submitRating

Autenticado INSTRUCTOR:
  Server Actions: updateAvailability, updateProfile, getPresignedUploadUrl, 
                  submitDocumentForReview, confirmLessonCompleted, requestPayout

Autenticado ADMIN:
  Server Actions: approveDocument, rejectDocument, suspendInstructor, resolveReport

Webhook (validação por assinatura, sem sessão):
  POST /api/webhooks/stripe
```

**Fronteiras de Dados:**

```
PostgreSQL (Prisma):
  → Todos os dados estruturados (usuários, aulas, avaliações, documentos metadados, pagamentos)
  → Dados de auditoria

Supabase Storage:
  → Arquivos binários (PDFs de documentos, fotos de perfil, CRLV)
  → Acesso apenas via signed URL com expiração (`createSignedUrl()`)
  → Bucket privado — URLs nunca expostas diretamente ao browser público
  → RLS integrado ao mesmo projeto Supabase do banco

Redis (Upstash):
  → Cache de resultados de busca geolocalizada
  → Rate limiting counters
  → Idempotency keys para webhooks Stripe

QStash (Filas):
  → Jobs de notificação (email + push)
  → Jobs de cálculo de Aprovômetro
  → Jobs de alerta de vencimento de documentos
```

**Fluxo de Dados — Busca de Instrutores:**

```
Browser → GET /buscar
  → Next.js Server Component
  → Prisma query com filtros geoespaciais (PostGIS: ST_DWithin)
  → Redis cache check (cache hit: retorna; cache miss: DB + armazena)
  → Retorna HTML com dados (SSR)
  → Client hydrata MapView com Google Maps
  → Google Maps renderiza pins de preço
  → Usuário interage (filtros) → fetch /api/v1/instructors (client-side)
```

**Fluxo de Dados — Pagamento com Escrow:**

```
Student action → Server Action: bookLesson
  → Validar disponibilidade (lock otimista no DB)
  → Criar Lesson com status PENDING + escrowStatus HELD
  → Criar Stripe PaymentIntent
  → Retornar client_secret ao browser

Browser → Stripe Elements (client-side)
  → Confirmar pagamento (Stripe processa)
  → Stripe → POST /api/webhooks/stripe (payment_intent.succeeded)
  → Webhook valida assinatura
  → Enfileira job: atualizar Lesson.status = CONFIRMED, notificar partes
  → Job executa: update DB, email/push para aluno e instrutor

Após aula:
  → Ambos confirmam → Server Action: confirmLessonCompleted (ambos)
  → Quando ambos confirmados: Lesson.escrowStatus = RELEASED
  → Stripe: transferir para Connected Account do instrutor
  → Enfileira job: notificar instrutor (pagamento liberado)
  → Enfileira job: calcular Aprovômetro se exam result presente
```

### Mapeamento de Requisitos para Estrutura

| Área FR (PRD) | Localização no Projeto |
|---|---|
| FR01–06 Busca e Descoberta | `app/(public)/buscar/`, `components/features/map/`, `api/v1/instructors/`, `lib/maps.ts` |
| FR07–10 Aprovômetro e Confiança | `components/features/aprovometro/`, `lib/aprovometro.ts`, `prisma/schema.prisma` (campo Lesson.examResult) |
| FR11–18 Agendamento | `app/(student)/agendar/`, `components/features/booking/`, `actions/lessons.ts`, `actions/instructors.ts` |
| FR19–26 Pagamento e Financeiro | `app/(student)/pagamento/`, `components/features/payment/`, `actions/payments.ts`, `api/webhooks/stripe/`, `lib/stripe.ts` |
| FR27–32 Onboarding Instrutor | `app/(instructor)/onboarding/`, `components/features/compliance/`, `actions/documents.ts`, `lib/storage.ts` |
| FR33–35 Perfil Instrutor | `app/(instructor)/perfil/`, `app/(instructor)/veiculo/`, `actions/instructors.ts` |
| FR36–37 Dashboard Instrutor | `app/(instructor)/dashboard/`, `app/(instructor)/agenda/`, `app/(instructor)/financeiro/` |
| FR38–39 Dashboard Aluno | `app/(student)/dashboard/`, `app/(student)/historico/` |
| FR40–43 Avaliações | `app/(student)/avaliacao/`, `components/features/rating/`, `actions/ratings.ts` |
| FR44 Notificações | `lib/notifications.ts`, `emails/`, `lib/email.ts` |
| FR45–50 Painel Admin | `app/(admin)/`, `components/admin/`, `actions/admin/` |

**Cross-Cutting Concerns:**

| Concern | Localização |
|---|---|
| Autenticação + RBAC | `lib/auth.ts`, `middleware.ts`, layouts de grupo de rota |
| Compliance Documental | `actions/documents.ts`, `lib/storage.ts`, `components/features/compliance/`, job de alerta de vencimento |
| Auditoria | `lib/audit.ts` (chamado em todas as mutations críticas) |
| Notificações Assíncronas | `lib/notifications.ts` → QStash → `api/webhooks/qstash/` |
| LGPD (minimização, deleção) | `lib/db.ts` (queries com select explícito), `actions/admin/compliance.ts` |

---

## Validação da Arquitetura

### Validação de Coerência ✅

**Compatibilidade de Decisões:**
- Next.js 15 + Prisma + Auth.js v5 + Stripe + Google Maps JS API: stack validada em produção por múltiplos projetos similares. Sem conflitos de versão conhecidos.
- Tailwind CSS v4 + shadcn/ui: compatível (shadcn/ui suporta Tailwind v4 com configuração OKLCH tokens).
- Vercel + Supabase + Upstash: stack serverless nativa, sem cold start de banco de dados (Prisma Accelerate + connection pool).

**Consistência de Padrões:**
- Server Actions com `ActionResult<T>` cobrem todas as mutations; sem mistura com fetch direto
- Zod schemas compartilhados client/server eliminam divergência de validação
- Convenções de nomenclatura consistentes entre DB (Prisma camelCase), API (kebab-case URLs, camelCase JSON), e código (PascalCase componentes, camelCase funções)

**Alinhamento Estrutural:**
- Feature-based structure alinha com as 10 áreas de capacidade do PRD
- Route groups (student/instructor/admin) isolam fronteiras de autorização no filesystem
- Separação clara: `actions/` (mutations), `api/` (webhooks + REST read), `lib/` (infraestrutura), `components/` (UI)

### Validação de Cobertura de Requisitos ✅

**Cobertura de Requisitos Funcionais:**
- FR01–06 (Busca): PostGIS + Google Maps + Redis cache ✅
- FR07–10 (Aprovômetro): campo no schema + lib de cálculo + invalidação por evento ✅
- FR11–18 (Agendamento): Server Actions + calendário client + concorrência via transaction Prisma ✅
- FR19–26 (Pagamento): Stripe Connect + escrow lógico no DB + webhooks ✅
- FR27–32 (Compliance): Supabase Storage signed upload + máquina de estado de documentos + job de alerta ✅
- FR33–50 (Perfil, Dashboard, Avaliações, Notificações, Admin): estrutura de rotas + actions + components ✅

**Cobertura de Requisitos Não-Funcionais:**
- Performance < 2s: SSR + cache Redis + Vercel Edge ✅
- WCAG 2.1 AA: shadcn/ui acessível + Playwright testes com axe ✅
- Segurança LGPD/PCI: Supabase Storage signed URLs + Stripe tokenização + TLS + RBAC ✅
- Disponibilidade ≥ 99,5%: Vercel SLA 99,99% + Supabase SLA 99,9% ✅
- Escalabilidade 10x: stateless Next.js + read replicas + Redis cache ✅

### Validação de Prontidão para Implementação ✅

**Completude de Decisões:**
- Todas as decisões críticas documentadas com versões verificadas ✅
- Stack tecnológica completamente especificada ✅
- Integrações (Stripe, Google Maps, Resend, Supabase Storage, Upstash) documentadas com SDKs ✅

**Completude da Estrutura:**
- Árvore de diretórios completa e específica (nenhum placeholder genérico) ✅
- Todos os arquivos mapeados para requisitos específicos ✅
- Fronteiras de integração e comunicação entre componentes definidas ✅

**Completude de Padrões:**
- Nomenclatura: DB, API, código, rotas ✅
- Formatos: datas, valores monetários, respostas de API, erros ✅
- Processos: error handling, loading state, validação, auditoria ✅

### Análise de Gaps

**Gaps Críticos:** Nenhum identificado.

**Gaps Importantes (endereçar nas primeiras histórias):**

1. **Schema Prisma completo** — documento define as entidades principais; schema detalhado com todos os campos, relações, índices e constraints deve ser a primeira entrega técnica (História de Setup)
2. **Política de cancelamento codificada** — regra de negócio (% de reembolso por antecedência) deve ser configurável por variável de ambiente antes do go-live
3. **Estratégia de PostGIS** — verificar se Supabase habilita extensão PostGIS por padrão; alternativa: geocoding para lat/lng no cadastro + `ST_DWithin` manual
4. **Web Push no Safari** — Safari 16.4+ suporta Web Push API; testar compatibilidade antes de implementar

**Nice-to-Have (Fase 2):**

- Health check endpoint (`/api/health`) para monitoramento externo
- Storybook para componentes de design system
- Análise de bundle size automatizada no CI

### Checklist de Completude da Arquitetura

**Análise de Requisitos**

- [x] Contexto do projeto analisado profundamente
- [x] Escala e complexidade avaliadas
- [x] Restrições técnicas identificadas
- [x] Cross-cutting concerns mapeados

**Decisões Arquiteturais**

- [x] Decisões críticas documentadas com versões
- [x] Stack tecnológica completamente especificada
- [x] Padrões de integração definidos
- [x] Considerações de performance endereçadas

**Padrões de Implementação**

- [x] Convenções de nomenclatura estabelecidas
- [x] Padrões de estrutura definidos
- [x] Padrões de comunicação especificados
- [x] Padrões de processo documentados

**Estrutura do Projeto**

- [x] Estrutura de diretórios completa definida
- [x] Fronteiras de componentes estabelecidas
- [x] Pontos de integração mapeados
- [x] Mapeamento de requisitos para estrutura completo

### Avaliação de Prontidão da Arquitetura

**Status Geral:** PRONTO PARA IMPLEMENTAÇÃO

**Nível de Confiança:** Alto

**Pontos Fortes:**
- Stack moderna, madura e com excelente suporte (Next.js 15 + Prisma + Stripe + Vercel)
- Feature-based structure mapeia diretamente para os 10 domínios de capacidade do PRD
- Decisão de Stripe Connect desde o MVP elimina retrabalho crítico de gateway
- Padrões de nomenclatura e formato eliminam inconsistências entre agentes de implementação
- Separação Server/Client Components alinhada com requisitos de performance e acessibilidade

**Áreas para Melhoria Futura:**
- PostGIS vs. geocoding simples: validar capacidade do Supabase tier selecionado antes de implementar queries espaciais
- App nativo (Fase 3): React Native com Expo reutilizará Server Actions via tRPC ou REST — arquitetura atual suporta essa evolução sem reescrita

### Handoff para Implementação

**Diretrizes para Agentes IA:**

- Seguir TODAS as decisões arquiteturais exatamente como documentadas neste arquivo
- Usar os padrões de implementação consistentemente em TODOS os componentes
- Respeitar a estrutura de projeto e fronteiras documentadas
- Consultar este documento para TODAS as questões arquiteturais — não inventar padrões novos

**Primeira Prioridade de Implementação:**

```bash
# 1. Inicializar o projeto
npx create-next-app@latest via-livre --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Instalar dependências core
cd via-livre
npx shadcn@latest init
npm install prisma @prisma/client next-auth@beta stripe @vis.gl/react-google-maps resend @upstash/redis zod @tanstack/react-query date-fns react-hook-form @hookform/resolvers

# 3. Configurar Prisma
npx prisma init

# 4. Criar schema.prisma completo (primeira entrega técnica)
# 5. Configurar Auth.js com Prisma adapter e roles
# 6. Configurar variáveis de ambiente
# 7. Primeira migration: npx prisma migrate dev --name init
```

---

*Este documento de arquitetura é a fonte única de verdade para todas as decisões técnicas do ViaLivre. Todo design, desenvolvimento e implementação deve ser rastreável às decisões aqui documentadas.*
