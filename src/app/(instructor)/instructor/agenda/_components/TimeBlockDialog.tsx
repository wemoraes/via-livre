"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2, Check } from "lucide-react";
import { createTimeBlock, removeTimeBlock } from "@/actions/availability";

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
});

const timeFmt = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

interface CreateProps {
  mode: "create";
  startsAt: Date;
  endsAt: Date;
  onClose: () => void;
}

interface RemoveProps {
  mode: "remove";
  blockId: string;
  startsAt: Date;
  endsAt: Date;
  reason: string | null;
  onClose: () => void;
}

type Props = CreateProps | RemoveProps;

export default function TimeBlockDialog(props: Props) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") props.onClose();
    }
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [props]);

  function handleCreate() {
    if (props.mode !== "create") return;
    setError(null);
    startTransition(async () => {
      const result = await createTimeBlock({
        startsAt: props.startsAt.toISOString(),
        endsAt: props.endsAt.toISOString(),
        reason: reason || undefined,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      props.onClose();
      router.refresh();
    });
  }

  function handleRemove() {
    if (props.mode !== "remove") return;
    setError(null);
    startTransition(async () => {
      const result = await removeTimeBlock(props.blockId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      props.onClose();
      router.refresh();
    });
  }

  const dayLabel = dateFmt.format(props.startsAt);
  const timeLabel = `${timeFmt.format(props.startsAt)} – ${timeFmt.format(props.endsAt)}`;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={props.onClose}
        style={{ background: "rgba(13,18,16,0.20)" }}
        aria-hidden
      />
      <div
        role="dialog"
        aria-label="Bloquear horário"
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(420px,calc(100vw-2rem))] rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 18px 50px rgba(13,18,16,0.18)",
        }}
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-semibold leading-tight" style={{ color: "var(--vl-text-1)" }}>
                {props.mode === "create" ? "Bloquear horário" : "Bloqueio"}
              </h3>
              <p className="text-sm mt-1" style={{ color: "var(--vl-text-2)" }}>
                {dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1)} · {timeLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={props.onClose}
              aria-label="Fechar"
              className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-black/[0.04]"
              style={{ color: "var(--vl-text-3)" }}
            >
              <X size={16} />
            </button>
          </div>

          {props.mode === "create" ? (
            <>
              <label htmlFor="reason" className="block text-xs font-medium mb-1.5" style={{ color: "var(--vl-text-3)" }}>
                Motivo (opcional)
              </label>
              <input
                id="reason"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={80}
                placeholder="Ex: viagem, consulta médica…"
                className="vl-input mb-4"
              />
              {error && (
                <p className="text-sm mb-3" style={{ color: "oklch(50% 0.15 25)" }}>{error}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-60"
                  style={{ background: "var(--vl-accent)", color: "#ffffff" }}
                >
                  <Check size={14} />
                  {isPending ? "Bloqueando…" : "Bloquear"}
                </button>
                <button
                  type="button"
                  onClick={props.onClose}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-white/50 disabled:opacity-60"
                  style={{ borderColor: "rgba(13,18,16,0.12)", color: "var(--vl-text-2)" }}
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              {props.reason && (
                <p
                  className="text-sm mb-4 rounded-xl px-3 py-2"
                  style={{ background: "rgba(13,18,16,0.04)", color: "var(--vl-text-2)" }}
                >
                  {props.reason}
                </p>
              )}
              {error && (
                <p className="text-sm mb-3" style={{ color: "oklch(50% 0.15 25)" }}>{error}</p>
              )}
              <button
                type="button"
                onClick={handleRemove}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-60"
                style={{ background: "oklch(50% 0.15 25)", color: "#ffffff" }}
              >
                <Trash2 size={14} />
                {isPending ? "Removendo…" : "Remover bloqueio"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
