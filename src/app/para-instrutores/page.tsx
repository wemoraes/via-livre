"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "oklch(96.5% 0.018 145)",
  text1: "#0d1210",
  text2: "#4a5449",
  text3: "#8a9888",
  accent: "oklch(52% 0.17 145)",
  accentLight: "oklch(92% 0.07 145)",
  accentMid: "oklch(84% 0.11 145)",
} as const;

// Nível 1 — translúcido, cor do mesh vaza
const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.50)",
  backdropFilter: "blur(18px) saturate(180%)",
  WebkitBackdropFilter: "blur(18px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.78)",
  boxShadow:
    "0 2px 8px rgba(13,18,16,0.10), 0 1px 3px rgba(13,18,16,0.07), inset 0 1px 0 rgba(255,255,255,0.62)",
};

// Nível 2 — card em destaque
const glassMd: React.CSSProperties = {
  background: "rgba(255,255,255,0.68)",
  backdropFilter: "blur(32px) saturate(200%)",
  WebkitBackdropFilter: "blur(32px) saturate(200%)",
  border: "1px solid rgba(255,255,255,0.86)",
  boxShadow:
    "0 8px 36px rgba(13,18,16,0.14), 0 3px 10px rgba(13,18,16,0.09), inset 0 1px 0 rgba(255,255,255,0.62)",
};

// Nível 3 — máxima opacidade, flutua sobre tudo
const glassLg: React.CSSProperties = {
  background: "rgba(255,255,255,0.82)",
  backdropFilter: "blur(48px) saturate(220%)",
  WebkitBackdropFilter: "blur(48px) saturate(220%)",
  border: "1px solid rgba(255,255,255,0.94)",
  boxShadow:
    "0 20px 64px rgba(13,18,16,0.18), 0 6px 20px rgba(13,18,16,0.11), inset 0 1px 0 rgba(255,255,255,0.68)",
};

