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

// Nível 3 — máxima opacidade, flutua sobre tudo
const glassLg: React.CSSProperties = {
  background: "rgba(255,255,255,0.82)",
  backdropFilter: "blur(48px) saturate(220%)",
  WebkitBackdropFilter: "blur(48px) saturate(220%)",
  border: "1px solid rgba(255,255,255,0.94)",
  boxShadow:
    "0 20px 64px rgba(13,18,16,0.18), 0 6px 20px rgba(13,18,16,0.11), inset 0 1px 0 rgba(255,255,255,0.68)",
};

const shadowMd =
  "0 8px 36px rgba(13,18,16,0.14), 0 3px 10px rgba(13,18,16,0.09), inset 0 1px 0 rgba(255,255,255,0.62)";

const mono: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
};

// ─── Icon helpers ─────────────────────────────────────────────────────────────
function VerifiedIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="oklch(54% 0.16 145)">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke={C.text3}
      strokeWidth="2"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    </svg>
  );
}

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

// ─── Car SVGs ─────────────────────────────────────────────────────────────────
function CarSvg1() {
  return (
    <svg
      viewBox="0 0 72 46"
      fill="none"
      width="72"
      height="46"
      style={{ position: "absolute", inset: 0 }}
    >
      <rect width="72" height="46" fill="oklch(82% 0.02 145)" />
      <rect x="0" y="28" width="72" height="18" fill="oklch(75% 0.02 145)" />
      <rect x="6" y="24" width="60" height="16" rx="3" fill="oklch(40% 0.02 145)" />
      <path
        d="M16 24 C18 16 22 13 28 12 L46 12 C52 13 56 16 58 24Z"
        fill="oklch(38% 0.02 145)"
      />
      <path
        d="M26 24 C27 18 29 15 32 14 L42 14 C45 15 47 18 48 24Z"
        fill="oklch(72% 0.03 145 / 0.5)"
      />
      <circle cx="20" cy="40" r="6" fill="oklch(18% 0.01 145)" />
      <circle cx="20" cy="40" r="3" fill="oklch(50% 0.01 145)" />
      <circle cx="52" cy="40" r="6" fill="oklch(18% 0.01 145)" />
      <circle cx="52" cy="40" r="3" fill="oklch(50% 0.01 145)" />
      <rect x="58" y="19" width="6" height="3" rx="1" fill="oklch(85% 0.12 75 / 0.7)" />
      <rect x="8" y="19" width="6" height="3" rx="1" fill="oklch(75% 0.05 25 / 0.5)" />
    </svg>
  );
}

function CarSvg2() {
  return (
    <svg
      viewBox="0 0 72 46"
      fill="none"
      width="72"
      height="46"
      style={{ position: "absolute", inset: 0 }}
    >
      <rect width="72" height="46" fill="oklch(88% 0.04 145)" />
      <rect x="0" y="30" width="72" height="16" fill="oklch(80% 0.03 145)" />
      <rect x="5" y="22" width="62" height="17" rx="3" fill="oklch(96% 0.01 145)" />
      <path
        d="M14 22 C16 14 21 11 27 10 L47 10 C53 11 57 14 60 22Z"
        fill="oklch(94% 0.01 145)"
      />
      <path
        d="M25 22 C26 16 28 13 31 12 L43 12 C46 13 48 16 49 22Z"
        fill="oklch(72% 0.04 145 / 0.35)"
      />
      <circle cx="19" cy="39" r="6" fill="oklch(18% 0.01 145)" />
      <circle cx="19" cy="39" r="3" fill="oklch(50% 0.01 145)" />
      <circle cx="53" cy="39" r="6" fill="oklch(18% 0.01 145)" />
      <circle cx="53" cy="39" r="3" fill="oklch(50% 0.01 145)" />
      <rect x="59" y="18" width="5" height="3" rx="1" fill="oklch(85% 0.12 75 / 0.7)" />
    </svg>
  );
}

