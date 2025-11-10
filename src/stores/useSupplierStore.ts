import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import type { AxiosError } from "axios";
import type {
  Supplier,
  SupplierDebtHistory,
  SupplierDebtListItem,
} from "@/types/supplier";

export type SupplierFilters = {
  q?: string;
  totalFrom?: number | null;
  totalTo?: number | null;
  datePreset?: string | null;  // "Toàn thời gian" | "Tháng này" | "Tháng trước" | "Năm này" | "Năm trước" | "Hôm nay" | "Hôm qua"
  fromDate?: string | null;
  toDate?: string | null;
  debtFrom?: number | null;
  debtTo?: number | null;
  pageIndex?: number;
  pageSize?: number;
};

type State = {
  data: SupplierDebtListItem[];
  detail: Supplier | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  isSubmittingTransaction: boolean;
  isDeletingHistory: boolean;
  error: string | null;
  filters: SupplierFilters;
  total: number;
};

type Actions = {
  setFilters: (p: Partial<SupplierFilters>) => void;
  resetFilters: () => void;
  getAll: () => Promise<void>;
  getById: (id: string, transactionType?: string) => Promise<void>;
  createTransaction: (params: CreateTransactionParams) => Promise<void>;
  deleteHistory: (params: DeleteHistoryParams) => Promise<void>;
};

type SupplierDebtHistoryApiItem = {
  id?: string;
  "transaction-type"?: string;
  "transaction-date"?: string;
  amount?: number;
  "balance-before"?: number;
  "balance-after"?: number;
  note?: string;
  "created-at"?: string;
};

type SupplierDebtApiItem = {
  id: string;
  "supplier-name"?: string;
  "supplier-phone"?: string;
  "total-debt"?: number;
  "paid-amount"?: number;
  "return-amount"?: number;
  "remaining-debt"?: number;
  "last-transaction-date"?: string;
  "last-updated"?: string;
  "supplier-debt-histories"?: SupplierDebtHistoryApiItem[];
};

type SupplierDebtApiResponse = {
  "status-code": number;
  message: string;
  data: SupplierDebtApiItem[];
  totalRecords?: number;
};

type SupplierDebtDetailApiResponse = {
  "status-code": number;
  message: string;
  data: SupplierDebtApiItem;
};

type SupplierDebtTransactionInput = {
  transactionType: "Custom" | "Purchase" | "Return" | "Payment";
  transactionDate: string;
  amount: number;
  note?: string;
  createdAt?: string;
};

type CreateTransactionParams = {
  supplierDebtId: string;
  transactions: SupplierDebtTransactionInput[];
  filterType?: string;
};

type DeleteHistoryParams = {
  supplierDebtId: string;
  historyId: string;
  filterType?: string;
};

const adaptSupplierDebtHistory = (
  history: SupplierDebtHistoryApiItem
): SupplierDebtHistory => {
  const balanceAfter = history["balance-after"] ?? undefined;

  return {
    id: history.id,
    transactionType: history["transaction-type"],
    transactionDate: history["transaction-date"],
    amount: history.amount,
    balanceBefore: history["balance-before"],
    balanceAfter,
    note: history.note,
    description: history.note,
    createdAt: history["created-at"],
    remainingDebt: balanceAfter,
  };
};

const adaptSupplierDebtItem = (item: SupplierDebtApiItem): SupplierDebtListItem => {
  const rawHistories = Array.isArray(item["supplier-debt-histories"]) ? item["supplier-debt-histories"] : [];

  return {
    id: item.id,
    name: item["supplier-name"] ?? "",
    phone: item["supplier-phone"] ?? "",
    totalDebt: item["total-debt"] ?? 0,
    payAmount: item["paid-amount"] ?? 0,
    returnAmount: item["return-amount"] ?? 0,
    remainingDebt: item["remaining-debt"] ?? 0,
    totalPurchase: item["total-debt"] ?? 0,
    currentDebt: item["remaining-debt"] ?? 0,
    lastTransactionDate: item["last-transaction-date"],
    lastUpdated: item["last-updated"],
    status: "Đang hoạt động",
    creator: "",
    debts: [],
    debtHistories: rawHistories.map(adaptSupplierDebtHistory),
  };
};

