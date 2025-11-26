// import { create } from "zustand";
// import { immer } from "zustand/middleware/immer";
// import api from "@/api/axiosInstance";
// import { message } from "antd";
// import type {
//   TransferSummary,
//   TransferStatus,
//   Transfer,
//   CreateTransferPayload,
//   UpdateTransferPayload,
//   ImportedTransferProduct,
//   CreateMultiTransferPayload,
// } from "@/types/transfer";

// // --- DEFINITIONS & HELPERS ---

// interface RawTransferDetail {
//   id: string;
//   "invoice-code": string;
//   "order-date": string;
//   "created-at": string;
//   "updated-at": string;
//   "sub-total": number;
//   "discount-amount": number;
//   paid: number;
//   note: string | null;
//   status: TransferStatus;
//   "from-branch-name": string;
//   "to-branch-name": string;
//   "transfer-order-details": Array<{
//     id: string;
//     "container-code": string | null;
//     quantity: number;
//     "actual-quantity": number;
//     "commission-fee": number;
//     "extra-fee": number;
//     "unit-price": number;
//     discount: number;
//     note: string | null;
//     "product-name": string;
//     sku: string;
//   }>;
// }

// interface RawTransferSummary {
//   id: string;
//   "invoice-code": string;
//   "from-branch-name": string;
//   "to-branch-name": string;
//   "order-date": string;
//   "sub-total": number;
//   status: TransferStatus;
// }

// type Filters = {
//   pageIndex: number;
//   pageSize: number;
//   branchId: string | null;
//   search?: string;
//   fromDate?: string | null;
//   toDate?: string | null;
//   status?: TransferStatus | null;
// };

// type State = {
//   list: TransferSummary[];
//   detail: Transfer | null;
//   isLoading: boolean;
//   error: string | null;
//   filters: Filters;
//   totalRecords: number;
// };

// type Actions = {
//   setFilters: (p: Partial<Filters>) => void;
//   resetFilters: () => void;
//   getAll: () => Promise<{success: boolean; message?: string}>;
//   getById: (id: string) => Promise<{success: boolean; message?: string}>;
//   createTransfer: (payload: CreateTransferPayload) => Promise<{success: boolean; message?: string}>;
//   createMultiTransfer: (payload: CreateMultiTransferPayload) => Promise<{success: boolean; message?: string}>;
//   updateTransfer: (id: string, payload: UpdateTransferPayload) => Promise<{success: boolean; message?: string}>;
//   importFile: (file: File) => Promise<{success: boolean; message?: string; data?: ImportedTransferProduct[]}>;
//   deleteTransfer: (id: string) => Promise<{success: boolean; message?: string}>;
// };

// // Config để control message cho từng API
// interface ApiConfig {
//   showSuccessMessage?: boolean;
//   showErrorMessage?: boolean;
//   customSuccessMessage?: string;
//   customErrorMessage?: string;
// }

// interface ApiResponse<T = unknown> {
//   data: T;
//   "status-code": number;
//   message: string;
// }

// // Helper function để xử lý API call với config
// type SetState = (fn: (state: State) => void) => void;

// const handleApiCall = async <T>(
//   set: SetState,
//   apiCall: () => Promise<{ data: ApiResponse<unknown> }>,
//   successCallback?: (data: unknown) => void,
//   config: ApiConfig = {}
// ): Promise<{success: boolean; message?: string; data?: T}> => {
//   const { 
//     showSuccessMessage = true,
//     showErrorMessage = true,
//     customSuccessMessage,
//     customErrorMessage 
//   } = config;

//   // Set loading state
//   set((s: State) => {
//     s.isLoading = true;
//     s.error = null;
//   });

//   try {
//     const res = await apiCall();
    
//     // Check status code từ API
//     if (res.data["status-code"] === 200) {
//       // Success - gọi callback để update state
//       if (successCallback) {
//         successCallback(res.data.data);
//       }
      
//       // Set loading false
//       set((s: State) => {
//         s.isLoading = false;
//       });
      
