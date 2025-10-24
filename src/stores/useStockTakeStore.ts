import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import type { StockTake, StockTakeStatus } from "@/types/stocktake";

type Filters = {
  q?: string;
  status?: StockTakeStatus[];
  creator?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
   dateRange?: string | null;
    datePreset?: string | null; 
};

type State = {
  stockTakes: StockTake[];
  details: Record<string, StockTake>;
  isLoading: boolean;
  filters: Filters;
  error: string | null;
};

type Actions = {
  setFilters: (p: Partial<Filters>) => void;
  resetFilters: () => void;
  getAllStockTakes: () => Promise<void>;
  getStockTakeById: (id: string) => Promise<void>;
  clearDetails: () => void;
};

export const useStockTakeStore = create<State & Actions>()(
  immer((set, get) => ({
    stockTakes: [],
    details: {},
    isLoading: false,
    filters: {},
    error: null,

    setFilters: (p) => set((s) => { s.filters = { ...s.filters, ...p }; }),
    resetFilters: () => set((s) => { s.filters = {}; }),
    clearDetails: () => set((s) => { s.details = {}; }),

    getAllStockTakes: async () => {
      set((s) => { s.isLoading = true; });
      const { filters } = get();
      const params: Record<string, unknown> = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "" || v === "all") return;
        params[k] = v;
      });
      try {
        const res = await api.get<StockTake[]>("/stocktakes", { params });
        set((s) => {
          s.stockTakes = res.data;
          s.isLoading = false;
        });
      } catch (e) {
        set((s) => {
          s.isLoading = false;
          s.error = e instanceof Error ? e.message : "Fetch error";
        });
      }
    },

    getStockTakeById: async (id: string) => {
      const cached = get().details[id];
      if (cached) return;
      try {
        const res = await api.get<StockTake>(`/stocktakes/${id}`);
        set((s) => { s.details[id] = res.data; });
      } catch {
        /* silent */
      }
    },
  }))
);
