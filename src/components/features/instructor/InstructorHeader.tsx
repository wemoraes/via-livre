"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { ChevronDown, LogOut, User } from "lucide-react";

interface Props {
  name: string;
  avatarUrl: string | null;
}

export default function InstructorHeader({ name, avatarUrl }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const initial = name.charAt(0).toUpperCase();

  return (
    <header
      className="sticky top-0 z-20"
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.6)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/instructor/dashboard"
          className="text-base font-bold tracking-tight"
          style={{ color: "var(--vl-text-1)" }}
        >
          ViaLivre
          <span className="text-xs ml-1.5 font-medium" style={{ color: "var(--vl-accent)" }}>
            · Instrutor
          </span>
        </Link>

        <div className="relative" ref={wrapRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl pl-1.5 pr-2 py-1 hover:bg-white/40 transition-colors"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            {avatarUrl ? (
              <Image src={avatarUrl} alt={name} width={32} height={32} className="rounded-full object-cover w-8 h-8" unoptimized />
            ) : (
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
              >
                {initial}
              </span>
            )}
            <span className="hidden md:inline text-sm font-medium max-w-[140px] truncate" style={{ color: "var(--vl-text-2)" }}>
              {name}
            </span>
            <ChevronDown size={14} style={{ color: "var(--vl-text-3)" }} />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-48 rounded-xl py-1 z-10"
              style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(13,18,16,0.08)",
                boxShadow: "0 10px 30px rgba(13,18,16,0.08)",
              }}
            >
              <Link
                href="/instructor/perfil"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/[0.04]"
                style={{ color: "var(--vl-text-1)" }}
              >
                <User size={14} />
                Perfil
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/[0.04] text-left"
                style={{ color: "oklch(50% 0.15 25)" }}
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
