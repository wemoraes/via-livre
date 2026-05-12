---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish, step-12-complete]
workflowType: 'prd'
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief.md
  - _bmad-output/planning-artifacts/domain-research-legal.md
  - _bmad-output/planning-artifacts/market-research.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
documentCounts:
  briefCount: 1
  researchCount: 2
  brainstormingCount: 0
  projectDocsCount: 0
classification:
  projectType: marketplace_web
  domain: transportation_govtech
  complexity: high
  projectContext: greenfield
releaseMode: phased
---

# Documento de Requisitos de Produto — ViaLivre

**Autor:** Wmoraes  
**Data:** 2026-05-12  
**Versão:** 1.0  
**Status:** Completo

---

## Sumário Executivo

ViaLivre é um marketplace two-sided que conecta candidatos à CNH com instrutores autônomos credenciados, habilitado pela Resolução CONTRAN nº 1.020/2025 — lei que elimina a obrigatoriedade de matrícula em CFCs e permite ao candidato contratar aulas diretamente com instrutores independentes. O produto atua em um mercado de R$ 1,1B–4B/ano em aulas práticas, com redução de custo de ~70% ao aluno (de R$ 2.500–5.000 para R$ 400–800) e ausência de um marketplace nativo confiável no novo modelo regulatório.

A plataforma endereça um problema bilateral: candidatos não têm onde encontrar, comparar e contratar instrutores de forma confiável e segura; instrutores autônomos não têm infraestrutura digital para gestão de agenda, pagamentos e construção de reputação verificável. ViaLivre resolve ambos os lados com onboarding de compliance integrado, agendamento online, pagamento com escrow, e a métrica proprietária **Aprovômetro** — média de aulas até aprovação no exame prático por instrutor, dado que nenhum concorrente possui.

O público primário são candidatos de 18–35 anos, urbanos, sensíveis a preço e familiarizados com marketplaces (iFood, Uber, GetNinjas). O público secundário são instrutores autônomos que buscam profissionalização e renda recorrente sem vínculo com CFC. Mercado nacional desde o MVP; crescimento de +360% em habilitações foi registrado no primeiro mês pós-lei (jan/2026), confirmando urgência da oportunidade.

### O Que Torna o ViaLivre Especial

**Aprovômetro** é o diferencial central e intransponível: dado real e verificado de quantas aulas, em média, cada instrutor leva um aluno até ser aprovado no exame prático. Nenhum competidor tem essa métrica. Ela resolve o problema de informação assimétrica — o candidato sabe, antes de contratar, qual instrutor tem o histórico mais eficiente. Para o instrutor, o Aprovômetro é incentivo para qualidade real, não apenas para popularidade.

Além disso, ViaLivre é o único player que combina: (1) onboarding com validação de credenciamento SENATRAN, (2) agendamento e pagamento integrado com escrow, (3) distribuição de seguro parametrizado por aula (gap crítico de mercado não resolvido) e (4) brand system de alta qualidade visual (Airbnb-style, shadcn/ui + Tailwind CSS v4).

O insight central: a nova lei criou um mercado de ~1,5M candidatos/ano sem uma plataforma que mereça sua confiança. ViaLivre não é só um diretório — é a infraestrutura de confiança do novo modelo de habilitação.

## Classificação do Projeto

| Atributo | Valor |
|---|---|
| **Tipo de Projeto** | Marketplace web two-sided (responsive, mobile-first) |
| **Domínio** | Transporte / Mobility / GovTech regulado |
| **Complexidade** | Alta — indústria regulada, pagamentos com split, compliance documental, dois lados de marketplace |
| **Contexto** | Greenfield — primeiro produto, sem legado |
| **Cobertura Geográfica** | Nacional desde o MVP |
| **Categorias CNH** | Auto (B) prioritário; Moto (A) com estrutura de dados compatível |

---

## Critérios de Sucesso

### Sucesso do Usuário — Aluno

- Aluno encontra um instrutor disponível na sua cidade em menos de 5 minutos após o primeiro acesso
- Aluno consegue agendar, pagar e receber confirmação de uma aula sem contato humano (zero-touch booking)
- Aluno completa a jornada de habilitação entendendo seu progresso em cada etapa (aulas realizadas, aprovações, histórico)
- Aluno com primeiro acesso conclui onboarding e faz primeiro agendamento em uma sessão (< 20 min)
- Taxa de cancelamento de alunos após primeira aula < 15% (validação de qualidade do match)

### Sucesso do Usuário — Instrutor

- Instrutor autônomo sem presença digital conclui onboarding e publica perfil em < 48h após cadastro
- Instrutor recebe pagamento em até 2 dias úteis após aula confirmada
- Instrutor gerencia agenda inteiramente pela plataforma, sem depender de WhatsApp para confirmações
- Instrutor com histórico real de aprovações vê seu Aprovômetro calculado automaticamente (zero input manual)
- Taxa de churn de instrutores (primeiros 90 dias) < 20%

### Sucesso do Negócio

