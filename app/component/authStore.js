import { create } from "zustand";
import { toast } from "react-hot-toast";

const useAuthStore = create((set, get) => ({
  user: null,
  isAdmin: false,
  loading: false, 

  setUser: (user) => set({ 
    user:user, 
    isAdmin: user?.role === "admin" || false 
  }),

  clearUser: () => set({ user: null, isAdmin: false }),

  checkAuth: async (router) => {
    set({ loading: true }); 
    try {
      const res = await fetch("/api/users/me", {
        cache: "no-store",
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Not authenticated");
      }
      
      const data = await res.json();

<<<<<<< HEAD
=======
      if (!data.user) {
        throw new Error("No user data");
      }

>>>>>>> 7bb97d6 (fix auth and product bugs)
      get().setUser(data.user);
      return true;
    } catch (err) {
      get().clearUser();
      router.push("/");
      return false;
    } finally {
      set({ loading: false }); 
    }
  },
}));

export default useAuthStore;
