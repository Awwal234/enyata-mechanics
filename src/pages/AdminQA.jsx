import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Layout from "../components/Layout.jsx";
import { api } from "../lib/api";

export default function AdminQA() {
  const form = useForm({
    defaultValues: { meterNumber: "", credit: 500 },
  });

  const { data: meters = [] } = useQuery({
    queryKey: ["meters"],
    queryFn: api.listMeters,
  });

  const primaryMeter = meters[0];

  useEffect(() => {
    if (!primaryMeter?.meterNumber) return;
    const currentMeter = form.getValues("meterNumber");
    if (!currentMeter) {
      form.setValue("meterNumber", primaryMeter.meterNumber, {
        shouldValidate: true,
      });
    }
  }, [primaryMeter?.meterNumber, form]);

  const validateMutation = useMutation({
    mutationFn: (type) =>
      type === "ikedc"
        ? api.validateIkeja({ meterNumber: form.getValues("meterNumber") })
        : api.validateMeter({ meterNumber: form.getValues("meterNumber") }),
    onSuccess: () => toast.success("Validation request sent."),
    onError: (err) => toast.error(err.message || "Validation failed"),
  });

  const qaMutation = useMutation({
    mutationFn: () =>
      api.applyQaElectricity(form.getValues("meterNumber"), {
        credit: Number(form.getValues("credit")),
        units: 4.2,
      }),
    onSuccess: () => toast.success("QA electricity data applied."),
    onError: (err) => toast.error(err.message || "QA request failed"),
  });

  const iotMutation = useMutation({
    mutationFn: () =>
      api.sendCreditUpdate({
        meterNumber: form.getValues("meterNumber"),
        creditLevel: Number(form.getValues("credit")),
      }),
    onSuccess: (res) => {
      console.log("IoT credit update success:", res);
      if (res?.autoTopupError) {
        toast.error("IoT credit update completed, but auto top-up failed.");
        return;
      }
      toast.success("IoT credit update sent.");
    },
    onError: (err) => {
      console.error("IoT credit update error:", err);
      toast.error(err.message || "IoT update failed");
    },
  });

  return (
    <Layout title="Admin & QA">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="font-display text-lg">Meter Validation</h3>
          <p className="text-sm text-muted">
            Run validation endpoints used by support and operations teams.
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-semibold">Meter number</label>
              <input
                className="input mt-2"
                inputMode="numeric"
                placeholder="11-digit meter number"
                {...form.register("meterNumber", {
                  required: "Meter number is required.",
                  pattern: {
                    value: /^[0-9]{11}$/,
                    message: "Meter number must be 11 digits.",
                  },
                })}
              />
              {form.formState.errors.meterNumber && (
                <p className="mt-2 text-xs text-danger">
                  {form.formState.errors.meterNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <button
                className="button-outline w-full"
                onClick={async () => {
                  const ok = await form.trigger("meterNumber");
                  if (!ok) return;
                  validateMutation.mutate();
                }}
              >
                Validate meter
              </button>
              <button
                className="button-outline w-full"
                onClick={async () => {
                  const ok = await form.trigger("meterNumber");
                  if (!ok) return;
                  validateMutation.mutate("ikedc");
                }}
              >
                Validate IKEDC
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-display text-lg">IOT Manual Trigger</h3>
          <p className="text-sm text-muted">Trigger low credit manually</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-semibold">Credit (NGN)</label>
              <input
                className="input mt-2"
                type="number"
                {...form.register("credit")}
              />
            </div>
            <div className="space-y-3">
              {/* <button className="button-outline w-full" onClick={() => qaMutation.mutate()}>
                Apply QA electricity
              </button> */}
              <button
                className="button-outline w-full"
                onClick={() => iotMutation.mutate()}
              >
                Send IoT credit update
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