| Métrica | Meta 6 meses | Meta 12 meses |
|---|---|---|
| Instrutores ativos (com ao menos 1 aula agendada) | 500 | 2.000 |
| Alunos cadastrados | 5.000 | 25.000 |
| Aulas realizadas via plataforma | 2.000 | 15.000 |
| GMV (volume de aulas pagas) | R$ 300K | R$ 2,25M |
| NPS de alunos | > 50 | > 60 |
| NPS de instrutores | > 40 | > 55 |
| Estados cobertos (instrutores ativos) | 5 | 15 |

### Sucesso Técnico

- Disponibilidade da plataforma ≥ 99,5% (medida mensalmente)
- Tempo de resposta de páginas críticas (busca, agendamento) < 2s em conexão 4G
- Tempo de processamento de pagamento confirmado < 5s
- Zero falhas de segurança em dados pessoais (LGPD)
- Cobertura de testes unitários + integração ≥ 80% nos módulos de pagamento e compliance

### Resultados Mensuráveis

- **Indicador de confiança:** % de alunos que escolhem instrutor com base no Aprovômetro > 60% (no primeiro ano, quando base estiver suficiente)
- **Indicador de qualidade de match:** Taxa de aprovação no exame prático de alunos da plataforma ≥ média nacional
- **Indicador de compliance:** 100% dos instrutores ativos com credenciamento SENATRAN verificado e vigente

## Escopo do Produto

### MVP — Produto Mínimo Viável (Fase 1)

**Filosofia de MVP:** Plataforma de experiência — o MVP entrega a jornada completa de descoberta, agendamento e pagamento para ambos os lados. Sem atalho de WhatsApp; sem workarounds manuais. Se o aluno precisar sair da plataforma para concluir uma ação, o MVP falhou.

**Jornadas suportadas no MVP:**

- Aluno: busca → comparação → agendamento → pagamento → avaliação pós-aula
- Instrutor: onboarding com compliance → publicação de perfil → gestão de agenda → recebimento

**Capacidades obrigatórias no MVP:**

- Busca de instrutores por geolocalização (mapa + lista sincronizados)
- Perfil de instrutor com Aprovômetro (quando há histórico ≥ 5 alunos) ou badge "Novo Instrutor"
- Agendamento online com confirmação do instrutor
- Pagamento por aula com escrow (liberado após confirmação de realização)
- Onboarding de instrutor com checklist de documentação (credenciamento, CNH com EAR, certidões)
- Dashboard do instrutor: agenda, próximas aulas, receita
- Dashboard do aluno: histórico de aulas, avaliações dadas
- Avaliação bidirecional pós-aula (aluno avalia instrutor, instrutor avalia aluno)
- Cadastro e gestão de veículo do instrutor (vistoria DETRAN)
- Notificações (confirmação, lembrete, cancelamento)

**Fora do MVP (roadmap):**

- Seguro parametrizado por aula (integração com seguradora)
- Conteúdo teórico (simulados, vídeos)
- App nativo iOS/Android (MVP é web responsive)
- Gamificação (conquistas, rankings)
- IA de recomendação de instrutor

### Crescimento — Fase 2 (Pós-MVP)

- Distribuição de seguro parametrizado por aula (parceria com seguradora)
- Verificação automática de credenciamento via API SENATRAN (se disponível)
- Planos de aula (pacotes de N aulas com desconto)
- Chat integrado instrutor–aluno (limitado ao contexto da aula)
- Relatório de progresso do aluno exportável para DETRAN (se regulamentado)
- Suporte a categoria Moto (A) sem retrabalho de infraestrutura

### Visão — Fase 3 e Além

- Conteúdo teórico integrado (simulados, questões, vídeo-aulas)
- IA de recomendação de instrutor por perfil de aluno
- Gamificação da jornada do aluno (conquistas, metas, ranking)
- App nativo iOS/Android
- B2B: dashboard para instrutores com múltiplos instrutores (formação de pequenas redes)
- Análise preditiva: probabilidade de aprovação do aluno por histórico de aulas

---

## Jornadas de Usuário

### Jornada 1 — Mariana, 22 anos, primeira habilitação (aluno — caminho de sucesso)

Mariana acabou de completar o ensino médio e quer tirar a CNH para ter mais liberdade. Ela ouviu de uma amiga que a nova lei eliminou o CFC obrigatório e ficou curiosidade — "mas onde eu acho um instrutor confiável?". Abre o ViaLivre pelo celular.

**Descoberta:** A tela inicial mostra o mapa com pins de preço (estilo Airbnb), com filtros de categoria e o Aprovômetro como critério de ordenação. Mariana filtra "Auto (B)", ajusta o raio para 5km e vê 12 instrutores disponíveis. Ela clica em um pin de R$ 120/aula que tem Aprovômetro "5,8 aulas — 47 alunos" com badge de verificado e 4,9 estrelas.

**Comparação:** No perfil do instrutor, ela vê foto, vídeo de apresentação curto, o veículo (com foto e ano), avaliações detalhadas, disponibilidade da semana e o Aprovômetro em destaque com a explicação "Em média, seus alunos aprovam em 5,8 aulas". Ela compara com outro instrutor de R$ 95/aula com Aprovômetro de 9,3 — entende que o mais caro pode ser mais barato no total.

