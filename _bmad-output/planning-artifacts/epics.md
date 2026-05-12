---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# ViaLivre — Epic Breakdown

## Visão Geral

Este documento decompõe todos os requisitos do PRD, Arquitetura e UX Design em épicos e histórias implementáveis. Cada épico entrega valor de usuário completo e pode ser implementado de forma incremental. Cobertura total: 50 FRs, NFRs aplicáveis e requisitos arquiteturais.

---

## Inventário de Requisitos

### Requisitos Funcionais

FR01: Aluno pode buscar instrutores por geolocalização (raio configurável de 2–50km)
FR02: Aluno pode visualizar instrutores em mapa interativo com pins de preço e em lista sincronizada
FR03: Aluno pode filtrar instrutores por: categoria CNH, faixa de preço, Aprovômetro máximo, disponibilidade, avaliação mínima
FR04: Aluno pode ordenar resultados por: relevância, menor Aprovômetro, menor preço, melhor avaliação
FR05: Aluno pode ver card resumido do instrutor no mapa/lista com foto, Aprovômetro, preço, avaliação, veículo
FR06: Aluno pode acessar perfil completo do instrutor com bio, Aprovômetro detalhado, galeria, veículo, avaliações, disponibilidade
FR07: Sistema calcula Aprovômetro do instrutor automaticamente após ≥ 5 alunos distintos com resultado registrado
FR08: Instrutor sem Aprovômetro suficiente recebe badge "Novo Instrutor" exibido de forma clara
FR09: Aluno pode ver histórico de avaliações recebidas pelo instrutor com comentários e data
FR10: Plataforma exibe badge de verificado para instrutores com documentação completa e vigente
FR11: Instrutor pode configurar disponibilidade semanal recorrente por blocos de horário
FR12: Instrutor pode bloquear horários pontuais
FR13: Aluno pode selecionar data, horário e local de encontro para agendar aula
FR14: Instrutor recebe notificação de pedido de agendamento e pode aceitar ou recusar em até 2 horas
FR15: Aluno e instrutor recebem confirmação de agendamento por push e email após aceite
FR16: Plataforma envia lembretes automáticos 24h e 1h antes da aula
FR17: Aluno pode cancelar agendamento com aplicação automática da política de cancelamento
FR18: Instrutor pode cancelar agendamento com motivo
FR19: Aluno pode pagar aula por cartão de crédito ou PIX antes da realização, com valor retido em escrow
FR20: Plataforma exibe explicitamente o mecanismo de escrow antes da confirmação de pagamento
FR21: Após confirmação bidirecional de realização, escrow é liberado para o instrutor
FR22: Em caso de cancelamento pelo instrutor, aluno recebe reembolso integral automático
FR23: Em caso de cancelamento pelo aluno abaixo do prazo, reembolso parcial é aplicado
FR24: Instrutor pode solicitar saque do saldo disponível em D+2 via PIX ou TED
FR25: Instrutor acessa extrato detalhado de aulas pagas, pendentes, canceladas e saques
FR26: Plataforma cobra mensalidade recorrente do instrutor (plano SaaS)
FR27: Instrutor pode iniciar cadastro e ver checklist de documentação com status de cada item
FR28: Instrutor pode fazer upload de documentos diretamente na plataforma
FR29: Equipe pode revisar documentos e aprovar, rejeitar com motivo ou solicitar reenvio
FR30: Instrutor é notificado sobre status de cada documento com prazo
FR31: Plataforma alerta instrutor 90, 60 e 30 dias antes do vencimento de documentos
FR32: Perfil de instrutor é pausado automaticamente se documentação obrigatória expirar
FR33: Instrutor pode configurar preço por aula, áreas de atuação, bio, foto e vídeo
FR34: Instrutor pode cadastrar veículos com placa, modelo, ano, foto e CRLV
FR35: Instrutor pode definir área geográfica de atuação (raio ou lista de bairros)
FR36: Instrutor acessa dashboard com próximas aulas, receita do mês, histórico e Aprovômetro atual
FR37: Instrutor vê agenda visual semanal/mensal com aulas confirmadas, pendentes e bloqueios
FR38: Aluno acessa histórico de aulas realizadas, próximas aulas e avaliações dadas e recebidas
FR39: Aluno pode ver status do seu progresso de habilitação
FR40: Após confirmação de realização, aluno pode avaliar instrutor com nota e comentário
FR41: Após confirmação de realização, instrutor pode avaliar aluno com nota e comentário
FR42: Aluno e instrutor podem reportar resultado do exame prático para atualização do Aprovômetro
FR43: Avaliações publicadas não podem ser editadas ou removidas pelo avaliado
FR44: Plataforma envia notificações push e email nos eventos: agendamento, aceite, cancelamento, lembretes, confirmação, pagamento liberado, documento vencendo
FR45: Equipe ViaLivre pode ver lista de instrutores com status de compliance, filtrar por estado e status
FR46: Equipe ViaLivre pode revisar e aprovar/rejeitar documentos de onboarding
FR47: Equipe ViaLivre pode suspender ou reativar perfil de instrutor com motivo
FR48: Equipe ViaLivre pode receber e gerenciar denúncias com histórico de ações
FR49: Equipe ViaLivre pode ver métricas operacionais: aulas, instrutores ativos, GMV, NPS
FR50: Equipe ViaLivre pode editar checklist de documentação por estado

### Requisitos Não-Funcionais

NFR-PERF-01: Páginas de busca carregam e renderizam resultados em < 2s em conexão 4G (P95)
NFR-PERF-02: Confirmação de pagamento processada em < 5s
NFR-PERF-03: API de disponibilidade responde em < 500ms
NFR-PERF-04: Google Maps renderiza pins para até 200 instrutores sem degradação
NFR-PERF-05: First Contentful Paint < 1,5s em conexão 4G
NFR-SEC-01: Todos os dados em trânsito criptografados via TLS 1.3
NFR-SEC-02: Documentos de compliance armazenados com criptografia em repouso (AES-256)
NFR-SEC-03: Dados de pagamento nunca armazenados localmente — tokenização via Stripe PCI-DSS nível 1
NFR-SEC-04: Autenticação com tokens de sessão com expiração (máx 30 dias)
NFR-SEC-05: Rate limiting em endpoints de autenticação, busca e pagamento
NFR-SEC-06: OWASP Top 10 contemplado (SQL injection, XSS, CSRF, broken access control)
NFR-SCALE-01: Arquitetura suporta crescimento de 10x de usuários simultâneos
NFR-SCALE-02: Caching de resultados de busca geolocalizada com invalidação por evento
NFR-ACCESS-01: Conformidade WCAG 2.1 nível AA em todas as páginas voltadas ao usuário
NFR-ACCESS-02: Navegação por teclado completa, contraste mínimo 4,5:1, textos alternativos
NFR-ACCESS-03: Fontes mínimas 16px no corpo; suporte a zoom até 200%
NFR-REL-01: Disponibilidade ≥ 99,5% medida mensalmente
NFR-REL-02: Retry automático para falhas de pagamento transitórias (máx 3 tentativas)
NFR-REL-03: Backups automáticos diários com retenção mínima de 30 dias
NFR-INT-01: Gateway de pagamento com split marketplace, escrow lógico, PIX, cartão e recorrência
NFR-INT-02: Google Maps JS API para mapa interativo com pins de preço
NFR-INT-03: Email transacional com Resend para notificações
NFR-INT-04: Web Push API para notificações no browser
NFR-INT-05: Upload seguro de documentos em Supabase Storage com URLs assinadas

### Requisitos Adicionais de Arquitetura

- ARCH-01: Inicializar projeto com `create-next-app@latest` + shadcn/ui + Prisma + Auth.js v5 (primeira entrega técnica)
- ARCH-02: Schema Prisma completo com entidades User, InstructorProfile, Document, Lesson, Rating, Vehicle, Availability
- ARCH-03: Configurar Stripe Connect para pagamentos marketplace com suporte a split desde o MVP
- ARCH-04: Configurar Supabase Storage com signed URLs para upload seguro de documentos
- ARCH-05: Configurar Redis (Upstash) para caching de busca e rate limiting
- ARCH-06: Configurar QStash para filas de jobs assíncronos (notificações, Aprovômetro, alertas)
- ARCH-07: Middleware Next.js para proteção de rotas por role (STUDENT / INSTRUCTOR / ADMIN)
- ARCH-08: Padrão `ActionResult<T>` em todas as Server Actions
- ARCH-09: Schemas Zod compartilhados client/server para validação isomórfica
- ARCH-10: CI/CD com GitHub Actions + deploy automático na Vercel

