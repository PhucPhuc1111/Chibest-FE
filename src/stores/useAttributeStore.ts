import { create } from "zustand";
import api from "@/api/axiosInstance";
import { message } from "antd";

interface Color {
  id: string;
  code: string;
}

interface Size {
  id: string;
  code: string;
}

interface AttributeState {
  colors: Color[];
  sizes: Size[];
  loading: boolean;
  error: string | null;
}

interface AttributeActions {
  getColors: () => Promise<void>;
  getSizes: () => Promise<void>;
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

export const useAttributeStore = create<AttributeState & AttributeActions>((set, get) => ({
  // INIT STATE
  colors: [],
  sizes: [],
  loading: false,
  error: null,

  // LẤY DANH SÁCH MÀU SẮC
  getColors: async () => {
    // Nếu đã có data thì không gọi lại
    if (get().colors.length > 0) {
      return;
    }

    set({ loading: true, error: null });
    
    try {
      const response = await api.get<{
        "status-code": number;
        data: { id: string; code: string }[];
      }>("/api/color");
      
      if (response.data["status-code"] === 200) {
        set({ 
          colors: response.data.data || [],
          loading: false 
        });
      }
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải danh sách màu sắc";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      set({ loading: false, error: errorMsg });
      // Không hiển thị error message để tránh spam
      console.error(errorMsg);
    }
  },

  // LẤY DANH SÁCH KÍCH THƯỚC
  getSizes: async () => {
    // Nếu đã có data thì không gọi lại
    if (get().sizes.length > 0) {
      return;
    }

    set({ loading: true, error: null });
    
    try {
      const response = await api.get<{
        "status-code": number;
        data: { id: string; code: string }[];
      }>("/api/size");
      
      if (response.data["status-code"] === 200) {
        set({ 
          sizes: response.data.data || [],
          loading: false 
        });
      }
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải danh sách kích thước";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      set({ loading: false, error: errorMsg });
      // Không hiển thị error message để tránh spam
      console.error(errorMsg);
    }
  },

  clearError: () => set({ error: null }),
}));

