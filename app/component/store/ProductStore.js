import { create } from "zustand";

const ProductStore = create((set, get) => ({
  products: [],
  category:[],
  searchQuery: "",
  setProducts: (products) => set({ products }),
  setCategory:(category) => set({ category }),
  addProduct: (product) => set({ products: [...get().products, product] }),
  updateProduct: (updated) =>
    set({
      products: get().products.map((p) =>
        p._id === updated._id ? updated : p
      ),
    }),
  deleteProduct: (id) =>
    set({ products: get().products.filter((p) => p._id !== id) }),

  setSearchQuery: (query) => set({ searchQuery: query.toLowerCase().trim() }),

  filteredProducts: () => {
    const { products, searchQuery } = get();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery)
    );
  },
}));

export default ProductStore;
