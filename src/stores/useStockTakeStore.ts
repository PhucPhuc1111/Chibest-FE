import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import {
  StockAdjustment,
  StockAdjustmentSummary,
  RawStockAdjustment,
  RawStockAdjustmentSummary,
  RawStockAdjustmentDetail,
  GetStockAdjustmentsParams,
  CreateStockAdjustmentRequest,
  UpdateStockAdjustmentRequest,
} from "@/types/stocktake";

interface StockTakeState {
  stockAdjustments: StockAdjustmentSummary[];
  currentStockAdjustment: StockAdjustment | null;
  isLoading: boolean;
  error: string | null;
}

interface StockTakeActions {
  getStockAdjustments: (params?: GetStockAdjustmentsParams) => Promise<{ success: boolean; message?: string }>;
  getStockAdjustmentById: (id: string) => Promise<{ success: boolean; message?: string }>;
  createStockAdjustment: (data: CreateStockAdjustmentRequest) => Promise<{ success: boolean; message?: string }>;
  updateStockAdjustment: (id: string, data: UpdateStockAdjustmentRequest) => Promise<{ success: boolean; message?: string }>;
  deleteStockAdjustment: (id: string) => Promise<{ success: boolean; message?: string }>;
  clearError: () => void;
  clearCurrentStockAdjustment: () => void;
}

export const useStockTakeStore = create<StockTakeState & StockTakeActions>()(
  immer((set) => ({
    stockAdjustments: [],
    currentStockAdjustment: null,
    isLoading: false,
    error: null,

    getStockAdjustments: async (params: GetStockAdjustmentsParams = {}) => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      try {
        const res = await api.get("/api/stock-adjustment", {
          params: {
            pageIndex: 1,
            pageSize: 100,
            ...params
          },
        });

        if (res.data["status-code"] === 200) {
          const stockAdjustments: StockAdjustmentSummary[] = res.data.data.map((item: RawStockAdjustmentSummary) => ({
            id: item.id,
            adjustmentCode: item["adjustment-code"],
            adjustmentDate: item["adjustment-date"],
            adjustmentType: item["adjustment-type"],
            totalValueChange: item["total-value-change"],
            status: item.status,
          }));

          set((s) => {
            s.stockAdjustments = stockAdjustments;
            s.isLoading = false;
          });
          return { success: true, message: res.data.message };
        } else {
          set((s) => { s.isLoading = false; });
          return { success: false, message: res.data.message || "Không có dữ liệu điều chỉnh tồn kho" };
        }
      } catch (err: unknown) {
        set((s) => {
          s.isLoading = false;
          s.error = err instanceof Error ? err.message : "Fetch error";
        });
        return { success: false, message: "Không thể tải danh sách điều chỉnh tồn kho" };
      }
    },

    getStockAdjustmentById: async (id: string) => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      try {
        const res = await api.get(`/api/stock-adjustment/${id}`);

        if (res.data["status-code"] === 200) {
          const rawData: RawStockAdjustment = res.data.data;
          const stockAdjustment: StockAdjustment = {
            id: rawData.id,
            adjustmentCode: rawData["adjustment-code"],
            adjustmentDate: rawData["adjustment-date"],
            adjustmentType: rawData["adjustment-type"],
            branchName: rawData["branch-name"],
            employeeName: rawData["employee-name"],
            approveName: rawData["approve-name"],
            totalValueChange: rawData["total-value-change"],
            status: rawData.status,
            reason: rawData.reason,
            note: rawData.note,
            createdAt: rawData["created-at"],
            updatedAt: rawData["updated-at"],
            approvedAt: rawData["approved-at"],
            stockAdjustmentDetails: rawData["stock-adjustment-details"].map((detail: RawStockAdjustmentDetail) => ({
              id: detail.id,
              systemQty: detail["system-qty"],
              actualQty: detail["actual-qty"],
              differenceQty: detail["difference-qty"],
              unitCost: detail["unit-cost"],
              totalValueChange: detail["total-value-change"],
              reason: detail.reason,
              note: detail.note,
              productName: detail["product-name"],
              sku: detail.sku,
            })),
          };

          set((s) => {
            s.currentStockAdjustment = stockAdjustment;
            s.isLoading = false;
          });
          return { success: true, message: res.data.message };
        } else {
          set((s) => { s.isLoading = false; });
          return { success: false, message: res.data.message || "Không tìm thấy phiếu điều chỉnh" };
        }
      } catch (err: unknown) {
        set((s) => {
          s.isLoading = false;
          s.error = err instanceof Error ? err.message : "Fetch error";
        });
        return { success: false, message: "Không thể tải thông tin phiếu điều chỉnh" };
      }
    },

    createStockAdjustment: async (data: CreateStockAdjustmentRequest) => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      try {
        const res = await api.post("/api/stock-adjustment", data);

        if (res.data["status-code"] === 200) {
          set((s) => {
            s.isLoading = false;
          });
          return { success: true, message: res.data.message };
        } else {
          set((s) => { s.isLoading = false; });
          return { success: false, message: res.data.message || "Tạo phiếu điều chỉnh thất bại" };
        }
      } catch (err: unknown) {
        set((s) => {
          s.isLoading = false;
          s.error = err instanceof Error ? err.message : "Create error";
        });
        return { success: false, message: "Không thể tạo phiếu điều chỉnh" };
      }
    },

    updateStockAdjustment: async (id: string, data: UpdateStockAdjustmentRequest) => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      try {
        const res = await api.put(`/api/stock-adjustment/${id}`, data);

        if (res.data["status-code"] === 200) {
          set((s) => {
            s.isLoading = false;
          });
          return { success: true, message: res.data.message };
        } else {
          set((s) => { s.isLoading = false; });
          return { success: false, message: res.data.message || "Cập nhật phiếu điều chỉnh thất bại" };
        }
      } catch (err: unknown) {
        set((s) => {
          s.isLoading = false;
          s.error = err instanceof Error ? err.message : "Update error";
        });
        return { success: false, message: "Không thể cập nhật phiếu điều chỉnh" };
      }
    },

    deleteStockAdjustment: async (id: string) => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      try {
        const res = await api.delete(`/api/stock-adjustment/${id}`);

        if (res.data["status-code"] === 200) {
          set((s) => {
            s.isLoading = false;
          });
          return { success: true, message: res.data.message };
        } else {
          set((s) => { s.isLoading = false; });
          return { success: false, message: res.data.message || "Xóa phiếu điều chỉnh thất bại" };
        }
      } catch (err: unknown) {
        set((s) => {
          s.isLoading = false;
          s.error = err instanceof Error ? err.message : "Delete error";
        });
        return { success: false, message: "Không thể xóa phiếu điều chỉnh" };
      }
    },

    clearError: () => {
      set((s) => {
        s.error = null;
      });
    },

    clearCurrentStockAdjustment: () => {
      set((s) => {
        s.currentStockAdjustment = null;
      });
    },
  }))
);

export default useStockTakeStore;