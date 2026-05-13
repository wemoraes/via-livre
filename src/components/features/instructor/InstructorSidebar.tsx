"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { INSTRUCTOR_NAV_LINKS, isInstructorLinkActive } from "./InstructorNavLinks";

export default function InstructorSidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Navegação do instrutor"
      className="hidden md:flex flex-col w-60 shrink-0 glass-card rounded-2xl p-4 self-start sticky top-24"
    >
      <nav className="flex flex-col gap-1">
        {INSTRUCTOR_NAV_LINKS.map(({ href, label, Icon }) => {
          const active = isInstructorLinkActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
              style={{
                background: active ? "oklch(92% 0.07 145)" : "transparent",
                color: active ? "var(--vl-accent)" : "var(--vl-text-2)",
                fontWeight: active ? 600 : 500,
              }}
            >
              <Icon size={18} strokeWidth={active ? 2.25 : 1.75} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
