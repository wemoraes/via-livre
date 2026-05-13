import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "ViaLivre <noreply@vialivreapp.com.br>";

interface LessonEmailData {
  to: string;
  name: string;
  instructorName?: string;
  studentName?: string;
  scheduledAt: string;
  meetingPoint?: string;
  priceAmount?: number;
  lessonId: string;
}

interface DocumentEmailData {
  to: string;
  name: string;
  documentType: string;
  reason?: string;
  daysLeft?: number;
  expiresAt?: string;
}

export async function sendLessonBookedEmail(data: LessonEmailData) {
  const date = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(data.scheduledAt));

  await resend.emails.send({
    from: FROM,
    to: data.to,
    subject: "Aula confirmada — ViaLivre",
    html: `
      <h2>Olá, ${data.name}!</h2>
      <p>Sua aula foi agendada com sucesso.</p>
      <ul>
        <li><strong>Instrutor:</strong> ${data.instructorName ?? "-"}</li>
        <li><strong>Data:</strong> ${date}</li>
        <li><strong>Ponto de encontro:</strong> ${data.meetingPoint ?? "-"}</li>
        ${data.priceAmount ? `<li><strong>Valor:</strong> R$ ${data.priceAmount.toFixed(2)}</li>` : ""}
      </ul>
      <p><a href="${process.env.AUTH_URL}/aulas/${data.lessonId}">Ver detalhes da aula</a></p>
    `,
  });
}

export async function sendLessonCancelledEmail(data: { to: string; name: string; lessonId: string; reason?: string }) {
  await resend.emails.send({
    from: FROM,
    to: data.to,
    subject: "Aula cancelada — ViaLivre",
    html: `
      <h2>Olá, ${data.name}!</h2>
      <p>Infelizmente sua aula foi cancelada.</p>
      ${data.reason ? `<p><strong>Motivo:</strong> ${data.reason}</p>` : ""}
      <p>Se o pagamento já foi processado, o reembolso será realizado em até 5 dias úteis.</p>
      <p><a href="${process.env.AUTH_URL}/instrutores">Buscar novos horários</a></p>
    `,
  });
}

export async function sendDocumentReviewedEmail(data: DocumentEmailData & { approved: boolean }) {
  const status = data.approved ? "aprovado" : "reprovado";
  await resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Documento ${status} — ViaLivre`,
    html: `
      <h2>Olá, ${data.name}!</h2>
      <p>Seu documento <strong>${data.documentType}</strong> foi <strong>${status}</strong>.</p>
      ${!data.approved && data.reason ? `<p><strong>Motivo da reprovação:</strong> ${data.reason}</p>` : ""}
      <p><a href="${process.env.AUTH_URL}/instructor/onboarding">Acessar painel de onboarding</a></p>
    `,
  });
}

export async function sendDocumentExpiringEmail(data: DocumentEmailData) {
  await resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Documento vencendo em ${data.daysLeft} dias — ViaLivre`,
    html: `
      <h2>Atenção, ${data.name}!</h2>
      <p>Seu documento <strong>${data.documentType}</strong> vence em <strong>${data.daysLeft} dias</strong>.</p>
      ${data.expiresAt ? `<p>Data de vencimento: ${new Intl.DateTimeFormat("pt-BR").format(new Date(data.expiresAt))}</p>` : ""}
      <p>Renove-o antes do prazo para manter seu perfil ativo.</p>
      <p><a href="${process.env.AUTH_URL}/instructor/onboarding">Atualizar documentos</a></p>
    `,
  });
}