**Agendamento:** Ela escolhe sexta-feira às 8h, vê a disponibilidade confirmada, seleciona local de encontro (endereço dela) e avança para pagamento.

**Pagamento:** A tela de pagamento explica o escrow: "Seu pagamento fica protegido até a aula acontecer. Só então o instrutor recebe." Ela paga com cartão e recebe confirmação instantânea por email e push.

**Dia da aula:** 30 minutos antes, recebe lembrete push. Após a aula, a plataforma pergunta "A aula foi realizada?". Mariana confirma, avalia o instrutor (5 estrelas, comentário) e o Aprovômetro do instrutor é atualizado.

**Nova realidade:** Mariana agenda a segunda aula direto no app, já conhece o instrutor, sente confiança. Em 5 semanas e 6 aulas, faz o exame. A plataforma registra a aprovação (via input do instrutor ou do aluno) e atualiza o Aprovômetro.

**Capacidades reveladas:** busca geolocalizada, filtros, card de instrutor com Aprovômetro, perfil detalhado, calendário de disponibilidade, seleção de local, pagamento com escrow, notificações, avaliação pós-aula, atualização de Aprovômetro.

---

### Jornada 2 — Ricardo, 38 anos, instrutor autônomo, buscando clientes (instrutor — onboarding e operação)

Ricardo tem CNH há 10 anos, tirou a certificação EAR no ano passado quando saiu do CFC onde trabalhava e está dando aulas particulares via indicação de amigos — só aceita PIX. Quer aumentar a renda e ter agenda cheia. Ouve falar do ViaLivre pelo Instagram.

**Onboarding:** Ricardo abre o cadastro "Sou Instrutor". A plataforma apresenta o checklist de documentação com progresso visual: CNH com EAR ✓, certidão negativa criminal ✓, credenciamento SENATRAN (pendente — link direto para o portal), certidão de débitos públicos ✓. Ele envia o credenciamento quando obtém. A plataforma valida (revisão manual em até 24h) e libera o perfil.

**Configuração do perfil:** Ricardo preenche bio, preço por aula, áreas de atuação (bairros), adiciona foto e vídeo curto de apresentação. Cadastra o veículo (placa, modelo, ano, foto) e faz upload do CRLV com vistoria DETRAN. Sua disponibilidade é configurada por horários na agenda.

**Primeiras aulas:** Recebe notificação de pedido de agendamento de Mariana. Aceita pela plataforma. Na data, realiza a aula, confirma a realização pelo app. O valor é liberado do escrow em 24h e disponível para saque em D+2.

**Dashboard:** Ricardo acessa o painel e vê: R$ 2.400 faturados no mês, 20 aulas realizadas, 4 próximas aulas, Aprovômetro "6,1 aulas — 12 alunos". Vê que um concorrente próximo tem Aprovômetro de 4,9 — decide investir mais na qualidade das aulas para melhorar o indicador.

**Nova realidade:** Ricardo parou de usar WhatsApp para confirmações. Tem renda previsível, gestão de agenda digital e reputação verificável. Indica o ViaLivre para outro instrutor que conhece.

**Capacidades reveladas:** onboarding com checklist compliance, validação documental, configuração de perfil/preço/bairros, cadastro de veículo, gestão de agenda, aceitação de agendamentos, confirmação de aula, saque de receita, dashboard financeiro, Aprovômetro calculado automaticamente.

---

### Jornada 3 — Fernanda, instrutora nova sem histórico (cold start — caso de borda)

Fernanda acabou de conseguir o credenciamento SENATRAN. Nunca deu aulas como autônoma. Não tem Aprovômetro. Cadastra-se no ViaLivre e sente insegurança: "Quem vai me contratar sem histórico?"

**Cold start handling:** A plataforma exibe o badge "Novo Instrutor — Primeiras Avaliações em Construção" de forma destacada e honesta. Fernanda recebe sugestão de preço inicial competitivo para sua região (baseado na mediana local) e dicas de como construir perfil atraente (foto profissional, vídeo de apresentação, bio detalhada).

**Primeiros alunos:** A plataforma inclui Fernanda em resultado de busca para alunos que marcaram "Aberto a Novos Instrutores" (filtro opcional) ou que ordenam por preço. Ela tem preço 20% abaixo da mediana local para atrair primeiros clientes. Após 5 aulas, seu Aprovômetro inicial aparece.

**Capacidades reveladas:** badge de novo instrutor, pricing sugerido baseado em região, filtro de aluno por "aberto a novos instrutores", progressão de reputação.

---

### Jornada 4 — Equipe de Operações ViaLivre (admin — compliance e qualidade)

Um analista de operações recebe alerta: instrutor com credenciamento prestes a vencer (90 dias). Acessa o painel de administração, vê o status do instrutor, envia notificação automática para renovação. Se expirar sem renovação, o perfil é pausado automaticamente e o instrutor é notificado.