### Requisitos de UX Design

UX-DR01: Implementar tokens de design OKLCH — verde primário `oklch(55% 0.17 145)` exclusivamente em CTAs, tag Aprovômetro e badge verificado
UX-DR02: Integrar Google Fonts: Instrument Serif (headlines itálico) + Plus Jakarta Sans (UI/corpo) + JetBrains Mono (valores numéricos)
UX-DR03: Implementar componente `AprovometroTag` com background verde, número JetBrains Mono e contagem de amostras
UX-DR04: Implementar componente `InstructorCard` com Airbnb-style: foto, nome, Aprovômetro (ou badge Novo), preço, avaliação, veículo
UX-DR05: Implementar `MapView` com Google Maps JS API (`@vis.gl/react-google-maps`), pins de preço estilo Airbnb, sincronização bidirecional com lista
UX-DR06: Implementar `AvailabilityCalendar` — seletor visual de data/hora com slots disponíveis
UX-DR07: Implementar `EscrowPaymentFlow` com Stripe Elements + explicação do escrow antes do botão de pagamento
UX-DR08: Implementar `ComplianceChecklist` com progresso visual por documento e status colorido
UX-DR09: Implementar `DocumentUploadZone` com upload direto para Supabase Storage via signed URL e feedback de progresso
UX-DR10: Layout mapa+lista sincronizados com toggle mobile (mapa vs lista) e split-view no desktop
UX-DR11: Fundo branco puro em todas as telas; sem fundos escuros ou coloridos
UX-DR12: Grid de 8px base; 4 colunas mobile / 12 colunas desktop (breakpoint 768px)
UX-DR13: Conformidade WCAG 2.1 AA: testes com axe-core em fluxos críticos (busca, agendamento, pagamento)

---

## Mapa de Cobertura de FRs

FR01: Epic 4 — Busca geolocalizada com raio configurável
FR02: Epic 4 — Mapa interativo + lista sincronizada com Google Maps
FR03: Epic 4 — Filtros de busca (categoria, preço, Aprovômetro, disponibilidade, avaliação)
FR04: Epic 4 — Ordenação de resultados
FR05: Epic 4 — Card do instrutor com Aprovômetro no mapa e lista
FR06: Epic 4 — Perfil público completo do instrutor
FR07: Epic 7 — Cálculo automático do Aprovômetro após ≥ 5 alunos
FR08: Epic 4 — Badge "Novo Instrutor" quando sem histórico suficiente
FR09: Epic 4 — Histórico de avaliações no perfil do instrutor
FR10: Epic 3 — Badge de verificado para documentação completa
FR11: Epic 5 — Configuração de disponibilidade semanal recorrente
FR12: Epic 5 — Bloqueio de horários pontuais
FR13: Epic 5 — Seleção de data/hora e local pelo aluno
FR14: Epic 5 — Aceite/recusa de agendamento pelo instrutor
FR15: Epic 5 — Confirmação de agendamento por notificação
FR16: Epic 9 — Lembretes automáticos 24h e 1h antes
FR17: Epic 5 — Cancelamento pelo aluno com política automática
FR18: Epic 5 — Cancelamento pelo instrutor com motivo
FR19: Epic 6 — Pagamento com escrow (cartão + PIX)
FR20: Epic 6 — Explicação do escrow antes do pagamento
FR21: Epic 6 — Liberação do escrow após confirmação bidirecional
FR22: Epic 6 — Reembolso integral automático em cancelamento pelo instrutor
FR23: Epic 6 — Reembolso parcial em cancelamento pelo aluno fora do prazo
FR24: Epic 6 — Saque do saldo pelo instrutor em D+2
FR25: Epic 6 — Extrato financeiro detalhado do instrutor
FR26: Epic 6 — Cobrança de mensalidade recorrente (SaaS)
FR27: Epic 3 — Checklist de documentação com status por item
FR28: Epic 3 — Upload de documentos na plataforma
FR29: Epic 10 — Revisão e aprovação de documentos pela equipe
FR30: Epic 3 — Notificação de status de documentos ao instrutor
FR31: Epic 3 — Alertas de vencimento 90/60/30 dias
FR32: Epic 3 — Pausa automática do perfil por documentação expirada
FR33: Epic 3 — Configuração de perfil (bio, foto, preço, áreas)
FR34: Epic 3 — Cadastro de veículos com documentação
FR35: Epic 3 — Definição de área geográfica de atuação
FR36: Epic 8 — Dashboard do instrutor (aulas, receita, Aprovômetro)
FR37: Epic 8 — Agenda visual do instrutor
FR38: Epic 8 — Dashboard do aluno (histórico, próximas aulas)
FR39: Epic 8 — Progresso de habilitação do aluno
FR40: Epic 7 — Avaliação do instrutor pelo aluno pós-aula
FR41: Epic 7 — Avaliação do aluno pelo instrutor pós-aula
FR42: Epic 7 — Registro de resultado de exame
FR43: Epic 7 — Imutabilidade de avaliações (sem edição pelo avaliado)
FR44: Epic 9 — Notificações push + email para todos os eventos
FR45: Epic 10 — Lista de instrutores com status de compliance
FR46: Epic 10 — Revisão de documentos pelo admin
FR47: Epic 10 — Suspensão/reativação de perfil de instrutor
FR48: Epic 10 — Gestão de denúncias
FR49: Epic 10 — Métricas operacionais
FR50: Epic 10 — Edição de checklist de documentação por estado

---

## Lista de Épicos

### Epic 1: Fundação Técnica e Infraestrutura
Equipe de engenharia configura o projeto, banco de dados, autenticação, storage e integrações de terceiros, criando a base sobre a qual todos os fluxos de usuário serão construídos.
**Cobertura:** ARCH-01 a ARCH-10, NFR-SEC-01 a NFR-SEC-06

### Epic 2: Autenticação e Cadastro de Usuários
Alunos e instrutores podem se cadastrar, autenticar, recuperar senha e ter perfis básicos criados — habilitando o acesso diferenciado a todas as funcionalidades por role.
**Cobertura:** Base implícita para todos os FRs que exigem identidade de usuário

### Epic 3: Onboarding e Perfil do Instrutor
Instrutor conclui o processo completo de compliance documental, configura seu perfil público, cadastra veículos e define área de atuação — tornando-se elegível para aparecer nas buscas.
**Cobertura:** FR10, FR27–35, UX-DR08, UX-DR09

### Epic 4: Descoberta de Instrutores
Aluno encontra, compara e avalia instrutores disponíveis na sua região através de mapa interativo e lista sincronizada com filtros, Aprovômetro e perfis completos.
**Cobertura:** FR01–09, UX-DR03, UX-DR04, UX-DR05, UX-DR10

### Epic 5: Agendamento de Aulas
Instrutor configura disponibilidade; aluno agenda aula com data, horário e local; instrutor confirma; ambos podem cancelar com políticas automáticas aplicadas.
**Cobertura:** FR11–18, UX-DR06

### Epic 6: Pagamento com Escrow e Gestão Financeira
Aluno paga com proteção de escrow; valor é liberado após confirmação de realização; instrutor saca receita; mensalidade SaaS é cobrada recorrentemente.
**Cobertura:** FR19–26, UX-DR07

### Epic 7: Avaliações e Aprovômetro
Aluno e instrutor se avaliam após cada aula; resultado de exame é registrado; Aprovômetro é calculado automaticamente e exibido no perfil do instrutor.
**Cobertura:** FR07, FR40–43

### Epic 8: Dashboards de Aluno e Instrutor
Aluno acompanha seu histórico e progresso; instrutor gerencia agenda e visualiza desempenho financeiro e reputação em dashboard unificado.
**Cobertura:** FR36–39

### Epic 9: Sistema de Notificações
Plataforma envia notificações push (web) e email transacional para todos os eventos críticos da jornada: agendamento, confirmação, lembretes, cancelamento, pagamento e vencimento de documentos.
**Cobertura:** FR44, NFR-INT-03, NFR-INT-04

### Epic 10: Painel de Administração
Equipe ViaLivre gerencia compliance de instrutores, revisa documentos, modera denúncias, suspende perfis e acompanha métricas operacionais.
**Cobertura:** FR29, FR45–50

---

## Epic 1: Fundação Técnica e Infraestrutura

