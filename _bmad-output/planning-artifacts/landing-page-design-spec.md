# Design Spec — Landing Page ViaLivre
# Direção: Moderno & Tech

**Autor:** Sally (UX Designer) — sessão com Wmoraes
**Data:** 2026-05-12
**Status:** v1.0 — aprovado para implementação

---

## 1. Diagnóstico do Estado Atual

### Problemas identificados no código atual (`src/app/page.tsx`)

| Problema | Impacto | Seção afetada |
|----------|---------|---------------|
| Tipografia usa `var(--font-geist-sans)` — não é a fonte do brand book | Alto — identidade visual errada | Global |
| Seções Aprovômetro e "Como funciona" usam fundo branco + `gray-*` | Alto — quebra de coerência visual | Seções 2 e 4 |
| Nenhum uso de Instrument Serif italic nos headlines de display | Alto — perde o caráter editorial da marca |Hero, Aprovômetro |
| Plus Jakarta Sans não está importada | Alto — fallback para fonte do sistema | Global |
| H1 do hero não tem `letter-spacing` negativo agressivo | Médio — perde tensão visual | Hero |
| Cards da seção "Três Pilares" sem hover com glow verde | Baixo — interação plana | Seção 3 |
| Social proof strip no hero tem texto muito pequeno e opaco | Médio — dado importante invisível | Hero |
| Seção Aprovômetro mostra card em `bg-gray-50` — completamente fora do tema | Alto — parece outro produto | Seção 2 |

### O que está funcionando bem (manter)
- Estrutura de layout grid `1fr 480px` no hero — assimétrico, correto
- OKLCH color system — correto e alinhado com brand book
- Grid texture + radial glow verde no hero — ótimo efeito de profundidade
- Instructor cards no hero — produto visível above the fold
- Cópia dos headlines — direta, sem hype, alinhada com a voz da marca

---

## 2. Sistema de Design — Tokens

### 2.1 Tipografia

A fonte atual (Geist Sans) deve ser **substituída** pelas fontes do brand book.

```
Display / Headlines editoriais: Instrument Serif, italic, weight 400
UI / Headlines de seção:        Plus Jakarta Sans, weight 700–800
Body / Corpo:                   Plus Jakarta Sans, weight 400–500
Dados / Números técnicos:       JetBrains Mono, weight 700
```

**Import no `layout.tsx`:**
```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
```

**Escala tipográfica:**
| Token | Tamanho | Família | Peso | Uso |
|-------|---------|---------|------|-----|
| `display-2xl` | 72px | Instrument Serif italic | 400 | Hero H1 (palavra de destaque) |
| `display-xl` | 60px | Plus Jakarta Sans | 800 | Hero H1 (linha principal) |
| `display-lg` | 48px | Plus Jakarta Sans | 800 | H2 de seção principal |
| `display-md` | 36px | Plus Jakarta Sans | 700 | H2 de seção secundária |
| `heading-lg` | 28px | Plus Jakarta Sans | 700 | H3, títulos de card |
| `body-lg` | 18px | Plus Jakarta Sans | 400 | Lead text, subtítulos |
| `body-md` | 15px | Plus Jakarta Sans | 400 | Corpo principal |
| `body-sm` | 13px | Plus Jakarta Sans | 400 | Labels, captions |
| `mono-data` | 36–96px | JetBrains Mono | 700 | Aprovômetro, stats |

**Regra de ouro:** `letter-spacing: -0.03em` em todo display ≥ 48px. Sem isso a tipografia perde autoridade.

### 2.2 Cores

Todas as seções seguem o tema escuro da marca. Não há mais seções brancas/cinzas isoladas.

```css
/* Fundos — escala de profundidade */
--bg-base:       oklch(7%  0.01 145);  /* mais escuro — footer */
--bg-surface:    oklch(9%  0.02 145);  /* hero, seções primárias */
--bg-elevated:   oklch(12% 0.02 145);  /* cards, modais */
--bg-overlay:    oklch(15% 0.03 145);  /* hover states, inputs */

/* Verde — sistema completo */
--green-500:     oklch(62% 0.18 145);  /* cor de ação primária */
--green-400:     oklch(70% 0.16 145);  /* hover, destaques */
--green-600:     oklch(50% 0.17 145);  /* pressed, links */
--green-glow:    oklch(55% 0.17 145 / 0.15);  /* shadows, glows */

/* Texto */
--text-primary:  oklch(98% 0.005 145); /* headlines */
--text-secondary:oklch(70% 0.01 145);  /* body, labels */
--text-muted:    oklch(45% 0.01 145);  /* captions, placeholders */

/* Bordas */
--border-subtle: oklch(100% 0 0 / 0.06);
--border-default:oklch(100% 0 0 / 0.10);
--border-strong: oklch(100% 0 0 / 0.18);
--border-green:  oklch(62% 0.18 145 / 0.20);

/* Seção clara alternativa (Aprovômetro, Como funciona) */
--bg-section-light: oklch(11% 0.025 145);  /* levemente mais claro que surface, NÃO branco */
```

