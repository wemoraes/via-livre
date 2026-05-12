# ViaLivre — Product Brief

**Versão:** 0.1 (rascunho inicial)  
**Data:** 2026-05-12  
**Status:** Em elicitação — aguardando complemento do fundador

---

## Visão em uma frase

ViaLivre é o marketplace que conecta candidatos à CNH com instrutores autônomos credenciados, habilitado pela nova lei CNH Brasil que elimina a obrigatoriedade de matrícula em CFCs.

---

## Problema

Com a nova CNH Brasil, candidatos podem contratar aulas diretamente com instrutores autônomos, sem passar por um CFC. Mas:

- **Candidatos** não têm onde encontrar, comparar e contratar instrutores de forma confiável. Não sabem quem é credenciado, qual carro o instrutor tem, qual a taxa de aprovação real, nem conseguem pagar online.
- **Instrutores autônomos** não têm infraestrutura para se profissionalizar: sem presença digital, sem gestão de agenda, sem forma de cobrar digitalmente, sem reputação verificável.
- **O mercado** tem uma lacuna regulatória nova a ser explorada: quais exigências legais o instrutor autônomo precisa cumprir? Como a plataforma garante compliance e ao mesmo tempo facilita a operação?

---

## Solução

Marketplace two-sided com dois perfis distintos:

### Para o Aluno
- Busca e comparação de instrutores (localização, preço, veículo, avaliações, Aprovômetro)
- **Aprovômetro** — métrica proprietária de taxa de aprovação média (ex: "7,1 aulas até aprovar — 31 amostras")
- Agendamento online de aulas
- Pagamento por aula ou por plano
- Painel de progresso: aulas realizadas, avaliações, histórico
- Conteúdos de apoio para provas teóricas e práticas (roadmap futuro)

### Para o Instrutor
- Onboarding com validação de documentação (credenciamento DETRAN, CNH profissional, BNMP, etc.)
- Registro e gestão dos veículos utilizados
- Gestão de agenda e disponibilidade
- Recebimento de pagamentos (split automático ou saque)
- Avaliações recebidas e dadas (bidirecional)
- Dashboard: aulas dadas, receita, próximas aulas, avaliação média

---

## Mercado

- **Contexto regulatório:** Nova lei CNH Brasil — desintermediação dos CFCs. A lei ainda tem lacunas em implementação que precisam ser mapeadas (ver seção de pesquisa necessária).
- **TAM preliminar:** Estimativa de ~1,5M candidatos à CNH/ano no Brasil. Mercado de instrução de direção estimado em R$ 3–5 bi/ano (a validar).
- **Público primário:** 18–30 anos, urbano, acostumado a marketplaces (iFood, Uber, GetNinjas).
- **Concorrentes diretos:** Não identificados como marketplace nativo pós-lei. CFCs tradicionais são o modelo legado. Existe oportunidade de ser first-mover.

---

## Diferenciais

1. **Aprovômetro** — dado de aprovação agregado por instrutor, verificado. Nenhum concorrente tem.
2. **Compliance integrado** — onboarding de instrutores com checklist legal reduz risco para ambos os lados.
3. **Autonomia real** — aluno escolhe instrutor, veículo, horário. Não é designado.
4. **Identidade de marca forte** — brand book completo (v2.0), sistema visual coeso.

---

## Perguntas em aberto (elicitação pendente)

1. **Regulatório:** Quais exigências específicas a nova lei impõe ao instrutor autônomo? Há lacunas que precisam de interpretação jurídica? Como a plataforma se posiciona como facilitadora sem assumir responsabilidade de CFC?
2. **Modelo de negócio:** Comissão por aula? Assinatura do instrutor? Freemium? Taxa do aluno?
3. **Geolocalização:** A busca é por raio (km)? Por bairro? Por DETRAN de vínculo?
4. **Validação de documentos:** O processo de verificação é manual (time interno) ou automatizado (API DETRAN)? Existe API pública do DETRAN para consulta de credenciamento?
5. **Pagamento:** Qual gateway? Escrow até conclusão da aula? Política de cancelamento?
6. **Conteúdo teórico:** É uma feature do MVP ou roadmap posterior? Parceria com algum conteudista?
7. **Auto vs Moto:** MVP cobre ambas as categorias ou começa por uma?
8. **Geografia:** MVP restrito a qual(is) estado(s)?

---

## Modelo de Negócio (hipóteses a validar)

Três vetores de monetização em estudo — não mutuamente exclusivos:

| Modelo | Descrição | Complexidade | Potencial |
|--------|-----------|--------------|-----------|
| **Mensalidade instrutor** | Plano mensal SaaS para o instrutor ter acesso à plataforma, agenda, painel | Baixa | Receita previsível, MRR |
| **Mensalidade aluno** | Acesso premium: prioridade na busca, suporte, histórico | Baixa-média | Depende de volume de alunos |
| **Fee por aula (split)** | Comissão % sobre cada aula paga — requer split de pagamento (Stripe Connect, Iugu, etc.) | Alta | Alto potencial, escala com volume |
| **Conteúdo + features AI** | Venda de conteúdo teórico, simulados, análise de progresso por IA | Média | Upsell após tração |

**Decisão arquitetural:** mesmo que o MVP comece com mensalidade, a infra de pagamentos deve suportar split desde o início para não ter retrabalho.

---

## Escopo e Abrangência

- **Categorias:** Auto (prioridade). Moto incluída se o esforço incremental for baixo (mesma estrutura de dados, habilitação específica).
- **Geografia:** Nacional desde o MVP.
- **Conteúdo teórico:** Fora do MVP, mas a arquitetura já deve prever o módulo (content delivery, progresso do aluno, eventual gamificação).

---

## Próximos passos BMAD

- [x] `/bmad-domain-research` — concluído, ver `domain-research-legal.md`
- [ ] `/bmad-market-research` — análise competitiva, comportamento do consumidor, pricing
- [ ] Validação jurídica do T&C e responsabilidade civil com advogado de trânsito
- [ ] Investigar API SENATRAN para credenciamento e parceria de seguro por aula
- [ ] `/bmad-create-prd` — PRD completo após market research

---

*Este documento é um rascunho vivo. Será atualizado conforme elicitação avança.*