function CarSvg3() {
  return (
    <svg
      viewBox="0 0 72 46"
      fill="none"
      width="72"
      height="46"
      style={{ position: "absolute", inset: 0 }}
    >
      <rect width="72" height="46" fill="oklch(72% 0.04 220)" />
      <rect x="0" y="29" width="72" height="17" fill="oklch(65% 0.03 220)" />
      <rect x="7" y="23" width="58" height="15" rx="3" fill="oklch(42% 0.05 220)" />
      <path
        d="M17 23 C19 15 23 12 29 11 L45 11 C51 12 55 15 57 23Z"
        fill="oklch(40% 0.05 220)"
      />
      <path
        d="M27 23 C28 17 30 14 33 13 L41 13 C44 14 46 17 47 23Z"
        fill="oklch(75% 0.04 220 / 0.4)"
      />
      <circle cx="21" cy="40" r="6" fill="oklch(15% 0.01 220)" />
      <circle cx="21" cy="40" r="3" fill="oklch(45% 0.01 220)" />
      <circle cx="51" cy="40" r="6" fill="oklch(15% 0.01 220)" />
      <circle cx="51" cy="40" r="3" fill="oklch(45% 0.01 220)" />
      <rect x="57" y="18" width="5" height="3" rx="1" fill="oklch(85% 0.12 75 / 0.7)" />
      <rect x="10" y="18" width="5" height="3" rx="1" fill="oklch(75% 0.05 25 / 0.4)" />
    </svg>
  );
}