A equipe de engenharia configura o projeto do zero — framework, banco de dados, autenticação, storage, pagamentos e CI/CD — criando a base técnica necessária para que todas as funcionalidades de usuário possam ser construídas de forma consistente.

### Story 1.1: Inicializar Projeto Next.js com Stack Completa

Como desenvolvedor,
quero inicializar o repositório ViaLivre com Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui e todas as dependências core,
para que todos os agentes de implementação trabalhem em uma base padronizada e consistente.

**Acceptance Criteria:**

**Given** um repositório vazio no GitHub
**When** o desenvolvedor executa o comando de inicialização documentado na arquitetura
**Then** o projeto é criado com Next.js 15 App Router, TypeScript, Tailwind CSS v4, ESLint configurado
**And** shadcn/ui está instalado e configurado com tema ViaLivre (tokens OKLCH: verde `oklch(55% 0.17 145)` como primary, fundo branco puro)
**And** as fontes Google Fonts estão configuradas via `next/font`: Instrument Serif, Plus Jakarta Sans, JetBrains Mono
**And** as dependências core estão instaladas: Prisma, Auth.js v5, Stripe, Google Maps (`@vis.gl/react-google-maps`), Resend, Upstash Redis, Zod, TanStack Query, date-fns, React Hook Form
**And** `.env.example` contém todas as variáveis de ambiente necessárias documentadas
**And** `npm run dev` executa sem erros e a página inicial exibe template básico
**And** `npm run build` completa sem erros de TypeScript

---

### Story 1.2: Configurar Banco de Dados com Schema Prisma Completo

Como desenvolvedor,
quero configurar PostgreSQL com Prisma e o schema completo do domínio ViaLivre,
para que todas as entidades necessárias estejam disponíveis para as histórias subsequentes.

**Acceptance Criteria:**

**Given** o projeto inicializado da Story 1.1
**When** o desenvolvedor executa `prisma migrate dev --name init`
**Then** o banco de dados PostgreSQL é configurado com todas as entidades: User, InstructorProfile, StudentProfile, Document, Vehicle, Lesson, Rating, Availability, AuditLog
**And** todos os campos, tipos, relações e índices estão definidos conforme a arquitetura
**And** enums estão criados: UserRole (STUDENT, INSTRUCTOR, ADMIN), LessonStatus, DocumentStatus, DocumentType, EscrowStatus, ExamResult
**And** o Prisma Client é gerado sem erros de tipo
**And** `prisma studio` exibe todas as tabelas corretamente
**And** uma seed básica popula um usuário admin para testes locais

---

### Story 1.3: Configurar Auth.js com RBAC por Roles

Como desenvolvedor,
quero configurar Auth.js v5 com suporte a roles (STUDENT, INSTRUCTOR, ADMIN) e proteção de rotas por middleware,
para que toda a lógica de autenticação e autorização esteja centralizada e consistente.

**Acceptance Criteria:**

**Given** o projeto com Prisma configurado
**When** o middleware Next.js processa uma requisição para `/student/*`, `/instructor/*` ou `/admin/*`
**Then** requisições não autenticadas são redirecionadas para `/entrar`
**And** usuário STUDENT não pode acessar rotas `/instructor/*` ou `/admin/*` (recebe 403)
**And** usuário INSTRUCTOR com status diferente de ACTIVE é redirecionado para `/instructor/onboarding`
**And** sessão contém: `id`, `email`, `role`, `name` — acessível via `auth()` em Server Components e Server Actions
**And** o tipo `Session` está estendido para incluir `role: UserRole` em `next-auth.d.ts`
**And** logout encerra a sessão e redireciona para `/`

---

### Story 1.4: Configurar Storage de Documentos (Supabase Storage)

Como desenvolvedor,
quero configurar o Supabase Storage com geração de signed URLs para upload seguro de documentos,
para que instrutores possam fazer upload de documentos de compliance sem expor credenciais.

**Acceptance Criteria:**

**Given** `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` configuradas nas variáveis de ambiente
**When** a Server Action `getSignedUploadUrl` é chamada com `documentType` e `instructorId`
**Then** uma signed URL é retornada com expiração de 15 minutos (`supabase.storage.createSignedUploadUrl()`)
**And** a URL é específica para o bucket e path corretos (`documents/{instructorId}/{documentType}/{timestamp}.{ext}`)
**And** upload de arquivo para a signed URL via PUT request browser funciona corretamente
**And** após upload bem-sucedido, o metadata (tipo, storageKey, status SUBMITTED) é salvo no banco via Server Action
**And** URLs de leitura de documentos são sempre signed com expiração (`createSignedUrl()`, acesso admin) — nunca públicas

---

### Story 1.5: Configurar Stripe Connect para Pagamentos Marketplace

Como desenvolvedor,
quero configurar o Stripe Connect com suporte a PaymentIntents, Connected Accounts e webhooks,
para que o sistema de escrow e split de pagamentos esteja disponível para as histórias de pagamento.

**Acceptance Criteria:**

**Given** chaves Stripe configuradas nas variáveis de ambiente (secret key, publishable key, webhook secret)
**When** o webhook handler em `/api/webhooks/stripe` recebe um evento
**Then** a assinatura Stripe é validada com `STRIPE_WEBHOOK_SECRET` antes de processar
**And** eventos `payment_intent.succeeded` e `payment_intent.payment_failed` são tratados e logados
**And** a função `createStripeConnectedAccount` cria uma conta Stripe Connect para novo instrutor
**And** `createPaymentIntent` cria um PaymentIntent com valor em centavos e metadata `lessonId`, `studentId`, `instructorId`
**And** `transferToInstructor` executa transferência para Connected Account após escrow liberado
**And** todos os erros Stripe são capturados, logados no Sentry e retornam `ActionResult` de erro sem expor detalhes

---

### Story 1.6: Configurar Filas de Jobs e Redis

Como desenvolvedor,
quero configurar Upstash Redis e QStash para caching e processamento assíncrono de jobs,
para que notificações, cálculo de Aprovômetro e alertas possam ser executados fora do ciclo de request/response.

**Acceptance Criteria:**

**Given** credenciais Upstash Redis e QStash configuradas
**When** `enqueueNotificationJob` é chamado com um `NotificationJob`
**Then** o job é enfileirado no QStash com a URL do handler e `idempotencyKey`
**And** o handler em `/api/webhooks/qstash` valida a assinatura QStash antes de processar
**And** `setCache` e `getCache` no Redis funcionam com TTL configurável
**And** `invalidateInstructorSearchCache` invalida as entradas de cache de busca para a região do instrutor
**And** o Redis está configurado com rate limiting: máx 5 tentativas de login por IP em 15 minutos

---

### Story 1.7: Configurar CI/CD e Deploy na Vercel

Como desenvolvedor,
quero configurar GitHub Actions e deploy automático na Vercel com preview deploys por PR,
para que toda alteração passe por validação automática antes de ir para produção.

**Acceptance Criteria:**

**Given** o repositório conectado ao Vercel e GitHub Actions configurado
**When** um Pull Request é aberto
**Then** o pipeline CI executa: `tsc --noEmit`, `eslint`, testes unitários com Vitest, `prisma migrate diff` (validação sem aplicar)
**And** um preview deploy é criado automaticamente com URL única
**And** quando o PR é mergeado em `main`, o deploy em produção é executado automaticamente
**And** o pipeline falha e bloqueia merge se qualquer check falhar
**And** variáveis de ambiente de produção estão configuradas no Vercel (não no repositório)

---

## Epic 2: Autenticação e Cadastro de Usuários

Alunos e instrutores podem criar contas, autenticar e recuperar acesso — com fluxos distintos por role e verificação de email obrigatória.

### Story 2.1: Cadastro de Aluno

Como candidato à CNH,
quero criar uma conta como aluno com meu email e senha,
para que eu possa acessar a plataforma e buscar instrutores.

**Acceptance Criteria:**

**Given** o usuário acessa `/cadastro/aluno`
**When** preenche email, senha (mín. 8 chars), nome completo e submete o formulário
**Then** uma conta User com `role: STUDENT` é criada no banco
**And** um StudentProfile vazio é criado vinculado ao User
**And** email de verificação é enviado via Resend com link de confirmação
**And** o usuário é redirecionado para página informando para verificar o email
**And** tentativa de cadastro com email já existente retorna erro claro: "Este email já está cadastrado"
**And** senha com menos de 8 caracteres retorna erro inline no campo sem submeter o form
**And** o formulário é acessível via teclado (tab order, labels, aria-describedby nos erros)

