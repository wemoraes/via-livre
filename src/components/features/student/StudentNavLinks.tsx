import { LayoutDashboard, CalendarDays, History, User, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface StudentNavLink {
  href: string;
  label: string;
  shortLabel: string;
  Icon: LucideIcon;
}

export const STUDENT_NAV_LINKS: StudentNavLink[] = [
  { href: "/aluno", label: "Início", shortLabel: "Início", Icon: LayoutDashboard },
  { href: "/aulas", label: "Minhas aulas", shortLabel: "Aulas", Icon: CalendarDays },
  { href: "/aluno/historico", label: "Histórico", shortLabel: "Histórico", Icon: History },
  { href: "/instrutores", label: "Buscar instrutores", shortLabel: "Buscar", Icon: Search },
  { href: "/aluno/perfil", label: "Perfil", shortLabel: "Perfil", Icon: User },
];

export function isStudentLinkActive(pathname: string, href: string): boolean {
  if (href === "/aluno") return pathname === "/aluno";
  if (href === "/aulas") return pathname === "/aulas" || pathname.startsWith("/aulas/") || pathname.startsWith("/agendar/");
  return pathname === href || pathname.startsWith(`${href}/`);
}
