# Story 8.1a — Shell de navegação do aluno

- **ID:** story-epic-8.1a-student-shell
- **Epic:** 8 — Dashboards de Aluno e Instrutor
- **Parent Story (PRD):** Story 8.1 — Dashboard do Aluno
- **Sub-story scope:** apenas o shell de navegação (foundation). Cards agregados, progresso, histórico e perfil ficam em 8.1b–e.
- **Personas:** Sally (UX), Amelia (Dev)
- **Status:** In progress

## Contexto

Auditoria spec-vs-código (`npm run audit:bmad`) revelou que Epic 8 nunca foi implementado. O Project Lead (Willians) confrontou o time com o gap: "o painel do aluno foi simplesmente a coisa mais horrível que já vi". Story 8.1 (Dashboard do Aluno) tem 8 ACs no PRD; 0/8 estão entregues. Esta story é a **fundação** que destrava as próximas (8.1b–e).

## Acceptance Criteria

### AC1 — Route group + layout para área do aluno

- **Given** o aluno autenticado acessa qualquer rota sob `/aluno/*` ou as legadas `/aulas`, `/aulas/[id]`, `/agendar/[id]`
- **When** a página renderiza
- **Then** existe um layout compartilhado em `src/app/(student)/layout.tsx` que envolve o conteúdo
- **And** o layout exibe um `StudentSidebar` (desktop md+) ou `StudentBottomNav` (mobile)
- **And** o layout exibe um `StudentHeader` persistente com avatar + dropdown logout
- **And** rotas não-autenticadas (sem sessão) ou de role ≠ STUDENT redirecionam para `/entrar`

### AC2 — Navegação canônica

- **Given** o `StudentSidebar` renderiza
- **When** o aluno vê os links
- **Then** os destinos são: **Início** (`/aluno`), **Minhas aulas** (`/aulas`), **Histórico** (`/aluno/historico` — placeholder até 8.1d), **Perfil** (`/aluno/perfil` — placeholder até 8.1e), **Buscar instrutores** (`/instrutores`)
- **And** o link da rota atual fica visualmente destacado (background accent translúcido, ícone preenchido)
- **And** ícones (lucide-react) acompanham cada link: `LayoutDashboard`, `CalendarDays`, `History`, `User`, `Search`

### AC3 — Mobile bottom nav

- **Given** viewport < 768px
- **When** o aluno acessa qualquer rota sob `(student)`
- **Then** o sidebar fica oculto
- **And** uma bottom nav fixed exibe os 5 destinos canônicos (ícone + label curto)
- **And** o item da rota atual fica destacado
- **And** o `<main>` tem `padding-bottom` suficiente pra não cobrir conteúdo atrás da bottom nav

### AC4 — Header com identidade do aluno

- **Given** o aluno autenticado em qualquer rota `(student)`
- **When** renderiza o `StudentHeader`
- **Then** exibe avatar (foto se houver, senão inicial do nome em círculo accent)
- **And** exibe nome do aluno ao lado do avatar (md+ apenas; mobile só avatar)
- **And** ao clicar no avatar, abre dropdown com: link "Perfil" → `/aluno/perfil` + botão "Sair" que faz `signOut()`
- **And** o logo "ViaLivre" à esquerda linka para `/aluno` (Início)

### AC5 — Glassmorphism canônico

- **Given** o layout renderiza
- **When** o aluno visualiza
- **Then** a sidebar usa `glass-card` com `vl-mesh` no fundo da viewport
- **And** o header é sticky no topo com `backdrop-filter: blur(24px) saturate(180%)` e background `rgba(255,255,255,0.72)` (mesmo padrão da `/instrutores`)
- **And** o conteúdo principal mantém o padrão `vl-mesh` já estabelecido

### AC6 — Redirect de aluno autenticado

- **Given** aluno autenticado acessa `/` (landing)
- **When** a página detecta sessão STUDENT
- **Then** redireciona para `/aluno` (que renderiza Início — placeholder até 8.1b)
- **And** página `/aluno` retorna um placeholder mínimo "Em breve" (será preenchida na 8.1b)

## Files affected

### Novos
- `src/app/(student)/layout.tsx` — Route group layout com auth guard + Sidebar + Header
- `src/app/(student)/page.tsx` — Placeholder de Início (preenchida em 8.1b)
- `src/components/features/student/StudentSidebar.tsx`
- `src/components/features/student/StudentBottomNav.tsx`
- `src/components/features/student/StudentHeader.tsx`
- `src/components/features/student/StudentNavLinks.tsx` — fonte única dos 5 destinos

### Modificados
- `src/app/(student)/aulas/page.tsx` — remove styling redundante de `vl-mesh` (movido pro layout)
- `src/app/(student)/aulas/[lessonId]/page.tsx` — idem
- `src/app/(student)/agendar/[instructorId]/page.tsx` — idem
- `src/app/page.tsx` (landing) — adicionar redirect STUDENT → `/aluno`

### Placeholders criados (preenchidos em stories posteriores)
- `src/app/(student)/aluno/historico/page.tsx` — placeholder "Em breve — 8.1d"
- `src/app/(student)/aluno/perfil/page.tsx` — placeholder "Em breve — 8.1e"

## Test plan

- ✅ Build: `npm run build` zero erros
- ✅ Smoke manual: login como aluno → ver sidebar com 5 links → clicar em cada → todos resolvem (placeholder ok) → menu mobile funciona em viewport < 768px → logout pelo dropdown do header
- ⏳ E2E (futuro): Playwright cobrindo nav cross-routes

## Risks

- **R1:** mover `vl-mesh` para o layout pode quebrar páginas que já tinham seu próprio mesh. Mitigação: garantir que o layout só renderiza mesh se for student route, e remover do conteúdo individual.
- **R2:** redirect de `/` → `/aluno` para STUDENT pode atrapalhar instrutores que também são alunos (não há esse caso hoje, mas vale checar role no auth). Mitigação: redirect só dispara se `session.user.role === "STUDENT"`.

## Definition of Done

- [ ] AC1: route group + layout + auth guard
- [ ] AC2: sidebar com 5 links canônicos + destaque ativo
- [ ] AC3: bottom nav mobile
- [ ] AC4: header com avatar + dropdown signOut
- [ ] AC5: glassmorphism canônico
- [ ] AC6: redirect STUDENT → `/aluno`
- [ ] Build limpo + smoke manual passou
- [ ] CR escrito (`cr-epic-8.1a-student-shell.md`)
- [ ] Commit com slug + push