---

### Story 2.2: Cadastro de Instrutor (Início do Onboarding)

Como instrutor autônomo credenciado,
quero criar uma conta como instrutor informando dados básicos,
para que eu possa iniciar o processo de onboarding de compliance e publicar meu perfil.

**Acceptance Criteria:**

**Given** o usuário acessa `/cadastro/instrutor`
**When** preenche email, senha, nome completo, CPF e submete
**Then** uma conta User com `role: INSTRUCTOR` é criada com status `PENDING`
**And** um InstructorProfile com `status: PENDING` é criado
**And** email de boas-vindas com próximos passos do onboarding é enviado
**And** o usuário é autenticado automaticamente e redirecionado para `/instructor/onboarding`
**And** CPF é validado por dígitos verificadores antes de salvar (mas não verificado externamente no MVP)
**And** o formulário valida os campos com mensagens inline usando Zod

---

### Story 2.3: Login para Alunos e Instrutores

Como usuário cadastrado,
quero entrar na plataforma com meu email e senha,
para que eu possa acessar minha área pessoal.

**Acceptance Criteria:**

**Given** o usuário acessa `/entrar`
**When** informa email e senha corretos e submete
**Then** a sessão é criada e o usuário é redirecionado para seu dashboard: `/student/dashboard` (aluno) ou `/instructor/dashboard` (instrutor ativo) ou `/instructor/onboarding` (instrutor pendente)
**And** credenciais incorretas exibem mensagem "Email ou senha incorretos" sem indicar qual está errado
**And** após 5 tentativas falhas do mesmo IP, novas tentativas são bloqueadas por 15 minutos (rate limiting Redis)
**And** a sessão persiste por 30 dias com cookie httpOnly seguro
**And** o campo de senha tem toggle de visibilidade acessível por teclado
**And** o formulário de login funciona sem JavaScript (progressive enhancement)

---

### Story 2.4: Recuperação de Senha

Como usuário que esqueceu a senha,
quero receber um link de recuperação por email,
para que eu possa criar uma nova senha e retomar o acesso.

**Acceptance Criteria:**

**Given** o usuário acessa `/entrar` e clica em "Esqueci minha senha"
**When** informa o email cadastrado e submete
**Then** um email com link de recuperação (token único, expiração 1h) é enviado via Resend
**And** a tela exibe "Se o email existir, você receberá as instruções" (sem confirmar existência do email)
**And** ao clicar no link, o usuário acessa tela de nova senha com campos de senha e confirmação
**And** após confirmar a nova senha, o token é invalidado e o usuário é redirecionado para `/entrar`
**And** tentativa de usar o link expirado retorna erro claro com link para solicitar novo

---

## Epic 3: Onboarding e Perfil do Instrutor

Instrutor autônomo completa o processo regulatório de credenciamento na plataforma, configura seu perfil público com fotos, preço e área de atuação, cadastra seus veículos e torna-se elegível para aparecer nas buscas de alunos.

### Story 3.1: Checklist de Compliance Documental

Como instrutor em onboarding,
quero ver uma lista clara de todos os documentos necessários com status de cada um,
para que eu saiba exatamente o que preciso enviar para ativar meu perfil.

**Acceptance Criteria:**

**Given** o instrutor acessa `/instructor/onboarding`
**When** a página carrega
**Then** o componente `ComplianceChecklist` exibe os 5 itens obrigatórios: CNH com EAR, Credenciamento SENATRAN, Certidão Negativa Criminal, Certidão de Débitos Públicos, CRLV com vistoria DETRAN
**And** cada item mostra seu status com cor e ícone: Pendente (cinza), Enviado (amarelo), Em Revisão (azul), Aprovado (verde), Rejeitado (vermelho)
**And** o progresso geral é exibido como barra de progresso (ex: "3 de 5 documentos aprovados")
**And** um link de ajuda ao lado de cada item explica o que é o documento e onde obtê-lo
**And** o perfil do instrutor exibe badge verde "Verificado" quando todos os 5 estão aprovados (FR10)
**And** a tela é totalmente acessível por teclado com foco gerenciado corretamente

---

### Story 3.2: Upload de Documentos de Compliance

Como instrutor em onboarding,
quero fazer upload dos meus documentos diretamente na plataforma,
para que a equipe ViaLivre possa revisar e aprovar meu credenciamento.

**Acceptance Criteria:**

**Given** o instrutor visualiza o checklist de compliance
**When** clica em "Enviar" em qualquer item pendente ou rejeitado
**Then** o componente `DocumentUploadZone` é exibido com suporte a drag-and-drop e seleção de arquivo
**And** apenas arquivos PDF e imagens (JPG, PNG) com tamanho máximo de 10MB são aceitos
**And** o arquivo é enviado diretamente para Supabase Storage via signed URL (instrutor → Storage, não via servidor)
**And** barra de progresso visual indica o andamento do upload
**And** após upload bem-sucedido, o status do documento muda para "Enviado" e o metadata é salvo no banco
**And** o instrutor recebe notificação por email confirmando o recebimento do documento
**And** se o upload falhar, uma mensagem de erro clara é exibida com opção de tentar novamente

---

### Story 3.3: Configuração de Perfil Público do Instrutor

Como instrutor com documentos enviados,
quero configurar meu perfil público com informações pessoais, preço e área de atuação,
para que alunos tenham informações completas ao me encontrar na busca.

**Acceptance Criteria:**

**Given** o instrutor acessa `/instructor/perfil`
**When** preenche e salva: bio (máx. 500 chars), foto de perfil, preço por aula (R$ 50–500), áreas/bairros de atuação e raio de atendimento (2–50km)
**Then** todas as informações são salvas no InstructorProfile via Server Action com `ActionResult<T>`
**And** a foto é enviada para Supabase Storage e a signed URL é gerada para exibição
**And** preview em tempo real do card de instrutor é exibido enquanto o usuário edita
**And** campo de preço aceita apenas números; validação Zod no servidor rejeita valores fora do intervalo
**And** as áreas de atuação são salvas como lista de strings e como coordenadas lat/lng para busca geolocalizada
**And** bio com menos de 50 chars exibe aviso suave (não bloqueante): "Bios mais detalhadas atraem mais alunos"

---

### Story 3.4: Cadastro de Veículo

Como instrutor configurando seu perfil,
quero cadastrar o(s) veículo(s) que uso nas aulas,
para que alunos possam ver o carro disponível antes de agendar.

**Acceptance Criteria:**

**Given** o instrutor acessa `/instructor/veiculo`
**When** preenche placa, marca, modelo, ano, cor e faz upload da foto do veículo e do CRLV
**Then** um registro Vehicle é criado vinculado ao InstructorProfile
**And** a foto do veículo e o CRLV são enviados para Supabase Storage via signed URL
**And** o veículo aparece no card e perfil público do instrutor após salvar
**And** o instrutor pode cadastrar múltiplos veículos e marcar um como principal
**And** placa com formato inválido (não AAA-0A00 ou AAA-0000) é rejeitada com erro inline
**And** o upload do CRLV é opcional no perfil público mas obrigatório para conclusão do compliance (linkado ao documento CRLV do checklist)

---

### Story 3.5: Alertas de Vencimento de Documentos

Como instrutor com perfil ativo,
quero ser avisado antecipadamente quando meus documentos estão próximos do vencimento,
para que eu possa renovar a tempo e não ter meu perfil suspenso.

**Acceptance Criteria:**

**Given** um instrutor ativo com documento de compliance com `expiresAt` definido
**When** um job agendado (QStash, diário às 8h) verifica documentos com vencimento em 90, 60 e 30 dias
**Then** o instrutor recebe email de alerta com: documento específico, data de vencimento, link para renovação
**And** o alerta é enviado exatamente uma vez por threshold (90 dias, 60 dias, 30 dias) — sem duplicatas (idempotencyKey)
**And** se o documento expirar sem renovação, o InstructorProfile.status é alterado para SUSPENDED automaticamente
**And** o instrutor recebe notificação email de suspensão com instruções para regularizar
**And** todos os agendamentos futuros do instrutor suspenso são cancelados automaticamente com reembolso integral para os alunos

---

## Epic 4: Descoberta de Instrutores

Aluno encontra instrutores disponíveis na sua cidade em menos de 5 minutos — com mapa interativo, lista sincronizada, filtros, Aprovômetro e perfis completos com tudo que precisa para tomar a decisão de contratar.