Outro cenário: aluno reporta instrutor por comportamento inadequado. Analista abre o caso no painel admin, vê histórico de aulas, avaliações e pode suspender o perfil preventivamente enquanto investiga.

**Capacidades reveladas:** painel de administração, gestão de status de instrutores, alertas de vencimento de documentos, moderação de denúncias, suspensão preventiva, auditoria de aulas.

---

### Resumo de Capacidades por Jornada

| Jornada | Capacidades Principais Reveladas |
|---|---|
| Mariana (aluno) | Busca + mapa, filtros, Aprovômetro, perfil, agendamento, escrow, notificações, avaliação |
| Ricardo (instrutor) | Onboarding compliance, agenda, aceitação, confirmação, saque, dashboard, Aprovômetro |
| Fernanda (cold start) | Badge novo instrutor, pricing sugerido, filtro de abertura, progressão de reputação |
| Ops ViaLivre (admin) | Painel admin, gestão de documentos, moderação, alertas, suspensão |

---

## Requisitos de Domínio

### Compliance e Regulatório

**Resolução CONTRAN nº 1.020/2025** é o marco legal central. Requisitos obrigatórios para um instrutor ser listado na plataforma:

- CNH válida há ≥ 2 anos, sem infrações gravíssimas nos últimos 60 dias
- Credenciamento ativo na SENATRAN (gratuito, online)
- Curso de Instrutor de Trânsito concluído com anotação EAR na CNH
- Certidão Negativa Criminal vigente
- Certidão de Débitos Públicos vigente
- Veículo com vistoria DETRAN para uso didático (conversão de categoria no CRLV: particular → aprendizagem)

**Variação estadual:** Critérios de renovação e fiscalização variam por estado. A plataforma deve manter checklist atualizado por UF e alertar instrutores sobre exigências específicas do DETRAN local.

**Posicionamento regulatório da plataforma:** ViaLivre é intermediadora. Não é CFC, não assume responsabilidade operacional por acidentes. T&C robusto com limitação de responsabilidade civil é requisito pré-lançamento (validação jurídica obrigatória antes do go-live).

### Lacuna Crítica — Seguro

Apólices padrão excluem condutor sem CNH. A lei não define seguro obrigatório para instrução autônoma. **Fase 1 (MVP):** Instrutor declara ter seguro (autodeclaração) e é alertado sobre o gap. **Fase 2:** ViaLivre distribui produto de seguro parametrizado por aula (parceria com seguradora como Thinkseg, Segoo ou similar). Esta é a maior oportunidade de receita adicional identificada.

### Proteção de Dados — LGPD

- Dados de CNH, documentos pessoais e credenciamento tratados como dados sensíveis
- Minimização: plataforma coleta apenas o necessário para compliance e operação
- DPO designado antes do lançamento
- Política de privacidade e termos de uso revisados por especialista LGPD
- Retenção de dados: documentos de compliance por período mínimo legal, dados de pagamento conforme regulação PCI

### Requisitos de Pagamento

- **Escrow:** pagamento do aluno é retido até confirmação de realização da aula
- **Split automático:** quando comissão percentual for implementada, split direto entre plataforma e instrutor
- **Cancelamento:** política definida e exibida antes do pagamento (ex: cancelamento ≥ 24h = reembolso total; < 24h = reembolso parcial)
- **Gateway:** suporte a cartão de crédito, PIX, e boleto. Split exige gateway com funcionalidade Marketplace (Stripe Connect, Iugu, Pagar.me Marketplace)
- **Nota fiscal:** emissão opcional pelo instrutor (pessoa física isenta, orientação sobre limite MEI/autônomo)

### Riscos Mapeados

| Risco | Nível | Mitigação |
|---|---|---|
| Responsabilidade solidária em acidente | Alto | T&C com limitação de responsabilidade; exigir autodeclaração de seguro; Fase 2: seguro integrado |
| Credenciamento falso ou expirado | Médio | Revisão manual no onboarding; verificação periódica; alerta 90 dias antes do vencimento |
| Variação regulatória estadual | Médio | Checklist por UF; equipe de operações acompanha atualizações legislativas |
| LGPD — dados sensíveis | Médio | DPO, minimização de dados, política robusta |
| Plataforma governamental gratuita (concorrência) | Médio-Alto | Diferenciação por confiança, Aprovômetro e conveniência — não só por match |
| Fraude em confirmação de aula | Médio | Confirmação bidirecional (aluno e instrutor confirmam); relatório de disputas |

---

## Inovação e Padrões Novos

### Aprovômetro — Métrica Proprietária de Confiança

Nenhum player existente (nem a plataforma governamental) possui uma métrica de eficiência de aprovação por instrutor. O Aprovômetro é computado automaticamente a partir de dados coletados na plataforma: aluno registra resultado do exame, instrutor confirma, plataforma agrega. A fórmula é simples mas o dado é poderoso: "Esse instrutor aprova seus alunos em 5,8 aulas, em média — baseado em 47 alunos."

