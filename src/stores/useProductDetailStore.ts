import { create } from "zustand";
import api from "@/api/axiosInstance";
import { message } from "antd";
import type {ProductDetail} from "@/types/productDetail";

export interface RawProductDetail {
  id: string;
  "chip-code": string;
  "purchase-price": number;
  "import-date": string;
  "last-transaction-date": string | null;
  status: string;
  "product-id": string;
  "branch-id": string;
  "online-branch-id": string | null;
  "container-code": string | null;
}

interface ProductDetailState {
  productDetails: ProductDetail[];
  currentProductDetail: ProductDetail | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

interface ProductDetailActions {
  getProductDetails: (params?: Record<string, unknown>) => Promise<void>;
  getProductDetailById: (id: string) => Promise<void>;
  getProductDetailByChipCode: (chipCode: string) => Promise<void>;
  createProductDetail: (productDetail: Record<string, unknown>) => Promise<boolean>;
  updateProductDetail: (productDetail: Record<string, unknown>) => Promise<boolean>;
  deleteProductDetail: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentProductDetail: () => void;
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

export const useProductDetailStore = create<ProductDetailState & ProductDetailActions>((set, get) => ({
  // INIT STATE
  productDetails: [],
  currentProductDetail: null,
  loading: false,
  error: null,
  totalCount: 0,

  // LẤY DANH SÁCH PRODUCT DETAIL VỚI FILTERS
  getProductDetails: async (params?: Record<string, unknown>) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get("/api/product-detail", { params });
      
      if (response.data["status-code"] === 200) {
        // Transform data từ API format sang frontend format
        const productDetails: ProductDetail[] = response.data.data["data-list"].map((item: RawProductDetail) => ({
          id: item.id,
          chipCode: item["chip-code"],
          purchasePrice: item["purchase-price"],
          importDate: item["import-date"],
          lastTransactionDate: item["last-transaction-date"],
          status: item.status,
          productId: item["product-id"],
          branchId: item["branch-id"],
          onlineBranchId: item["online-branch-id"],
          containerCode: item["container-code"],
        }));
        
        set({ 
          productDetails: productDetails,
          totalCount: response.data.data["total-count"],
          loading: false 
        });
      }
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải danh sách chi tiết sản phẩm";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
    }
  },

  // LẤY CHI TIẾT PRODUCT DETAIL THEO ID
  getProductDetailById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get(`/api/product-detail/${id}`);
      
      if (response.data["status-code"] === 200) {
        const item = response.data.data;
        const productDetail: ProductDetail = {
          id: item.id,
          chipCode: item["chip-code"],
          purchasePrice: item["purchase-price"],
          importDate: item["import-date"],
          lastTransactionDate: item["last-transaction-date"],
          status: item.status,
          productId: item["product-id"],
          branchId: item["branch-id"],
          onlineBranchId: item["online-branch-id"],
          containerCode: item["container-code"],
        };
        
        set({ 
          currentProductDetail: productDetail,
          loading: false 
        });
      }
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải chi tiết sản phẩm";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
    }
  },

  // LẤY PRODUCT DETAIL THEO CHIP CODE
  getProductDetailByChipCode: async (chipCode: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get(`/api/product-detail/chipCode/${chipCode}`);
      
      if (response.data["status-code"] === 200) {
        const item = response.data.data;
        const productDetail: ProductDetail = {
          id: item.id,
          chipCode: item["chip-code"],
          purchasePrice: item["purchase-price"],
          importDate: item["import-date"],
          lastTransactionDate: item["last-transaction-date"],
          status: item.status,
          productId: item["product-id"],
          branchId: item["branch-id"],
          onlineBranchId: item["online-branch-id"],
          containerCode: item["container-code"],
        };
        
        set({ 
          currentProductDetail: productDetail,
          loading: false 
        });
      }
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải chi tiết sản phẩm theo chip code";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
    }
  },

  // TẠO PRODUCT DETAIL MỚI
  createProductDetail: async (productDetail: Record<string, unknown>) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.post("/api/product-detail", productDetail, {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      });
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Tạo chi tiết sản phẩm thành công!");
        
        // Load lại danh sách sau khi tạo
        get().getProductDetails();
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi tạo chi tiết sản phẩm";
      
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

  // CẬP NHẬT PRODUCT DETAIL
  updateProductDetail: async (productDetail: Record<string, unknown>) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.put("/api/product-detail", productDetail, {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      });
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Cập nhật chi tiết sản phẩm thành công!");
        
        // Load lại danh sách sau khi cập nhật
        get().getProductDetails();
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi cập nhật chi tiết sản phẩm";
      
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

  // XÓA PRODUCT DETAIL
  deleteProductDetail: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.delete(`/api/product-detail/${id}`);
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Xóa chi tiết sản phẩm thành công!");
        
        // Cập nhật danh sách hiện tại
        const currentProductDetails = get().productDetails;
        set({ productDetails: currentProductDetails.filter(detail => detail.id !== id) });
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi xóa chi tiết sản phẩm";
      
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
  
  clearCurrentProductDetail: () => set({ currentProductDetail: null }),
}));