### Story 4.1: API de Busca de Instrutores Geolocalizados

Como sistema,
quero uma API de busca de instrutores com filtros e geolocalização,
para que o frontend possa exibir instrutores relevantes para a localização do aluno.

**Acceptance Criteria:**

**Given** a rota `GET /api/v1/instructors` recebe parâmetros `lat`, `lng`, `radius_km` (default 10)
**When** a query é executada
**Then** retorna instrutores ativos (status ACTIVE, documentação completa) dentro do raio especificado
**And** o resultado suporta filtros: `category` (A ou B), `min_approvo` e `max_approvo` (float), `min_rating` (float), `price_min` e `price_max`
**And** o resultado suporta ordenação: `relevance` (padrão), `approvo_asc`, `price_asc`, `rating_desc`
**And** paginação com `limit` (default 20, máx 50) e `cursor` para infinite scroll
**And** resultados de busca são armazenados em cache Redis com TTL de 5 minutos, chaveados por parâmetros
**And** o cache é invalidado quando um novo instrutor na área se torna ativo
**And** resposta em `< 500ms` para área com até 200 instrutores

---

### Story 4.2: Mapa Interativo com Pins de Preço

Como aluno buscando instrutor,
quero visualizar instrutores no mapa com pins mostrando o preço,
para que eu possa entender a distribuição geográfica e de preços de forma intuitiva.

**Acceptance Criteria:**

**Given** o aluno acessa `/buscar`
**When** a página carrega
**Then** o componente `MapView` (Client Component com Google Maps JS API via `@vis.gl/react-google-maps`) exibe o mapa centrado na localização do aluno (via Geolocation API ou IP geolocation como fallback)
**And** cada instrutor é representado por um pin com o preço por aula (ex: "R$ 120") — estilo Airbnb
**And** ao clicar em um pin, um bottom sheet mobile (ou popover desktop) exibe o card resumido do instrutor
**And** o mapa sincroniza com a lista: instrutor hover na lista destaca o pin no mapa e vice-versa
**And** no mobile, toggle "Mapa / Lista" alterna entre as duas visões; no desktop, split-view lado a lado (50/50)
**And** o Google Maps é carregado apenas na rota `/buscar` via dynamic import com `ssr: false`
**And** quando Geolocation API é negada, o mapa exibe Brasil completo e solicita endereço textual

---

### Story 4.3: Lista de Instrutores com Cards

Como aluno buscando instrutor,
quero ver a lista de instrutores com cards informativos mostrando o Aprovômetro,
para que eu possa comparar rapidamente as opções antes de entrar em um perfil.

**Acceptance Criteria:**

**Given** resultados de busca disponíveis da Story 4.1
**When** o aluno visualiza a lista
**Then** cada card `InstructorCard` exibe: foto do instrutor (ou avatar placeholder), nome, tag `AprovometroTag` verde com número JetBrains Mono e contagem de amostras (ou badge "Novo Instrutor"), preço por aula, avaliação média com estrelas, veículo principal (marca e modelo)
**And** `AprovometroTag` tem background verde `oklch(55% 0.17 145)`, texto branco, fonte JetBrains Mono — apenas neste componente
**And** badge "Novo Instrutor" é exibido com fundo cinza neutro (sem verde) para instrutores com < 5 alunos
**And** cards são ordenados por relevância por padrão; re-ordenados sem reload de página ao mudar ordenação
**And** o infinite scroll carrega mais 20 instrutores ao chegar ao final da lista
**And** cards são focáveis por teclado e navegáveis com Enter (abre perfil)

---

### Story 4.4: Filtros de Busca

Como aluno buscando instrutor,
quero filtrar e refinar os resultados de busca por vários critérios,
para que eu encontre o instrutor ideal para minha situação específica.

**Acceptance Criteria:**

**Given** o aluno está na página `/buscar` com resultados exibidos
**When** o aluno interage com os filtros
**Then** filtros disponíveis na barra superior: Categoria CNH (A / B), Preço (slider de range), Aprovômetro máximo (ex: "até 6 aulas"), Disponibilidade (dias da semana), Avaliação mínima (1–5 estrelas)
**And** filtros ativos são exibidos como chips removíveis abaixo da barra
**And** aplicar filtros atualiza imediatamente os resultados no mapa e na lista sem reload de página
**And** "Limpar filtros" remove todos os filtros ativos e restaura a busca completa
**And** os filtros selecionados são mantidos na URL (query params) — recarregar a página preserva os filtros
**And** o estado dos filtros é compartilhado entre mapa e lista (alteração em um reflete no outro)

---

### Story 4.5: Perfil Público Completo do Instrutor

Como aluno interessado em um instrutor,
quero ver o perfil completo do instrutor com todas as informações necessárias para decidir contratar,
para que eu tome uma decisão informada antes de agendar.

**Acceptance Criteria:**

**Given** o aluno clica em um card de instrutor
**When** o perfil em `/instrutor/[slug]` carrega (SSR)
**Then** a página exibe: foto de perfil e galeria de fotos, nome, bio completa, `AprovometroTag` com explicação expandível ("Em média, seus alunos aprovam em X aulas — baseado em Y alunos"), avaliação média com distribuição de estrelas, veículo(s) com foto e detalhes, badges (Verificado, Novo Instrutor), disponibilidade da semana, preço por aula
**And** a seção de avaliações exibe as últimas 10 avaliações com nota, comentário, data e primeiro nome do aluno
**And** botão "Agendar aula" está fixo na parte inferior mobile (sticky CTA)
**And** a página é renderizada no servidor (SSR) para SEO e FCP < 1,5s
**And** `AprovometroExplainer` — ao clicar na tag, um tooltip/modal explica o que é o Aprovômetro e como é calculado
**And** instrutor sem avaliações exibe "Ainda sem avaliações — seja o primeiro a avaliar"

---

## Epic 5: Agendamento de Aulas

Instrutor define quando está disponível; aluno escolhe data, horário e local de encontro; instrutor confirma; ambos podem cancelar com políticas automáticas aplicadas — tudo dentro da plataforma, sem WhatsApp.

### Story 5.1: Configuração de Disponibilidade pelo Instrutor

Como instrutor,
quero configurar minha disponibilidade semanal recorrente e bloquear horários pontuais,
para que alunos só vejam e agendem nos horários em que realmente estou disponível.

**Acceptance Criteria:**

**Given** o instrutor acessa `/instructor/agenda/configurar`
**When** define disponibilidade semanal (ex: segunda-feira 8h–18h, intervalo 12h–14h)
**Then** os blocos de disponibilidade são salvos como registros Availability no banco via Server Action
**And** a grade de horários é dividida em slots de 1h (configurável pelo admin)
**And** o instrutor pode bloquear datas/horários pontuais (ex: feriado, consulta médica) marcando-os como indisponíveis
**And** blocos já com aulas confirmadas não podem ser editados sem cancelar a aula primeiro
**And** a disponibilidade é exibida no perfil público do instrutor (semana atual + próxima semana)
**And** alterações na disponibilidade não afetam aulas já confirmadas naquele horário

---

### Story 5.2: Agendamento de Aula pelo Aluno

Como aluno,
quero selecionar data, horário e local de encontro para agendar uma aula com um instrutor,
para que eu possa confirmar minha aula de forma totalmente digital.

**Acceptance Criteria:**

**Given** o aluno está no perfil do instrutor e clica em "Agendar aula"
**When** o componente `AvailabilityCalendar` carrega
**Then** o calendário exibe apenas datas com disponibilidade do instrutor (próximos 30 dias)
**And** ao selecionar uma data, os slots de horário disponíveis são exibidos (horários já reservados não aparecem)
**And** o aluno informa o local de encontro (endereço ou texto livre, máx. 200 chars)
**And** ao confirmar, uma Lesson é criada com status PENDING e o instrutor recebe notificação
**And** o sistema previne double-booking: se outro aluno confirmar o mesmo slot entre a seleção e o envio, uma mensagem de conflito é exibida e o aluno é orientado a escolher outro horário
**And** o aluno é redirecionado para `/pagamento/[lessonId]` para concluir o agendamento com pagamento

---

### Story 5.3: Confirmação de Agendamento pelo Instrutor

Como instrutor,
quero receber notificações de pedidos de agendamento e aceitar ou recusar com motivo,
para que eu tenha controle sobre minha agenda e possa recusar pedidos incompatíveis.

**Acceptance Criteria:**

