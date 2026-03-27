import React from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Layout from "../components/Layout.jsx";
import { api } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";

export default function MeterDetail() {
  const { meterNumber } = useParams();
  const { data: meter } = useQuery({
    queryKey: ["meter", meterNumber],
    queryFn: () => api.getMeter(meterNumber),
  });

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: { threshold: "", isActive: true },
  });

  React.useEffect(() => {
    if (meter) {
      setValue("threshold", meter.threshold);
      setValue("isActive", meter.isActive);
    }
  }, [meter, setValue]);

  const updateMutation = useMutation({
    mutationFn: (payload) => api.updateMeterConfig(meterNumber, payload),
    onSuccess: () => toast.success("Configuration updated."),
    onError: (err) => toast.error(err.message || "Update failed"),
  });

  const validationMutation = useMutation({
    mutationFn: (type) =>
      type === "ikedc"
        ? api.validateIkeja({ meterNumber })
        : api.validateMeter({ meterNumber }),
    onSuccess: () => toast.success("Validation request sent."),
    onError: (err) => toast.error(err.message || "Validation failed"),
  });

  const qaMutation = useMutation({
    mutationFn: () =>
      api.applyQaElectricity(meterNumber, {
        credit: 1200,
        units: 8.5,
      }),
    onSuccess: () => toast.success("QA electricity data applied."),
    onError: (err) => toast.error(err.message || "QA apply failed"),
  });

  const onSubmit = handleSubmit((values) =>
    updateMutation.mutate({
      threshold: Number(values.threshold),
      isActive: Boolean(values.isActive),
    }),
  );

  return (
    <Layout title={`Meter ${meterNumber}`}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="font-display text-lg">Meter Snapshot</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Current credit
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                {formatCurrency(meter?.currentCredit || 0)}
              </h2>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Disco
              </p>
              <h4 className="mt-2 text-lg font-semibold">
                {meter?.disco || "--"}
              </h4>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Last update
              </p>
              <h4 className="mt-2 text-lg font-semibold">
                {formatDate(meter?.lastUpdated)}
              </h4>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-200 pt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Location
            </p>
            <p className="mt-2 text-sm font-semibold">
              {meter?.location || "--"}
            </p>
          </div>
        </div>

        <div className="card">
          <h3 className="font-display text-lg">Update Configuration</h3>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-semibold">
                Auto top-up threshold (NGN)
              </label>
              <input
                className="input mt-2"
                type="number"
                {...register("threshold")}
              />
            </div>
            <label className="flex items-center justify-between text-sm font-semibold">
              Meter active
              <input
                type="checkbox"
                className="h-4 w-4"
                {...register("isActive")}
              />
            </label>
            <button
              className="button-primary"
              type="submit"
              disabled={updateMutation.isPending}
            >
              Save configuration
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card">
          <h3 className="font-display text-lg">Auto Top-up Guard</h3>
          <p className="text-sm text-muted">
            Auto top-up will only trigger if the meter is active and credit is
            below the threshold.
          </p>
          <div className="mt-4">
            <span
              className={meter?.isActive ? "badge-success" : "badge-danger"}
            >
              {meter?.isActive ? "Auto top-up eligible" : "Auto top-up paused"}
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