const mono: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
};

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="oklch(54% 0.16 145)">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ParaInstrutoresPage() {
  const [width, setWidth] = useState(1200);
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  const isMobile = width < 640;
  const isTablet = width < 880;

  return (
    <div
      style={{
        fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif",
        color: C.text1,
        minHeight: "100vh",
        WebkitFontSmoothing: "antialiased",
        lineHeight: 1.6,
      }}
    >
      {/* Mesh — slightly different blob positions for the instructor page */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: [
            "radial-gradient(ellipse 1100px 800px at 115% 5%, oklch(64% 0.22 145 / 0.34), transparent 52%)",
            "radial-gradient(ellipse 900px 1100px at -6% 90%, oklch(60% 0.21 145 / 0.30), transparent 52%)",
            "radial-gradient(ellipse 600px 500px at 42% 52%, oklch(76% 0.18 145 / 0.20), transparent 52%)",
            "radial-gradient(ellipse 450px 450px at 20% 20%, oklch(72% 0.16 145 / 0.15), transparent 52%)",
            "oklch(96.5% 0.018 145)",
          ].join(", "),
        }}
      />

      {/* ── Nav ── */}
      <nav
        style={{
          position: "sticky",
          top: 12,
          zIndex: 100,
          padding: "0 16px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            pointerEvents: "all",
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            height: 52,
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(28px) saturate(200%)",
            WebkitBackdropFilter: "blur(28px) saturate(200%)",
            border: "1px solid rgba(255,255,255,0.88)",
            borderRadius: 16,
            boxShadow:
              "0 4px 20px rgba(13,18,16,0.10), 0 1px 4px rgba(13,18,16,0.07), inset 0 1px 0 rgba(255,255,255,0.70)",
          }}
        >
          <span
            style={{
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: C.text1,
              userSelect: "none",
            }}
          >
            Via<span style={{ color: C.accent }}>.</span>Livre
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 24 }}>
            {!isMobile && (
              <Link
                href="/"
                style={{ fontSize: 13, fontWeight: 500, color: C.text3 }}
              >
                Sou aluno
              </Link>
            )}
            {!isMobile && (
              <Link
                href="/entrar"
                style={{ fontSize: 13, fontWeight: 500, color: C.text3 }}
              >
                Entrar
              </Link>
            )}
            <Link
              href="/cadastro/instrutor"
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: "7px 16px",
                borderRadius: 10,
                color: C.accent,
                border: `1px solid ${C.accentMid}`,
                background: C.accentLight,
                whiteSpace: "nowrap",
              }}
            >
              {isMobile ? "Cadastrar" : "Cadastrar como instrutor"}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding: isMobile ? "36px 0 52px" : "60px 0 80px" }}>
        <div
          style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 20px" : "0 28px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet ? "1fr" : "1fr 420px",
              gap: isTablet ? 36 : 56,
              alignItems: "center",
            }}
          >
            {/* Left — copy */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: C.accent,
                  background: C.accentLight,
                  border: `1px solid ${C.accentMid}`,
                  padding: "5px 12px",
                  borderRadius: 100,
                  marginBottom: 24,
                }}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
                Para instrutores autônomos
              </div>
              <h1
                style={{
                  fontSize: "clamp(40px, 4.6vw, 58px)",
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.05,
                  color: C.text1,
                  marginBottom: 20,
                }}
              >
                Trabalhe por conta
                <br />
                própria.{" "}
                <span style={{ color: C.accent }}>No seu ritmo.</span>
              </h1>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: C.text2,
                  maxWidth: 400,
                  marginBottom: 32,
                }}
              >
                Crie seu perfil, configure sua agenda e receba alunos
                diretamente. Sem CFC no meio, sem comissão abusiva.
              </p>
              <div
                style={{ display: "flex", gap: 10, marginBottom: 36, flexWrap: "wrap" }}
              >
                <Link
                  href="/cadastro/instrutor"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 22px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    background: C.accent,
                    boxShadow: `0 2px 12px rgba(13,18,16,0.06), 0 4px 16px oklch(54% 0.16 145 / 0.18)`,
                  }}
                >
                  Criar meu perfil
                  <ArrowIcon />
                </Link>
                <a
                  href="#como-funciona"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 18px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.text2,
                    background: "rgba(255,255,255,0.65)",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  Ver como funciona
                </a>
              </div>

              {/* Proof stats */}
              <div
                style={{
                  display: "flex",
                  paddingTop: 28,
                  borderTop: "1px solid rgba(0,0,0,0.07)",
                }}
              >
                {[
                  { v: "15%", l: "taxa da plataforma\nvocê fica com o resto" },
                  { v: "48h", l: "para revisar\nsua documentação" },
                  { v: "Seu preço", l: "você define o valor\npor aula" },
                ].map(({ v, l }, i) => (
                  <div
                    key={v}
                    style={{
                      flex: 1,
                      ...(i > 0
                        ? {
                            borderLeft: "1px solid rgba(0,0,0,0.07)",
                            paddingLeft: 20,
                          }
                        : {}),
                    }}
                  >
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        color: C.text1,
                      }}
                    >
                      {v}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: C.text3,
                        marginTop: 2,
                        lineHeight: 1.4,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — profile card preview */}
            <div>
              <div style={{ ...glassMd, borderRadius: 24, padding: 28 }}>
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background:
                        "linear-gradient(135deg, oklch(62% 0.18 145), oklch(48% 0.14 145))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "white",
                    }}
                  >
                    CM
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: C.text1,
                      }}
                    >
                      Carlos Mendes
                    </div>
                    <div style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>
                      Tatuapé, SP · AUTO
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        color: C.accent,
                        background: C.accentLight,
                        border: `1px solid ${C.accentMid}`,
                        borderRadius: 100,
                        padding: "2px 10px",
                        marginTop: 6,
                      }}
                    >
                      <VerifiedIcon />
                      Perfil verificado
                    </div>
                  </div>
                </div>

                {/* Aprovômetro */}
                <div
                  style={{
                    background: C.accentLight,
                    border: `1px solid ${C.accentMid}`,
                    borderRadius: 14,
                    padding: "16px 18px",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                      color: C.accent,
                      marginBottom: 6,
                    }}
                  >
                    Aprovômetro
                  </div>
                  <div
                    style={{
                      ...mono,
                      fontSize: 40,
                      fontWeight: 700,
                      color: C.accent,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    8,4
                  </div>
                  <div
                    style={{ fontSize: 11, color: C.text3, marginTop: 4 }}
                  >
                    aulas até aprovação — baseado em 24 alunos
                  </div>
                </div>

                {/* Stats grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  {[
                    { v: "24", l: "aprovações\nconfirmadas" },
                    { v: "4,9 ★", l: "avaliação\nmédia" },
                    { v: "R$ 120", l: "por aula\n(você define)" },
                    { v: "3 anos", l: "na plataforma" },
                  ].map(({ v, l }) => (
                    <div
                      key={v}
                      style={{
                        background: "rgba(0,0,0,0.03)",
                        borderRadius: 10,
                        padding: "12px 14px",
                        border: "1px solid rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 17,
                          fontWeight: 800,
                          letterSpacing: "-0.02em",
                          color: C.text1,
                        }}
                      >
                        {v}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: C.text3,
                          marginTop: 2,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {l}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    { label: "AUTO", green: true },
                    { label: "1ª habilitação", green: false },
                    { label: "Reciclagem", green: false },
                  ].map(({ label, green }) => (
                    <span
                      key={label}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "4px 12px",
                        borderRadius: 100,
                        background: green
                          ? C.accentLight
                          : "rgba(0,0,0,0.05)",
                        color: green ? C.accent : C.text2,
                        border: green
                          ? `1px solid ${C.accentMid}`
                          : "1px solid rgba(0,0,0,0.07)",
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: isTablet ? "56px 0" : "88px 0" }}>
        <div
          style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 20px" : "0 28px" }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.accent,
              display: "block",
              marginBottom: 14,
            }}
          >
            O que a ViaLivre oferece
          </span>
          <h2
            style={{
              fontSize: "clamp(26px, 3vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: C.text1,
              marginBottom: 40,
            }}
          >
            Tudo que você precisa para
            <br />
            trabalhar de forma independente.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: 16,
            }}
          >
            {[
              {
                tag: "Visibilidade",
                title: "Perfil público e buscável",
                body: "Apareça para alunos que buscam instrutores na sua região. Seu perfil mostra seus diferenciais, preço, categorias e o Aprovômetro.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(54% 0.16 145)" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
              },
              {
                tag: "Reputação",
                title: "Aprovômetro como vitrine",
                body: "Seus dados reais de aprovação viram diferencial competitivo. Quanto melhor sua média, mais confiança você transmite — automaticamente.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(54% 0.16 145)" strokeWidth="2">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                ),
              },
              {
                tag: "Autonomia",
                title: "Agenda no seu controle",
                body: "Defina seus dias, horários e a área onde atende. Aceite ou recuse solicitações. Você decide quando e quanto trabalhar.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(54% 0.16 145)" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                ),
              },
              {
                tag: "Recebimento",
                title: "Receba após cada aula",
                body: "O pagamento do aluno é liberado para sua conta após a aula ser confirmada. Sem esperar semanas, sem depender de ninguém.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(54% 0.16 145)" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
              },
            ].map(({ tag, title, body, icon }) => (
              <div
                key={title}
                style={{ ...glass, borderRadius: 20, padding: "32px 28px" }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: C.accent,
                    marginBottom: 18,
                  }}
                >
                  {tag}
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: C.accentLight,
                    border: `1px solid ${C.accentMid}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  {icon}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.text1,
                    marginBottom: 8,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: C.text2,
                  }}
                >
                  {body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section id="como-funciona" style={{ padding: isTablet ? "0 0 56px" : "0 0 88px" }}>
        <div
          style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 20px" : "0 28px" }}
        >
          <h2
            style={{
              fontSize: "clamp(26px, 3vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: C.text1,
              marginBottom: 48,
            }}
          >
            Como funciona.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: 16,
            }}
          >
            {[
              {
                n: "01",
                title: "Cadastre seu perfil",
                desc: "Foto, bairros atendidos, categorias de habilitação e preço por aula. Você controla cada detalhe.",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(54% 0.16 145)" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ),
              },
              {
                n: "02",
                title: "Envie a documentação",
                desc: "CNH EAR, credenciamento SENATRAN e certidões negativas. Nossa equipe revisa em até 48 horas.",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(54% 0.16 145)" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                ),
              },
              {
                n: "03",
                title: "Configure sua agenda",
                desc: "Defina disponibilidade recorrente ou avulsa. Mude quando quiser, diretamente pelo app.",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(54% 0.16 145)" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                ),
              },
              {
                n: "04",
                title: "Confirme e receba",
                desc: "Aluno agendou? Confirme a aula em 1 toque. Após a confirmação, o pagamento cai na sua conta.",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(54% 0.16 145)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ),
              },
            ].map(({ n, title, desc, icon }) => (
              <div
                key={n}
                style={{ ...glass, borderRadius: 18, padding: "28px 24px" }}
              >
                <div
                  style={{
                    ...mono,
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.accent,
                    marginBottom: 16,
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: C.accentLight,
                    border: `1px solid ${C.accentMid}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  {icon}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: C.text1,
                    marginBottom: 6,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{ fontSize: 12, lineHeight: 1.55, color: C.text3 }}
                >
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Taxa ── */}
      <section style={{ padding: isTablet ? "0 0 56px" : "0 0 88px" }}>
        <div
          style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 20px" : "0 28px" }}
        >
          <div
            style={{
              ...glassLg,
              borderRadius: 24,
              padding: isMobile ? "36px 24px" : isTablet ? "40px 36px" : "48px 56px",
              display: "grid",
              gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",
              gap: isTablet ? 28 : 56,
              alignItems: "center",
            }}
          >
            <div>
              <div>
                <span
                  style={{
                    ...mono,
                    fontSize: 80,
                    fontWeight: 700,
                    color: C.accent,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  15
                </span>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: C.text1,
                    letterSpacing: "-0.03em",
                    verticalAlign: "super",
                  }}
                >
                  %
                </span>
              </div>
              <div style={{ fontSize: 14, color: C.text3, marginTop: 6 }}>
                taxa da plataforma por aula
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: C.text1,
                  marginBottom: 12,
                  letterSpacing: "-0.02em",
                }}
              >
                Simples, transparente,
                <br />
                sem surpresas.
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.7, color: C.text2 }}>
                A ViaLivre cobra 15% sobre o valor de cada aula. Você define o
                preço, a plataforma fica com 15%, e o restante é seu.
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginTop: 16,
                }}
              >
                {[
                  "Sem mensalidade ou taxa de adesão",
                  "Sem cobranças em aulas canceladas",
                  "Você define seu preço por aula livremente",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 14,
                      color: C.text2,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: C.accent,
                        flexShrink: 0,
                        marginTop: 7,
                      }}
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: isTablet ? "0 0 56px" : "0 0 88px" }}>
        <div
          style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 20px" : "0 28px" }}
        >
          <div
            style={{
              borderRadius: 28,
              padding: isMobile ? "48px 24px" : isTablet ? "56px 40px" : "72px 60px",
              textAlign: "center",
              background:
                "linear-gradient(135deg, oklch(50% 0.15 145), oklch(44% 0.13 145))",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "radial-gradient(ellipse 700px 400px at 80% 20%, rgba(255,255,255,0.08), transparent 60%)",
              }}
            />
            <h2
              style={{
                fontSize: "clamp(26px, 3.5vw, 40px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "#fff",
                marginBottom: 14,
                position: "relative",
              }}
            >
              Comece a receber alunos.
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.68)",
                maxWidth: 360,
                margin: "0 auto 32px",
                lineHeight: 1.65,
                position: "relative",
              }}
            >
              Crie seu perfil gratuitamente. Você só paga quando tiver aulas
              confirmadas.
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
                position: "relative",
              }}
            >
              <Link
                href="/cadastro/instrutor"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 24px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  background: "#fff",
                  color: C.accent,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
                }}
              >
                Criar meu perfil
                <ArrowIcon />
              </Link>
              <a
                href="#como-funciona"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 20px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.80)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                Ver como funciona
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(0,0,0,0.07)",
          padding: "28px 0",
          background: "rgba(255,255,255,0.40)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: C.text1,
            }}
          >
            Via<span style={{ color: C.accent }}>.</span>Livre
          </span>
          <p style={{ fontSize: 12, color: C.text3 }}>
            © 2025 ViaLivre. Todos os direitos reservados.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link
              href="/termos"
              style={{ fontSize: 12, color: C.text3 }}
            >
              Termos
            </Link>
            <Link
              href="/privacidade"
              style={{ fontSize: 12, color: C.text3 }}
            >
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
