// src/stores/usePurchaseOrderStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import type { PurchaseOrder, PurchaseOrderStatus } from "@/types/purchaseOrder";

type Filters = {
  q: string;
  status?: PurchaseOrderStatus[]; // nhiều trạng thái
  fromDate?: string | null;
  toDate?: string | null;
  datePreset?: string | null;
  creator?: string | null;
  receiver?: string | null;
  extraCostType?: string | null; // chi phí nhập trả NCC
};

type State = {
  list: PurchaseOrder[];
  detail: PurchaseOrder | null;
  isLoading: boolean;
  error: string | null;
  filters: Filters;
};

type Actions = {
  setFilters: (p: Partial<Filters>) => void;
  resetFilters: () => void;
  getAll: () => Promise<void>;
  getById: (id: string) => Promise<void>;
};

export const usePurchaseOrderStore = create<State & Actions>()(
  immer((set, get) => ({
    list: [],
    detail: null,
    isLoading: false,
    error: null,
    filters: { q: "" },

    setFilters: (p) =>
      set((s) => {
        s.filters = { ...s.filters, ...p };
      }),

    resetFilters: () =>
      set((s) => {
        s.filters = { q: "" };
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
        const res = await api.get<PurchaseOrder[]>("/purchaseOrders", {
          params,
        });
        set((s) => {
          s.list = res.data;
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
        s.isLoading = true;
        s.error = null;
      });

      try {
        const res = await api.get<PurchaseOrder>(`/purchaseOrders/${id}`);
        set((s) => {
          s.detail = res.data;
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
