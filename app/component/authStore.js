import { create } from "zustand";
import { toast } from "react-hot-toast";

const useAuthStore = create((set, get) => ({
  user: null,
  isAdmin: false,
  loading: false, 

  setUser: (user) => set({ 
    user, 
    isAdmin: user?.role === "admin" || false 
  }),

  clearUser: () => set({ user: null, isAdmin: false }),

  checkAuth: async (router) => {
    set({ loading: true }); 
    try {
      const res = await fetch("/api/users/me", { cache: "no-store" });
      const data = await res.json();

      get().setUser(data.user);
      return true;
    } catch (err) {
      toast.error("Auth check failed");
      get().clearUser();
      router.push("/");
      return false;
    } finally {
      set({ loading: false }); 
    }
  },
}));

export default useAuthStore;
