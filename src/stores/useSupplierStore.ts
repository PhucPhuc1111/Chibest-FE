import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import type { Supplier } from "@/types/supplier";

type Filters = {
  q?: string;
  group?: string | null;
  totalFrom?: number | null;
  totalTo?: number | null;
  datePreset?: string | null;  // "Toàn thời gian" | "Tháng này" | ...
  fromDate?: string | null;
  toDate?: string | null;
  debtFrom?: number | null;
  debtTo?: number | null;
  status?: ("Đang hoạt động" | "Ngừng hoạt động")[] | undefined;
};

type State = {
  data: Supplier[];
  detail: Supplier | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  filters: Filters;
};

type Actions = {
  setFilters: (p: Partial<Filters>) => void;
  resetFilters: () => void;
  getAll: () => Promise<void>;
  getById: (id: string) => Promise<void>;
};

export const useSupplierStore = create<State & Actions>()(
  immer((set, get) => ({
    data: [],
    detail: null,
    isLoading: false,
    isLoadingDetail: false,
    error: null,
    filters: {
      q: "",
      datePreset: "Toàn thời gian",
    },

    setFilters: (p) =>
      set((s) => {
        s.filters = { ...s.filters, ...p };
      }),

    resetFilters: () =>
      set((s) => {
        s.filters = { q: "", datePreset: "Toàn thời gian" };
      }),

    getAll: async () => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      const { filters } = get();
      const params: Record<string, unknown> = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "" || v === "all") return;
        params[k] = v;
      });

      try {
        const res = await api.get<Supplier[]>("/suppliers", { params });
        set((s) => {
          s.data = res.data;
          s.isLoading = false;
        });
      } catch (e) {
        set((s) => {
          s.isLoading = false;
          s.error = e instanceof Error ? e.message : "Fetch error";
        });
      }
    },

    getById: async (id: string) => {
      set((s) => {
        s.isLoadingDetail = true;
        s.error = null;
      });
      try {
        const res = await api.get<Supplier>(`/suppliers/${encodeURIComponent(id)}`);
        set((s) => {
          s.detail = res.data;
          s.isLoadingDetail = false;
        });
      } catch (e) {
        set((s) => {
          s.isLoadingDetail = false;
          s.error = e instanceof Error ? e.message : "Fetch error";
        });
      }
    },
  }))
);