//       // Hiển thị message thành công nếu được enable
//       if (showSuccessMessage) {
//         const successMsg = customSuccessMessage || res.data.message;
//         message.success(successMsg);
//       }
      
//       return { 
//         success: true, 
//         message: res.data.message,
//         data: res.data.data as T
//       };
//     } else {
//       // API trả về status code không phải 200
//       set((s: State) => {
//         s.isLoading = false;
//       });
      
//       // Hiển thị message lỗi nếu được enable
//       if (showErrorMessage) {
//         const errorMsg = customErrorMessage || res.data.message || "Thao tác thất bại";
//         message.error(errorMsg);
//       }
      
//       return { 
//         success: false, 
//         message: res.data.message 
//       };
//     }
//   } catch (err: unknown) {
//     // Lỗi network hoặc server
//     set((s: State) => {
//       s.isLoading = false;
//       s.error = err instanceof Error ? err.message : "Unknown error";
//     });
    
//     // Hiển thị message lỗi nếu được enable
//     if (showErrorMessage) {
//       let errorMessage = "Có lỗi xảy ra";
      
//       if (err && typeof err === 'object' && 'response' in err) {
//         const axiosError = err as { response?: { data?: { message?: string } } };
//         errorMessage = axiosError.response?.data?.message || errorMessage;
//       } else if (err instanceof Error) {
//         errorMessage = err.message;
//       }
      
//       const finalErrorMessage = customErrorMessage || errorMessage;
//       message.error(finalErrorMessage);
//     }
    
//     let errorMessage = "Có lỗi xảy ra";
//     if (err && typeof err === 'object' && 'response' in err) {
//       const axiosError = err as { response?: { data?: { message?: string } } };
//       errorMessage = axiosError.response?.data?.message || errorMessage;
//     } else if (err instanceof Error) {
//       errorMessage = err.message;
//     }
    
//     return { 
//       success: false, 
//       message: errorMessage 
//     };
//   }
// };

// // Helper để transform data
// const transformTransferSummary = (data: RawTransferSummary[]): TransferSummary[] => {
//   return data.map(x => ({
//     id: x.id,
//     code: x["invoice-code"],
//     fromBranchName: x["from-branch-name"],
//     toBranchName: x["to-branch-name"],
//     time: x["order-date"],
//     subTotal: x["sub-total"],
//     status: x.status,
//   }));
// };

// const transformTransferDetail = (rawData: RawTransferDetail): Transfer => {
//   const items = rawData["transfer-order-details"].map(item => ({
//     id: item.id,
//     quantity: item.quantity,
//     actualQuantity: item["actual-quantity"],
//     unitPrice: item["unit-price"],
//     extraFee: item["extra-fee"],
//     commissionFee: item["commission-fee"],
//     discount: item.discount,
//     note: item.note,
//     productName: item["product-name"],
//     sku: item.sku,
//     containerCode: item["container-code"],
//   }));

//   return {
//     id: rawData.id,
//     code: rawData["invoice-code"],
//     time: rawData["order-date"],
//     createdAt: rawData["created-at"],
//     updatedAt: rawData["updated-at"],
//     subTotal: rawData["sub-total"],
//     discountAmount: rawData["discount-amount"],
//     paid: rawData.paid,
//     note: rawData.note,
//     status: rawData.status,
//     fromBranchName: rawData["from-branch-name"],
//     toBranchName: rawData["to-branch-name"],
//     items: items,
//   };
// };

// export const useTransferStore = create<State & Actions>()(
//   immer((set, get) => ({
//     // INITIAL STATE
//     list: [],
//     detail: null,
//     isLoading: false,
//     error: null,
//     totalRecords: 0,
//     filters: { pageIndex: 1, pageSize: 15, branchId: null },

//     // --- ACTIONS ---

//     setFilters: (p) =>
//       set((s) => {
//         s.filters = { ...s.filters, ...p };
//       }),

