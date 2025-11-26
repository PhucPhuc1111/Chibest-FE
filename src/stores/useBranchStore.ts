import { create } from "zustand";
import api from "@/api/axiosInstance";
import { message } from "antd";

interface Branch {
  id: string;
  code: string;
  name: string;
  address: string;
  "phone-number": string;
  "is-franchise": boolean;
  status: string;
  "user-count": number;
}

interface BranchState {
  branches: Branch[];
  currentBranch: Branch | null;
  loading: boolean;
  error: string | null;
}

interface BranchActions {
  getBranches: (params?: Record<string, unknown>) => Promise<void>;
  getBranchById: (id: string) => Promise<void>;
  createBranch: (branch: Record<string, unknown>) => Promise<boolean>;
  updateBranch: (id: string, branch: Record<string, unknown>) => Promise<boolean>;
  deleteBranch: (id: string) => Promise<boolean>;
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

export const useBranchStore = create<BranchState & BranchActions>((set, get) => ({
  // INIT STATE
  branches: [],
  currentBranch: null,
  loading: false,
  error: null,

  // LẤY DANH SÁCH CHI NHÁNH
  getBranches: async (params?: Record<string, unknown>) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get("/api/branch", { params });
      
      if (response.data["status-code"] === 200) {
        set({ 
          branches: response.data.data || [],
          loading: false 
        });
      }
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải danh sách chi nhánh";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
    }
  },

  // LẤY CHI TIẾT CHI NHÁNH
  getBranchById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get(`/api/branch/${id}`);
      
      if (response.data["status-code"] === 200) {
        set({ 
          currentBranch: response.data.data,
          loading: false 
        });
      }
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải chi tiết chi nhánh";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
    }
  },

  // TẠO CHI NHÁNH MỚI
  createBranch: async (branch: Record<string, unknown>) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.post("/api/branch", branch);
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Tạo chi nhánh thành công!");
        
        get().getBranches();
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi tạo chi nhánh";
      
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

  // CẬP NHẬT CHI NHÁNH
  updateBranch: async (id: string, branch: Record<string, unknown>) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.put(`/api/branch/${id}`, branch);
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Cập nhật chi nhánh thành công!");
        
        get().getBranches();
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi cập nhật chi nhánh";
      
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

  // XÓA CHI NHÁNH
  deleteBranch: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.delete(`/api/branch/${id}`);
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Xóa chi nhánh thành công!");
        
        const currentBranches = get().branches;
        set({ branches: currentBranches.filter(branch => branch.id !== id) });
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi xóa chi nhánh";
      
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
}));