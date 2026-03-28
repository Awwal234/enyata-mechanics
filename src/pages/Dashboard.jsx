import React from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { api } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { data: meters = [] } = useQuery({
    queryKey: ["meters"],
    queryFn: api.listMeters,
  });
  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: api.listTransactions,
  });

  const primaryMeter = meters[0];
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const recentTransactions = sortedTransactions.slice(0, 5);
  const creditStatus =
    primaryMeter?.currentCredit <= primaryMeter?.threshold
      ? "Below threshold"
      : "Healthy";

  const iotMutation = useMutation({
    mutationFn: () =>
      api.sendCreditUpdate({
        meterNumber: primaryMeter?.meterNumber,
        creditLevel: 10,
      }),
    onSuccess: (res) => {
      if (res?.autoTopupError) {
        toast.error("IoT credit update completed, but auto top-up failed.");
        return;
      }
      toast.success("IoT credit update sent.");
    },
    onError: (err) => toast.error(err.message || "IoT update failed"),
  });

  return (
    <Layout title="Dashboard Overview">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div
          className={`rounded-3xl border ${creditStatus === "Below threshold" ? "border-danger" : "border-slate-200"}   bg-white p-6`}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Current Credit
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-ink">
            {formatCurrency(primaryMeter?.currentCredit || 0)}
          </h3>
          <p
            className={`mt-2 text-sm ${
              creditStatus === "Below threshold" ? "text-danger" : "text-muted"
            }`}
          >
            {creditStatus}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Threshold
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-ink">
            {formatCurrency(primaryMeter?.threshold || 0)}
          </h3>
          <p className="mt-2 text-sm text-muted">
            Meter {primaryMeter?.meterNumber || "--"}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-ink">Quick actions</h3>
              <p className="text-sm text-muted">Move faster with shortcuts.</p>
            </div>
            <span className="badge-info">Secure</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <button
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-ink"
              onClick={() => iotMutation.mutate()}
              disabled={!primaryMeter?.meterNumber || iotMutation.isPending}
            >
              {iotMutation.isPending ? "Sending..." : "Simulate IOT top-up"}
            </button>
            {/* <button className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-ink">
              Add meter
            </button> */}
            <button className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-ink">
              Download receipt
            </button>
          </div>
          <div className="mt-6 grid gap-3">
            {meters.map((meter) => (
              <div
                key={meter.meterNumber}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {meter.meterNumber}
                  </p>
                  <p className="text-xs text-muted">{meter.location}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span>{formatCurrency(meter.currentCredit)}</span>
                  <span
                    className={
                      meter.currentCredit <= meter.threshold
                        ? "badge-danger"
                        : "badge-success"
                    }
                  >
                    {meter.currentCredit <= meter.threshold
                      ? "Needs top-up"
                      : "Healthy"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-ink">
                Recent Transactions
              </h3>
              <p className="text-sm text-muted">
                Latest payments and OTP flows.
              </p>
            </div>
            <button className="button-outline text-sm">View all</button>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="grid grid-cols-4 gap-3 text-xs uppercase tracking-[0.2em] text-muted">
              <span>Meter</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Time</span>
            </div>
            {recentTransactions.map((tx) => (
              <div className="grid grid-cols-4 gap-3" key={tx.id}>
                <span>{tx.meterNumber}</span>
                <span>{formatCurrency(tx.amount)}</span>
                <span>
                  <StatusBadge status={tx.status} />
                </span>
                <span>{formatDate(tx.createdAt)}</span>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <p className="text-sm text-muted">No recent transactions yet.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