**Validação:** O Aprovômetro é automaticamente exibido apenas após 5 aulas concluídas com alunos distintos. Abaixo disso, exibe badge "Novo Instrutor" para não punir instrutores com poucos dados. A métrica é o principal critério de filtragem e ordenação para alunos com decisão baseada em dados.

**Flywheel:** Quanto mais aulas na plataforma, mais preciso o Aprovômetro. Quanto mais preciso, mais alunos confiam. Quanto mais alunos, mais instrutores ingressam. É o motor do crescimento e da barreira competitiva.

### Seguro Parametrizado por Aula

Gap crítico de mercado — nenhum player resolve. ViaLivre pode ser o primeiro a distribuir seguro para instrução particular por aula avulsa. O produto parametrizado elimina a exclusão de apólices padrão. **Fase 2**, mas a arquitetura de pagamento e aula deve prever o hook de ativação de seguro no momento do agendamento.

### Contexto de Mercado

Competidores existentes (Meu Instrutor, Instrutor Legal, TreinaCNH) usam contato via WhatsApp ou listagem simples sem agendamento integrado. ViaLivre é o único com todos os elementos: compliance, agendamento, pagamento, Aprovômetro e brand de alta qualidade. A plataforma governamental resolve o match básico mas não resolve confiança, qualidade ou conveniência operacional.

### Abordagem de Validação

- Aprovômetro: validado pela correlação entre indicador e aprovação real dos alunos (monitorar nos primeiros 1.000 alunos)
- Escrow: testar aceitação por alunos e instrutores antes do launch (user research ou beta)
- Cold start: testar eficácia do badge "Novo Instrutor" na conversão dos primeiros 50 instrutores

---

## Requisitos Específicos do Tipo — Marketplace Two-Sided

### Estrutura do Marketplace

**Dois lados com plataformas distintas:**

- **Aluno (lado demanda):** Web app responsive mobile-first. Descoberta + agendamento + pagamento + histórico. Jornada principal no mobile.
- **Instrutor (lado oferta):** Web app responsive. Onboarding no desktop (upload de documentos). Operação diária (agenda, confirmações) no mobile. Dashboard financeiro no desktop.
- **Administração:** Web app desktop-first para equipe de operações ViaLivre.

### Modelo de Monetização — MVP

**Modelo 1 (MVP inicial):** Mensalidade instrutor (SaaS) — R$ 79–149/mês para acesso à plataforma, agenda e perfil verificado. Baixa fricção operacional para começar.

**Modelo 2 (habilitado no MVP, ativado na Fase 2):** Comissão por aula — 10–15% split sobre o valor da aula. Requer gateway marketplace. Infraestrutura de pagamento deve suportar split desde o início (decisão arquitetural crítica).

**Coexistência:** Instrutor em plano mensal + comissão por aula como mix possível.

### Gestão de Confiança no Marketplace

- Verificação de identidade e documentação no onboarding (ambos os lados)
- Sistema de avaliação bidirecional (aluno avalia instrutor, instrutor avalia aluno)
- Aprovômetro como indicador de qualidade objetiva (não editável pelo instrutor)
- Badge de verificado para instrutores com documentação completa e vigente
- Política de cancelamento clara e aplicada automaticamente (escrow + reembolso)
- Sistema de denúncias e moderação pela equipe de operações

### Descoberta e Match

- Busca geolocalizada por raio (padrão: 10km ajustável)
- Filtros: categoria CNH (A, B), preço (range), Aprovômetro (mínimo de aulas até aprovação), disponibilidade (semana), veículo (modelo, ano), avaliação média
- Ordenação: relevância (padrão) / menor Aprovômetro / menor preço / melhor avaliação
- Mapa interativo com pins de preço (Mapbox GL JS) sincronizado com lista
- Card de instrutor com: foto, nome, Aprovômetro (ou badge Novo), preço/aula, avaliação, veículo

### Agendamento e Calendário

- Instrutor configura disponibilidade por blocos de tempo (ex: seg-sex 7h–18h, exceto 12h–14h)
- Aluno seleciona data/hora dentre slots disponíveis
- Confirmação pelo instrutor (aceitar/recusar com motivo) em até 2h
- Lembrete automático 24h e 1h antes da aula
- Cancelamento pelo aluno ou instrutor com aplicação automática da política

### Gestão Financeira do Instrutor

- Dashboard de receita: mensal, semanal, por aluno
- Histórico de aulas pagas, pendentes e canceladas
- Solicitação de saque: D+2 úteis após aula confirmada
- Conta bancária cadastrada para recebimento (TED/PIX)
- Extrato para declaração de IR (autônomo PF)

---

## Escopo e Faseamento

### Fase 1 — MVP (0–6 meses do lançamento)

**Abordagem:** Plataforma de experiência. Jornada completa sem workaround para alunos e instrutores em mercados piloto. Lançamento em 2–3 cidades com maior densidade de instrutores credenciados (São Paulo, Belo Horizonte, Curitiba como hipótese).

**Time mínimo estimado:** 1 fullstack sênior, 1 frontend, 1 designer, 1 PM (Wmoraes), suporte jurídico e de operações.

