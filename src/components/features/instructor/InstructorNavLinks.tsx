import { LayoutDashboard, CalendarDays, CalendarClock, User, Car } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface InstructorNavLink {
  href: string;
  label: string;
  shortLabel: string;
  Icon: LucideIcon;
}

export const INSTRUCTOR_NAV_LINKS: InstructorNavLink[] = [
  { href: "/instructor/dashboard", label: "Dashboard", shortLabel: "Início", Icon: LayoutDashboard },
  { href: "/instructor/aulas", label: "Minhas aulas", shortLabel: "Aulas", Icon: CalendarDays },
  { href: "/instructor/agenda", label: "Agenda", shortLabel: "Agenda", Icon: CalendarClock },
  { href: "/instructor/perfil", label: "Perfil", shortLabel: "Perfil", Icon: User },
  { href: "/instructor/veiculo", label: "Veículo", shortLabel: "Veículo", Icon: Car },
];

export function isInstructorLinkActive(pathname: string, href: string): boolean {
  if (href === "/instructor/dashboard") return pathname === "/instructor/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
