"use client";

import { useState, useTransition } from "react";
import { Pencil, Save, X, Check } from "lucide-react";
import { updateStudentProfile } from "@/actions/student";

interface Props {
  initial: {
    name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
  };
}

export default function ProfileForm({ initial }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone);
  const [city, setCity] = useState(initial.city);
  const [state, setState] = useState(initial.state);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateStudentProfile({ name, phone, city, state });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSavedAt(result.data.updatedAt);
      setEditing(false);
    });
  }

  function handleCancel() {
    setName(initial.name);
    setPhone(initial.phone);
    setCity(initial.city);
    setState(initial.state);
    setError(null);
    setEditing(false);
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {savedAt && !editing && (
        <div
          className="flex items-center gap-2 text-sm rounded-xl px-3 py-2"
          style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
        >
          <Check size={14} />
          Perfil atualizado.
        </div>
      )}

      <Field label="Nome">
        {editing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={100}
            className="vl-input"
          />
        ) : (
          <ReadOnlyValue>{name || "—"}</ReadOnlyValue>
        )}
      </Field>

      <Field label="Email">
        <ReadOnlyValue>{initial.email}</ReadOnlyValue>
      </Field>

      <Field label="Telefone">
        {editing ? (
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="11912345678"
            inputMode="numeric"
            maxLength={20}
            className="vl-input"
          />
        ) : (
          <ReadOnlyValue>{phone || "—"}</ReadOnlyValue>
        )}
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Cidade">
          {editing ? (
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              maxLength={80}
              className="vl-input"
            />
          ) : (
            <ReadOnlyValue>{city || "—"}</ReadOnlyValue>
          )}
        </Field>

        <Field label="Estado (UF)">
          {editing ? (
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
              maxLength={2}
              placeholder="SP"
              className="vl-input"
            />
          ) : (
            <ReadOnlyValue>{state || "—"}</ReadOnlyValue>
          )}
        </Field>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "oklch(50% 0.15 25)" }}>{error}</p>
      )}

      <div className="flex gap-2 pt-2">
        {!editing ? (
          <button
            type="button"
            onClick={() => { setEditing(true); setSavedAt(null); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-white/50"
            style={{ borderColor: "rgba(13,18,16,0.12)", color: "var(--vl-text-2)" }}
          >
            <Pencil size={14} />
            Editar
          </button>
        ) : (
          <>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-60"
              style={{ background: "var(--vl-accent)", color: "#ffffff" }}
            >
              <Save size={14} />
              {isPending ? "Salvando…" : "Salvar"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-white/50 disabled:opacity-60"
              style={{ borderColor: "rgba(13,18,16,0.12)", color: "var(--vl-text-2)" }}
            >
              <X size={14} />
              Cancelar
            </button>
          </>
        )}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--vl-text-3)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ReadOnlyValue({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="px-3 py-2 rounded-xl text-sm"
      style={{ background: "rgba(13,18,16,0.04)", color: "var(--vl-text-2)" }}
    >
      {children}
    </p>
  );
}