**Given** um aluno criou uma Lesson com status PENDING
**When** o instrutor acessa a notificação ou o dashboard
**Then** o pedido é exibido com: foto e nome do aluno, data, horário, local de encontro, e preço
**And** o instrutor pode "Aceitar" ou "Recusar" (com campo de motivo obrigatório na recusa)
**And** ao aceitar, a Lesson muda para CONFIRMED e o aluno é notificado por push e email
**And** ao recusar, a Lesson muda para CANCELLED e o aluno recebe o motivo por notificação
**And** se o instrutor não responder em 2 horas, um job cancela automaticamente a Lesson e notifica o aluno
**And** o pagamento só é cobrado após a confirmação do instrutor (o PaymentIntent é criado na Story 5.2 mas capturado somente após confirmação)

---

### Story 5.4: Cancelamento de Aulas

Como aluno ou instrutor,
quero poder cancelar uma aula agendada com política de reembolso aplicada automaticamente,
para que cancelamentos sejam gerenciados de forma justa e transparente.

**Acceptance Criteria:**

**Given** uma Lesson com status CONFIRMED
**When** o aluno cancela com > 24h de antecedência
**Then** a Lesson muda para CANCELLED e o aluno recebe reembolso integral via Stripe automático
**When** o aluno cancela com < 24h de antecedência
**Then** o aluno recebe reembolso de 50% (configurável); o restante é liberado para o instrutor
**When** o instrutor cancela (qualquer antecedência)
**Then** o aluno recebe reembolso integral e o instrutor recebe penalidade de reputação (contador de cancelamentos incrementado)
**And** em todos os casos, ambos recebem notificação por push e email com detalhes do cancelamento
**And** a política de cancelamento é exibida na tela de confirmação do agendamento, antes do pagamento

---

## Epic 6: Pagamento com Escrow e Gestão Financeira

Aluno paga com a proteção do escrow explicada antes do botão de pagamento; valor só é liberado após ambos confirmarem a realização da aula; instrutor saca receita de forma simples; mensalidade SaaS é cobrada automaticamente.

### Story 6.1: Pagamento por Aula com Escrow

Como aluno que agendou uma aula,
quero pagar pela aula com a garantia de que meu dinheiro fica protegido até a aula acontecer,
para que eu me sinta seguro ao pagar antecipadamente.

**Acceptance Criteria:**

**Given** o aluno é redirecionado para `/pagamento/[lessonId]`
**When** a página carrega
**Then** o componente `EscrowPaymentFlow` exibe claramente: valor da aula, política de cancelamento resumida, e o bloco de escrow: "Seu pagamento fica protegido. Só liberamos para o instrutor após a aula acontecer."
**And** o Stripe Elements (formulário de cartão) é carregado de forma segura (campo hospedado pelo Stripe)
**And** opção de pagamento via PIX exibe QR code gerado pelo Stripe com expiração de 30 minutos
**And** ao confirmar o pagamento, um PaymentIntent é capturado e o escrow é registrado no banco (Lesson.escrowStatus = HELD)
**And** o aluno recebe email de confirmação de pagamento com detalhes da aula
**And** dados de cartão nunca passam pelo servidor ViaLivre (tokenização Stripe)
**And** em caso de falha no pagamento, mensagem clara é exibida sem jargão técnico: "Pagamento não processado. Verifique seus dados ou tente outro cartão."

---

### Story 6.2: Confirmação de Realização e Liberação do Escrow

Como aluno ou instrutor,
quero confirmar que a aula foi realizada,
para que o pagamento seja liberado para o instrutor de forma segura.

**Acceptance Criteria:**

**Given** uma Lesson com status CONFIRMED e `scheduledAt` no passado
**When** o sistema detecta que o horário da aula passou (job agendado + 15 min após horário)
**Then** ambos (aluno e instrutor) recebem notificação push: "A aula foi realizada? Confirme para liberar o pagamento."
**And** cada um pode confirmar ou reportar problema na aula
**And** quando AMBOS confirmam, Lesson.status = COMPLETED, EscrowStatus = RELEASED e transferência Stripe para o instrutor é executada
**And** se somente um confirmar após 48h, o sistema libera o escrow automaticamente a favor do instrutor (sem disputa)
**And** se aluno reportar problema (aula não realizada), Lesson vai para status DISPUTED e equipe admin é notificada
**And** após liberação, o instrutor recebe notificação: "R$ X,XX disponível para saque"

---

### Story 6.3: Reembolso em Cancelamentos

Como aluno que cancelou uma aula paga,
quero receber meu reembolso automaticamente conforme a política,
para que eu não precise acionar suporte para cancelamentos simples.

**Acceptance Criteria:**

**Given** uma Lesson paga com escrow HELD é cancelada
**When** o cancelamento é processado (Story 5.4)
**Then** o reembolso correto é calculado: 100% se cancelamento pelo instrutor ou pelo aluno com > 24h; 50% se pelo aluno com < 24h
**And** o refund é executado automaticamente via Stripe em até 5 dias úteis para o método de pagamento original
**And** para PIX, o reembolso é processado via Pix Devolution no prazo bancário
**And** o aluno recebe email com valor do reembolso e prazo estimado
**And** o estado da Lesson e o EscrowStatus são atualizados no banco atomicamente (transação Prisma)
**And** o log de auditoria registra o cancelamento com quem cancelou, motivo e valor reembolsado

---

### Story 6.4: Gestão Financeira do Instrutor

Como instrutor,
quero visualizar meu saldo disponível e fazer saques,
para que eu possa gerenciar minha receita de forma autônoma sem depender de suporte.

**Acceptance Criteria:**

**Given** o instrutor acessa `/instructor/financeiro`
**When** a página carrega
**Then** são exibidos: saldo disponível para saque (aulas confirmadas liberadas), receita do mês corrente, últimas 10 transações (com tipo: aula realizada, cancelamento, saque)
**And** botão "Sacar" está disponível quando saldo > R$ 0,00
**And** ao solicitar saque, o instrutor informa chave PIX ou dados bancários (salvos para futuras solicitações)
**And** o saque é processado via Stripe payout e disponibilizado em D+2 úteis
**And** o extrato exibe: data, tipo de transação, valor, status (pendente/concluído) e número da aula
**And** o saldo nunca exibe valor negativo; saque é bloqueado se o saldo disponível for insuficiente

---

### Story 6.5: Mensalidade SaaS do Instrutor

Como instrutor ativo,
quero ser cobrado automaticamente pela mensalidade da plataforma,
para que meu acesso seja mantido sem precisar pagar manualmente todo mês.

**Acceptance Criteria:**

**Given** o instrutor ativo com cartão cadastrado no Stripe
**When** o ciclo mensal é renovado
**Then** a cobrança recorrente é processada automaticamente via Stripe Subscriptions
**And** em caso de falha de pagamento, o instrutor recebe email de alerta com link para atualizar o cartão
**And** após 3 tentativas falhas (retry automático do Stripe em dias diferentes), o perfil é pausado com notificação
**And** ao regularizar o pagamento, o perfil é reativado automaticamente
**And** o histórico de faturas mensais é acessível no painel do instrutor com link para download do recibo

---

## Epic 7: Avaliações e Aprovômetro

Após cada aula, aluno e instrutor se avaliam mutuamente; o resultado do exame prático é registrado; o Aprovômetro é calculado e atualizado automaticamente — construindo o ativo de confiança central da plataforma.

### Story 7.1: Avaliação Bidirecional Pós-Aula

Como aluno ou instrutor após uma aula realizada,
quero avaliar a outra parte com nota e comentário,
para que a comunidade se beneficie de avaliações reais e verificadas.

**Acceptance Criteria:**

**Given** uma Lesson com status COMPLETED
**When** o aluno acessa `/aluno/avaliacao/[lessonId]`
**Then** o formulário de avaliação exibe: nome e foto do instrutor, seletor de estrelas (1–5) e campo de comentário (máx. 500 chars, opcional)
**And** ao submeter, um registro Rating é criado com `role: STUDENT`, `authorId: studentId`, `targetId: instructorId`
**And** o instrutor recebe notificação push de nova avaliação
**And** a avaliação é imediatamente exibida no perfil público do instrutor (sem moderação prévia)
**And** o aluno só pode avaliar uma vez por aula (tentativa de duplicata retorna erro 409)
**And** avaliações com conteúdo violando política (palavrões, informações pessoais) são detectadas por moderação assíncrona e sinalizadas para revisão admin
**And** avaliações do aluno pelo instrutor (note: nota 1–5) são salvas mas visíveis apenas para outros instrutores (não para o aluno avaliado)

