import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { listInstructors } from "@/actions/admin";
import { InstructorStatus } from "@prisma/client";
import SuspendButton from "./SuspendButton";

const STATUS_LABEL: Record<InstructorStatus, string> = {
  PENDING: "Pendente",
  UNDER_REVIEW: "Em revisão",
  ACTIVE: "Ativo",
  SUSPENDED: "Suspenso",
  INACTIVE: "Inativo",
};

const STATUS_COLOR: Record<InstructorStatus, string> = {
  PENDING: "text-yellow-700 bg-yellow-50",
  UNDER_REVIEW: "text-blue-700 bg-blue-50",
  ACTIVE: "text-green-700 bg-green-50",
  SUSPENDED: "text-red-700 bg-red-50",
  INACTIVE: "text-gray-700 bg-gray-50",
};

export default async function AdminInstructoresPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/entrar");

  const result = await listInstructors();
  if (!result.success) redirect("/entrar");

  const instructors = result.data;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Instrutores</h1>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Nome</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Cidade</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Aprovômetro</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Rating</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {instructors.map((inst) => (
                <tr key={inst.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{inst.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {[inst.city, inst.state].filter(Boolean).join(", ") || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[inst.status as InstructorStatus]}`}>
                      {STATUS_LABEL[inst.status as InstructorStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {inst.aprovometro !== null ? `${inst.aprovometro} aulas` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {inst.avgRating !== null ? `${inst.avgRating} ★` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <SuspendButton
                      instructorId={inst.id}
                      currentStatus={inst.status as InstructorStatus}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {instructors.length === 0 && (
            <p className="text-center py-12 text-sm text-gray-400">Nenhum instrutor encontrado.</p>
          )}
        </div>
      </div>
    </main>
  );
}