**Regra:** Nunca usar `gray-*` do Tailwind na landing page. Todas as cores passam pelo sistema OKLCH.

### 2.3 Sombras com tint verde

```css
--shadow-card:   0 1px 3px oklch(55% 0.17 145 / 0.08),
                 0 4px 16px oklch(0% 0 0 / 0.40);
--shadow-glow:   0 0 40px oklch(55% 0.17 145 / 0.12);
--shadow-button: 0 4px 20px oklch(55% 0.17 145 / 0.30);
```

### 2.4 Glassmorphism (cards das features)

```css
background: oklch(100% 0 0 / 0.04);
border: 1px solid oklch(100% 0 0 / 0.08);
backdrop-filter: blur(12px);
/* hover: */
background: oklch(100% 0 0 / 0.07);
border-color: oklch(62% 0.18 145 / 0.25);
box-shadow: 0 0 24px oklch(62% 0.18 145 / 0.08);
```

---

## 3. Especificação por Seção

### 3.1 Navegação

**Estado atual:** ok, manter estrutura.

**Ajustes:**
- Logo: aumentar peso visual — `font-extrabold` → `font-black`, aumentar de `text-lg` para `text-xl`
- Links do nav: opacidade de `white/50` → `white/40`, hover → `white` (mesmo contraste, mais suave)
- Botão "Começar grátis": adicionar `shadow-[oklch(55%_0.17_145)]/25 shadow-md` para elevar no fundo escuro
- Adicionar `backdrop-blur-sm` e `border-b border-white/5` no nav quando rolar (sticky scroll behavior)

---

### 3.2 Hero

**Problema central:** H1 não usa Instrument Serif para criar a tensão editorial que a marca pede.

**Estrutura do H1 — layout tipográfico:**
```
[Plus Jakarta Sans, 800, -0.03em]  "Aulas com quem"
[Instrument Serif, italic, 400]     "realmente aprova."
```
A segunda linha em Instrument Serif italic cria contraste tipográfico poderoso — sans-serif assertiva + serif expressiva. Exatamente o que o brand book define para "momentos editoriais".

**Tamanhos:**
- Mobile: `text-5xl` / `text-5xl`
- Desktop: `text-[68px]` / `text-[72px]`
- `letter-spacing: -0.03em` em ambas as linhas
- `line-height: 1.0`

**Badge CONTRAN:**
- Manter estrutura, mas aumentar `py` para `py-2` e adicionar `gap-2` para o ícone respirar

**CTAs:**
- Principal: manter estilo, adicionar `shadow-[oklch(55%_0.17_145)]/30 shadow-lg`
- Secundário: mudar texto para "Sou instrutor autônomo" → sem `ChevronRight` que parece incompleto, usar `ArrowRight` com `size={14}` e `opacity-40` para hierarquizar

**Social proof strip:**
- Aumentar opacidade dos valores de `text-white` para `font-bold text-white` — já está certo
- Aumentar labels de `text-[11px] text-white/35` para `text-xs text-white/45` — mais legível
- Adicionar separador vertical `|` entre os três itens (ou usar `gap-6` com divider)

**Cards de instrutor (coluna direita):**
- Manter estrutura — está bem
- Aumentar o `opacity` do terceiro card de `0.6` para `0.7` — menos "sumido"
- No `AprovColor`: green correto para ≤10, amarelo para 10–14, vermelho para >14

---

### 3.3 Seção Aprovômetro

**Problema central:** fundo `bg-gray-50` completamente fora do tema. Card parece arrancado de outro produto.

**Redesign completo:**

**Fundo da seção:** `bg-[--bg-section-light]` — `oklch(11% 0.025 145)` — levemente diferente do hero para criar ritmo sem sair do tema escuro

