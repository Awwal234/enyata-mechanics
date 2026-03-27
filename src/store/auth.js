import { create } from "zustand";

const TOKEN_KEY = "energywallet.token";
const USER_KEY = "energywallet.user";

const loadToken = () => localStorage.getItem(TOKEN_KEY);
const loadUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const useAuthStore = create((set) => ({
  token: loadToken(),
  user: loadUser(),
  setAuth: (token, user) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
    set({ token: token || null, user: user || null });
  },
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null });
  },
}));
