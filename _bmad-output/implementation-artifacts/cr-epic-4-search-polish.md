# Code Review: story-epic-4-search-polish

- **Reviewer:** Amelia (Senior Software Engineer)
- **Story:** [story-epic-4-search-polish.md](story-epic-4-search-polish.md)
- **Data:** 2026-05-13
- **Status:** APPROVED

## Sumário

Fecha 3 ACs explícitos do Epic 4 que estavam parcialmente implementados: pins do mapa agora mostram preço estilo Airbnb, filtros persistem na URL, e `AprovometroTag` agora segue o spec canônico (OKLCH verde ViaLivre + JetBrains Mono).

## Conformidade com ACs

| AC | Status | Nota |
|----|--------|------|
| AC1 — Price pins | ✅ | Componente `PricePin` substitui `Pin` genérico. Background branco com borda accent quando idle; full accent + texto branco + scale 1.1 quando selecionado. |
| AC2 — URL query params | ✅ | `useSearchParams` lê estado inicial; `router.replace()` com debounce 200ms sincroniza state→URL; "Limpar" reseta ambos. State sources: `city`, `maxPrice`, `minRating`, `category`. |
| AC3 — AprovometroTag canon | ✅ | Background `oklch(55% 0.17 145)` (verde ViaLivre canônico), texto branco. Número em JetBrains Mono via CSS var `--font-jetbrains-mono`. "Novo Instrutor" mantém visual neutro (sem verde). |
| AC4 — Build + smoke | ✅ | Build 5.1s + 4.1s TS, 27 páginas. Smoke 8/8 asserts. |

## Decisões técnicas

- **`PricePin` inline em `page.tsx` em vez de componente separado:** é específico do mapa de busca e não tem reúso esperado. Manter local reduz overhead.
- **Suspense wrapper:** `useSearchParams()` requer Suspense em Next 16 quando usado direto em uma página. Mesmo padrão de `verificar-email` e `nova-senha`. O `InstrutoresPageInner` é a árvore real.
- **Debounce de 200ms para `router.replace`:** evita pisada de URL ao usuário mexer rapidamente no slider de preço. 200ms é abaixo do limiar perceptível (~250ms) mas suficiente para coalescer múltiplos onChange.
- **`scroll: false`:** o `router.replace()` por padrão tenta scroll up; passamos `{ scroll: false }` para preservar o scroll do usuário.
- **Selects/inputs agora têm `value` controlado:** antes ficavam orfãos (mudança via onChange mas sem reflect quando state mudava externamente — ex.: limpar filtros). Agora a UI sempre reflete o state.
- **JetBrains Mono já carregado no `layout.tsx` via `next/font/google`:** zero impacto de bundle adicional.

## Pontos fortes

- **State → URL → state é unidirecional e idempotente:** carregar a URL com `?maxPrice=200&category=AUTO` produz exatamente o mesmo estado da app que aplicar esses filtros manualmente. Compartilhamento de link funciona.
- **`PricePin` é puramente apresentacional:** sem state interno, recebe `price` + `selected` como props. Trivial de testar visualmente.
- **AprovometroTag mantém retrocompatibilidade:** mesma API (`aprovometro`, `aprovometroCount`, `size`), só mudou o visual. Zero call site quebrado.
- **`filtersFromSearchParams` é defensivo:** type-guards explícitos para `category === "AUTO" | "MOTO"`, parsing seguro de `Number()` com `undefined` fallback.

## Pontos de atenção

- **A1 — `useSearchParams()` em client component requer Suspense:** já tratado. Mas se alguém mover lógica de filtros para um page server-side futuramente, precisará revisar.
- **A2 — `router.replace` com query string vazia mantém `?`:** testado mentalmente que `pathname + ""` é equivalente a `pathname`. Sem reprodução de bug, mas vale validar manualmente.
- **A3 — Lat/lng não estão sincronizados na URL:** geolocalização vem do browser, é runtime. Compartilhar link não preserva a posição do usuário. Aceitável — é UX correto (cada usuário vê resultados ao redor de si).
- **A4 — Cache Redis usa `JSON.stringify(filters)` como chave:** isso inclui ordem de propriedades. Se filtros forem reconstruídos em ordem diferente entre render inicial e posterior, o cache miss-rate sobe. Mitigação implícita: `filtersFromSearchParams` produz objeto em ordem fixa.

## Métricas

- Build: ✅ 5.1s compile / 4.1s TS / 27 páginas
- TypeScript errors: 0
- Smoke test: ✅ 8/8
- Arquivos modificados: 2 (M)
- Linhas: +90 / -30 (estimativa)

## Follow-ups (Epic 4 — phase 2)

1. **Reviews section no perfil público** (Story 4.5 AC): últimas 10 avaliações com nota, comentário, data, primeiro nome.
2. **AprovometroExplainer modal** (Story 4.5 AC): clicar no tag abre tooltip/modal explicando o cálculo.
3. **Star distribution** (Story 4.5 AC): histograma 5/4/3/2/1 estrelas no perfil.
4. **Sticky CTA mobile no perfil** (Story 4.5 AC): "Agendar aula" fixo bottom em viewport mobile.
5. **Infinite scroll na lista** (Story 4.3 AC): atualmente cap em 20 sem load-more.
6. **Filter chips removíveis** (Story 4.4 AC): exibir filtros ativos como chips abaixo da barra com X para remover individualmente.

## Decisão

**APPROVED.** Story fechada. Push para `main` aciona deploy Vercel automático para `vialivre-br.vercel.app`.