**Capacidades do MVP:**

- Busca de instrutores (mapa + lista, geolocalização, filtros básicos)
- Perfil de instrutor completo (Aprovômetro calculado ou badge Novo)
- Onboarding de instrutor com checklist compliance + validação manual
- Agendamento online com confirmação do instrutor
- Pagamento por aula com escrow (cartão + PIX)
- Avaliação bidirecional pós-aula
- Dashboard instrutor (agenda, receita básica, perfil)
- Dashboard aluno (histórico de aulas, próximas aulas)
- Notificações (push + email): confirmação, lembrete, cancelamento
- Painel admin: gestão de instrutores, compliance, moderação básica
- Mensalidade instrutor (cobrança recorrente SaaS)

**Fora do MVP (requisitos de compliance):**

- T&C e política de privacidade revisados por especialista jurídico ✅ (pré-lançamento)
- Processo de validação manual de credenciamento ✅ (operações internas)

### Fase 2 — Crescimento (6–18 meses)

- Seguro parametrizado por aula (parceria + integração)
- Verificação automática SENATRAN (se API disponível)
- Planos/pacotes de aulas com desconto
- Chat instrutor–aluno (contextual à aula)
- Comissão por aula (split automático, gateway marketplace)
- Suporte a categoria Moto (A)
- Expansão nacional completa (todos os estados)
- App nativo iOS/Android (se validado pelo comportamento mobile-first dos usuários)

### Fase 3 — Visão (18+ meses)

- Conteúdo teórico integrado (simulados, vídeo-aulas)
- IA de recomendação de instrutor por perfil do aluno
- Gamificação da jornada do aluno
- Análise preditiva de aprovação
- B2B: micro-redes de instrutores

### Estratégia de Mitigação de Riscos

**Riscos Técnicos:**
- Split de pagamento: usar gateway com suporte nativo a marketplace desde o MVP (Stripe Connect ou Iugu) mesmo que a monetização inicial seja SaaS — evita retrabalho crítico
- Aprovômetro: algoritmo simples (média aritmética ponderada por confirmações) inicialmente; escala para pesos por categoria, dificuldade de região, etc. na Fase 2

**Riscos de Mercado:**
- Plataforma governamental gratuita: diferenciar na camada de confiança, qualidade e conveniência, não no match básico. Usuário que quer segurança paga pelo Aprovômetro e pelo escrow.
- First-mover com UX superior é a janela. Executar bem nos primeiros 6 meses antes de competidores consolidarem.

**Riscos de Recurso:**
- MVP com validação manual de compliance é viável com equipe pequena. Automatização vem na Fase 2.
- Priorizar geografias com maior densidade de instrutores credenciados para maximizar supply no MVP.

---

## Requisitos Funcionais

### Descoberta e Busca

- **FR01:** Aluno pode buscar instrutores por geolocalização (raio configurável de 2–50km a partir da sua localização ou endereço digitado)
- **FR02:** Aluno pode visualizar instrutores em mapa interativo com pins de preço e em lista sincronizada, alternando entre as duas visões
- **FR03:** Aluno pode filtrar instrutores por: categoria CNH (A, B), faixa de preço por aula, Aprovômetro máximo (ex: "até 6 aulas"), disponibilidade na semana, avaliação mínima
- **FR04:** Aluno pode ordenar resultados por: relevância, menor Aprovômetro, menor preço, melhor avaliação
- **FR05:** Aluno pode ver card resumido do instrutor no mapa/lista com: foto, nome, Aprovômetro (ou badge Novo Instrutor), preço por aula, avaliação média, veículo
- **FR06:** Aluno pode acessar perfil completo do instrutor com: bio, Aprovômetro detalhado (com número de amostras), galeria de fotos, detalhes do veículo, avaliações completas, disponibilidade da semana

### Aprovômetro e Confiança

- **FR07:** Sistema calcula Aprovômetro do instrutor automaticamente a partir de aulas confirmadas e resultados de exame reportados, exibido apenas após ≥ 5 alunos distintos com resultado registrado
- **FR08:** Instrutor sem Aprovômetro suficiente recebe badge "Novo Instrutor" exibido de forma clara e honesta no perfil e nos cards de busca
- **FR09:** Aluno pode ver histórico de avaliações recebidas pelo instrutor com comentários e data, sem possibilidade de edição pelo instrutor
- **FR10:** Plataforma exibe badge de verificado para instrutores com documentação completa e vigente

### Agendamento

- **FR11:** Instrutor pode configurar disponibilidade semanal recorrente por blocos de horário (ex: segunda-feira 8h–18h com intervalo 12h–14h)
- **FR12:** Instrutor pode bloquear horários pontuais (férias, compromisso avulso)
- **FR13:** Aluno pode selecionar data, horário e local de encontro (endereço do aluno ou ponto combinado) para agendar aula
- **FR14:** Instrutor recebe notificação de pedido de agendamento e pode aceitar ou recusar com motivo em até 2 horas
- **FR15:** Aluno e instrutor recebem confirmação de agendamento por push notification e email após aceite
- **FR16:** Plataforma envia lembretes automáticos 24h e 1h antes da aula para aluno e instrutor
- **FR17:** Aluno pode cancelar agendamento com aplicação automática da política de cancelamento (reembolso conforme antecedência)
- **FR18:** Instrutor pode cancelar agendamento com motivo, sujeito a penalidade de reputação se recorrente

