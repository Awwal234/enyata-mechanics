import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Layout from "../components/Layout.jsx";
import { api } from "../lib/api";
import { useSettingsStore } from "../store/settings";
import { formatCurrency } from "../lib/format";

const guessBrand = (digits) => {
  if (digits.startsWith("4")) return "Visa";
  if (digits.startsWith("5")) return "Mastercard";
  if (digits.startsWith("3")) return "Amex";
  return "Card";
};

const maskCard = (digits) => {
  const last4 = digits.slice(-4);
  return last4 ? `**** **** **** ${last4}` : "";
};

export default function Settings() {
  const authData = useSettingsStore((state) => state.authData);
  const topupAmount = useSettingsStore((state) => state.topupAmount);
  const setAuthData = useSettingsStore((state) => state.setAuthData);
  const setTopupAmount = useSettingsStore((state) => state.setTopupAmount);

  const authForm = useForm({
    defaultValues: {
      cardNumber: "",
      expiry: authData?.expiry || "",
      cvv: "",
      pin: "",
      saveCard: true,
    },
  });
  const cardNumberValue = authForm.watch("cardNumber");

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const topupForm = useForm({
    defaultValues: { amount: topupAmount || 0 },
  });

  const authMutation = useMutation({
    mutationFn: (payload) => api.storeAuthData(payload),
    onSuccess: () => toast.success("Card auth data stored for auto top-up."),
    onError: (err) => toast.error(err.message || "Failed to store auth data"),
  });

  const topupMutation = useMutation({
    mutationFn: (payload) => api.setTopupAmount(payload),
    onSuccess: () => toast.success("Auto top-up amount updated."),
    onError: (err) => toast.error(err.message || "Failed to update top-up amount"),
  });

  const onSaveAuth = authForm.handleSubmit((values) => {
    const digits = values.cardNumber.replace(/\s+/g, "");
    if (!/^[0-9]{12,19}$/.test(digits)) {
      toast.error("Enter a valid card number.");
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(values.expiry)) {
      toast.error("Expiry must be in MM/YY format.");
      return;
    }
    if (!/^[0-9]{4}$/.test(values.pin)) {
      toast.error("PIN must be 4 digits.");
      return;
    }
    const [mm, yy] = values.expiry.split("/");
    const expiryYYMM = `${yy}${mm}`;
    const authPayload = {
      last4: digits.slice(-4),
      brand: guessBrand(digits),
      expiry: values.expiry,
      masked: maskCard(digits),
      token: null,
    };
    setAuthData(authPayload);
    authMutation.mutate({
      pan: digits,
      pin: values.pin,
      expiryYYMM,
      cvv2: values.cvv,
    });
    authForm.reset({
      cardNumber: "",
      expiry: values.expiry,
      cvv: "",
      pin: "",
      saveCard: values.saveCard,
    });
  });

  const onSaveTopup = topupForm.handleSubmit((values) => {
    const amount = Number(values.amount || 0);
    setTopupAmount(amount);
    topupMutation.mutate({ amount });
  });

  return (
    <Layout title="Settings">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="font-display text-lg">Store Card Auth Data</h3>
          <p className="text-sm text-muted">
            Add a card to enable auto top-up. We only store a tokenized reference.
          </p>
          <div className="mt-4 rounded-2xl bg-slate-900 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Saved card</p>
            <p className="mt-3 text-lg font-semibold">
              {authData?.masked || "**** **** **** 0000"}
            </p>
            <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
              <span>{authData?.brand || "Card"}</span>
              <span>{authData?.expiry || "MM/YY"}</span>
            </div>
          </div>
          <form onSubmit={onSaveAuth} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold">Card number</label>
              <input
                className="input mt-2"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={cardNumberValue}
                {...authForm.register("cardNumber", {
                  required: true,
                  onChange: (e) =>
                    authForm.setValue("cardNumber", formatCardNumber(e.target.value)),
                })}
              />
              <p className="mt-1 text-xs text-muted">We will only store the last 4 digits.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-semibold">Expiry (MM/YY)</label>
                <input className="input mt-2" placeholder="12/29" {...authForm.register("expiry", { required: true })} />
              </div>
              <div>
                <label className="text-sm font-semibold">CVV</label>
                <input
                  className="input mt-2"
                  type="password"
                  inputMode="numeric"
                  placeholder="123"
                  {...authForm.register("cvv", { required: true, minLength: 3 })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Card PIN</label>
                <input
                  className="input mt-2"
                  type="password"
                  inputMode="numeric"
                  placeholder="1234"
                  {...authForm.register("pin", { required: true, minLength: 4, maxLength: 4 })}
                />
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" className="h-4 w-4" {...authForm.register("saveCard")} />
              Save card for auto top-up
            </label>
            <button className="button-primary" type="submit" disabled={authMutation.isPending}>
              Store card auth
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="font-display text-lg">Auto Top-up Amount</h3>
          <p className="text-sm text-muted">
            When credit falls below threshold, auto top-up will vend this amount.
          </p>
          <form onSubmit={onSaveTopup} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-semibold">Top-up amount (NGN)</label>
              <input className="input mt-2" type="number" {...topupForm.register("amount")} />
            </div>
            <button className="button-primary" type="submit" disabled={topupMutation.isPending}>
              Save amount
            </button>
          </form>
          <div className="mt-4 rounded-xl bg-slate-100 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Current stored amount</p>
            <h4 className="mt-2 text-lg font-semibold">
              {formatCurrency(topupAmount || 0)}
            </h4>
          </div>
        </div>
      </div>
    </Layout>
  );
}
