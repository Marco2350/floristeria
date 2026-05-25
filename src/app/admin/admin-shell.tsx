"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart3,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  Package,
  Percent,
  Repeat,
  ShoppingBag,
  Sparkles,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard, exact: true },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/suscripciones", label: "Suscripciones", icon: Repeat },
  { href: "/admin/cupones", label: "Cupones", icon: Percent },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/contactos", label: "Contactos", icon: MessageSquare },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Login page renders standalone
  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Sesión cerrada");
      router.push("/admin/login");
    } catch {
      toast.error("Error al cerrar sesión");
      setLoggingOut(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 z-30 flex h-screen flex-col border-r border-border/60 bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-border/60 px-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-display text-base tracking-tight"
          >
            <Sparkles className="size-5 text-primary" />
            {!collapsed && <span>Lirios admin</span>}
          </Link>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground lg:block"
            aria-label="Toggle sidebar"
          >
            <ChevronRight className={cn("size-4 transition-transform", collapsed ? "rotate-0" : "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-border/60 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <BarChart3 className="size-4" />
            {!collapsed && "Ver sitio público"}
          </Link>
          <button
            onClick={logout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" />
            {!collapsed && (loggingOut ? "Cerrando…" : "Cerrar sesión")}
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-x-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen p-6 sm:p-8 lg:p-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
