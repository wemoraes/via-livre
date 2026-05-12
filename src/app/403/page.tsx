import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200 mb-4">403</h1>
        <p className="text-gray-600 mb-6">Você não tem permissão para acessar esta página.</p>
        <Link href="/" className="text-[oklch(55%_0.17_145)] hover:underline text-sm">
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
