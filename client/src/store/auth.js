import { create } from "zustand";

export const useAuth = create((set) => ({
  token: localStorage.getItem("plu_token") || null,
  member: JSON.parse(localStorage.getItem("plu_member") || "null"),
  setSession: ({ token, member }) => {
    localStorage.setItem("plu_token", token);
    localStorage.setItem("plu_member", JSON.stringify(member));
    set({ token, member });
  },
  clear: () => {
    localStorage.removeItem("plu_token");
    localStorage.removeItem("plu_member");
    set({ token: null, member: null });
  },
}));
