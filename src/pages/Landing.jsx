import React, { useState } from "react";
import { Link } from "react-router-dom";
import landingIllustration from "../assets/landing-illustration.svg";

const features = [
  {
    title: "Instant Top-ups",
    description: "Fund meters in seconds with reliable payment rails and real-time confirmation.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
      </svg>
    ),
  },
  {
    title: "Smart Thresholds",
    description: "Stay ahead of outages with auto top-up triggers and clear alerts.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M4 6h10M4 18h7" />
      </svg>
    ),
  },
  {
    title: "Verified Meters",
    description: "Securely link and validate meters to protect every transaction.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a4 4 0 00-4 4v3H7a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2h-1V7a4 4 0 00-4-4z" />
      </svg>
    ),
  },
  {
    title: "Audit-ready Receipts",
    description: "Share clean receipts with your team or accountant anytime.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6m-6 4h10M5 4h14a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 012-2z" />
      </svg>
    ),
  },
];

const steps = [
  {
    title: "Create your account",
    description: "Sign up in minutes and invite your team.",
  },
  {
    title: "Link your meters",
    description: "Verify once and manage everything from one dashboard.",
  },
  {
    title: "Automate top-ups",
    description: "Store auth data and set a threshold for peace of mind.",
  },
];

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 text-ink">
      <header className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-sm font-semibold text-white">
              PW
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Power as you go</p>
              <p className="truncate text-xs text-muted">Payments for prepaid power</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            <span>Product</span>
            <span>Security</span>
            <span>Pricing</span>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link className="text-sm font-semibold text-muted" to="/login">
              Sign in
            </Link>
            <Link className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" to="/register">
              Get started
            </Link>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-ink transition hover:border-slate-300 md:hidden"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
        {isMenuOpen ? (
          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.08)] md:hidden">
            <nav className="flex flex-col gap-4 text-sm font-medium text-muted">
              <span>Product</span>
              <span>Security</span>
              <span>Pricing</span>
            </nav>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link className="rounded-full border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-muted" to="/login" onClick={closeMenu}>
                Sign in
              </Link>
              <Link className="rounded-full bg-ink px-4 py-3 text-center text-sm font-semibold text-white" to="/register" onClick={closeMenu}>
                Get started
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-16 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Trusted power platform</p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl">
              Power payments that feel as reliable as your bank.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted">
              Built for SMEs and individuals. Top up faster, automate thresholds, and
              keep every meter healthy with a single, secure dashboard.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white" to="/register">
                Create free account
              </Link>
              <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-ink">
                Talk to sales
              </button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.25em] text-muted">
              <span>Payments</span>
              <span>Receipts</span>
              <span>Auto top-up</span>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
            <img
              src={landingIllustration}
              alt="Dashboard illustration"
              className="h-full w-full rounded-2xl object-cover"
              loading="lazy"
            />
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Trusted by</p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-muted sm:grid-cols-4">
              {["Axis Foods", "Coreline", "Trestle", "Lumen"].map((name) => (
                <div key={name} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">How it works</p>
            <div className="mt-6 space-y-5">
              {steps.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ink">{step.title}</h4>
                    <p className="text-sm text-muted">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-ink p-6 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Product walkthrough</p>
            <div className="mt-6 flex h-48 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/70">
              Short video overview of the top-up flow, receipts, and alerts.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-16">
          <div className="rounded-3xl bg-ink px-8 py-10 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Ready to start?</p>
                <h2 className="mt-3 font-display text-3xl">Bring your meters under control.</h2>
                <p className="mt-2 text-sm text-white/70">
                  Secure payments, reliable automation, and clean reporting in one place.
                </p>
              </div>
              <Link className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink" to="/register">
                Create free account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Power as you go. All rights reserved.</span>
          <span>Reliable energy payments for growing teams and households.</span>
        </div>
      </footer>
    </div>
  );
}
