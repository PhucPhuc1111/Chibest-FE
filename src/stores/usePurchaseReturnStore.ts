// src/stores/usePurchaseReturnStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import type { PurchaseReturn, PurchaseReturnStatus } from "@/types/purchaseReturn";

type Filters = {
  q: string;
  status?: PurchaseReturnStatus[];
  fromDate?: string | null;
  toDate?: string | null;
  datePreset?: string | null;
  creator?: string | null;
  receiver?: string | null;
  extraCostType?: string | null; // chi phí nhập hoàn lại NCC
};

type State = {
  list: PurchaseReturn[];
  detail: PurchaseReturn | null;
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

export const usePurchaseReturnStore = create<State & Actions>()(
  immer((set, get) => ({
    list: [],
    detail: null,
    isLoading: false,
    error: null,
    filters: { q: "" },

    // Cập nhật bộ lọc
    setFilters: (p) =>
      set((s) => {
        s.filters = { ...s.filters, ...p };
      }),

    // Reset toàn bộ filter
    resetFilters: () =>
      set((s) => {
        s.filters = { q: "" };
      }),

    // Lấy danh sách phiếu trả hàng
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
        const res = await api.get<PurchaseReturn[]>("/purchaseReturns", {
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

    // Lấy chi tiết phiếu trả hàng theo ID
    getById: async (id: string) => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      try {
        const res = await api.get<PurchaseReturn>(`/purchaseReturns/${id}`);
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
