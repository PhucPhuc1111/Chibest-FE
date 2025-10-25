import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import type { PriceBookItem, PriceBookFilters } from "@/types/pricebook";

type State = {
  items: PriceBookItem[];
  filters: PriceBookFilters;
  isLoading: boolean;
};

type Actions = {
  setFilters: (payload: Partial<PriceBookFilters>) => void;
  resetFilters: () => void;
  getAll: () => Promise<void>;
  updatePrice: (id: string, price: number) => void;
};

export const usePriceBookStore = create<State & Actions>()(
  immer((set) => ({
    items: [],
    filters: {},
    isLoading: false,

    setFilters: (payload) =>
      set((s) => {
        s.filters = { ...s.filters, ...payload };
      }),

    resetFilters: () =>
      set((s) => {
        s.filters = {};
      }),

    getAll: async () => {
      set((s) => {
        s.isLoading = true;
      });
      try {
        const res = await api.get<PriceBookItem[]>("/pricebook");
        set((s) => {
          s.items = res.data;
          s.isLoading = false;
        });
      } catch (e) {
        console.error(e);
        set((s) => {
          s.isLoading = false;
        });
      }
    },

    updatePrice: (id, price) =>
      set((s) => {
        const product = s.items.find((x) => x.id === id);
        if (product) product.commonPrice = price;
      }),
  }))
);
