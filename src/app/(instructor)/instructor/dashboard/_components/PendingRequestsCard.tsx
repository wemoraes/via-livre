import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { formatCompactDateTime } from "@/lib/datetime";
import type { PendingRequestItem } from "../_data/dashboard";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

interface Props {
  requests: PendingRequestItem[];
}

export default function PendingRequestsCard({ requests }: Props) {
  if (requests.length === 0) return null;

  return (
    <section
      className="glass-card rounded-2xl p-5 mb-6"
      style={{ boxShadow: "0 0 0 2px oklch(55% 0.12 85 / 0.20)" }}
    >
      <header className="flex items-center gap-2 mb-3">
        <span
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: "oklch(96% 0.04 85)", color: "oklch(55% 0.12 85)" }}
        >
          <Clock size={15} />
        </span>
        <h3 className="text-sm font-semibold" style={{ color: "var(--vl-text-1)" }}>
          {requests.length} pedido{requests.length !== 1 ? "s" : ""} aguardando sua confirmação
        </h3>
      </header>

      <ul className="space-y-2">
        {requests.map((req) => (
          <li key={req.id}>
            <Link
              href={`/instructor/aulas/${req.id}`}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/40 transition-colors"
              style={{ background: "rgba(255,255,255,0.55)", textDecoration: "none" }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: "var(--vl-text-1)" }}>
                  {req.studentName}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>
                  {formatCompactDateTime(req.scheduledAt)} · {brl.format(req.netAmount)} líquido
                </p>
              </div>
              <ChevronRight size={15} style={{ color: "var(--vl-text-3)" }} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