export const useSupplierStore = create<State & Actions>()(
  immer((set, get) => ({
    data: [],
    detail: null,
    isLoading: false,
    isLoadingDetail: false,
    isSubmittingTransaction: false,
    isDeletingHistory: false,
    error: null,
    filters: {
      q: "",
      datePreset: "Toàn thời gian",
      pageIndex: 1,
      pageSize: 15,
    },
    total: 0,

    setFilters: (p) =>
      set((s) => {
        s.filters = { ...s.filters, ...p };
      }),

    resetFilters: () =>
      set((s) => {
        s.filters = { q: "", datePreset: "Toàn thời gian", pageIndex: 1, pageSize: 15 };
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
        const res = await api.get<SupplierDebtApiResponse>("/api/supplier-debt", { params });
        const list = res.data?.data ?? [];
        set((s) => {
          s.data = list.map(adaptSupplierDebtItem);
          s.isLoading = false;
          s.total = res.data?.totalRecords ?? list.length;
        });
      } catch (rawError) {
        const error = rawError as AxiosError<{ message?: string }>;
        set((s) => {
          s.isLoading = false;
          s.data = [];
          s.total = 0;
          s.error =
            error.response?.data?.message ??
            (error instanceof Error ? error.message : "Fetch error");
        });
      }
    },

    getById: async (id: string, transactionType: string = "all") => {
      set((s) => {
        s.isLoadingDetail = true;
        s.error = null;
      });
      try {
        const basePath = `/api/supplier-debt/${encodeURIComponent(id)}`;
        const params =
          transactionType !== "all"
            ? { transactionType }
            : undefined;

        const res = await api.get<SupplierDebtDetailApiResponse>(basePath, {
          params,
        });
        const payload = res.data?.data;
        set((s) => {
          s.detail = payload ? adaptSupplierDebtItem(payload) : null;
          s.isLoadingDetail = false;
        });
      } catch (e) {
        set((s) => {
          s.isLoadingDetail = false;
          s.error = e instanceof Error ? e.message : "Fetch error";
        });
      }
    },

    createTransaction: async ({ supplierDebtId, transactions, filterType }: CreateTransactionParams) => {
      set((s) => {
        s.isSubmittingTransaction = true;
        s.error = null;
      });

      const payload = transactions.map((txn) => ({
        "transaction-type": txn.transactionType,
        "transaction-date": txn.transactionDate,
        amount: txn.amount,
        note: txn.note,
        "created-at": txn.createdAt ?? txn.transactionDate,
      }));

      try {
        await api.post("/api/supplier-debt", payload, {
          params: { supplierDebtId },
        });

        await get().getById(supplierDebtId, filterType);
        await get().getAll();
      } catch (rawError) {
        const error = rawError as AxiosError<{ message?: string }>;
        const message =
          error.response?.data?.message ??
          (error instanceof Error ? error.message : "Create transaction error");

        set((s) => {
          s.error = message;
        });
        throw new Error(message);
      } finally {
        set((s) => {
          s.isSubmittingTransaction = false;
        });
      }
    },

    deleteHistory: async ({ supplierDebtId, historyId, filterType }: DeleteHistoryParams) => {
      set((s) => {
        s.isDeletingHistory = true;
        s.error = null;
      });

      try {
        await api.delete("/api/supplier-debt", {
          params: {
            supplierdebtId: supplierDebtId,
            historyId,
          },
        });

        await get().getById(supplierDebtId, filterType);
        await get().getAll();
      } catch (rawError) {
        const error = rawError as AxiosError<{ message?: string }>;
        const message =
          error.response?.data?.message ??
          (error instanceof Error ? error.message : "Delete history error");

        set((s) => {
          s.error = message;
        });
        throw new Error(message);
      } finally {
        set((s) => {
          s.isDeletingHistory = false;
        });
      }
    },
  }))
);
