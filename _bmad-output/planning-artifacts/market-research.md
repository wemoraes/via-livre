# ViaLivre — Pesquisa de Mercado

**Data:** 2026-05-12  
**Status:** Rascunho inicial — validar dados de competidores diretamente nas plataformas

---

## Tamanho de Mercado

| Métrica | Dado | Certeza |
|---------|------|---------|
| CNHs emitidas/ano (2023) | 2,7M | Alta |
| CNHs emitidas/ano (2024) | 2,59M | Alta |
| Crescimento jan/2026 pós-lei | +360% (369k → 1,7M em um mês) | Alta |
| Faturamento total setor CFC | ~R$ 14 bi/ano | Média |
| Preço médio aula CFC | R$ 500–700 / 2h | Alta |
| Preço médio aula instrutor autônomo | R$ 85–150 / aula | Alta |
| Redução de custo para o aluno com nova lei | ~70% (MG: R$ 2.256 → R$ 660) | Alta |

**TAM estimado (mercado de aulas práticas):**  
2,7M habilitandos × R$ 85–150/aula × mínimo 2 aulas = R$ 460M–810M/ano (conservador, base 2 aulas).  
Considerando média real de 5–10 aulas até aprovação: R$ 1,1B–4B/ano.

---

## Competidores

### Diretos — Brasil

| Plataforma | Descrição | Diferencial aparente | Risco |
|------------|-----------|---------------------|-------|
| **Meu Instrutor** (meuinstrutor.net) | Conecta alunos a instrutores autônomos | Existente, tração desconhecida | Médio |
| **Instrutor CNH** (instrutorcnh.com) | +600 instrutores credenciados DETRAN, comparação de preços e ratings | Base de instrutores verificados | Alto |
| **TreinaCNH** | Marketplace sem taxas para instrutores | Sem taxa atrai instrutores | Médio |
| **CNHAuto** | Rastreamento em tempo real durante aulas | Feature de segurança diferenciada | Médio |
| **Instrutor Legal** (instrutorlegal.org) | +15.000 instrutores verificados | Base grande, mas contato via WhatsApp | Médio |

### Competidor Institucional — CRÍTICO

**App "CNH do Brasil" (governo federal) — Maio 2026:**  
O governo lançou plataforma oficial integrada ao app CNH do Brasil com busca de instrutores por localização, preços e ratings. **Competição pública e gratuita.** Nível de UX e engajamento ainda desconhecido, mas a existência muda a dinâmica.

### Internacionais (referência)

| Plataforma | País | Modelo |
|------------|------|--------|
| Zutobi | EUA | Freemium — prep teórico, assinatura para premium |
| Aceable | EUA | Cursos online aprovados por estado, venda única |
| Pass Me Fast | UK | Marketplace de instrutores, comissão por aula |
| DriveJoyce | UK | Booking de aulas, assinatura do instrutor |

---

## Comportamento do Consumidor

**Principais dores com CFCs (Reclame Aqui, reviews):**
- Recusa de reembolso em categorias descontinuadas
- Cobrança duplicada / falha em computar aulas realizadas
- Veículos irregulares ou com documentação vencida
- Falta de transparência em preços
- Score 0% de resposta nas plataformas de reclamação

**O que buscam num instrutor:**
1. Preço — aula particular é 4–5x mais barata que CFC
2. Flexibilidade de horário
3. Proximidade geográfica
4. Transparência (saber o que está pagando antes de contratar)

**Perfil do candidato:**
- 18–35 anos (maioria das novas habilitações)
- Urbano
- Sensível a preço (busca alternativa ao CFC justamente pelo custo)

---

## Situação dos CFCs

- 98% registraram queda em procura após a Res. 1.020
- 27,7% registraram queda >80% em receitas (ABRAUTO)
- Estão pivotando para outros serviços (renovação, reciclagem), não reconvertendo para marketplace
- Não são concorrentes ativos no novo modelo — são o modelo legado em colapso

---

## Modelos de Monetização de Referência

| Modelo | Exemplo | Take rate |
|--------|---------|-----------|
| Comissão por aula (split) | Pass Me Fast, GetNinjas | 10–20% |
| Assinatura instrutor (SaaS) | DriveJoyce | R$ 80–200/mês |
| Assinatura aluno | Zutobi premium | R$ 30–100/ciclo |
| Conteúdo / curso avulso | Aceable | R$ 30–100 por curso |

---

## Análise Competitiva — Posicionamento ViaLivre

### Gaps dos competidores existentes

| Gap | Oportunidade ViaLivre |
|-----|----------------------|
| Sem Aprovômetro (dado real de aprovação) | Métrica proprietária — forte diferencial |
| Contato ainda via WhatsApp (Instrutor Legal) | Agendamento + pagamento integrado na plataforma |
| Sem gestão financeira para instrutor | Dashboard financeiro, split automático, recibo |
| Sem seguro por aula | Distribuir seguro parametrizado como feature |
| UX genérica | Brand system forte (brand book v2.0), identidade clara |
| Nenhum verifica credenciamento automaticamente | Onboarding com checklist + integração SENATRAN |

### Risco principal

**Plataforma governamental gratuita** compete no caso de uso mais básico (encontrar instrutor). ViaLivre precisa se posicionar na camada de **confiança, qualidade e conveniência** — não só no match.

---

## Sizing de Oportunidade

| Cenário | Market share ano 3 | Receita estimada |
|---------|--------------------|-----------------|
| Conservador | 1% do TAM | R$ 11M–40M/ano |
| Base | 3% do TAM | R$ 33M–120M/ano |
| Otimista | 5% do TAM | R$ 55M–200M/ano |

*Estimativas brutas para direcionamento estratégico. Requerem validação.*

---

## Próximas Investigações

- [ ] Testar UX dos competidores diretos (Meu Instrutor, Instrutor CNH, Instrutor Legal)
- [ ] Avaliar profundidade e UX da plataforma governamental no app CNH do Brasil
- [ ] Entrevistar 5–10 candidatos à CNH sobre dores e disposição a pagar
- [ ] Entrevistar 3–5 instrutores autônomos sobre ferramentas que usam hoje
- [ ] Validar preço de comissão aceito por instrutores (benchmarks: GetNinjas 20%, iFood 12–27%)