//     resetFilters: () =>
//       set((s) => {
//         const branchId = s.filters.branchId ?? null;
//         s.filters = { pageIndex: 1, pageSize: 15, branchId };
//       }),

//     getAll: async () => {
//       const { filters } = get();

//       set((s: State) => {
//         s.isLoading = true;
//         s.error = null;
//       });

//       try {
//         const response = await api.get("/api/transfer-order", {
//           params: {
//             pageIndex: filters.pageIndex,
//             pageSize: filters.pageSize,
//             search: filters.search ?? "",
//             fromDate: filters.fromDate ?? "",
//             toDate: filters.toDate ?? "",
//             status: filters.status ?? "",
//             branchId: filters.branchId ?? undefined,
//           },
//         });

//         if (response.data["status-code"] === 200) {
//           const list = transformTransferSummary(response.data.data as RawTransferSummary[]);
//           set((s: State) => {
//             s.list = list;
//             s.totalRecords = list.length;
//             s.isLoading = false;
//           });
//           return { success: true, message: response.data.message };
//         }

//         const errorMsg = response.data.message || "Không thể tải dữ liệu phiếu chuyển";
//         set((s: State) => {
//           s.isLoading = false;
//           s.error = errorMsg;
//         });
//         message.error(errorMsg);
//         return { success: false, message: errorMsg };
//       } catch (err: unknown) {
//         if (err && typeof err === "object" && "response" in err) {
//           const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
//           if (axiosError.response?.status === 404) {
//             set((s: State) => {
//               s.list = [];
//               s.totalRecords = 0;
//               s.isLoading = false;
//               s.error = null;
//             });
//             return { success: true };
//           }
//           const errorMsg = axiosError.response?.data?.message || "Có lỗi xảy ra";
//           set((s: State) => {
//             s.isLoading = false;
//             s.error = errorMsg;
//           });
//           message.error(errorMsg);
//           return { success: false, message: errorMsg };
//         }

//         const genericMsg = err instanceof Error ? err.message : "Có lỗi xảy ra";
//         set((s: State) => {
//           s.isLoading = false;
//           s.error = genericMsg;
//         });
//         message.error(genericMsg);
//         return { success: false, message: genericMsg };
//       }
//     },

//     getById: async (id: string) => {
//       return handleApiCall(
//         set,
//         () => api.get(`/api/transfer-order/${id}`),
//         (data) => {
//           const detail = transformTransferDetail(data as RawTransferDetail);
//           set((s: State) => {
//             s.detail = detail;
//           });
//         },
//         { 
//           showSuccessMessage: false,
//           showErrorMessage: true 
//         }
//       );
//     },

//     createTransfer: async (payload: CreateTransferPayload) => {
//       return handleApiCall(
//         set,
//         () => api.post("/api/transfer-order", payload, {
//           headers: {
//             "Content-Type": "application/json-patch+json", 
//           },
//         }),
//         undefined,
//         { 
//           showSuccessMessage: true, 
//           showErrorMessage: true,
//           customSuccessMessage: "Tạo phiếu chuyển kho thành công!" 
//         }
//       );
//     },

//     createMultiTransfer: async (payload: CreateMultiTransferPayload) => {
//       return handleApiCall(
//         set,
//         () => api.post("/api/transfer-order/multiple", payload, {
//           headers: {
//             "Content-Type": "application/json-patch+json",
//           },
//         }),
//         undefined,
//         {
//           showSuccessMessage: true,
//           showErrorMessage: true,
//           customSuccessMessage: "Tạo phiếu chuyển kho nhiều kho thành công!",
//         }
//       );
//     },

//     updateTransfer: async (id: string, payload: UpdateTransferPayload) => {
//       return handleApiCall(
//         set,
//         () => api.put(`/api/transfer-order/${id}`, payload, {
//           headers: {
//             "Content-Type": "application/json-patch+json", 
//           },
//         }),
//         undefined,
//         { 
//           showSuccessMessage: true, 
//           showErrorMessage: true,
//           customSuccessMessage: "Cập nhật phiếu chuyển kho thành công!" 
//         }
//       );
//     },