### Pagamento e Financeiro

- **FR19:** Aluno pode pagar aula por cartão de crédito ou PIX antes da realização, com valor retido em escrow
- **FR20:** Plataforma exibe explicitamente o mecanismo de escrow antes da confirmação de pagamento: "Seu pagamento fica protegido até a aula acontecer"
- **FR21:** Após confirmação bidirecional de realização da aula (aluno e instrutor confirmam), escrow é liberado para o instrutor
- **FR22:** Em caso de cancelamento pelo instrutor, aluno recebe reembolso integral automático
- **FR23:** Em caso de cancelamento pelo aluno com antecedência inferior ao limite da política, reembolso parcial é aplicado conforme regra configurável
- **FR24:** Instrutor pode solicitar saque do saldo disponível, recebendo em D+2 úteis via PIX ou TED
- **FR25:** Instrutor acessa extrato detalhado de aulas pagas, pendentes, canceladas e saques realizados
- **FR26:** Plataforma cobra mensalidade recorrente do instrutor (plano SaaS) com cobrança automática no cartão cadastrado

### Onboarding — Instrutor

- **FR27:** Instrutor pode iniciar cadastro e ver checklist completo de documentação necessária com status de cada item (pendente, enviado, aprovado, rejeitado)
- **FR28:** Instrutor pode fazer upload de documentos (CNH, credenciamento SENATRAN, certidões, CRLV do veículo) diretamente na plataforma
- **FR29:** Equipe de operações pode revisar documentos enviados e aprovar, rejeitar com motivo ou solicitar reenvio via painel admin
- **FR30:** Instrutor é notificado sobre status de cada documento (aprovado, rejeitado, reenvio solicitado) com prazo
- **FR31:** Plataforma alerta instrutor 90, 60 e 30 dias antes do vencimento de documentos com prazo de validade (credenciamento, certidões)
- **FR32:** Perfil de instrutor é pausado automaticamente se documentação obrigatória expirar sem renovação, com notificação clara

### Gestão de Perfil — Instrutor

- **FR33:** Instrutor pode configurar preço por aula, áreas/bairros de atuação, bio, foto de perfil e vídeo de apresentação curto
- **FR34:** Instrutor pode cadastrar um ou mais veículos com: placa, modelo, ano, foto e upload do CRLV com vistoria DETRAN
- **FR35:** Instrutor pode definir área geográfica de atuação (raio ou lista de bairros/cidades)

### Dashboard — Instrutor

- **FR36:** Instrutor acessa dashboard com: próximas aulas, receita do mês, histórico de aulas, avaliação média e Aprovômetro atual
- **FR37:** Instrutor vê agenda visual semanal/mensal com aulas confirmadas, pendentes e bloqueios

### Dashboard — Aluno

- **FR38:** Aluno acessa histórico de aulas realizadas, próximas aulas agendadas e avaliações dadas e recebidas
- **FR39:** Aluno pode ver status do seu progresso de habilitação (aulas realizadas, resultado de exames registrados)

### Avaliações

- **FR40:** Após confirmação de realização da aula, aluno pode avaliar instrutor com nota (1–5 estrelas) e comentário de texto livre
- **FR41:** Após confirmação de realização da aula, instrutor pode avaliar aluno com nota (1–5) e comentário (visível apenas para outros instrutores)
- **FR42:** Aluno e instrutor podem reportar resultado do exame prático (aprovado/reprovado) para atualização do Aprovômetro
- **FR43:** Avaliações publicadas não podem ser editadas ou removidas pelo avaliado; apenas equipe de operações pode moderar por violação de política

### Notificações

- **FR44:** Plataforma envia notificações por push (web) e email nos eventos: agendamento solicitado, aceite, cancelamento, lembrete (24h e 1h), confirmação de aula realizada, pagamento liberado, documento prestes a vencer

### Painel de Administração

- **FR45:** Equipe ViaLivre pode ver lista de instrutores com status de compliance (documentação completa, parcial, expirada), filtrar por estado e status
- **FR46:** Equipe ViaLivre pode revisar e aprovar/rejeitar documentos de onboarding de instrutores
- **FR47:** Equipe ViaLivre pode suspender ou reativar perfil de instrutor com motivo registrado e notificação ao instrutor
- **FR48:** Equipe ViaLivre pode receber e gerenciar denúncias de alunos e instrutores com histórico de ações tomadas
- **FR49:** Equipe ViaLivre pode ver métricas operacionais: aulas realizadas, instrutores ativos, GMV, NPS (dashboard básico)
- **FR50:** Equipe ViaLivre pode editar checklist de documentação por estado (adaptação à variação regulatória estadual)

---

## Requisitos Não-Funcionais

