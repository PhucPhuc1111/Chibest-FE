import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import type { Transfer, TransferStatus } from "@/types/transfer";

type Filters = {
  q: string;
  status?: TransferStatus[];
  month?: string | null;
  fromBranch?: string | null;
  toBranch?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
};

type State = {
  transfers: Transfer[];
  details: Record<string, Transfer>; // cache chi tiết
  isLoading: boolean;
  error: string | null;
  filters: Filters;
};

type Actions = {
  setFilters: (p: Partial<Filters>) => void;
  resetFilters: () => void;
  getAllTransfers: () => Promise<void>;
  getTransferById: (id: string) => Promise<Transfer | undefined>;
  clearDetails: () => void;
};

export const useTransferStore = create<State & Actions>()(
  immer((set, get) => ({
    transfers: [],
    details: {},
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

    clearDetails: () =>
      set((s) => {
        s.details = {};
      }),

    getAllTransfers: async () => {
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
        const res = await api.get<Transfer[]>("/transfers", { params });
        set((s) => {
          s.transfers = res.data;
          s.isLoading = false;
          s.details = {}; // reset cache khi load list mới
        });
      } catch (e) {
        set((s) => {
          s.isLoading = false;
          s.error = e instanceof Error ? e.message : "Fetch error";
        });
      }
    },

    getTransferById: async (id: string) => {
      const cached = get().details[id];
      if (cached) return cached;

      try {
        const res = await api.get<Transfer>(`/transfers/${id}`);
        const transfer = res.data;
        set((s) => {
          s.details[id] = transfer;
        });
        return transfer;
      } catch (e) {
        set((s) => {
          s.error = e instanceof Error ? e.message : "Fetch error";
        });
      }
    },
  }))
);
