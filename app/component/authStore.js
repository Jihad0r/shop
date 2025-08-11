import { create } from "zustand";
import { toast } from "react-hot-toast";

const useAuthStore = create((set, get) => ({
  user: null,
  isAdmin: false,

  setUser: (user, isAdmin) => set({ user, isAdmin }),

  clearUser: () => set({ user: null, isAdmin: false }),

  checkAuth: async (router) => {
    try {
      const res = await fetch("/api/users/me");
      if (!res.ok) {
        get().clearUser();
        if (router) router.push("/");
        return;
      }

      const data = await res.json();
      get().setUser(data.user, data.isAdmin);
    } catch (err) {
      toast.error("Auth check failed");
      get().clearUser();
      if (router) router.push("/");
    }
  },
}));

export default useAuthStore;
