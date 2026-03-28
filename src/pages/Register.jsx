import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth";
import authIllustration from "../assets/auth-illustration.svg";

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      businessName: "",
      email: "",
      phone: "",
      password: "",
      meterNumber: "",
      disco: "ikedc",
      meterType: "prepaid",
    },
  });

  const mutation = useMutation({
    mutationFn: api.register,
    onSuccess: (res) => {
      setAuth(res?.data?.token, res?.data?.user);
      toast.success("Account created. Verify your email.");
      navigate("/verify-email");
    },
    onError: (err) => {
      const message = err?.response?.data?.message || err.message || "Registration failed";
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
            <p className="text-xs text-muted">Onboard in minutes</p>
          </div>
        </div>
        <Link className="text-sm font-semibold text-muted" to="/login">
          Sign in
        </Link>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-16 pt-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <img
            src={authIllustration}
            alt="Onboarding illustration"
            className="h-full w-full rounded-2xl object-cover"
            loading="lazy"
          />
          <div className="mt-6 grid gap-3 text-sm text-muted">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Verified meters and secure card storage.
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Auto top-up rules that keep power stable.
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Create account</p>
          <h1 className="mt-4 font-display text-3xl text-ink">
            Start managing prepaid power like a pro.
          </h1>
          <p className="mt-3 text-sm text-muted">
            Link your first meter, set a threshold, and get immediate payment receipts.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Business name</label>
              <input className="input mt-2" {...register("businessName", { required: true })} />
            </div>
            <div>
              <label className="text-sm font-semibold">Email address</label>
              <input className="input mt-2" type="email" {...register("email", { required: true })} />
            </div>
            <div>
              <label className="text-sm font-semibold">Phone number</label>
              <input className="input mt-2" type="tel" {...register("phone", { required: true })} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Password</label>
              <div className="relative mt-2">
                <input
                  className="input pr-16"
                  type={showPassword ? "text" : "password"}
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
            <div>
              <label className="text-sm font-semibold">Meter number</label>
              <input className="input mt-2" {...register("meterNumber", { required: true })} />
            </div>
            <div>
              <label className="text-sm font-semibold">Disco</label>
              <select className="input mt-2" {...register("disco", { required: true })}>
                <option value="ikedc">IKEDC</option>
                <option value="ekedc">EKEDC</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold">Meter type</label>
              <select className="input mt-2" {...register("meterType", { required: true })}>
                <option value="prepaid">Prepaid</option>
                <option value="postpaid">Postpaid</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button className="button-primary w-full" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Create account"}
              </button>
            </div>
          </form>
          {formState.isSubmitted && Object.keys(formState.errors).length > 0 ? (
            <p className="mt-3 text-xs text-danger">All fields are required.</p>
          ) : null}
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span>Already have an account?</span>
            <Link className="text-brand" to="/login">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
