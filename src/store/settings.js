import { create } from "zustand";

const AUTHDATA_KEY = "energywallet.authData";
const TOPUP_KEY = "energywallet.topupAmount";

const loadAuthData = () => {
  const raw = localStorage.getItem(AUTHDATA_KEY);
  return raw ? JSON.parse(raw) : null;
};

const loadTopupAmount = () => {
  const raw = localStorage.getItem(TOPUP_KEY);
  return raw ? Number(raw) : 0;
};

export const useSettingsStore = create((set) => ({
  authData: loadAuthData(),
  topupAmount: loadTopupAmount(),
  setAuthData: (data) => {
    if (data) localStorage.setItem(AUTHDATA_KEY, JSON.stringify(data));
    else localStorage.removeItem(AUTHDATA_KEY);
    set({ authData: data || null });
  },
  setTopupAmount: (amount) => {
    if (amount) localStorage.setItem(TOPUP_KEY, String(amount));
    else localStorage.removeItem(TOPUP_KEY);
    set({ topupAmount: amount || 0 });
  },
}));
