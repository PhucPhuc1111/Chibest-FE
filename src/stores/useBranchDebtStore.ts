import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import type { AxiosError } from "axios";
import type {
  BranchDebtHistory,
  BranchDebtListItem,
  BranchDebtTransactionType,
} from "@/types/branch";

export type BranchDebtFilters = {
  search?: string;
  totalFrom?: number | null;
  totalTo?: number | null;
  datePreset?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  debtFrom?: number | null;
  debtTo?: number | null;
  pageIndex?: number;
  pageSize?: number;
};

type State = {
  data: BranchDebtListItem[];
  detail: BranchDebtListItem | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  isSubmittingTransaction: boolean;
  error: string | null;
  filters: BranchDebtFilters;
  total: number;
};

type Actions = {
  setFilters: (payload: Partial<BranchDebtFilters>) => void;
  resetFilters: () => void;
  getAll: () => Promise<void>;
  getById: (id: string, transactionType?: string) => Promise<void>;
  createTransaction: (params: CreateTransactionParams) => Promise<void>;
};

type BranchDebtHistoryApiItem = {
  id?: string;
  "transaction-type"?: string;
  "transaction-date"?: string;
  amount?: number;
  "balance-before"?: number;
  "balance-after"?: number;
  note?: string;
  "created-at"?: string;
};

type BranchDebtApiItem = {
  id: string;
  "branch-name"?: string;
  email?: string | null;
  "total-debt"?: number;
  "paid-amount"?: number;
  "return-amount"?: number;
  "remaining-debt"?: number;
  "last-transaction-date"?: string;
  "last-updated"?: string;
  "branch-debt-histories"?: BranchDebtHistoryApiItem[];
};

type BranchDebtApiResponse = {
  "status-code": number;
  message: string;
  data: BranchDebtApiItem[];
  totalRecords?: number;
};

type BranchDebtDetailApiResponse = {
  "status-code": number;
  message: string;
  data: BranchDebtApiItem;
};

type BranchDebtTransactionInput = {
  transactionType: BranchDebtTransactionType | string;
  transactionDate: string;
  amount: number;
  note?: string;
  createdAt?: string;
};

type CreateTransactionParams = {
  branchDebtId: string;
  transactions: BranchDebtTransactionInput[];
  filterType?: string;
};

const adaptBranchDebtHistory = (
  history: BranchDebtHistoryApiItem
): BranchDebtHistory => ({
  id: history.id,
  transactionType: history["transaction-type"],
  transactionDate: history["transaction-date"],
  amount: history.amount,
  balanceBefore: history["balance-before"],
  balanceAfter: history["balance-after"],
  note: history.note,
  createdAt: history["created-at"],
});

const adaptBranchDebtItem = (item: BranchDebtApiItem): BranchDebtListItem => {
  const rawHistories = Array.isArray(item["branch-debt-histories"])
    ? item["branch-debt-histories"]
    : [];

  return {
    id: item.id,
    name: item["branch-name"] ?? "",
    email: item.email ?? null,
    totalDebt: item["total-debt"] ?? 0,
    paidAmount: item["paid-amount"] ?? 0,
    returnAmount: item["return-amount"] ?? 0,
    remainingDebt: item["remaining-debt"] ?? 0,
    lastTransactionDate: item["last-transaction-date"],
    lastUpdated: item["last-updated"],
    debtHistories: rawHistories.map(adaptBranchDebtHistory),
  };
};

export const useBranchDebtStore = create<State & Actions>()(
  immer((set, get) => ({
    data: [],
    detail: null,
    isLoading: false,
    isLoadingDetail: false,
    isSubmittingTransaction: false,
    error: null,
    filters: {
      search: "",
      datePreset: "Toàn thời gian",
      pageIndex: 1,
      pageSize: 15,
    },
    total: 0,

    setFilters: (payload) =>
      set((state) => {
        state.filters = { ...state.filters, ...payload };
      }),

    resetFilters: () =>
      set((state) => {
        state.filters = {
          search: "",
          datePreset: "Toàn thời gian",
          pageIndex: 1,
          pageSize: 15,
        };
      }),

    getAll: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      const { filters } = get();
      const params: Record<string, unknown> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || value === "all") {
          return;
        }
        params[key] = value;
      });

      try {
        const res = await api.get<BranchDebtApiResponse>("/api/branch-debt", {
          params,
        });
        const list = res.data?.data ?? [];

        set((state) => {
          state.data = list.map(adaptBranchDebtItem);
          state.isLoading = false;
          state.total = res.data?.totalRecords ?? list.length;
        });
      } catch (rawError) {
        const error = rawError as AxiosError<{ message?: string }>;
        set((state) => {
          state.isLoading = false;
          state.data = [];
          state.total = 0;
          state.error =
            error.response?.data?.message ??
            (error instanceof Error ? error.message : "Fetch error");
        });
      }
    },

    getById: async (id: string, transactionType: string = "all") => {
      set((state) => {
        state.isLoadingDetail = true;
        state.error = null;
      });

      try {
        const params = transactionType !== "all" ? { transactionType } : undefined;
        const res = await api.get<BranchDebtDetailApiResponse>(
          `/api/branch-debt/${encodeURIComponent(id)}`,
          { params }
        );
        const payload = res.data?.data;

        set((state) => {
          state.detail = payload ? adaptBranchDebtItem(payload) : null;
          state.isLoadingDetail = false;
        });
      } catch (rawError) {
        const error = rawError as unknown;
        set((state) => {
          state.isLoadingDetail = false;
          state.error = error instanceof Error ? error.message : "Fetch error";
        });
      }
    },

    createTransaction: async ({ branchDebtId, transactions, filterType }: CreateTransactionParams) => {
      set((state) => {
        state.isSubmittingTransaction = true;
        state.error = null;
      });

      const payload = transactions.map((txn) => ({
        "transaction-type": txn.transactionType,
        "transaction-date": txn.transactionDate,
        amount: txn.amount,
        note: txn.note,
        "created-at": txn.createdAt ?? txn.transactionDate,
      }));

      try {
        await api.post("/branch-debt", payload, {
          params: { branchDebtId },
        });

        await get().getById(branchDebtId, filterType);
        await get().getAll();
      } catch (rawError) {
        const error = rawError as AxiosError<{ message?: string }>;
        const message =
          error.response?.data?.message ??
          (error instanceof Error ? error.message : "Create transaction error");

        set((state) => {
          state.error = message;
        });
        throw new Error(message);
      } finally {
        set((state) => {
          state.isSubmittingTransaction = false;
        });
      }
    },
  }))
);

