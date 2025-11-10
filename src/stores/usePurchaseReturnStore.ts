import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import { message } from "antd";
import type { 
  PurchaseReturnSummary, 
  PurchaseReturnStatus, 
  PurchaseReturn, 
  CreatePurchaseReturnPayload,
  ImportedPurchaseReturnProduct 
} from "@/types/purchaseReturn";

// --- DEFINITIONS & HELPERS ---

interface RawPurchaseReturnDetail {
  id: string;
  "invoice-code": string;
  "order-date": string;
  "created-at": string;
  "updated-at": string;
  "sub-total": number;
  note: string | null;
  status: PurchaseReturnStatus;
  "from-warehouse-name": string;
  "to-warehouse-name": string;
  "purchase-return-details": Array<{
    id: string;
    "container-code": string | null;
    quantity: number;
    "unit-price": number;
    "return-price": number;
    note: string | null;
    "product-name": string;
    sku: string;
  }>;
}

interface RawPurchaseReturnSummary {
  id: string;
  "invoice-code": string;
  "order-date": string;
  "sub-total": number;
  status: PurchaseReturnStatus;
}

type Filters = {
  pageIndex: number;
  pageSize: number;
  branchId: string | null;
  search?: string;
  fromDate?: string | null;
  toDate?: string | null;
  status?: PurchaseReturnStatus | null;
};

type State = {
  list: PurchaseReturnSummary[];
  detail: PurchaseReturn | null;
  isLoading: boolean;
  error: string | null;
  filters: Filters;
  totalRecords: number;
};

type Actions = {
  setFilters: (p: Partial<Filters>) => void;
  resetFilters: () => void;
  getAll: () => Promise<{success: boolean; message?: string}>;
  getById: (id: string) => Promise<{success: boolean; message?: string}>;
  createReturn: (payload: CreatePurchaseReturnPayload) => Promise<{success: boolean; message?: string}>;
  importFile: (file: File) => Promise<{success: boolean; message?: string; data?: ImportedPurchaseReturnProduct[]}>;
  deleteReturn: (id: string) => Promise<{success: boolean; message?: string}>;
};

// Config để control message cho từng API
interface ApiConfig {
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  customSuccessMessage?: string;
  customErrorMessage?: string;
}

interface ApiResponse<T = unknown> {
  data: T;
  "status-code": number;
  message: string;
}

// Helper function để xử lý API call với config
type SetState = (fn: (state: State) => void) => void;

const handleApiCall = async <T>(
  set: SetState,
  apiCall: () => Promise<{ data: ApiResponse<unknown> }>,
  successCallback?: (data: unknown) => void,
  config: ApiConfig = {}
): Promise<{success: boolean; message?: string; data?: T}> => {
  const { 
    showSuccessMessage = true,
    showErrorMessage = true,
    customSuccessMessage,
    customErrorMessage 
  } = config;

  // Set loading state
  set((s: State) => {
    s.isLoading = true;
    s.error = null;
  });

  try {
    const res = await apiCall();
    
    // Check status code từ API
    if (res.data["status-code"] === 200) {
      // Success - gọi callback để update state
      if (successCallback) {
        successCallback(res.data.data);
      }
      
      // Set loading false
      set((s: State) => {
        s.isLoading = false;
      });
      
      // Hiển thị message thành công nếu được enable
      if (showSuccessMessage) {
        const successMsg = customSuccessMessage || res.data.message;
        message.success(successMsg);
      }
      
      return { 
        success: true, 
        message: res.data.message,
        data: res.data.data as T
      };
    } else {
      // API trả về status code không phải 200
      set((s: State) => {
        s.isLoading = false;
      });
      
      // Hiển thị message lỗi nếu được enable
      if (showErrorMessage) {
        const errorMsg = customErrorMessage || res.data.message || "Thao tác thất bại";
        message.error(errorMsg);
      }
      
      return { 
        success: false, 
        message: res.data.message 
      };
    }
  } catch (err: unknown) {
    // Lỗi network hoặc server
    set((s: State) => {
      s.isLoading = false;
      s.error = err instanceof Error ? err.message : "Unknown error";
    });
    
    // Hiển thị message lỗi nếu được enable
    if (showErrorMessage) {
      let errorMessage = "Có lỗi xảy ra";
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      const finalErrorMessage = customErrorMessage || errorMessage;
      message.error(finalErrorMessage);
    }
     let errorMessage = "Có lỗi xảy ra";
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    return { 
      success: false, 
      message: errorMessage 
    };
  }
};

// Helper để transform data
const transformPurchaseReturnSummary = (data: RawPurchaseReturnSummary[]): PurchaseReturnSummary[] => {
  return data.map(x => ({
    id: x.id,
    code: x["invoice-code"],
    time: x["order-date"],
    subTotal: x["sub-total"],
    status: x.status,
  }));
};