**Card do Aprovômetro:**
```
bg: oklch(14% 0.02 145)
border: 1px solid oklch(62% 0.18 145 / 0.15)
border-radius: 24px
box-shadow: 0 0 60px oklch(62% 0.18 145 / 0.08)
padding: 40px
```

**Número central (8,4):**
```
font-family: JetBrains Mono
font-size: 96px
font-weight: 700
color: oklch(70% 0.18 145)  /* verde vibrante */
letter-spacing: -0.04em
```

**Barras de comparação:**
- Background das barras: `oklch(20% 0.04 145)` — não `bg-gray-100`
- Barra Carlos: `oklch(62% 0.18 145)` — verde marca
- Barra mercado: `oklch(30% 0.04 145)` — cinza esverdeado escuro
- Labels: `oklch(60% 0.01 145)` — text muted no tema escuro

**Texto da seção:**
```
H2: "A métrica que nenhuma autoescola tem coragem de mostrar."
→ "A métrica que nenhuma" — Plus Jakarta Sans 800
→ "autoescola tem" — Instrument Serif italic (palavra de peso emocional)
→ "coragem de mostrar." — Plus Jakarta Sans 800
```
A terceira linha `text-gray-300` deve se tornar `text-white/25` (semanticamente idêntico, mas no sistema correto).

---

### 3.4 Três Pilares (seção escura)

**Problema:** cards sem hover expressivo, ícones não têm impacto suficiente.

**Ajustes nos cards:**
```css
/* Base */
background: oklch(14% 0.02 145);
border: 1px solid oklch(100% 0 0 / 0.06);
transition: border-color 200ms, box-shadow 200ms;

/* Hover */
border-color: oklch(62% 0.18 145 / 0.25);
box-shadow: 0 0 32px oklch(62% 0.18 145 / 0.06);
```

**Ícone container:**
- Aumentar de `w-10 h-10` para `w-12 h-12`
- Aumentar ícone de `size={18}` para `size={20}`
- Adicionar `shadow-[oklch(55%_0.17_145)]/20 shadow-md` no container

**Tag (COMPLIANCE, TRANSPARÊNCIA, SEGURANÇA):**
- Manter, mas mudar cor de `oklch(45%...)` para `oklch(55%...)` — mais visível

**H2 da seção:**
- "Uma plataforma honesta," — Plus Jakarta Sans 800
- "do começo ao fim." — Instrument Serif italic (com peso emocional)
- A linha `text-white/30 font-normal` é um erro — `font-normal` em Plus Jakarta Sans 800 cria inconsistência. Usar `text-white/35 font-light` ou manter italic em Instrument Serif.

---

### 3.5 Como Funciona

**Problema central:** seção em `bg-white` com `gray-*` — completamente fora do tema.

**Redesign:**

**Fundo:** `bg-[--bg-surface]` — mesma escala do hero (ritmo alternado)

**H2:** `"Simples para os dois lados."` → sem mudança de cópia, mas:
- `text-gray-950` → `text-white`
- Adicionar Instrument Serif italic na segunda parte se quiser ritmo: `"Simples"` (PJS 800) + `"para os dois lados."` (Instrument Serif italic)

**Coluna "Para alunos":**
- Label badge: `text-[oklch(62%_0.18_145)] bg-[oklch(15%_0.06_145)] border-[oklch(30%_0.08_145)]` — já existe no código do hero, reusar
- Números dos steps: manter `oklch(55%...)`, mas aumentar para `text-sm` (de `text-[11px]`)
- Step text: `text-gray-900` → `text-white/90`; `text-gray-400` → `text-white/40`
- Linha vertical conectora: `bg-[oklch(85%_0.08_145)]` → `bg-white/8`

**Coluna "Para instrutores":**
- Remover `bg-gray-50 border border-gray-100` — substituir por:
  ```
  bg: oklch(12% 0.025 145)
  border: 1px solid oklch(100% 0 0 / 0.08)
  border-radius: 24px
  ```
- Badge label: `text-gray-500 bg-gray-100` → `text-white/40 bg-white/5 border-white/8`
- Números: `text-gray-400` → `text-white/35`
- Botão "Cadastrar como instrutor": `border-gray-200 text-gray-700` → `border-white/12 text-white/60 hover:text-white hover:border-white/20`

