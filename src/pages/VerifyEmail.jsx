import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "../lib/api";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const mutation = useMutation({
    mutationFn: () => api.verifyEmail(token),
    onSuccess: () => {
      toast.success("Email verified. You can now sign in.");
      setTimeout(() => navigate("/login"), 1000);
    },
    onError: (err) => {
      const message = err?.response?.data?.message || err.message || "Verification failed";
      toast.error(message);
    },
  });

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative flex flex-col gap-6 bg-ink px-10 py-12 text-slate-100">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Energy Wallet</p>
        <h1 className="font-display text-4xl">Verify your email address.</h1>
        <p className="text-slate-300">
          Verified emails receive vend tokens, transaction receipts, and low credit alerts.
        </p>
        <div className="card bg-white/10 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Why this matters</p>
          <p className="mt-3 text-sm text-slate-200">
            We use verification to keep meter access secure and avoid top-up errors.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-8 py-12">
        <div className="card w-full max-w-md">
          <h2 className="font-display text-2xl">Check your inbox</h2>
          <p className="text-sm text-muted">
            Tap the button below once you have clicked the verification link.
          </p>
          <button
            className="button-primary mt-6 w-full"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Verifying..." : "I have verified"}
          </button>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span>Already verified?</span>
            <Link className="text-brand" to="/login">
              Return to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
