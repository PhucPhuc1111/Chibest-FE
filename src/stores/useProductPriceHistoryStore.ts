import { create } from "zustand";
import api from "@/api/axiosInstance";
import { message } from "antd";
import type { 
  ProductPriceHistory, 
  RawProductPriceHistory,
  ProductPriceHistoryQueryParams 
} from "@/types/productPriceHistory";

interface ProductPriceHistoryState {
  priceHistories: ProductPriceHistory[];
  currentPriceHistory: ProductPriceHistory | null;
  currentPrices: ProductPriceHistory[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

interface ProductPriceHistoryActions {
  getPriceHistories: (params?: ProductPriceHistoryQueryParams) => Promise<void>;
  getPriceHistoryById: (id: string) => Promise<void>;
  getCurrentPrices: (branchId?: string) => Promise<void>;
  createPriceHistory: (priceHistory: Record<string, unknown>) => Promise<boolean>;
  updatePriceHistory: (priceHistory: Record<string, unknown>) => Promise<boolean>;
  deletePriceHistory: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentPriceHistory: () => void;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'response' in error;
}

// ✅ INTERFACE CHO API RESPONSE
interface PriceHistoryApiResponse {
  "status-code": number;
  message: string;
  data: {
    "data-list": RawProductPriceHistory[];
    "total-count": number;
  };
}

interface CurrentPricesApiResponse {
  "status-code": number;
  message: string;
  data: RawProductPriceHistory[];
}

export const useProductPriceHistoryStore = create<ProductPriceHistoryState & ProductPriceHistoryActions>((set, get) => ({
  // INIT STATE
  priceHistories: [],
  currentPriceHistory: null,
  currentPrices: [],
  loading: false,
  error: null,
  totalCount: 0,

  // LẤY DANH SÁCH LỊCH SỬ GIÁ
  getPriceHistories: async (params?: ProductPriceHistoryQueryParams) => {
    set({ loading: true, error: null });
    
    try {
      // ✅ TYPE-SAFE: params có type ProductPriceHistoryQueryParams
      // ✅ TYPE-SAFE: response có type PriceHistoryApiResponse
      const response = await api.get<PriceHistoryApiResponse>("/api/product-price-history", { params });
      
      if (response.data["status-code"] === 200) {
        // ✅ TYPE-SAFE: item tự động inferred là RawProductPriceHistory
        const priceHistories: ProductPriceHistory[] = response.data.data["data-list"].map((item) => ({
          id: item.id,
          sellingPrice: item["selling-price"],
          costPrice: item["cost-price"] || 0,
          effectiveDate: item["effective-date"],
          expiryDate: item["expiry-date"],
          note: item.note,
          createdAt: item["created-at"],
          createdBy: item["created-by"],
          productId: item["product-id"],
          branchId: item["branch-id"],
        }));
        
        set({ 
          priceHistories: priceHistories,
          totalCount: response.data.data["total-count"],
          loading: false 
        });
      }
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải lịch sử giá";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
    }
  },

  // LẤY CHI TIẾT LỊCH SỬ GIÁ THEO ID
  getPriceHistoryById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get<{ "status-code": number; message: string; data: RawProductPriceHistory }>(`/api/product-price-history/${id}`);
      
      if (response.data["status-code"] === 200) {
        const item = response.data.data;
        const priceHistory: ProductPriceHistory = {
          id: item.id,
          sellingPrice: item["selling-price"],
          costPrice: item["cost-price"] || 0,
          effectiveDate: item["effective-date"],
          expiryDate: item["expiry-date"],
          note: item.note,
          createdAt: item["created-at"],
          createdBy: item["created-by"],
          productId: item["product-id"],
          branchId: item["branch-id"],
        };
        
        set({ 
          currentPriceHistory: priceHistory,
          loading: false 
        });
      }
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải chi tiết lịch sử giá";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
    }
  },

  // LẤY GIÁ HIỆN TẠI
  getCurrentPrices: async (branchId?: string) => {
    set({ loading: true, error: null });
    
    try {
      const params = branchId ? { branchId } : {};
      // ✅ TYPE-SAFE: response có type CurrentPricesApiResponse
      const response = await api.get<CurrentPricesApiResponse>("/api/product-price-history/current-prices", { params });
      
      if (response.data["status-code"] === 200) {
        // ✅ TYPE-SAFE: item tự động inferred là RawProductPriceHistory
        const currentPrices: ProductPriceHistory[] = response.data.data.map((item) => ({
          id: item.id,
          sellingPrice: item["selling-price"],
          costPrice: item["cost-price"] || 0,
          effectiveDate: item["effective-date"],
          expiryDate: item["expiry-date"],
          note: item.note,
          createdAt: item["created-at"],
          createdBy: item["created-by"],
          productId: item["product-id"],
          branchId: item["branch-id"],
        }));
        
        set({ 
          currentPrices: currentPrices,
          loading: false 
        });
      }
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải giá hiện tại";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
    }
  },

  // TẠO LỊCH SỬ GIÁ MỚI
  createPriceHistory: async (priceHistory: Record<string, unknown>) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.post("/api/product-price-history", priceHistory, {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      });
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Tạo lịch sử giá thành công!");
        
        get().getPriceHistories();
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi tạo lịch sử giá";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
      return false;
    }
  },

  // CẬP NHẬT LỊCH SỬ GIÁ
  updatePriceHistory: async (priceHistory: Record<string, unknown>) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.put("/api/product-price-history", priceHistory, {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      });
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Cập nhật lịch sử giá thành công!");
        
        get().getPriceHistories();
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi cập nhật lịch sử giá";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
      return false;
    }
  },

  // XÓA LỊCH SỬ GIÁ
  deletePriceHistory: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.delete(`/api/product-price-history/${id}`);
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Xóa lịch sử giá thành công!");
        
        const currentPriceHistories = get().priceHistories;
        set({ priceHistories: currentPriceHistories.filter(history => history.id !== id) });
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi xóa lịch sử giá";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
      return false;
    }
  },

  clearError: () => set({ error: null }),
  
  clearCurrentPriceHistory: () => set({ currentPriceHistory: null }),
}));