---

### 3.6 CTA Final

**Estado atual:** bem executado. Ajustes menores:

- `text-white/40` no subtítulo → `text-white/50` (um toque mais legível)
- Botão secundário "Criar conta gratuita" → adicionar CTA mais direto: **"Criar conta — é grátis"** (mais ativo)
- Considerar adicionar um elemento visual de fundo: radial glow verde centrado, opacidade 8% — cria profundidade sem poluir

---

### 3.7 Footer

**Estado atual:** correto. Nenhuma mudança necessária.

---

## 4. Hierarquia Visual Global

### Ritmo de seções (de cima para baixo)

```
Nav          — bg-surface (transparente/dark)
Hero         — bg-surface       oklch(9% 0.02 145)    ← escuro principal
Aprovômetro  — bg-section-light oklch(11% 0.025 145)  ← levemente mais claro
Três Pilares — bg-surface       oklch(9% 0.02 145)    ← escuro principal
Como funciona— bg-elevated      oklch(12% 0.02 145)   ← card feel
CTA Final    — bg-surface       oklch(9% 0.02 145)    ← escuro principal
Footer       — bg-base          oklch(7% 0.01 145)    ← mais escuro
```

O ritmo é: escuro → levemente claro → escuro → card → escuro → base. Nunca branco. A variação sutil de OKLCH mantém identidade enquanto cria respiração entre seções.

---

## 5. Componentes Críticos

### InstructorCard (hero)
```tsx
// Especificação de prop types implícita na implementação
interface InstructorCard {
  initials: string        // 2 chars, gradient avatar
  gradient: string        // Tailwind from/to emerald/teal/cyan
  name: string
  city: string
  aprovometro: number     // JetBrains Mono, cor por faixa
  aprovCount: number      // amostras
  rating: number          // amber star
  ratingCount: number
  price: number
  moto: boolean
}
// aprovometro color thresholds: ≤10 verde, 10-14 amarelo, >14 vermelho
```

### AprovômetroDisplay
```tsx
// Para a seção 2 — número grande
<span className="font-mono text-[96px] font-bold text-[oklch(70%_0.18_145)] 
                 tabular-nums leading-none tracking-[-0.04em]">
  {value}
</span>
```

### FeatureCard (três pilares)
```tsx
// Base → Hover transition
className="group bg-[oklch(14%_0.02_145)] border border-white/6 
           rounded-2xl px-8 py-10
           hover:border-[oklch(62%_0.18_145)/25] 
           hover:shadow-[0_0_32px_oklch(62%_0.18_145)/6]
           transition-all duration-200"
```

---

## 6. Checklist de Implementação

- [ ] Substituir `font-[var(--font-geist-sans)]` por `font-[var(--font-plus-jakarta)]` globalmente
- [ ] Importar Instrument Serif + Plus Jakarta Sans + JetBrains Mono no `layout.tsx`
- [ ] Configurar CSS variables de fonte no `globals.css`
- [ ] Aplicar Instrument Serif italic na segunda linha do H1 do hero
- [ ] Aplicar `letter-spacing: -0.03em` em todos os headlines ≥ 48px
- [ ] Redesenhar seção Aprovômetro — remover `gray-*`, aplicar tema escuro
- [ ] Redesenhar seção "Como funciona" — remover `bg-white`, aplicar `bg-[oklch(12%...)]`
- [ ] Adicionar hover com glow verde nos cards dos Três Pilares
- [ ] Substituir todos os `gray-*` por equivalentes OKLCH
- [ ] Aumentar ícone containers na seção Três Pilares para `w-12 h-12`
- [ ] Revisar opacidades de texto para legibilidade mínima AA (4.5:1 para body)

---

## 7. Referências Visuais

| Elemento | Referência | Por quê |
|----------|-----------|---------|
| Hero dark + glow | Linear.app | Confiança tech, produto sério |
| Tipografia mista serif+sans | The Economist digital | Autoridade + modernidade |
| Número grande Aprovômetro | Stripe Dashboard | Dado como hero visual |
| Card hover com glow verde | Vercel, Resend | Interatividade elegante sem barulho |
| Ritmo claro/escuro | Nubank landing | Seções respiram sem perder identidade |

---

*Próximo passo: implementar o checklist acima no `src/app/page.tsx` e atualizar `layout.tsx` com as fontes do brand book.*
