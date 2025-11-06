import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import { message } from "antd";
import type { 
  PriceBookItem,
  PriceBookResponse
} from "@/types/pricebook";

// --- DEFINITIONS & HELPERS ---

type Filters = {
  pageIndex: number;
  pageSize: number;
  search?: string;
  category?: string[];
  stockStatus?: string;
  priceCondition?: string;
  priceOperator?: string;
  priceValue?: number;
  priceType?: string;
};

type State = {
  items: PriceBookItem[];
  isLoading: boolean;
  error: string | null;
  filters: Filters;
  totalRecords: number;
  totalPages: number;
};

type Actions = {
  setFilters: (p: Partial<Filters>) => void;
  resetFilters: () => void;
  getAll: () => Promise<{success: boolean; message?: string}>;
  // updatePrice: (productId: string, price: number) => Promise<{success: boolean; message?: string}>; // TODO: Implement later
  // bulkUpdatePrices: (updates: Array<{productId: string; price: number}>) => Promise<{success: boolean; message?: string}>; // TODO: Implement later
};
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
  set((s: State) => {
    s.isLoading = true;
    s.error = null;
  });

  try {
    const res = await apiCall();
    if (res.data["status-code"] === 200) {
      if (successCallback) {
        successCallback(res.data.data);
      }
      set((s: State) => {
        s.isLoading = false;
      });
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
    set((s: State) => {
      s.isLoading = false;
      s.error = err instanceof Error ? err.message : "Unknown error";
    });
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
    
    return { 
      success: false, 
      // message: errorMessage 
    };
  }
};

export const usePriceBookStore = create<State & Actions>()(
  immer((set, get) => ({
    // INITIAL STATE
    items: [],
    isLoading: false,
    error: null,
    totalRecords: 0,
    totalPages: 0,
    filters: { 
      pageIndex: 1, 
      pageSize: 20,
      category: [],
      stockStatus: "Tất cả",
      priceCondition: "none",
      priceOperator: "none", 
      priceValue: 0,
      priceType: "none"
    },

    // --- ACTIONS ---

    setFilters: (p) =>
      set((s) => {
        s.filters = { ...s.filters, ...p };
      }),

    resetFilters: () =>
      set((s) => {
        s.filters = { 
          pageIndex: 1, 
          pageSize: 20,
          category: [],
          stockStatus: "Tất cả",
          priceCondition: "none",
          priceOperator: "none",
          priceValue: 0,
          priceType: "none"
        };
      }),

    getAll: async () => {
      const { filters } = get();
      
      return handleApiCall(
        set,
        () => api.get("/api/product-price-history", {
          params: {
            PageNumber: filters.pageIndex,
            PageSize: filters.pageSize,
            SearchTerm: filters.search ?? "",
          },
        }),
        (data) => {
          const response = data as PriceBookResponse;
          
          // CHỈ DÙNG DATA TỪ API - KHÔNG MOCK
          const items = response["data-list"];
          
          set((s: State) => {
            s.items = items;
            s.totalRecords = response["total-count"];
            s.totalPages = response["total-page"];
          });
        },
        { 
          showSuccessMessage: false,
          showErrorMessage: true
        }
      );
    },

    // TODO: Implement when have update price API
    // updatePrice: async (productId: string, price: number) => {
    //   // Will implement when have API
    //   return { success: false, message: "Chưa implement" };
    // },

    // TODO: Implement when have bulk update API  
    // bulkUpdatePrices: async (updates: Array<{productId: string; price: number}>) => {
    //   // Will implement when have API
    //   return { success: false, message: "Chưa implement" };
    // },
  }))
);