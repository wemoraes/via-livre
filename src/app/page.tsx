import Link from "next/link";
import { CheckCircle2, TrendingUp, Shield, Star } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-lg font-bold text-[oklch(55%_0.17_145)]">ViaLivre</span>
          <div className="flex items-center gap-4">
            <Link href="/entrar" className="text-sm text-gray-600 hover:text-gray-900">
              Entrar
            </Link>
            <Link
              href="/cadastro/aluno"
              className="text-sm px-4 py-2 bg-[oklch(55%_0.17_145)] text-white rounded-xl hover:bg-[oklch(50%_0.17_145)] transition-colors"
            >
              Começar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-[oklch(55%_0.17_145)] bg-[oklch(97%_0.03_145)] px-3 py-1.5 rounded-full mb-6">
          <Shield size={12} />
          Conforme Resolução CONTRAN 1.020/2025
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          Aprenda a dirigir com o{" "}
          <span className="text-[oklch(55%_0.17_145)]">instrutor certo</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Encontre instrutores autônomos credenciados perto de você, compare o{" "}
          <strong className="text-gray-700">Aprovômetro</strong> — a média de aulas até a aprovação —
          e agende com pagamento seguro.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/cadastro/aluno"
            className="w-full sm:w-auto px-8 py-3 bg-[oklch(55%_0.17_145)] text-white text-sm font-medium rounded-xl hover:bg-[oklch(50%_0.17_145)] transition-colors"
          >
            Buscar instrutores
          </Link>
          <Link
            href="/cadastro/instrutor"
            className="w-full sm:w-auto px-8 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:border-gray-300 transition-colors"
          >
            Sou instrutor autônomo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-12">
            Por que a ViaLivre?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Aprovômetro",
                body: "Veja a média de aulas que cada instrutor precisa para aprovar um aluno. Dados reais, não publicidade.",
              },
              {
                icon: Shield,
                title: "Instrutores verificados",
                body: "CNH EAR, credenciamento SENATRAN e certidões revisadas pela nossa equipe antes da ativação.",
              },
              {
                icon: CheckCircle2,
                title: "Pagamento seguro",
                body: "O valor fica em custódia até a aula ser confirmada por ambas as partes. Sem risco de calote.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[oklch(97%_0.03_145)] flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[oklch(55%_0.17_145)]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-12">Como funciona</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-sm font-semibold text-[oklch(55%_0.17_145)] uppercase tracking-wide mb-4">
              Para alunos
            </p>
            {[
              "Crie sua conta gratuitamente",
              "Busque instrutores por localização, preço e Aprovômetro",
              "Agende a aula e pague com segurança",
              "Confirme após a aula e avalie o instrutor",
            ].map((step, i) => (
              <div key={i} className="flex gap-4 mb-4">
                <div className="w-7 h-7 rounded-full bg-[oklch(55%_0.17_145)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm font-semibold text-[oklch(55%_0.17_145)] uppercase tracking-wide mb-4">
              Para instrutores
            </p>
            {[
              "Cadastre seu perfil e envie os documentos obrigatórios",
              "Configure sua agenda e preço por aula",
              "Receba alunos e confirme as aulas",
              "Receba o pagamento automaticamente após confirmação",
            ].map((step, i) => (
              <div key={i} className="flex gap-4 mb-4">
                <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <span>© 2025 ViaLivre. Todos os direitos reservados.</span>
          <div className="flex gap-6">
            <Link href="/termos" className="hover:text-gray-600">Termos de uso</Link>
            <Link href="/privacidade" className="hover:text-gray-600">Privacidade</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
