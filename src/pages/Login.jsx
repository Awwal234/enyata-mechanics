import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth";
import authIllustration from "../assets/auth-illustration.svg";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: api.login,
    onSuccess: (res) => {
      setAuth(res?.data?.token, res?.data?.user);
      toast.success("Welcome back.");
      navigate("/app/dashboard");
    },
    onError: (err) => {
      const message = err?.response?.data?.message || err.message || "Login failed";
      toast.error(message);
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-sm font-semibold text-white">
            PW
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Power as you go</p>
            <p className="text-xs text-muted">Secure prepaid payments</p>
          </div>
        </div>
        <Link className="text-sm font-semibold text-muted" to="/register">
          Create account
        </Link>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-16 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Sign in</p>
          <h1 className="mt-4 font-display text-3xl text-ink">
            Welcome back to reliable power payments.
          </h1>
          <p className="mt-3 text-sm text-muted">
            Monitor meters, automate top-ups, and keep receipts organized for your team.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold">Email address</label>
              <input
                className="input mt-2"
                type="email"
                placeholder="you@company.ng"
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Password</label>
                <button type="button" className="text-xs font-semibold text-brand">
                  Forgot?
                </button>
              </div>
              <div className="relative mt-2">
                <input
                  className="input pr-16"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 grid place-items-center text-brand"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button className="button-primary w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span>New here?</span>
            <Link className="text-brand" to="/register">
              Create an account
            </Link>
          </div>
          {formState.errors.email || formState.errors.password ? (
            <p className="mt-3 text-xs text-danger">Email and password are required.</p>
          ) : null}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <img
            src={authIllustration}
            alt="Payments illustration"
            className="h-full w-full rounded-2xl object-cover"
            loading="lazy"
          />
          <div className="mt-6 grid gap-3 text-sm text-muted">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Bank-grade encryption for every transaction.
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Instant receipts and OTP-secured workflows.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
