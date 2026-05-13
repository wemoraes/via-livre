import Link from "next/link";
import { ArrowRight, BadgeCheck, TrendingUp, Lock, Star, ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <span className="text-base font-black tracking-tight text-[oklch(40%_0.17_145)]">
            Via<span className="text-[oklch(55%_0.17_145)]">Livre</span>
          </span>
          <nav className="hidden md:flex items-center gap-7">
            <Link href="/instrutores" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Buscar instrutores
            </Link>
            <Link href="/entrar" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Entrar
            </Link>
            <Link
              href="/cadastro/aluno"
              className="text-sm font-semibold px-4 py-2 bg-[oklch(55%_0.17_145)] text-white rounded-lg hover:bg-[oklch(48%_0.17_145)] transition-colors"
            >
              Começar grátis
            </Link>
          </nav>
          <Link
            href="/cadastro/aluno"
            className="md:hidden text-sm font-semibold px-4 py-2 bg-[oklch(55%_0.17_145)] text-white rounded-lg"
          >
            Começar
          </Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-5">
        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-[oklch(55%_0.17_145)] border border-[oklch(80%_0.10_145)] bg-[oklch(97%_0.04_145)] px-3 py-1.5 rounded-full mb-8">
            <BadgeCheck size={11} />
            Resolução CONTRAN 1.020/2025
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-950 leading-[1.05] tracking-tight mb-6">
            Sua CNH com o<br />
            <span className="text-[oklch(55%_0.17_145)]">instrutor certo.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
            Encontre instrutores credenciados perto de você.
            Compare o <strong className="text-gray-800 font-semibold">Aprovômetro</strong> — a média real de aulas até passar — e agende com pagamento protegido.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/instrutores"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[oklch(55%_0.17_145)] text-white text-sm font-semibold rounded-xl hover:bg-[oklch(48%_0.17_145)] transition-all shadow-lg shadow-[oklch(55%_0.17_145)]/25"
            >
              Buscar instrutores perto de mim
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/cadastro/instrutor"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Sou instrutor autônomo
              <ChevronRight size={14} className="text-gray-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-8 px-5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "100%", label: "Instrutores verificados" },
            { value: "15%", label: "Taxa da plataforma apenas" },
            { value: "5★", label: "Avaliações verificadas" },
            { value: "0", label: "Risco de calote" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-black text-gray-900 tabular-nums">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Aprovômetro feature ───────────────────────────────────── */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-[oklch(55%_0.17_145)] mb-4">
              Diferencial exclusivo
            </p>
            <h2 className="text-4xl font-black text-gray-950 leading-tight mb-5">
              O Aprovômetro.<br />
              <span className="text-gray-400 font-normal">Dados reais,<br />não marketing.</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Cada instrutor tem uma média calculada com base nos alunos reais que aprovaram com ele. Você vê exatamente quantas aulas, em média, foram necessárias. Não estrelas compradas. Não depoimentos forjados.
            </p>
            <Link
              href="/instrutores"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[oklch(55%_0.17_145)] hover:gap-3 transition-all"
            >
              Ver instrutores com Aprovômetro <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mock card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100 p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[oklch(75%_0.14_145)] to-[oklch(50%_0.17_145)] flex items-center justify-center text-white text-xl font-black shrink-0">
                C
              </div>
              <div>
                <p className="font-semibold text-gray-900">Carlos Mendes</p>
                <p className="text-xs text-gray-400">São Paulo, SP · AUTO & MOTO</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xl font-black text-[oklch(40%_0.17_145)]">R$ 120</p>
                <p className="text-[10px] text-gray-400">por aula</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-center">
                <p className="text-2xl font-black text-green-700">8,4</p>
                <p className="text-[10px] text-green-600 font-medium mt-0.5">aulas até aprovação</p>
                <p className="text-[9px] text-gray-400">Aprovômetro · 24 alunos</p>
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-center">
                <p className="text-2xl font-black text-gray-800">4,9</p>
                <div className="flex justify-center gap-0.5 my-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} size={9} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-[9px] text-gray-400">31 avaliações</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {["Parque São Jorge", "Tatuapé", "Vila Formosa", "Penha"].map(a => (
                <span key={a} className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">{a}</span>
              ))}
            </div>

            <div className="w-full bg-[oklch(55%_0.17_145)] text-white text-sm font-semibold py-2.5 rounded-xl text-center">
              Agendar aula
            </div>
          </div>
        </div>
      </section>

      {/* ── Features 3-col ───────────────────────────────────────── */}
      <section className="bg-gray-950 py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-3">
            Tudo que você precisa.<br />
            <span className="text-gray-400 font-normal">Nada que não precisa.</span>
          </h2>
          <p className="text-gray-500 text-center text-sm mb-14 max-w-md mx-auto">
            Uma plataforma enxuta e honesta para quem quer tirar a CNH sem dor de cabeça.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: BadgeCheck,
                title: "Instrutores verificados",
                body: "CNH EAR, credenciamento SENATRAN, certidões negativas — tudo revisado pela nossa equipe antes da ativação. Zero surpresas.",
              },
              {
                icon: TrendingUp,
                title: "Aprovômetro real",
                body: "Média de aulas até aprovação calculada com dados de alunos reais. Só aparece com mínimo de 5 aprovações confirmadas.",
              },
              {
                icon: Lock,
                title: "Pagamento em custódia",
                body: "Você paga na hora de agendar. O valor só vai para o instrutor após a aula ser confirmada. Sem risco, para os dois lados.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <div className="w-9 h-9 rounded-lg bg-[oklch(20%_0.06_145)] border border-[oklch(30%_0.08_145)] flex items-center justify-center mb-5">
                  <Icon size={16} className="text-[oklch(70%_0.15_145)]" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-gray-950 text-center mb-16">Como funciona</h2>

          <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
            {/* Students */}
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase text-[oklch(55%_0.17_145)] mb-6">
                Para alunos
              </p>
              <div className="space-y-6">
                {[
                  ["Crie sua conta", "Gratuito e leva menos de 2 minutos."],
                  ["Busque e compare", "Filtre por bairro, preço, categoria e Aprovômetro."],
                  ["Agende e pague", "Escolha data e horário. O pagamento fica protegido."],
                  ["Confirme e avalie", "Após a aula, libere o pagamento e avalie o instrutor."],
                ].map(([title, desc], i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[oklch(55%_0.17_145)] text-white text-xs font-black flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      {i < 3 && <div className="w-px flex-1 bg-[oklch(88%_0.06_145)] mt-1" />}
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold text-gray-900 text-sm">{title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructors */}
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-6">
                Para instrutores
              </p>
              <div className="space-y-6">
                {[
                  ["Cadastre seu perfil", "Dados, bairros atendidos, preço e categorias de aula."],
                  ["Envie a documentação", "Fazemos a verificação — leva até 48h úteis."],
                  ["Configure sua agenda", "Defina dias e horários disponíveis quando quiser."],
                  ["Receba automaticamente", "Pagamento liberado após confirmação da aula."],
                ].map(([title, desc], i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs font-black flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      {i < 3 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold text-gray-900 text-sm">{title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="px-5 pb-24">
        <div className="max-w-3xl mx-auto bg-[oklch(55%_0.17_145)] rounded-3xl p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
            Pronto para tirar sua CNH?
          </h2>
          <p className="text-[oklch(85%_0.08_145)] text-sm mb-8 max-w-md mx-auto">
            Encontre o instrutor ideal perto de você agora mesmo. É grátis para criar sua conta.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/instrutores"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[oklch(40%_0.17_145)] text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Buscar instrutores <ArrowRight size={14} />
            </Link>
            <Link
              href="/cadastro/instrutor"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[oklch(48%_0.17_145)] text-white text-sm font-semibold rounded-xl hover:bg-[oklch(42%_0.17_145)] transition-colors"
            >
              Cadastrar como instrutor
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-base font-black tracking-tight text-[oklch(40%_0.17_145)]">
            Via<span className="text-[oklch(55%_0.17_145)]">Livre</span>
          </span>
          <p className="text-xs text-gray-400">© 2025 ViaLivre. Todos os direitos reservados.</p>
          <div className="flex gap-5">
            <Link href="/termos" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Termos</Link>
            <Link href="/privacidade" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
