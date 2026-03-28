import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiZap,
  FiSettings,
  FiCreditCard,
  FiShield,
} from "react-icons/fi";
import { useAuthStore } from "../store/auth";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/app/meters", label: "Meters", icon: FiZap },
  { to: "/app/payments", label: "Payments", icon: FiCreditCard },
  { to: "/app/settings", label: "Settings", icon: FiSettings },
  { to: "/app/admin", label: "Admin/QA", icon: FiShield },
];

export default function Layout({ title, children, action }) {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <div className="min-h-screen gradient-bg">
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="flex flex-col gap-8 bg-ink px-6 py-8 text-slate-100">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand to-emerald-500 text-ink font-semibold">
              EW
            </div>
            <div>
              <p className="text-sm font-semibold">Energy Wallet</p>
              <p className="text-xs text-slate-400">Prepaid Control Center</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-brand/20 text-white"
                        : "text-slate-300 hover:bg-white/10"
                    }`
                  }
                >
                  <Icon className="text-base" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="mt-auto flex flex-col gap-3 rounded-xl bg-white/10 p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm font-semibold">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user?.email || "you@email.com"}
                </p>
              </div>
            </div>
            <button
              className="button-outline bg-danger text-white border-white/20"
              onClick={clearAuth}
            >
              Sign out
            </button>
          </div>
        </aside>
        <main className="px-6 py-8 md:px-10">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Power as you go
              </p>
              <h1 className="font-display text-2xl font-semibold text-ink">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {action}
              <button className="button-outline">Support</button>
            </div>
          </header>
          <section className="mt-8">{children}</section>
        </main>
      </div>
    </div>
  );
}
