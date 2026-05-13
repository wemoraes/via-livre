# Story: Epic 4 polish — price pins, URL filters, AprovometroTag canônico

- **ID:** story-epic-4-search-polish
- **Origem:** Epic 4 ACs explícitos (Stories 4.2, 4.3, 4.4) que estavam parcialmente implementados.
- **Epic-alvo:** Epic 4 — Descoberta de Instrutores
- **Personas:** Sally (UX), Amelia (Dev)
- **Status:** In progress

## Contexto

O Epic 4 já está ~80% implementado: `searchInstructors`, mapa com `@vis.gl/react-google-maps`, `InstructorCard`, filtros, perfil público. Três gaps quebram ACs explícitos:

1. **Mapa exibe pins sem preço** (Story 4.2 AC: "cada instrutor é representado por um pin com o preço por aula (ex: 'R$ 120') — estilo Airbnb"). Atualmente são pins genéricos sem informação.
2. **Filtros não persistem na URL** (Story 4.4 AC: "os filtros selecionados são mantidos na URL (query params) — recarregar a página preserva os filtros"). Atualmente refresh perde tudo.
3. **`AprovometroTag` não segue spec** (Story 4.3 AC: "background verde `oklch(55% 0.17 145)`, texto branco, fonte JetBrains Mono"). Atualmente usa Tailwind `bg-green-50 text-green-700` sem JetBrains Mono.

## Acceptance Criteria

### AC1 — Price pins (Story 4.2)

- **Given** o aluno está em `/instrutores` no modo mapa
- **When** os instrutores são renderizados como markers
- **Then** cada marker exibe o preço por aula como label visível (ex: "R$ 180")
- **And** marker selecionado tem destaque visual (background `var(--vl-accent)`, texto branco)
- **And** marker não selecionado tem background branco com borda accent
- **And** ao clicar abre o `InstructorCard` (comportamento atual preservado)

### AC2 — URL query params para filtros (Story 4.4)

- **Given** o aluno aplica filtros (`maxPrice`, `minRating`, `category`, `city`)
- **When** os filtros mudam
- **Then** a URL é atualizada com os query params correspondentes via `useRouter().replace()` (sem push para não poluir histórico)
- **And** ao recarregar a página, os filtros são lidos da URL e aplicados ao state inicial
- **And** "Limpar filtros" remove tanto state quanto query params

### AC3 — AprovometroTag canônico (Story 4.3)

- **Given** o componente `AprovometroTag`
- **When** renderizado para um instrutor com `aprovometro` válido (>= 5 amostras)
- **Then** o background é `oklch(55% 0.17 145)` (verde canônico ViaLivre)
- **And** o texto é branco
- **And** o número usa fonte `JetBrains Mono` (carregada via `next/font/google` no layout)
- **And** o tooltip mantém a explicação atual
- **And** para `aprovometroCount < 5`, mantém o estado "Novo Instrutor" (sem verde)

### AC4 — Build limpo e smoke passa

- `npx next build` zero erros
- `npx tsx scripts/smoke-test-search.ts` continua passando

## Files affected

- `src/app/instrutores/page.tsx` (URL sync + price pins)
- `src/components/features/instructors/AprovometroTag.tsx` (canonical OKLCH + JetBrains Mono)
- `src/app/layout.tsx` (adicionar JetBrains Mono via next/font, se ainda não estiver)

## Test plan

- ✅ Build: `npx next build` zero erros
- ✅ Smoke test passa
- ⏳ Smoke manual: aplicar filtro, copiar URL, abrir em outra aba — filtros aplicados; alternar mapa, ver preços nos pins; ver tag verde do Carlos.

## Risks

- **R1:** `useRouter().replace()` em rapid succession pode causar re-renders excessivos. Mitigação: debounce de 200ms no sync de URL.
- **R2:** Adicionar `JetBrains Mono` aumenta bundle de fontes em ~12KB. Aceitável; é o único uso e tem peso semântico (números monoespaçados).
- **R3:** `AdvancedMarker` com label custom em vez de `Pin` requer Map ID configurado no Google Cloud Console. Verificar `mapId="via-livre-instructor-map"` no Map já está setado.

## Definition of Done

- [ ] AC1: pins do mapa mostram preço, estilo Airbnb
- [ ] AC2: filtros persistem na URL
- [ ] AC3: AprovometroTag em OKLCH canônico + JetBrains Mono
- [ ] AC4: build limpo e smoke ok
- [ ] CR `cr-epic-4-search-polish.md`
- [ ] Commit + push (deploy via Vercel auto)