---

### Story 7.2: Registro de Resultado de Exame e Cálculo do Aprovômetro

Como aluno ou instrutor após um exame prático,
quero registrar o resultado (aprovado ou reprovado),
para que o Aprovômetro do instrutor seja atualizado com dados reais.

**Acceptance Criteria:**

**Given** um aluno realizou o exame prático após série de aulas com um instrutor
**When** aluno ou instrutor reporta resultado via `/aluno/dashboard` ou `/instructor/dashboard`
**Then** o campo `Lesson.examResult` é atualizado com PASSED ou FAILED
**And** um job QStash é enfileirado para recalcular o Aprovômetro do instrutor
**And** o job calcula: média de aulas realizadas com o mesmo instrutor até o exame (agrupado por série de aulas do mesmo aluno)
**And** o Aprovômetro só é exibido quando o instrutor tem resultados de ≥ 5 alunos distintos; abaixo disso mantém badge "Novo Instrutor"
**And** ao atingir 5 alunos, o badge muda automaticamente para `AprovometroTag` verde no perfil e cards de busca
**And** o Aprovômetro exibe sempre o número de amostras: "5,8 aulas — 47 alunos" (JetBrains Mono)
**And** resultados divergentes (aluno diz aprovado, instrutor diz reprovado) são ignorados; prevalece o do aluno

---

### Story 7.3: Imutabilidade de Avaliações

Como plataforma,
quero garantir que avaliações publicadas não possam ser editadas ou removidas pelo avaliado,
para que a integridade das avaliações seja preservada e o Aprovômetro seja confiável.

**Acceptance Criteria:**

**Given** uma avaliação publicada
**When** o avaliado tenta editar ou excluir a avaliação via qualquer interface
**Then** a Server Action retorna erro 403 com mensagem "Avaliações publicadas não podem ser alteradas"
**And** apenas um usuário ADMIN pode remover uma avaliação (com motivo registrado no AuditLog)
**And** o avaliador (autor) pode editar a própria avaliação em até 24h após publicação (janela de correção)
**And** após 24h, mesmo o autor não pode editar
**And** avaliações removidas pelo admin mantêm o registro no AuditLog com o conteúdo original e motivo da remoção

---

## Epic 8: Dashboards de Aluno e Instrutor

Aluno acompanha seu progresso de habilitação; instrutor vê sua agenda, receita e reputação — tudo em dashboards claros que substituem completamente o WhatsApp e planilhas.

### Story 8.1: Dashboard do Aluno

Como aluno,
quero ver um resumo do meu progresso na habilitação e minhas próximas aulas,
para que eu possa acompanhar minha jornada de forma organizada.

**Acceptance Criteria:**

**Given** o aluno acessa `/aluno/dashboard`
**When** a página carrega (SSR)
**Then** são exibidos: próximas aulas (data, hora, instrutor, local), aulas realizadas no total, avaliação média recebida pelos instrutores (visível só para o aluno), e status de progresso ("X aulas realizadas de ~Y estimadas para aprovação")
**And** cada aula próxima tem botões de ação: "Ver detalhes" e "Cancelar"
**And** o painel de histórico em `/aluno/historico` lista todas as aulas com: data, instrutor, nota dada e nota recebida
**And** ao clicar em uma aula passada sem avaliação, um prompt "Avaliar esta aula?" é exibido
**And** o progresso estimado usa o Aprovômetro do instrutor principal do aluno como referência
**And** a página carrega em < 2s em 4G com dados reais do banco (SSR sem loading state visível)

---

### Story 8.2: Dashboard e Agenda do Instrutor

Como instrutor ativo,
quero ver minha agenda, próximas aulas, receita e meu Aprovômetro atual em um único painel,
para que eu possa gerenciar minha operação diária sem precisar de ferramenta externa.

**Acceptance Criteria:**

**Given** o instrutor acessa `/instructor/dashboard`
**When** a página carrega (SSR)
**Then** são exibidos: resumo do dia (próximas aulas com data, hora, aluno, local), receita do mês corrente, Aprovômetro atual com número de amostras, avaliação média, e alerta de documentos próximos do vencimento
**And** a agenda visual em `/instructor/agenda` exibe visão semanal com aulas confirmadas (verde), pendentes (amarelo) e bloqueios (cinza)
**And** ao clicar em uma aula na agenda, abre painel lateral com: dados do aluno, local de encontro, valor, e ações (confirmar realização, cancelar)
**And** o instrutor pode adicionar bloqueios de horário diretamente da agenda (sem ir para página de configuração)
**And** pedidos de agendamento pendentes são exibidos em destaque com contador de urgência ("Expira em X minutos")
**And** o dashboard exibe motivação baseada em dados: "Você está 0,3 aulas melhor que a média ViaLivre!"

---

## Epic 9: Sistema de Notificações

A plataforma comunica automaticamente cada evento relevante da jornada — agendamento, confirmação, lembretes, cancelamento, pagamento liberado, vencimento de documentos — por push (web) e email, sem que o usuário precise verificar manualmente o app.

### Story 9.1: Notificações por Email Transacional

Como usuário da plataforma,
quero receber emails claros e informativos para cada evento importante da minha jornada,
para que eu seja informado mesmo quando não estou com o app aberto.

**Acceptance Criteria:**

**Given** qualquer evento que dispara notificação (agendamento, confirmação, cancelamento, pagamento, vencimento)
**When** o job de notificação é processado pelo QStash handler
**Then** o email correto é enviado via Resend com o template React Email específico para o evento
**And** os seguintes templates existem e são testados: `LessonBooked`, `LessonConfirmed`, `LessonCancelled`, `LessonReminder24h`, `LessonReminder1h`, `LessonCompleted`, `PaymentReleased`, `DocumentApproved`, `DocumentRejected`, `DocumentExpiryAlert`
**And** emails são enviados com SPF/DKIM configurados (sem cair em spam)
**And** emails incluem: logo ViaLivre, call-to-action com link direto para a ação relevante, informações mínimas necessárias
**And** idempotencyKey previne o mesmo email de ser enviado duas vezes para o mesmo evento
**And** falhas de entrega são registradas e o job é retentado com exponential backoff (máx 3x)

---

### Story 9.2: Notificações Push (Web Push API)

Como usuário da plataforma com notificações ativadas,
quero receber notificações push no browser para eventos urgentes,
para que eu seja alertado instantaneamente mesmo sem ter o email aberto.

**Acceptance Criteria:**

**Given** o usuário está no dashboard pela primeira vez
**When** a página carrega
**Then** um prompt de permissão de notificações é exibido de forma não intrusiva (não modal de sistema imediato) com botão "Ativar notificações"
**And** ao aceitar, a subscription Web Push é salva no banco associada ao User
**And** os seguintes eventos disparam push: novo pedido de agendamento (instrutor), agendamento confirmado (aluno), cancelamento, lembretes (24h e 1h), confirmação de aula solicitada, pagamento liberado (instrutor)
**And** push de lembrete 1h antes inclui: nome do instrutor/aluno, hora e local da aula
**And** clique na notificação push abre a página relevante diretamente (deep link)
**And** usuários que recusaram permissão não recebem novo prompt (respeitar a escolha)
**And** compatibilidade testada: Chrome, Firefox, Safari 16.4+ (suporte a Web Push)

---

## Epic 10: Painel de Administração

A equipe ViaLivre gerencia compliance de instrutores, revisa documentos, modera denúncias, controla perfis e acompanha métricas operacionais — garantindo a integridade da plataforma.

### Story 10.1: Lista de Instrutores e Gestão de Compliance

Como membro da equipe ViaLivre,
quero ver todos os instrutores com status de compliance e poder gerenciar seus perfis,
para que eu possa garantir que apenas instrutores com documentação válida estejam ativos.

**Acceptance Criteria:**

**Given** o admin acessa `/admin/instrutores`
**When** a página carrega
**Then** uma tabela exibe: nome, email, estado (UF), data de cadastro, status do perfil (PENDING, ACTIVE, SUSPENDED), e status de compliance (X de 5 documentos aprovados)
**And** filtros disponíveis: por status do perfil, por UF, por documentos com vencimento em < 30 dias
**And** ao clicar em um instrutor, abre `/admin/instrutores/[instructorId]` com perfil completo e lista de documentos
**And** o admin pode suspender ou reativar o perfil com campo de motivo obrigatório — ação registrada no AuditLog
**And** a suspensão envia email automático ao instrutor com o motivo e instruções para recurso
**And** o painel carrega no máximo 50 instrutores por página com paginação

