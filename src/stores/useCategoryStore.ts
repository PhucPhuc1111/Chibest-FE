import { create } from "zustand";
import api from "@/api/axiosInstance";
import { message } from "antd";

interface Category {
  id: string;
  type: string;
  name: string;
  description: string;
  "parent-id": string | null;
  "parent-name": string | null;
  "product-count": number;
  children: Category[] | null;
}

interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
}

interface CategoryActions {
  getCategories: (params?: Record<string, unknown>) => Promise<void>;
  getCategoryById: (id: string) => Promise<void>;
  createCategory: (category: Record<string, unknown>) => Promise<boolean>;
  updateCategory: (category: Record<string, unknown>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  getCategoryHierarchy: () => Promise<void>;
  clearError: () => void;
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

export const useCategoryStore = create<CategoryState & CategoryActions>((set, get) => ({
  // INIT STATE
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,

  // LẤY DANH SÁCH CATEGORY
  getCategories: async (params?: Record<string, unknown>) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get("/api/category", { params });
      
      if (response.data["status-code"] === 200) {
        set({ 
          categories: response.data.data["data-list"] || [],
          loading: false 
        });
      }
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải danh mục";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
    }
  },

  // LẤY CHI TIẾT CATEGORY
  getCategoryById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get(`/api/category/${id}`);
      
      if (response.data["status-code"] === 200) {
        set({ 
          currentCategory: response.data.data,
          loading: false 
        });
      }
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải chi tiết danh mục";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
    }
  },

  // TẠO CATEGORY MỚI
  createCategory: async (category: Record<string, unknown>) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.post("/api/category", category);
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Tạo danh mục thành công!");
        
        get().getCategories();
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi tạo danh mục";
      
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

  // CẬP NHẬT CATEGORY
  updateCategory: async (category: Record<string, unknown>) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.put("/api/category", category);
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Cập nhật danh mục thành công!");
        
        get().getCategories();
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi cập nhật danh mục";
      
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

  // XÓA CATEGORY
  deleteCategory: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.delete(`/api/category/${id}`);
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Xóa danh mục thành công!");
        
        const currentCategories = get().categories;
        set({ categories: currentCategories.filter(cat => cat.id !== id) });
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi xóa danh mục";
      
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

  // LẤY CATEGORY HIERARCHY
  getCategoryHierarchy: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get("/api/category/hierarchy");
      
      if (response.data["status-code"] === 200) {
        set({ 
          categories: response.data.data || [],
          loading: false 
        });
      }
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải danh mục phân cấp";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
    }
  },

  clearError: () => set({ error: null }),
}));