"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STUDENT_NAV_LINKS, isStudentLinkActive } from "./StudentNavLinks";

export default function StudentBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação do aluno"
      className="md:hidden fixed bottom-0 inset-x-0 z-30 px-2 pb-2 pt-1"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderTop: "1px solid rgba(13,18,16,0.06)",
      }}
    >
      <ul className="grid grid-cols-5 gap-1">
        {STUDENT_NAV_LINKS.map(({ href, shortLabel, Icon }) => {
          const active = isStudentLinkActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                className="flex flex-col items-center gap-0.5 py-1.5 rounded-lg transition-colors"
                style={{
                  color: active ? "var(--vl-accent)" : "var(--vl-text-3)",
                  fontWeight: active ? 600 : 500,
                }}
              >
                <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
                <span className="text-[10px] leading-tight">{shortLabel}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
