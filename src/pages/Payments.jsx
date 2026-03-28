import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Layout from "../components/Layout.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { api } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";

export default function Payments() {
  const queryClient = useQueryClient();
  const purchaseForm = useForm({ defaultValues: { meterNumber: "", amount: "" } });
  const otpForm = useForm({ defaultValues: { paymentId: "", otp: "" } });

  const { data: meters = [] } = useQuery({
    queryKey: ["meters"],
    queryFn: api.listMeters,
  });

  const primaryMeter = meters[0];

  useEffect(() => {
    if (!primaryMeter?.meterNumber) return;
    const currentMeter = purchaseForm.getValues("meterNumber");
    if (!currentMeter) {
      purchaseForm.setValue("meterNumber", primaryMeter.meterNumber, {
        shouldValidate: true,
      });
    }
  }, [primaryMeter?.meterNumber, purchaseForm]);

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: api.listTransactions,
  });

  useEffect(() => {
    if (!transactions.length) return;
    const currentId = otpForm.getValues("paymentId");
    if (currentId) return;
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const pending = sorted.find((tx) => tx.status === "OTP_REQUIRED");
    if (pending?.id) {
      otpForm.setValue("paymentId", pending.id, { shouldValidate: true });
    }
  }, [transactions, otpForm]);

  const purchaseMutation = useMutation({
    mutationFn: api.purchase,
    onSuccess: (res) => {
      if (res.status === "OTP_REQUIRED") {
        toast.info("OTP required. Enter the OTP to complete the purchase.");
        otpForm.setValue("paymentId", res.id);
      } else {
        toast.success("Purchase created.");
      }
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err) => {
      const providerCode = err?.response?.data?.providerCode || err?.response?.data?.code;
      const message = providerCode
        ? `${err.message} (Provider code: ${providerCode})`
        : err.message || "Purchase failed";
      toast.error(message);
    },
  });

  const otpMutation = useMutation({
    mutationFn: api.submitOtp,
    onSuccess: (res) => {
      if (res.status === "SUCCESS") {
        toast.success(`Vend success. Token: ${res.token}, Units: ${res.units} kWh`);
      } else {
        toast.info("OTP submitted.");
      }
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err) => toast.error(err.message || "OTP verification failed"),
  });

  return (
    <Layout
      title="Payments & Top-ups"
      action={<button className="button-primary">New purchase</button>}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="font-display text-lg">Manual Top-up</h3>
          <p className="text-sm text-muted">
            Create a purchase and complete OTP if required by Interswitch.
          </p>
          <form
            onSubmit={purchaseForm.handleSubmit((values) =>
              purchaseMutation.mutate({
                meterNumber: values.meterNumber,
                amount: Number(values.amount),
              })
            )}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="text-sm font-semibold">Meter number</label>
              <input className="input mt-2" {...purchaseForm.register("meterNumber", { required: true })} />
            </div>
            <div>
              <label className="text-sm font-semibold">Amount (NGN)</label>
              <input className="input mt-2" type="number" {...purchaseForm.register("amount", { required: true })} />
            </div>
            <button className="button-primary" type="submit" disabled={purchaseMutation.isPending}>
              Initiate purchase
            </button>
          </form>
        </div>
        <div className="card">
          <h3 className="font-display text-lg">OTP Verification</h3>
          <p className="text-sm text-muted">Complete a pending purchase.</p>
          <form
            onSubmit={otpForm.handleSubmit((values) => otpMutation.mutate(values))}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="text-sm font-semibold">Payment ID</label>
              <input className="input mt-2" {...otpForm.register("paymentId", { required: true })} />
            </div>
            <div>
              <label className="text-sm font-semibold">OTP</label>
              <input className="input mt-2" {...otpForm.register("otp", { required: true })} />
            </div>
            <button className="button-primary" type="submit" disabled={otpMutation.isPending}>
              Submit OTP
            </button>
          </form>
        </div>
      </div>

      <div className="card mt-8">
        <h3 className="font-display text-lg">Transaction History</h3>
        <p className="text-sm text-muted">Track status changes, tokens, and vend units.</p>
        <div className="mt-4 space-y-3 text-sm">
          <div className="grid grid-cols-6 gap-3 text-xs uppercase tracking-[0.2em] text-muted">
            <span>ID</span>
            <span>Meter</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Token</span>
            <span>Time</span>
          </div>
          {transactions.map((tx) => (
            <div className="grid grid-cols-6 gap-3" key={tx.id}>
              <span>{tx.id}</span>
              <span>{tx.meterNumber}</span>
              <span>{formatCurrency(tx.amount)}</span>
              <span>
                <StatusBadge status={tx.status} />
              </span>
              <span>{tx.token || "--"}</span>
              <span>{formatDate(tx.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