//     importFile: async (file: File) => {
//       const formData = new FormData();
//       formData.append("file", file);

//       return handleApiCall<ImportedTransferProduct[]>(
//         set,
//         () => api.post("/api/transfer-order/import", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }),
//         undefined,
//         { 
//           showSuccessMessage: true,
//           showErrorMessage: true,
//         }
//       );
//     },

//     deleteTransfer: async (id: string) => {
//       return handleApiCall(
//         set,
//         () => api.delete(`/api/transfer-order/${id}`),
//         () => {
//           set((s: State) => {
//             s.list = s.list.filter(transfer => transfer.id !== id);
//             if (s.detail?.id === id) {
//               s.detail = null;
//             }
//           });
//         },
//         { 
//           showSuccessMessage: true, 
//           showErrorMessage: true,
//           customSuccessMessage: "Xóa phiếu chuyển kho thành công!"
//         }
//       );
//     },
//   }))
// );

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
  ImportedTransferProduct,
  CreateMultiTransferPayload,
  UpdateTransferPricesPayload,
  // UpdateTransferStatusPayload,
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
  "from-branch-name": string;
  "to-branch-name": string;
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
  "from-branch-name": string;
  "to-branch-name": string;
  "order-date": string;
  "sub-total": number;
  status: TransferStatus;
}

type Filters = {
  pageIndex: number;
  pageSize: number;
  branchId: string | null;
  search?: string;
  fromDate?: string | null;
  toDate?: string | null;
  status?: TransferStatus | null;
};

type State = {
  list: TransferSummary[];
  detail: Transfer | null;
  detailCache: Record<string, Transfer>;
  isLoading: boolean;
  isLoadingDetail: boolean;
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
  createMultiTransfer: (payload: CreateMultiTransferPayload) => Promise<{success: boolean; message?: string}>;
  updateTransfer: (id: string, payload: UpdateTransferPayload) => Promise<{success: boolean; message?: string}>;
  updateTransferStatus: (id: string, status: TransferStatus) => Promise<{success: boolean; message?: string}>;
  updateTransferPrices: (id: string, payload: UpdateTransferPricesPayload) => Promise<{success: boolean; message?: string}>;
  importFile: (file: File) => Promise<{success: boolean; message?: string; data?: ImportedTransferProduct[]}>;
  deleteTransfer: (id: string) => Promise<{success: boolean; message?: string}>;
};

// Config để control message cho từng API
interface ApiConfig {
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  customSuccessMessage?: string;
  customErrorMessage?: string;
  isDetail?: boolean;
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
    customErrorMessage,
    isDetail = false
  } = config;

  // Set loading state riêng cho detail hoặc list
  set((s: State) => {
    if (isDetail) {
      s.isLoadingDetail = true;
    } else {
      s.isLoading = true;
    }
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
        if (isDetail) {
          s.isLoadingDetail = false;
        } else {
          s.isLoading = false;
        }
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
        if (isDetail) {
          s.isLoadingDetail = false;
        } else {
          s.isLoading = false;
        }
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
      if (isDetail) {
        s.isLoadingDetail = false;
      } else {
        s.isLoading = false;
      }
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
    fromBranchName: x["from-branch-name"],
    toBranchName: x["to-branch-name"],
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
    fromBranchName: rawData["from-branch-name"],
    toBranchName: rawData["to-branch-name"],
    items: items,
  };
};

