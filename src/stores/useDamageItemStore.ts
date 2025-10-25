import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import type { DamageDoc, DamageStatus } from "@/types/damageitem";

type Filters = {
  q?: string;
  status?: DamageStatus[];
  datePreset?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  creator?: string | null;
  destroyer?: string | null;
};

type State = {
  damageItems: DamageDoc[];
  isLoading: boolean;
  error: string | null;
  filters: Filters;
};

type Actions = {
  setFilters: (p: Partial<Filters>) => void;
  resetFilters: () => void;
  getAllDamageItems: () => Promise<void>;
};

export const useDamageItemStore = create<State & Actions>()(
  immer((set, get) => ({
    damageItems: [],
    isLoading: false,
    error: null,
    filters: { q: "", datePreset: "Tháng này" },

    setFilters: (p) =>
      set((s) => {
        s.filters = { ...s.filters, ...p };
      }),

    resetFilters: () =>
      set((s) => {
        s.filters = { q: "", datePreset: "Tháng này" };
      }),

    getAllDamageItems: async () => {
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
        const res = await api.get<DamageDoc[]>("/damageitems", { params });
        set((s) => {
          s.damageItems = res.data;
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