const transformPurchaseReturnDetail = (rawData: RawPurchaseReturnDetail): PurchaseReturn => {
  const items = rawData["purchase-return-details"].map(item => ({
    id: item.id,
    quantity: item.quantity,
    unitPrice: item["unit-price"],
    returnPrice: item["return-price"],
    note: item.note,
    productName: item["product-name"],
    sku: item.sku,
    containerCode: item["container-code"],
  }));

  return {
    id: rawData.id,
    code: rawData["invoice-code"],
    time: rawData["order-date"],
    createdAt: rawData["created-at"],
    updatedAt: rawData["updated-at"],
    subTotal: rawData["sub-total"],
    note: rawData.note,
    status: rawData.status,
    fromWarehouseName: rawData["from-warehouse-name"],
    toWarehouseName: rawData["to-warehouse-name"],
    items: items,
  };
};

export const usePurchaseReturnsStore = create<State & Actions>()(
  immer((set, get) => ({
    // INITIAL STATE
    list: [],
    detail: null,
    isLoading: false,
    error: null,
    totalRecords: 0,
    filters: { pageIndex: 1, pageSize: 15, branchId: null },

    // --- ACTIONS ---

    setFilters: (p) =>
      set((s) => {
        s.filters = { ...s.filters, ...p };
      }),

    resetFilters: () =>
      set((s) => {
        const branchId = s.filters.branchId ?? null;
        s.filters = { pageIndex: 1, pageSize: 15, branchId };
      }),

    getAll: async () => {
      const { filters } = get();

      set((s: State) => {
        s.isLoading = true;
        s.error = null;
      });

      try {
        const response = await api.get("/api/purchase-return", {
          params: {
            pageIndex: filters.pageIndex,
            pageSize: filters.pageSize,
            search: filters.search ?? "",
            fromDate: filters.fromDate ?? "",
            toDate: filters.toDate ?? "",
            status: filters.status ?? "",
            branchId: filters.branchId ?? undefined,
          },
        });

        if (response.data["status-code"] === 200) {
          const list = transformPurchaseReturnSummary(response.data.data as RawPurchaseReturnSummary[]);
          set((s: State) => {
            s.list = list;
            s.totalRecords = list.length;
            s.isLoading = false;
          });
          return { success: true, message: response.data.message };
        }

        const errorMsg = response.data.message || "Không thể tải dữ liệu phiếu trả";
        set((s: State) => {
          s.isLoading = false;
          s.error = errorMsg;
        });
        message.error(errorMsg);
        return { success: false, message: errorMsg };
      } catch (err: unknown) {
        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
          if (axiosError.response?.status === 404) {
            set((s: State) => {
              s.list = [];
              s.totalRecords = 0;
              s.isLoading = false;
              s.error = null;
            });
            return { success: true };
          }
          const errorMsg = axiosError.response?.data?.message || "Có lỗi xảy ra";
          set((s: State) => {
            s.isLoading = false;
            s.error = errorMsg;
          });
          message.error(errorMsg);
          return { success: false, message: errorMsg };
        }

        const genericMsg = err instanceof Error ? err.message : "Có lỗi xảy ra";
        set((s: State) => {
          s.isLoading = false;
          s.error = genericMsg;
        });
        message.error(genericMsg);
        return { success: false, message: genericMsg };
      }
    },

    getById: async (id: string) => {
      return handleApiCall(
        set,
        () => api.get(`/api/purchase-return/${id}`),
        (data) => {
          const detail = transformPurchaseReturnDetail(data as RawPurchaseReturnDetail);
          set((s: State) => {
            s.detail = detail;
          });
        },
        { 
          showSuccessMessage: false,
          showErrorMessage: true 
        }
      );
    },

    createReturn: async (payload: CreatePurchaseReturnPayload) => {
      return handleApiCall(
        set,
        () => api.post("/api/purchase-return", payload, {
          headers: {
            "Content-Type": "application/json-patch+json", 
          },
        }),
        undefined,
        { 
          showSuccessMessage: true, 
          showErrorMessage: true,
          customSuccessMessage: "Tạo phiếu trả hàng thành công!" 
        }
      );
    },

    importFile: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return handleApiCall<ImportedPurchaseReturnProduct[]>(
        set,
        () => api.post("/api/purchase-return/import", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        undefined,
        { 
          showSuccessMessage: true,
          showErrorMessage: true,
        }
      );
    },

    deleteReturn: async (id: string) => {
      return handleApiCall(
        set,
        () => api.delete(`/api/purchase-return/${id}`),
        () => {
          set((s: State) => {
            s.list = s.list.filter(returnOrder => returnOrder.id !== id);
            if (s.detail?.id === id) {
              s.detail = null;
            }
          });
        },
        { 
          showSuccessMessage: true, 
          showErrorMessage: true,
          customSuccessMessage: "Xóa phiếu trả hàng thành công!"
        }
      );
    },
  }))
);