### Performance

- Páginas de busca (mapa + lista) carregam e renderizam resultados em < 2 segundos em conexão 4G (medido pelo P95 dos usuários)
- Confirmação de pagamento processada e exibida ao usuário em < 5 segundos
- API de disponibilidade do instrutor responde em < 500ms para suportar calendário interativo sem latência perceptível
- Mapa (Mapbox GL JS) renderiza pins de preço para até 200 instrutores sem degradação de performance no dispositivo
- Build do front-end otimizado para First Contentful Paint < 1,5s em conexão 4G

### Segurança

- Todos os dados em trânsito criptografados via TLS 1.3
- Dados de documentos de compliance (CNH, certidões) armazenados com criptografia em repouso (AES-256 ou equivalente)
- Dados de pagamento nunca armazenados localmente — tokenização via gateway PCI-DSS nível 1
- Autenticação com tokens de sessão com expiração configurável (máximo 30 dias com renovação)
- Senhas armazenadas com bcrypt (custo mínimo 12) ou argon2id
- Rate limiting em endpoints de autenticação, busca e pagamento
- Logs de auditoria para ações de compliance e moderação (quem fez o quê, quando)
- OWASP Top 10 contemplado no desenvolvimento: SQL injection, XSS, CSRF, broken access control

### Escalabilidade

- Arquitetura suporta crescimento de 10x de usuários simultâneos sem alteração de infraestrutura principal (ex: busca de 100 para 1.000 usuários simultâneos)
- Estratégia de caching para resultados de busca geolocalizada (invalidação por área quando novo instrutor é publicado)
- Banco de dados com capacidade de escalar reads horizontalmente (réplicas) à medida que a base de instrutores cresce

### Acessibilidade

- Conformidade com WCAG 2.1 nível AA em todas as páginas voltadas ao usuário (aluno e instrutor)
- Exigido por lei brasileira LBI (Lei Brasileira de Inclusão) para serviços digitais ao público
- Requisitos específicos: navegação por teclado completa, contraste mínimo 4,5:1, textos alternativos em imagens funcionais, rótulos em todos os campos de formulário, feedback de erro acessível (não só por cor)
- Fontes com tamanho mínimo 16px no corpo do texto; suporte a zoom do sistema operacional até 200%
- Testes de acessibilidade com leitor de tela (VoiceOver/NVDA) nos fluxos críticos: busca, agendamento, pagamento

### Confiabilidade

- Disponibilidade da plataforma ≥ 99,5% medida mensalmente (downtime máximo ~3,6h/mês)
- Política de retry automático para falhas de pagamento transitórias (máximo 3 tentativas com backoff)
- Backups automáticos diários do banco de dados com retenção mínima de 30 dias
- Plano de disaster recovery documentado com RTO (Recovery Time Objective) < 4h

### Integração

- **Gateway de pagamento:** API com suporte a split marketplace, escrow lógico, cartão de crédito, PIX e cobrança recorrente (Stripe Connect, Iugu ou Pagar.me Marketplace)
- **Mapas:** Mapbox GL JS para mapa interativo com pins de preço; Geocoding para conversão de endereço em coordenadas
- **Email transacional:** Sendgrid ou similar para notificações de email (confirmação, lembrete, vencimento)
- **Push notifications:** Web Push API (compatível com Chrome, Firefox, Safari 16.4+) para notificações no browser
- **Upload de documentos:** armazenamento seguro em objeto storage (S3 ou equivalente) com URLs assinadas e expiração
- **SENATRAN (Fase 2):** integração com API de consulta de credenciamento de instrutores quando disponível publicamente
- **Seguradora (Fase 2):** API para ativação de seguro parametrizado por aula no momento do agendamento

---

## Decisões de Design de UX (Referência)

Conforme especificado em `ux-design-specification.md`:

- **Sistema de design:** shadcn/ui + Tailwind CSS v4 com tokens OKLCH
- **Verde primário** `oklch(55% 0.17 145)` — usado EXCLUSIVAMENTE em: CTAs, tag Aprovômetro, badge verificado
- **Fundo:** branco puro `oklch(100% 0 0)` — sem fundos escuros ou coloridos
- **Tipografia:** Instrument Serif (headlines em itálico) + Plus Jakarta Sans (UI/corpo) + JetBrains Mono (valores numéricos do Aprovômetro)
- **Grid:** 8px base, 4 colunas mobile / 12 colunas desktop
- **Componentes-chave:** AprovometroTag, InstructorCard, MapView (Mapbox), AvailabilityCalendar, EscrowPaymentFlow, ComplianceChecklist, DocumentUploadZone
- **Padrão de descoberta:** mapa + lista sincronizados (Airbnb-style), toggle mobile
- **Referência visual:** Airbnb — limpo, branco, confiante, verde apenas como acento

---

*Este PRD é o contrato de capacidades do ViaLivre. Todo trabalho de UX, arquitetura e desenvolvimento deve ser rastreável aos requisitos funcionais e não-funcionais aqui definidos. Atualize este documento à medida que o produto evolui.*
