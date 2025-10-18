import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import type { Product } from "@/types/product"; // ✅ dùng chung type chuẩn

type Filters = {
  q: string;
  group?: string | null;
  stock?: "all" | "out" | "in";
  createdFrom?: string | null;
  createdTo?: string | null;
  color?: string | null;
  size?: string | null;
  supplier?: string | null;
};

type State = {
  products: Product[];
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  filters: Filters;
};

type Actions = {
  setFilters: (p: Partial<Filters>) => void;
  resetFilters: () => void;
  getAllProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<void>;
};

export const useProductStore = create<State & Actions>()(
  immer((set, get) => ({
    products: [],
    product: null,
    isLoading: false,
    error: null,
    filters: { q: "", stock: "all" },

    setFilters: (p) =>
      set((s) => {
        s.filters = { ...s.filters, ...p };
      }),

    resetFilters: () =>
      set((s) => {
        s.filters = { q: "", stock: "all" };
      }),

    getAllProducts: async () => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      const { filters } = get();
      const params: Record<string, unknown> = {}; // ✅ không còn any
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "" && v !== "all")
          params[k] = v;
      });

      try {
        const res = await api.get<Product[]>("/products", { params });
        set((s) => {
          s.products = res.data;
          s.isLoading = false;
        });
      } catch (e) {
        set((s) => {
          s.isLoading = false;
          s.error = e instanceof Error ? e.message : "Fetch error";
        });
      }
    },

    getProductById: async (id: string) => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });
      try {
        const res = await api.get<Product>(`/products/${id}`);
        set((s) => {
          s.product = res.data;
          s.isLoading = false;
        });
      } catch (e) {
        set((s) => {
          s.isLoading = false;
          s.error = e instanceof Error ? e.message : "Fetch error";
        });
      }
    },
  }))
);
