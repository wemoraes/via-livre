# ViaLivre — Pesquisa de Domínio Legal

**Data:** 2026-05-12  
**Status:** Rascunho inicial — requer validação com especialista jurídico em trânsito  
**Fontes:** DETRAN/PR, Agência Brasil, Migalhas, Portal do Trânsito, gov.br/transportes

---

## Base Legal

**Resolução CONTRAN nº 1.020/2025** (publicada dez/2025) é o marco regulatório que elimina a obrigatoriedade de matrícula em CFC. Coordenada pela SENATRAN, implementada pelos DETRANs estaduais.

**Impacto no custo:**
- Antes: R$ 2.500–5.000 (CFC obrigatório)
- Depois: R$ 400–800 (instrutor autônomo + taxas DETRAN)
- Aulas teóricas: app gratuito "CNH do Brasil"
- Mínimo de aulas práticas reduzido para **2 horas**

---

## Requisitos do Instrutor Autônomo ✓

| Requisito | Detalhe |
|-----------|---------|
| Idade | Mínimo 21 anos |
| Escolaridade | Ensino Médio completo |
| CNH | Habilitado há ≥ 2 anos, sem infrações gravíssimas nos últimos 60 dias |
| Histórico | Sem cassação de CNH |
| Certificação | Curso de Instrutor de Trânsito + CNH com anotação **EAR** |
| Antecedentes | Certidão Negativa Criminal + Certidão de Débitos Públicos |
| Credenciamento | Gratuito via plataforma online da SENATRAN |

**Lacuna:** Critérios de renovação anual e padrões de fiscalização estadual ainda em definição.

---

## Requisitos do Veículo ⚠

| Requisito | Status |
|-----------|--------|
| Vistoria DETRAN para uso didático | ✓ Obrigatória |
| Veículo próprio permitido | ✓ Confirmado (mudança significativa em relação ao modelo CFC) |
| Duplo comando | **NÃO obrigatório** (apenas recomendado) — mudança importante |
| Conversão no CRLV | Categoria "particular" → "aprendizagem" — processo estadual varia |

**Lacuna crítica — SEGURO:** A maioria das apólices de seguro automotivo padrão **exclui cobertura** para condutor sem CNH. A lei não define seguro específico obrigatório. Mercado de seguros parametrizados para instrutores autônomos está em formação.

---

## Responsabilidade Civil ⚠

| Parte | Responsabilidade |
|-------|-----------------|
| Instrutor | Civil por negligência/imprudência |
| Proprietário do veículo | Pessoal por danos (sem cobertura padrão) |
| Candidato | Por infrações cometidas durante a aula |
| Plataforma | Intermediadora — não assume responsabilidade operacional na lei atual |

**Status jurídico:** Jurisprudência ainda em desenvolvimento. Lei silencia sobre vários pontos.

---

## Processo do Candidato ✓

1. Aulas teóricas via app CNH do Brasil (gratuito)
2. Mínimo 2h de aula prática com instrutor credenciado (autônomo ou CFC)
3. Exame prático no DETRAN — mantido, sem alteração
4. Processo estadual de emissão da CNH — sem alteração

---

## Riscos para a Plataforma

| Risco | Nível | Mitigação Recomendada |
|-------|-------|----------------------|
| Responsabilidade solidária em acidentes | ⚠ Alto | T&C robusto limitando responsabilidade; exigir seguro do instrutor |
| Variação regulatória estadual | ⚠ Médio | Checklist de credenciamento por estado; atualização contínua |
| LGPD — dados de instrutores e alunos | ⚠ Médio | DPO, política de privacidade, minimização de dados |
| Lacuna de seguro (nenhuma apólice cobre) | 🔴 Crítico | Parceria com seguradora para produto parametrizado; ou exigir seguro específico como requisito de onboarding |
| Credenciamento falso/expirado | ⚠ Médio | Verificação periódica na SENATRAN; webhook de status se disponível |

---

## Oportunidades Identificadas

1. **Seguro parametrizado por aula** — gap crítico no mercado. ViaLivre pode virar distribuidor de seguro por aula (ex: parceria com Segoo, Thinkseg, ou seguradora direta).
2. **Verificação de credenciamento** — consulta automatizada à SENATRAN via API (verificar se existe) agrega valor enorme e reduz risco.
3. **First-mover** — não há marketplace nativo para este mercado ainda.
4. **Volume potencial** — ~1,5M candidatos/ano. Redução de custo de 70-80% deve aumentar a demanda total.

---

## Próximas Investigações Necessárias

- [ ] Confirmar se SENATRAN disponibiliza API pública de consulta de credenciamento
- [ ] Mapear variações estaduais de implementação (SP, RJ, MG, RS pelo menos)
- [ ] Consultar advogado especializado em direito de trânsito para T&C e responsabilidade
- [ ] Pesquisar seguradoras com produto para instrutor autônomo ou dispostas a criar
- [ ] Verificar se o app "CNH do Brasil" tem API/parceria possível para conteúdo teórico

---

*Requer validação jurídica antes de uso em decisões de produto ou arquitetura.*
