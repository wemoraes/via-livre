# Story 8.1e — Perfil editável do aluno (nome, contato, avatar)

- **ID:** story-epic-8.1e-student-profile
- **Epic:** 8 — Dashboards de Aluno e Instrutor
- **Parent Story (PRD):** Story 8.1 — Dashboard do Aluno (e implícito FR38, FR39 sobre dados visíveis ao aluno)
- **Sub-story scope:** preenche `/aluno/perfil` (placeholder da 8.1a) com formulário editável (nome, telefone, cidade, estado) + upload de avatar. Pula perf budget Lighthouse — fica para Story 8.1f.
- **Personas:** Amelia (Dev)
- **Status:** In progress

## Contexto

Em 2026-05-13 o Project Lead (Willians) listou explicitamente "visualizar perfil, avatar, editar" entre os gaps do painel do aluno. A rota `/aluno/perfil` ficou como placeholder na Story 8.1a. Esta story entrega a edição funcional. Avatar usa pattern signed URL do Supabase Storage (já estabelecido nos documentos de compliance).

## Acceptance Criteria

### AC1 — Página `/aluno/perfil` renderiza dados atuais via SSR

- **Given** o aluno autenticado acessa `/aluno/perfil`
- **When** a página carrega
- **Then** exibe (em modo de leitura inicial):
  - avatar (foto ou inicial em círculo accent)
  - nome do aluno
  - email (read-only)
  - telefone, cidade, estado (do `StudentProfile`)
- **And** os dados vêm de uma server function `getStudentProfileData(userId)`

### AC2 — Formulário editável com validação

- **Given** o aluno está em `/aluno/perfil`
- **When** clica em "Editar"
- **Then** os campos `nome`, `telefone`, `cidade`, `estado` viram editáveis (input/select)
- **And** o email continua disabled (não pode editar sem reset flow)
- **And** validação Zod no servidor: nome 2-100 chars, telefone opcional (10-15 dígitos), cidade max 80, estado UF de 2 chars
- **And** errors de validação inline próximos ao campo
- **And** botão "Salvar" desabilitado enquanto request está em flight
- **And** ao salvar com sucesso, exibe feedback "Perfil atualizado" via toast/inline e volta pro modo leitura

### AC3 — Upload de avatar via signed URL

- **Given** o aluno está em `/aluno/perfil`
- **When** clica em "Trocar foto"
- **Then** abre um file picker aceitando jpg/jpeg/png/webp até 5MB
- **And** ao selecionar arquivo, o client chama `getSignedAvatarUploadUrl()` para obter URL signed
- **And** faz PUT direto para Supabase Storage (não passa pelo servidor Next)
- **And** após upload bem-sucedido, chama `persistAvatar(path)` que atualiza `User.image` com signed read URL (TTL 1 ano)
- **And** a tela mostra preview imediato do novo avatar
- **And** o header (`StudentHeader`) reflete a mudança ao próximo navegar (ok aceitar refetch)

### AC4 — Feedback de erro defensivo

- **Given** qualquer chamada à Server Action retorna `ActionResult<T>` `err()`
- **When** o cliente recebe o erro
- **Then** exibe inline com cor de erro (oklch 50% 0.15 25)
- **And** mantém os dados digitados (não reseta o form)

### AC5 — UX: status visual claro

- **Given** o avatar não foi setado
- **When** renderiza
- **Then** exibe inicial do primeiro nome em círculo accent (mesmo pattern do StudentHeader)
- **And** botão "Adicionar foto" tem texto claro (não "Trocar")

### AC6 — Server Action `updateStudentProfile`

- **Validação:**
  - `name`: string, 2-100 chars, trim
  - `phone`: string opcional, 10-15 dígitos (regex `/^\d{10,15}$/`)
  - `city`: string opcional, max 80 chars
  - `state`: string opcional, exatamente 2 chars UF (regex `/^[A-Z]{2}$/`)
- **Persistência:**
  - `User.name` (transação)
  - `StudentProfile.phone/city/state` (upsert; cria se não houver)
- **Retorno:** `ActionResult<{ updatedAt: Date }>`

## Files affected

### Novos
- `src/actions/student.ts` — `updateStudentProfile`, `getSignedAvatarUploadUrl`, `persistAvatar`
- `src/app/(student)/aluno/perfil/_components/ProfileForm.tsx` — client component (formulário)
- `src/app/(student)/aluno/perfil/_components/AvatarUpload.tsx` — client component (upload)
- `src/app/(student)/aluno/perfil/_data/profile.ts` — `getStudentProfileData(userId)`

### Modificados
- `src/app/(student)/aluno/perfil/page.tsx` — substitui placeholder
- `src/lib/storage.ts` — adicionar `getSignedAvatarUploadUrl(userId, ext)` (bucket público ou compartilhado)

## Test plan

- ✅ Build: `npx next build` zero erros
- ✅ Audit: `npm run audit:bmad:debt` exit 0
- ⏳ Smoke manual:
  - Login `aluno@teste.vialivre` → `/aluno/perfil` → ver dados Maria (nome vazio se default seed) → editar → salvar → ver feedback → recarregar → persistiu
  - Upload de avatar com JPG válido → ver preview → header reflete na navegação
  - Tentar telefone com letras → erro Zod inline
  - Tentar estado "ABC" → erro Zod inline
- ⏳ Validação manual de tipo de arquivo no client (rejeita .pdf, .exe)

## Risks

- **R1:** bucket Supabase é privado por default (`compliance-documents`). Para avatar funcionar com URL longa, vamos usar o mesmo bucket + signed read URL com TTL de 1 ano. Acceptable temp solution; quando criarmos bucket público `avatars`, fica mais simples (URL direta).
- **R2:** ao atualizar `User.name`, o `next-auth` JWT pode ficar stale (sessão ainda mostra nome antigo) até logout/login. Mitigação: usar `useSession().update()` no client após sucesso. Ou aceitar pequeno gap (próximo navegar refaz SSR e nome atualiza).
- **R3:** signed read URL com TTL de 1 ano expira em 1 ano. Aceitável para MVP. Fix definitivo: bucket público + URL direta + cache headers.

## Definition of Done

- [ ] AC1: dados atuais via SSR
- [ ] AC2: form editável + validação Zod
- [ ] AC3: upload avatar via signed URL
- [ ] AC4: feedback de erro
- [ ] AC5: avatar fallback + texto contextual
- [ ] AC6: `updateStudentProfile` server action
- [ ] Build + audit ok
- [ ] CR escrito
- [ ] Commit + push
