import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}
    >
      <div aria-hidden className="vl-mesh" />
      <div className="glass-card rounded-2xl p-12 text-center max-w-sm w-full">
        <p className="text-7xl font-black mb-4" style={{ color: "var(--vl-accent)", opacity: 0.2 }}>403</p>
        <h1 className="text-lg font-semibold mb-2" style={{ color: "var(--vl-text-1)" }}>
          Acesso negado
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--vl-text-3)" }}>
          Você não tem permissão para acessar esta página.
        </p>
        <Link
          href="/"
          className="text-sm hover:underline"
          style={{ color: "var(--vl-accent)" }}
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