// ─── Instructor list cards ─────────────────────────────────────────────────────
const INSTRUCTORS = [
  {
    Car: CarSvg1,
    name: "Carlos Mendes",
    city: "Tatuapé, SP · AUTO",
    price: "R$ 120",
    aprovVal: "8,4",
    aprovColor: C.accent,
    aprovCount: 24,
    rating: "4,9",
    opacity: 1,
  },
  {
    Car: CarSvg2,
    name: "Ana Soares",
    city: "Mooca, SP · AUTO + MOTO",
    price: "R$ 95",
    aprovVal: "11,2",
    aprovColor: "oklch(52% 0.14 75)",
    aprovCount: 18,
    rating: "4,7",
    opacity: 0.84,
  },
  {
    Car: CarSvg3,
    name: "Roberto Faria",
    city: "Penha, SP · AUTO",
    price: "R$ 110",
    aprovVal: "9,1",
    aprovColor: C.accent,
    aprovCount: 35,
    rating: "4,8",
    opacity: 0.65,
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [view, setView] = useState<"map" | "list">("list");
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
      {/* Mesh gradient background */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: [
            "radial-gradient(ellipse 1100px 900px at -8% 2%, oklch(68% 0.21 145 / 0.36), transparent 52%)",
            "radial-gradient(ellipse 800px 1100px at 110% 98%, oklch(56% 0.23 145 / 0.28), transparent 52%)",
            "radial-gradient(ellipse 700px 600px at 62% 14%, oklch(78% 0.17 145 / 0.22), transparent 52%)",
            "radial-gradient(ellipse 500px 500px at 88% 42%, oklch(70% 0.19 145 / 0.16), transparent 52%)",
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
                href="/para-instrutores"
                style={{ fontSize: 13, fontWeight: 500, color: C.text3 }}
              >
                Sou instrutor
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
              href="/cadastro/aluno"
              style={{
                fontSize: 13,
                fontWeight: 700,
                padding: "7px 16px",
                borderRadius: 10,
                background: C.text1,
                color: "#fff",
              }}
            >
              Começar grátis
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
              gridTemplateColumns: isTablet ? "1fr" : "1fr 460px",
              gap: isTablet ? 36 : 52,
              alignItems: "start",
            }}
          >
            {/* Left — copy */}
            <div>
              <h1
                style={{
                  fontSize: "clamp(42px, 4.8vw, 60px)",
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.05,
                  color: C.text1,
                  marginBottom: 20,
                }}
              >
                Sua CNH com o
                <br />
                instrutor{" "}
                <span style={{ color: C.accent }}>certo.</span>
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
                Compare o{" "}
                <strong style={{ color: C.text1, fontWeight: 700 }}>
                  Aprovômetro
                </strong>{" "}
                — média real de aulas até passar no exame — e escolha quem vai
                te ensinar com dados, não chutes.
              </p>
              <div
                style={{ display: "flex", gap: 10, marginBottom: 36, flexWrap: "wrap" }}
              >
                <Link
                  href="/instrutores"
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
                  Buscar instrutores
                  <ArrowIcon />
                </Link>
                <a
                  href="#aprovometro"
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
                  {
                    v: "100%",
                    l: "instrutores verificados\npelo SENATRAN",
                  },
                  {
                    v: "Aprovômetro",
                    l: "dado real de aprovação\nde cada instrutor",
                  },
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
                        fontSize: 18,
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

            {/* Right — hero panel */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* View toggle */}
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  background: "rgba(0,0,0,0.05)",
                  borderRadius: 10,
                  padding: 4,
                  marginBottom: 10,
                  alignSelf: "flex-start",
                }}
              >
                {(["map", "list"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 7,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: 12,
                      fontWeight: 600,
                      transition: "all 160ms",
                      background: view === v ? "#fff" : "transparent",
                      color: view === v ? C.text1 : C.text3,
                      boxShadow:
                        view === v
                          ? "0 2px 12px rgba(13,18,16,0.06), 0 1px 3px rgba(13,18,16,0.04)"
                          : "none",
                    }}
                  >
                    {v === "map" ? (
                      <>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" />
                          <path d="M9 4v13M15 7v13" />
                        </svg>
                        Mapa
                      </>
                    ) : (
                      <>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="8" y1="6" x2="21" y2="6" />
                          <line x1="8" y1="12" x2="21" y2="12" />
                          <line x1="8" y1="18" x2="21" y2="18" />
                          <line x1="3" y1="6" x2="3.01" y2="6" />
                          <line x1="3" y1="12" x2="3.01" y2="12" />
                          <line x1="3" y1="18" x2="3.01" y2="18" />
                        </svg>
                        Lista
                      </>
                    )}
                  </button>
                ))}
              </div>

              {/* Map view */}
              {view === "map" && (
                <div>
                  <div
                    style={{
                      borderRadius: 18,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.60)",
                      border: "1px solid rgba(255,255,255,0.85)",
                      boxShadow: shadowMd,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px 0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          color: C.text2,
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        São Paulo, SP
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          color: C.text3,
                          background: C.accentLight,
                          borderRadius: 100,
                          padding: "2px 10px",
                        }}
                      >
                        3 instrutores próximos
                      </span>
                    </div>
                    <svg
                      viewBox="0 0 440 230"
                      fill="none"
                      width="100%"
                      style={{ display: "block" }}
                    >
                      <rect
                        width="440"
                        height="230"
                        fill="oklch(96% 0.015 145)"
                      />
                      {/* Streets */}
                      <line x1="0" y1="46" x2="440" y2="46" stroke="oklch(88% 0.03 145)" strokeWidth="1" />
                      <line x1="0" y1="92" x2="440" y2="92" stroke="oklch(84% 0.04 145)" strokeWidth="2" />
                      <line x1="0" y1="138" x2="440" y2="138" stroke="oklch(88% 0.03 145)" strokeWidth="1" />
                      <line x1="0" y1="184" x2="440" y2="184" stroke="oklch(88% 0.03 145)" strokeWidth="1" />
                      <line x1="73" y1="0" x2="73" y2="230" stroke="oklch(88% 0.03 145)" strokeWidth="1" />
                      <line x1="147" y1="0" x2="147" y2="230" stroke="oklch(84% 0.04 145)" strokeWidth="2" />
                      <line x1="220" y1="0" x2="220" y2="230" stroke="oklch(88% 0.03 145)" strokeWidth="1" />
                      <line x1="294" y1="0" x2="294" y2="230" stroke="oklch(84% 0.04 145)" strokeWidth="2" />
                      <line x1="367" y1="0" x2="367" y2="230" stroke="oklch(88% 0.03 145)" strokeWidth="1" />
                      {/* Blocks */}
                      <rect x="76" y="49" width="68" height="40" rx="3" fill="oklch(90% 0.02 145)" opacity=".6" />
                      <rect x="150" y="49" width="68" height="40" rx="3" fill="oklch(90% 0.02 145)" opacity=".6" />
                      <rect x="76" y="95" width="68" height="40" rx="3" fill="oklch(90% 0.02 145)" opacity=".6" />
                      <rect x="150" y="95" width="40" height="40" rx="3" fill="oklch(90% 0.02 145)" opacity=".6" />
                      <rect x="225" y="95" width="66" height="40" rx="3" fill="oklch(90% 0.02 145)" opacity=".6" />
                      <rect x="225" y="49" width="66" height="40" rx="3" fill="oklch(90% 0.02 145)" opacity=".6" />
                      <rect x="297" y="49" width="66" height="40" rx="3" fill="oklch(90% 0.02 145)" opacity=".6" />
                      <rect x="297" y="95" width="66" height="40" rx="3" fill="oklch(90% 0.02 145)" opacity=".6" />
                      <rect x="76" y="141" width="68" height="40" rx="3" fill="oklch(90% 0.02 145)" opacity=".6" />
                      <rect x="150" y="141" width="68" height="40" rx="3" fill="oklch(90% 0.02 145)" opacity=".6" />
                      <rect x="225" y="141" width="66" height="40" rx="3" fill="oklch(90% 0.02 145)" opacity=".6" />
                      {/* Search radius */}
                      <circle cx="220" cy="115" r="100" fill="oklch(62% 0.18 145 / 0.07)" />
                      <circle cx="220" cy="115" r="100" stroke="oklch(62% 0.18 145 / 0.18)" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
                      {/* User pin */}
                      <circle cx="220" cy="115" r="10" fill="white" stroke="oklch(62% 0.18 145)" strokeWidth="2" />
                      <circle cx="220" cy="115" r="4" fill="oklch(62% 0.18 145)" />
                      <defs>
                        <filter id="mapShadow">
                          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,.15)" />
                        </filter>
                      </defs>
                      {/* Pin CM — selected */}
                      <circle cx="152" cy="78" r="20" fill="oklch(54% 0.16 145)" filter="url(#mapShadow)" />
                      <text x="152" y="82" textAnchor="middle" fontFamily="var(--font-plus-jakarta-sans), sans-serif" fontSize="10" fontWeight="800" fill="white">CM</text>
                      <rect x="116" y="52" width="72" height="20" rx="5" fill="white" filter="url(#mapShadow)" />
                      <text x="152" y="66" textAnchor="middle" fontFamily="var(--font-plus-jakarta-sans), sans-serif" fontSize="10" fontWeight="700" fill="oklch(15% 0.008 145)">R$ 120 · 8,4</text>
                      {/* Pin AS */}
                      <circle cx="294" cy="88" r="18" fill="white" stroke="oklch(85% 0.06 145)" strokeWidth="1.5" filter="url(#mapShadow)" />
                      <text x="294" y="93" textAnchor="middle" fontFamily="var(--font-plus-jakarta-sans), sans-serif" fontSize="10" fontWeight="800" fill="oklch(54% 0.16 145)">AS</text>
                      {/* Pin RF */}
                      <circle cx="175" cy="152" r="17" fill="white" stroke="oklch(85% 0.06 145)" strokeWidth="1.5" filter="url(#mapShadow)" />
                      <text x="175" y="157" textAnchor="middle" fontFamily="var(--font-plus-jakarta-sans), sans-serif" fontSize="10" fontWeight="800" fill="oklch(54% 0.16 145)">RF</text>
                      {/* Faded pin outside radius */}
                      <circle cx="375" cy="58" r="14" fill="white" stroke="oklch(90% 0.02 145)" strokeWidth="1" opacity=".45" />
                      <text x="375" y="63" textAnchor="middle" fontFamily="var(--font-plus-jakarta-sans), sans-serif" fontSize="9" fontWeight="700" fill="oklch(65% 0.05 145)" opacity=".45">JL</text>
                    </svg>
                  </div>
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: 11,
                      color: C.text3,
                      padding: "6px 0 2px",
                    }}
                  >
                    Toque em um instrutor para ver o perfil
                  </p>
                </div>
              )}

              {/* List view */}
              {view === "list" && (
                <div>
                  {/* Search bar */}
                  <div
                    style={{
                      ...glass,
                      borderRadius: 14,
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.text3}
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span style={{ fontSize: 13, color: C.text3, flex: 1 }}>
                      São Paulo, SP
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: C.accent,
                        background: C.accentLight,
                        border: `1px solid ${C.accentMid}`,
                        padding: "2px 10px",
                        borderRadius: 100,
                      }}
                    >
                      AUTO
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {INSTRUCTORS.map((inst) => (
                      <div
                        key={inst.name}
                        style={{
                          ...glass,
                          borderRadius: 16,
                          padding: 14,
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          opacity: inst.opacity,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 72,
                              height: 46,
                              borderRadius: 8,
                              overflow: "hidden",
                              flexShrink: 0,
                              position: "relative",
                            }}
                          >
                            <inst.Car />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: C.text1,
                                }}
                              >
                                {inst.name}
                              </span>
                              <VerifiedIcon />
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: C.text3,
                                marginTop: 1,
                              }}
                            >
                              {inst.city}
                            </div>
                          </div>
                          <div
                            style={{ textAlign: "right", flexShrink: 0 }}
                          >
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 800,
                                color: C.text1,
                                letterSpacing: "-0.02em",
                              }}
                            >
                              {inst.price}
                            </div>
                            <div style={{ fontSize: 10, color: C.text3 }}>
                              por aula
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 8,
                            paddingTop: 8,
                            borderTop: "1px solid rgba(0,0,0,0.05)",
                          }}
                        >
                          <TrendIcon />
                          <span
                            style={{
                              ...mono,
                              fontSize: 13,
                              fontWeight: 700,
                              color: inst.aprovColor,
                            }}
                          >
                            {inst.aprovVal}
                          </span>
                          <span style={{ fontSize: 10, color: C.text3 }}>
                            aulas até aprovar ({inst.aprovCount})
                          </span>
                          <div
                            style={{
                              marginLeft: "auto",
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: 11,
                              color: C.text3,
                            }}
                          >
                            <span style={{ color: "oklch(62% 0.14 75)" }}>
                              ★
                            </span>{" "}
                            {inst.rating}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p
                    style={{
                      textAlign: "center",
                      fontSize: 11,
                      color: C.text3,
                      padding: "6px 0 2px",
                    }}
                  >
                    + dezenas de instrutores na sua região
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Aprovômetro Spotlight ── */}
      <section id="aprovometro" style={{ padding: isTablet ? "56px 0" : "88px 0" }}>
        <div
          style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 20px" : "0 28px" }}
        >
          <div
            style={{
              ...glassLg,
              borderRadius: 28,
              padding: isMobile ? "36px 24px" : isTablet ? "44px 40px" : "56px 64px",
              display: "grid",
              gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",
              gap: isTablet ? 36 : 64,
              alignItems: "center",
            }}
          >
            {/* Left — copy */}
            <div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.accent,
                  display: "block",
                  marginBottom: 16,
                }}
              >
                Exclusivo ViaLivre
              </span>
              <h2
                style={{
                  fontSize: "clamp(28px, 3vw, 38px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  color: C.text1,
                  marginBottom: 20,
                }}
              >
                A métrica que nenhuma autoescola tem coragem de mostrar.
              </h2>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: C.text2,
                  marginBottom: 12,
                }}
              >
                Cada instrutor tem uma média calculada com base nos alunos reais
                que aprovaram com ele. Você vê exatamente quantas aulas, em
                média, foram necessárias — sem depoimentos forjados.
              </p>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: C.text2,
                  marginBottom: 12,
                }}
              >
                Só aparece quando o instrutor tem pelo menos 5 aprovações
                confirmadas. Quem tem poucos dados aparece como &ldquo;Novo
                instrutor&rdquo;.
              </p>
              <Link
                href="/instrutores"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.accent,
                  marginTop: 8,
                }}
              >
                Ver instrutores com Aprovômetro
                <ArrowIcon />
              </Link>
            </div>

            {/* Right — visual */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  ...mono,
                  fontSize: 100,
                  fontWeight: 700,
                  color: C.accent,
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  textAlign: "center",
                }}
              >
                8,4
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  color: C.text3,
                  marginBottom: 28,
                  marginTop: 4,
                }}
              >
                aulas até aprovação — média
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {[
                  {
                    label: "Carlos Mendes",
                    val: "8,4 aulas",
                    pct: "56%",
                    accent: true,
                  },
                  {
                    label: "Média do mercado",
                    val: "15,0 aulas",
                    pct: "100%",
                    accent: false,
                  },
                ].map(({ label, val, pct, accent }) => (
                  <div key={label}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        color: C.text3,
                        marginBottom: 5,
                      }}
                    >
                      <span>{label}</span>
                      <strong style={{ color: C.text2, fontWeight: 600 }}>
                        {val}
                      </strong>
                    </div>
                    <div
                      style={{
                        height: 5,
                        borderRadius: 100,
                        background: "rgba(0,0,0,0.08)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: 100,
                          width: pct,
                          background: accent ? C.accent : "rgba(0,0,0,0.14)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: 10,
                  color: C.text3,
                  marginTop: 16,
                }}
              >
                Calculado com dados reais de exame. Mínimo de 5 aprovações.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: isTablet ? "0 0 56px" : "0 0 88px" }}>
        <div
          style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 20px" : "0 28px" }}
        >
          <h2
            style={{
              fontSize: "clamp(26px, 3vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: C.text1,
              marginBottom: 44,
            }}
          >
            Uma plataforma honesta.
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
                tag: "Compliance",
                title: "Instrutores verificados",
                body: "CNH EAR, credenciamento SENATRAN e certidões negativas revisados pela nossa equipe antes de qualquer ativação. Ninguém entra sem checagem.",
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="oklch(54% 0.16 145)"
                    strokeWidth="2"
                  >
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
              },
              {
                tag: "Transparência",
                title: "Aprovômetro",
                body: "Dados reais de aprovação calculados automaticamente. Não estrelas compradas, não depoimentos forjados. A média que mostra quem realmente ensina.",
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="oklch(54% 0.16 145)"
                    strokeWidth="2"
                  >
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                ),
              },
            ].map(({ tag, title, body, icon }) => (
              <div
                key={title}
                style={{ ...glass, borderRadius: 20, padding: "36px 32px" }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: C.accent,
                    marginBottom: 20,
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
                    marginBottom: 16,
                  }}
                >
                  {icon}
                </div>
                <div
                  style={{
                    fontSize: 17,
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
                  "radial-gradient(ellipse 700px 400px at 20% 30%, rgba(255,255,255,0.08), transparent 60%)",
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
              Encontre seu instrutor agora.
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
              Crie sua conta gratuitamente e compare instrutores perto de você
              com dados reais.
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
                href="/instrutores"
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
                Buscar instrutores
                <ArrowIcon />
              </Link>
              <Link
                href="/cadastro/aluno"
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
                Criar conta — é grátis
              </Link>
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
