import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import { message } from "antd";
import type { 
  TransferSummary, 
  TransferStatus, 
  Transfer, 
  CreateTransferPayload,
  UpdateTransferPayload,
  ImportedTransferProduct 
} from "@/types/transfer";

// --- DEFINITIONS & HELPERS ---

interface RawTransferDetail {
  id: string;
  "invoice-code": string;
  "order-date": string;
  "created-at": string;
  "updated-at": string;
  "sub-total": number;
  "discount-amount": number;
  paid: number;
  note: string | null;
  status: TransferStatus;
  "from-warehouse-name": string;
  "to-warehouse-name": string;
  "transfer-order-details": Array<{
    id: string;
    "container-code": string | null;
    quantity: number;
    "actual-quantity": number;
    "commission-fee": number;
    "extra-fee": number;
    "unit-price": number;
    discount: number;
    note: string | null;
    "product-name": string;
    sku: string;
  }>;
}

interface RawTransferSummary {
  id: string;
  "invoice-code": string;
  "from-warehouse-name": string;
  "to-warehouse-name": string;
  "order-date": string;
  "sub-total": number;
  status: TransferStatus;
}

type Filters = {
  pageIndex: number;
  pageSize: number;
  search?: string;
  fromDate?: string | null;
  toDate?: string | null;
  status?: TransferStatus | null;
};

type State = {
  list: TransferSummary[];
  detail: Transfer | null;
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
  createTransfer: (payload: CreateTransferPayload) => Promise<{success: boolean; message?: string}>;
  updateTransfer: (id: string, payload: UpdateTransferPayload) => Promise<{success: boolean; message?: string}>;
  importFile: (file: File) => Promise<{success: boolean; message?: string; data?: ImportedTransferProduct[]}>;
  deleteTransfer: (id: string) => Promise<{success: boolean; message?: string}>;
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
const transformTransferSummary = (data: RawTransferSummary[]): TransferSummary[] => {
  return data.map(x => ({
    id: x.id,
    code: x["invoice-code"],
    fromWarehouseName: x["from-warehouse-name"],
    toWarehouseName: x["to-warehouse-name"],
    time: x["order-date"],
    subTotal: x["sub-total"],
    status: x.status,
  }));
};

const transformTransferDetail = (rawData: RawTransferDetail): Transfer => {
  const items = rawData["transfer-order-details"].map(item => ({
    id: item.id,
    quantity: item.quantity,
    actualQuantity: item["actual-quantity"],
    unitPrice: item["unit-price"],
    extraFee: item["extra-fee"],
    commissionFee: item["commission-fee"],
    discount: item.discount,
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
    discountAmount: rawData["discount-amount"],
    paid: rawData.paid,
    note: rawData.note,
    status: rawData.status,
    fromWarehouseName: rawData["from-warehouse-name"],
    toWarehouseName: rawData["to-warehouse-name"],
    items: items,
  };
};

export const useTransferStore = create<State & Actions>()(
  immer((set, get) => ({
    // INITIAL STATE
    list: [],
    detail: null,
    isLoading: false,
    error: null,
    totalRecords: 0,
    filters: { pageIndex: 1, pageSize: 15 },

    // --- ACTIONS ---

    setFilters: (p) =>
      set((s) => {
        s.filters = { ...s.filters, ...p };
      }),

    resetFilters: () =>
      set((s) => {
        s.filters = { pageIndex: 1, pageSize: 15 };
      }),

    getAll: async () => {
      const { filters } = get();
      
      return handleApiCall(
        set,
        () => api.get("/api/transfer-order", {
          params: {
            pageIndex: filters.pageIndex,
            pageSize: filters.pageSize,
            search: filters.search ?? "",
            fromDate: filters.fromDate ?? "", 
            toDate: filters.toDate ?? "",
            status: filters.status ?? "",
          },
        }),
        (data) => {
          const list = transformTransferSummary(data as RawTransferSummary[]);
          set((s: State) => {
            s.list = list;
            s.totalRecords = list.length;
          });
        },
        { 
          showSuccessMessage: false,
          showErrorMessage: true
        }
      );
    },

    getById: async (id: string) => {
      return handleApiCall(
        set,
        () => api.get(`/api/transfer-order/${id}`),
        (data) => {
          const detail = transformTransferDetail(data as RawTransferDetail);
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

    createTransfer: async (payload: CreateTransferPayload) => {
      return handleApiCall(
        set,
        () => api.post("/api/transfer-order", payload, {
          headers: {
            "Content-Type": "application/json-patch+json", 
          },
        }),
        undefined,
        { 
          showSuccessMessage: true, 
          showErrorMessage: true,
          customSuccessMessage: "Tạo phiếu chuyển kho thành công!" 
        }
      );
    },

    updateTransfer: async (id: string, payload: UpdateTransferPayload) => {
      return handleApiCall(
        set,
        () => api.put(`/api/transfer-order/${id}`, payload, {
          headers: {
            "Content-Type": "application/json-patch+json", 
          },
        }),
        undefined,
        { 
          showSuccessMessage: true, 
          showErrorMessage: true,
          customSuccessMessage: "Cập nhật phiếu chuyển kho thành công!" 
        }
      );
    },

    importFile: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return handleApiCall<ImportedTransferProduct[]>(
        set,
        () => api.post("/api/transfer-order/import", formData, {
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

    deleteTransfer: async (id: string) => {
      return handleApiCall(
        set,
        () => api.delete(`/api/transfer-order/${id}`),
        () => {
          set((s: State) => {
            s.list = s.list.filter(transfer => transfer.id !== id);
            if (s.detail?.id === id) {
              s.detail = null;
            }
          });
        },
        { 
          showSuccessMessage: true, 
          showErrorMessage: true,
          customSuccessMessage: "Xóa phiếu chuyển kho thành công!"
        }
      );
    },
  }))
);