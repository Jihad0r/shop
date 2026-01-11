// stores/useCartStore.js
import { create } from 'zustand';
import toast from 'react-hot-toast';

const useCartStore = create((set) => ({
  carts: [],
  isLoading: false,

  // Fetch cart items
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/carts`);
      
      if (!res.ok) throw new Error("Failed to fetch cart");
      
      const data = await res.json();
      set({ carts: data || [], isLoading: false });
    } catch (err) {
      toast.error(err.message);
      set({ isLoading: false });
    }
  },
  clearCart: () => {
    set({ carts: [] });
  },
}));

export default useCartStore;