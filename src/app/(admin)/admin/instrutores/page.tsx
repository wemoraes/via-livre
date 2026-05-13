import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listInstructors } from "@/actions/admin";
import { InstructorStatus } from "@prisma/client";
import { INSTRUCTOR_STATUS_LABEL, INSTRUCTOR_STATUS_STYLE } from "@/lib/status-colors";
import SuspendButton from "./SuspendButton";

export default async function AdminInstructoresPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/entrar");

  const result = await listInstructors();
  if (!result.success) redirect("/entrar");

  const instructors = result.data;

  return (
    <main
      className="min-h-screen py-10 px-4"
      style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}
    >
      <div aria-hidden className="vl-mesh" />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8" style={{ color: "var(--vl-text-1)" }}>Instrutores</h1>

        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ borderBottom: "1px solid rgba(13,18,16,0.08)" }}>
              <tr>
                {["Nome", "Cidade", "Status", "Aprovômetro", "Rating", ""].map((h) => (
                  <th key={h} className={`text-left px-4 py-3 text-xs font-medium ${!h ? "w-24" : ""}`} style={{ color: "var(--vl-text-3)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {instructors.map((inst) => (
                <tr key={inst.id} style={{ borderBottom: "1px solid rgba(13,18,16,0.04)" }} className="hover:bg-white/30 transition-colors">
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--vl-text-1)" }}>{inst.name}</td>
                  <td className="px-4 py-3" style={{ color: "var(--vl-text-3)" }}>
                    {[inst.city, inst.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        color: INSTRUCTOR_STATUS_STYLE[inst.status as InstructorStatus].color,
                        background: INSTRUCTOR_STATUS_STYLE[inst.status as InstructorStatus].bg,
                      }}
                    >
                      {INSTRUCTOR_STATUS_LABEL[inst.status as InstructorStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--vl-text-2)" }}>
                    {inst.aprovometro !== null ? `${inst.aprovometro} aulas` : "—"}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--vl-text-2)" }}>
                    {inst.avgRating !== null ? `${inst.avgRating} ★` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <SuspendButton instructorId={inst.id} currentStatus={inst.status as InstructorStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {instructors.length === 0 && (
            <p className="text-center py-12 text-sm" style={{ color: "var(--vl-text-3)" }}>
              Nenhum instrutor encontrado.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