export const useTransferStore = create<State & Actions>()(
  immer((set, get) => ({
    // INITIAL STATE
    list: [],
    detail: null,
    detailCache: {}, 
    isLoading: false,
    isLoadingDetail: false,
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
        const response = await api.get("/api/transfer-order", {
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
          const list = transformTransferSummary(response.data.data as RawTransferSummary[]);
          set((s: State) => {
            s.list = list;
            s.totalRecords = list.length;
            s.isLoading = false;
          });
          return { success: true, message: response.data.message };
        }

        const errorMsg = response.data.message || "Không thể tải dữ liệu phiếu chuyển";
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

    createMultiTransfer: async (payload: CreateMultiTransferPayload) => {
      return handleApiCall(
        set,
        () => api.post("/api/transfer-order/multiple", payload, {
          headers: {
            "Content-Type": "application/json-patch+json",
          },
        }),
        undefined,
        {
          showSuccessMessage: true,
          showErrorMessage: true,
          customSuccessMessage: "Tạo phiếu chuyển kho nhiều kho thành công!",
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
        () => {
          // Reload detail sau khi update
          get().getById(id);
        },
        { 
          showSuccessMessage: true, 
          showErrorMessage: true,
          customSuccessMessage: "Cập nhật phiếu chuyển kho thành công!" 
        }
      );
    },

    updateTransferStatus: async (id: string, status: TransferStatus) => {
      const { detail } = get(); // Lấy detail từ state hiện tại
      
      return handleApiCall(
        set,
        () => api.put(`/api/transfer-order/${id}`, {
          "pay-method": detail?.payMethod || "Cash",
          "sub-total": detail?.subTotal || 0,
          "discount-amount": detail?.discountAmount || 0,
          "paid": detail?.paid || 0,
          status: status, // Chỉ thay đổi status
          "transfer-order-details": detail?.items?.map(item => ({
            id: item.id,
            "extra-fee": item.extraFee || 0,
            "commission-fee": item.commissionFee || 0,
            "unit-price": item.unitPrice || 0,
            "actual-quantity": item.actualQuantity || item.quantity || 0,
            "note": item.note || "",
          })) || []
        }, {
          headers: {
            "Content-Type": "application/json-patch+json",
          },
        }),
        () => {
          // Update local state - chỉ cập nhật status
          set((s: State) => {
            // Update in list
            s.list = s.list.map(item => 
              item.id === id ? { ...item, status } : item
            );
            // Update in detail if currently viewing
            if (s.detail?.id === id) {
              s.detail.status = status;
            }
          });
        },
        { 
          showSuccessMessage: true,
          showErrorMessage: true,
          customSuccessMessage: "Cập nhật trạng thái thành công!",
          isDetail: true
        }
      );
    },

    updateTransferPrices: async (id: string, payload: UpdateTransferPricesPayload) => {
      const { detail } = get(); // Lấy detail từ state hiện tại
      
      return handleApiCall(
        set,
        () => api.put(`/api/transfer-order/${id}`, {
          ...payload,
          status: detail?.status || "Draft" // Giữ nguyên status hiện tại
        }, {
          headers: {
            "Content-Type": "application/json-patch+json",
          },
        }),
        () => {
          // Update local state - chỉ cập nhật thông tin giá
          set((s: State) => {
            // Update in detail if currently viewing
            if (s.detail?.id === id) {
              if (s.detail) {
                // Cập nhật các thông tin giá từ payload
                s.detail.subTotal = payload["sub-total"];
                s.detail.discountAmount = payload["discount-amount"];
                s.detail.paid = payload.paid;
                
                // Cập nhật thông tin items
                if (payload["transfer-order-details"] && s.detail.items) {
                  s.detail.items = s.detail.items.map(item => {
                    const updatedItem = payload["transfer-order-details"].find(
                      (detailItem) => detailItem.id === item.id
                    );
                    if (updatedItem) {
                      return {
                        ...item,
                        extraFee: updatedItem["extra-fee"],
                        commissionFee: updatedItem["commission-fee"],
                        unitPrice: updatedItem["unit-price"],
                        actualQuantity: updatedItem["actual-quantity"],
                        note: updatedItem.note
                      };
                    }
                    return item;
                  });
                }
              }
            }
          });
        },
        { 
          showSuccessMessage: true,
          showErrorMessage: true,
          customSuccessMessage: "Thiết lập giá thành công!",
          isDetail: true
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