# Code Review: story-epic-8.1e-student-profile

- **Reviewer:** Amelia (Senior Software Engineer)
- **Story:** [story-epic-8.1e-student-profile.md](story-epic-8.1e-student-profile.md)
- **Data:** 2026-05-13
- **Status:** APPROVED com follow-ups

## Sumário

Substitui o placeholder de `/aluno/perfil` por perfil editável completo: avatar via Supabase signed URL, nome, telefone, cidade, estado. Server Action `updateStudentProfile` com validação Zod + transaction Prisma cobrindo `User` + `StudentProfile` em uma operação atômica.

## Conformidade com ACs

| AC | Status | Nota |
|----|--------|------|
| AC1 — SSR com dados atuais | ✅ | `getStudentProfileData(userId)` faz select aninhado User + StudentProfile. Server component carrega tudo. |
| AC2 — Formulário editável + validação | ✅ | Modo leitura → "Editar" → form com `vl-input` + validação Zod no servidor. Inline error com cor de erro. |
| AC3 — Upload avatar via signed URL | ✅ | Client chama `getSignedStudentAvatarUploadUrl({ext})` → PUT direto no Supabase → `persistStudentAvatar(path)` salva signed read URL (TTL 1 ano) em `User.image`. Preview imediato. |
| AC4 — Erro defensivo | ✅ | `ActionResult<T>.err()` retorna mensagem do Zod (1º issue) ou erro de storage. Form não reseta em falha. |
| AC5 — Avatar fallback contextual | ✅ | Inicial do primeiro nome em círculo accent. Texto do botão muda entre "Adicionar foto" e "Trocar foto" baseado em estado. |
| AC6 — `updateStudentProfile` server action | ✅ | Validação Zod: name 2-100, phone regex `^\d{10,15}$` após sanitize, city max 80, state UF 2 chars uppercase. Transaction Prisma. |

## Decisões técnicas

- **Bucket compartilhado com docs de compliance:** evita criar bucket novo só para avatar. Usa prefix `avatars/${userId}/` para isolar logicamente. Signed read URL com TTL 31_536_000s (1 ano).
- **`unoptimized` no `<Image>`:** signed URLs do Supabase têm query string com assinatura. O image optimizer do Next reescreve a URL e quebra a assinatura. `unoptimized` evita isso.
- **Validação Zod com `.refine()` para phone:** sanitiza com `.replace(/\D/g, "")` antes do regex — usuário pode digitar com máscara, sistema persiste só dígitos.
- **`state.toUpperCase()` no Zod E no client onChange:** experiência consistente. Usuário digita "sp" e vira "SP" automaticamente.
- **Transaction Prisma cobre User.name + StudentProfile upsert:** atomicidade garantida; se um falhar, o outro reverte.
- **`persistStudentAvatar` valida prefix do path:** `if (!storagePath.startsWith(\`avatars/${userId}/\`)) return err(...)`. Impede um aluno injetar caminho de outro user.
- **Sem `useSession().update()` após salvar nome:** próximo SSR refaz a query. Aceito o gap pequeno na nav header (1 navegação para refrescar). Mitigação futura: emitir evento client + refresh router.
- **Form em modo leitura por default:** evita edits acidentais. Pattern usado também no instructor profile.

## Pontos fortes

- **Single source of truth no schema:** `StudentProfile` ganhou um cliente real. Antes era criado vazio no cadastro e nunca tocado.
- **Server-first:** página é server component, queries fazem em uma round-trip via prisma select aninhado.
- **Security boundary:** action valida role STUDENT antes de qualquer operação. Path validation no `persistStudentAvatar` previne IDOR.
- **Resiliência a dados parciais:** `studentProfile?.phone ?? ""`, fallback "—" em modo leitura. Nenhum crash em conta nova.
- **Componentes isolados por responsabilidade:** `AvatarUpload` cuida só de upload, `ProfileForm` só de campos. Página orquestra.

## Pontos de atenção

- **A1 — Avatar TTL de 1 ano expira eventualmente.** Aceitável para MVP. Fix definitivo: criar bucket `avatars` público + URL direta (sem assinatura) + cache headers. Anotar em follow-up.
- **A2 — Header do aluno (`StudentHeader`) não atualiza imediatamente após mudar nome ou avatar.** Próximo SSR refaz. Pra UX perfeita: `router.refresh()` após salvar.
- **A3 — Sem indicação visual de "tentativa anterior salva".** `savedAt` é apenas state, perde no reload. Aceitável: pessoa que recarrega vê o estado salvo via leitura.
- **A4 — Telefone aceita formato livre.** Sanitiza para dígitos só na persistência. Não tem máscara visual no UI (custaria importar react-input-mask ou similar). Aceitável.
- **A5 — Sem upload progress bar.** Tem só spinner. Para arquivos pequenos (até 5MB), spinner basta.
- **A6 — Não há `redirect` after `getStudentProfileData` failure.** Se o usuário tem role STUDENT mas sem User row (caso impossível dado layout guard), crash. Boundary improvável; layout já filtra.

## Métricas

- Build: ✅ 30 páginas (mesma contagem; `/aluno/perfil` já existia como placeholder), zero erros TypeScript, 4.0s compile + 3.7s TS
- Audit BMAD: ✅ Story 8.1 segue DONE
- Componentes novos: 2 (`AvatarUpload`, `ProfileForm`)
- Server file novo: 1 (`getStudentProfileData`)
- Actions novas: 3 (`updateStudentProfile`, `getSignedStudentAvatarUploadUrl`, `persistStudentAvatar`)
- Storage helpers novos: 2 (`getSignedAvatarUploadUrl`, `getAvatarReadUrl`)
- Linhas: ~370

## Follow-ups

1. **Story 8.1d (Histórico):** preenche `/aluno/historico` com timeline + rating prompt proativo. Essa é a próxima.
2. **Story 8.1c (Aprovômetro pessoal):** ainda precisa decisão "instrutor principal". Recomendo `bmad-correct-course` antes.
3. **Migração futura: bucket `avatars` público** para eliminar TTL e simplificar URLs.
4. **`router.refresh()` após save** para sincronizar header em tempo real.
5. **Máscara de telefone no client** (pequeno polish).

## Decisão

**APPROVED.** O `"visualizar perfil, avatar, editar"` que o Willians listou como gap está agora coberto. Push aciona deploy automático.