---

### Story 10.2: Revisão e Aprovação de Documentos

Como membro da equipe ViaLivre,
quero revisar os documentos enviados pelos instrutores e aprovar ou rejeitar com motivo,
para que o processo de credenciamento seja controlado com qualidade.

**Acceptance Criteria:**

**Given** o admin acessa `/admin/instrutores/[instructorId]/documentos`
**When** a página carrega
**Then** cada documento é listado com: tipo, data de envio, status atual e botão "Revisar"
**And** ao clicar em "Revisar", o documento é exibido em um painel lateral com visualizador inline (PDF ou imagem) — via signed URL Supabase Storage com expiração de 15min
**And** o admin pode aprovar (status → APPROVED), rejeitar (status → REJECTED, motivo obrigatório) ou solicitar reenvio (status → PENDING, instrução obrigatória)
**And** ao aprovar/rejeitar, o instrutor recebe notificação push e email automaticamente
**And** a ação é registrada no AuditLog com: adminId, documentId, ação, motivo, timestamp
**And** quando todos os 5 documentos obrigatórios são APPROVED, o InstructorProfile.status muda para ACTIVE automaticamente

---

### Story 10.3: Moderação de Denúncias

Como membro da equipe ViaLivre,
quero receber e gerenciar denúncias de alunos e instrutores,
para que problemas de comportamento sejam investigados e resolvidos de forma organizada.

**Acceptance Criteria:**

**Given** o admin acessa `/admin/denuncias`
**When** a página carrega
**Then** a lista exibe denúncias com: denunciante (aluno ou instrutor), denunciado, tipo (comportamento inadequado, avaliação falsa, não comparecimento), data, e status (nova, em análise, resolvida)
**And** ao abrir uma denúncia, o admin vê: histórico completo da aula relacionada, avaliações trocadas, histórico de denúncias anteriores do denunciado
**And** o admin pode suspender preventivamente o denunciado, arquivar a denúncia sem ação, ou remover avaliação irregular
**And** todas as ações são registradas no AuditLog com motivo
**And** o denunciante recebe notificação sobre o encerramento do caso ("Analisamos sua denúncia e tomamos as medidas necessárias")

---

### Story 10.4: Métricas Operacionais

Como membro da equipe ViaLivre,
quero ver as principais métricas operacionais da plataforma,
para que eu possa acompanhar o crescimento e identificar problemas rapidamente.

**Acceptance Criteria:**

**Given** o admin acessa `/admin/dashboard`
**When** a página carrega
**Then** são exibidos painéis com: instrutores ativos total / novos no mês, alunos cadastrados total / novos no mês, aulas realizadas no mês / total, GMV (volume de pagamentos) no mês, documentos pendentes de revisão (alerta se > 10)
**And** gráfico simples de aulas por semana (últimas 8 semanas)
**And** ranking dos 5 instrutores com melhor Aprovômetro (min. 10 amostras)
**And** NPS placeholder (campo de input manual para inserir o NPS coletado externamente no MVP)
**And** os dados são calculados em tempo real com queries otimizadas (índices no banco), sem necessidade de cache separado para o MVP

---

### Story 10.5: Configuração de Checklist por Estado

Como membro da equipe ViaLivre,
quero configurar o checklist de documentos por estado (UF),
para que instrutores de estados com requisitos diferentes sejam orientados corretamente.

**Acceptance Criteria:**

**Given** o admin acessa `/admin/configuracoes/checklist`
**When** seleciona um estado da lista
**Then** vê o checklist de documentos padrão com possibilidade de adicionar, remover ou editar itens específicos para aquela UF
**And** as alterações são salvas e refletem imediatamente no onboarding de novos instrutores daquele estado
**And** instrutores existentes não são afetados retroativamente (apenas novos cadastros do estado)
**And** o admin pode restaurar o checklist padrão nacional com um clique
**And** alterações são registradas no AuditLog com o admin responsável

---

## Validação Final de Cobertura

### Checklist de Cobertura de FRs

- [x] FR01–06: Epic 4 (Stories 4.1–4.5)
- [x] FR07: Epic 7 (Story 7.2) + Epic 4 (Story 4.3, exibição)
- [x] FR08: Epic 4 (Story 4.3, badge Novo Instrutor)
- [x] FR09: Epic 4 (Story 4.5, histórico de avaliações no perfil)
- [x] FR10: Epic 3 (Story 3.1, badge verificado)
- [x] FR11–12: Epic 5 (Story 5.1)
- [x] FR13: Epic 5 (Story 5.2)
- [x] FR14: Epic 5 (Story 5.3)
- [x] FR15: Epic 5 (Story 5.3)
- [x] FR16: Epic 9 (Story 9.1 + 9.2)
- [x] FR17–18: Epic 5 (Story 5.4)
- [x] FR19–20: Epic 6 (Story 6.1)
- [x] FR21: Epic 6 (Story 6.2)
- [x] FR22–23: Epic 6 (Story 6.3)
- [x] FR24–25: Epic 6 (Story 6.4)
- [x] FR26: Epic 6 (Story 6.5)
- [x] FR27–28: Epic 3 (Stories 3.1–3.2)
- [x] FR29: Epic 10 (Story 10.2)
- [x] FR30: Epic 3 (Story 3.2)
- [x] FR31–32: Epic 3 (Story 3.5)
- [x] FR33–35: Epic 3 (Stories 3.3–3.4)
- [x] FR36–37: Epic 8 (Story 8.2)
- [x] FR38–39: Epic 8 (Story 8.1)
- [x] FR40–43: Epic 7 (Stories 7.1–7.3)
- [x] FR44: Epic 9 (Stories 9.1–9.2)
- [x] FR45, FR47: Epic 10 (Story 10.1)
- [x] FR46: Epic 10 (Story 10.2)
- [x] FR48: Epic 10 (Story 10.3)
- [x] FR49: Epic 10 (Story 10.4)
- [x] FR50: Epic 10 (Story 10.5)

**Todos os 50 FRs cobertos. ✅**

### Checklist de Cobertura de Requisitos de Arquitetura

- [x] ARCH-01: Story 1.1 (inicialização do projeto)
- [x] ARCH-02: Story 1.2 (schema Prisma)
- [x] ARCH-03: Story 1.5 (Stripe Connect)
- [x] ARCH-04: Story 1.4 (Supabase Storage)
- [x] ARCH-05–06: Story 1.6 (Redis + QStash)
- [x] ARCH-07: Story 1.3 (Auth.js middleware)
- [x] ARCH-08–09: Implícito em todas as Server Actions (padrão `ActionResult<T>` + Zod)
- [x] ARCH-10: Story 1.7 (CI/CD)

### Checklist de Cobertura de UX Design

- [x] UX-DR01 (tokens OKLCH): Story 1.1 (configuração shadcn/ui)
- [x] UX-DR02 (Google Fonts): Story 1.1 (next/font)
- [x] UX-DR03 (AprovometroTag): Story 4.3 + Story 7.2
- [x] UX-DR04 (InstructorCard): Story 4.3
- [x] UX-DR05 (MapView + Google Maps): Story 4.2
- [x] UX-DR06 (AvailabilityCalendar): Story 5.2
- [x] UX-DR07 (EscrowPaymentFlow): Story 6.1
- [x] UX-DR08 (ComplianceChecklist): Story 3.1
- [x] UX-DR09 (DocumentUploadZone): Story 3.2
- [x] UX-DR10 (mapa+lista toggle): Story 4.2
- [x] UX-DR11 (fundo branco): Story 1.1 (tokens)
- [x] UX-DR12 (grid 8px): Story 1.1 (configuração Tailwind)
- [x] UX-DR13 (WCAG 2.1 AA): NFR-ACCESS — implícito em todas as stories de UI; testes axe nos fluxos críticos

**Todos os 13 UX-DRs cobertos. ✅**

### Status Final

**Total de Épicos:** 10
**Total de Histórias:** 37
**Cobertura de FRs:** 50/50 (100%)
**Cobertura de UX-DRs:** 13/13 (100%)
**Status:** PRONTO PARA DESENVOLVIMENTO ✅

---

*Este documento é o contrato de entrega do ViaLivre. Todo o desenvolvimento deve ser rastreável às histórias aqui definidas. Atualize conforme o produto evolui.*
