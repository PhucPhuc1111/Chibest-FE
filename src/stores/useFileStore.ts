import { create } from "zustand";
import api from "@/api/axiosInstance";
import { message } from "antd";

interface FileState {
  uploading: boolean;
  error: string | null;
}

interface FileActions {
  uploadImage: (file: File, name: string, category: string) => Promise<string | null>;
  getImage: (urlPath: string) => Promise<string>;
  exportFile: (columns: string[]) => Promise<boolean>;
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

export const useFileStore = create<FileState & FileActions>((set) => ({
  // INIT STATE

  uploading: false,
  error: null,

  // UPLOAD ẢNH
uploadImage: async (file: File, name: string, category: string) => {
  set({ uploading: true, error: null });
  
  try {
    const formData = new FormData();
    formData.append('FileData', file);
    formData.append('Name', name);
    formData.append('Category', category);

    const response = await api.post("/api/file/image", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
      let imagePath = "";
      if (typeof response.data === "string") {
      imagePath = response.data;
    } else if (response.data && response.data["status-code"] === 200) {
      // BE trả object chuẩn
      imagePath = response.data.data;
    } else {
      throw new Error("Upload lỗi: response không đúng định dạng");
    }
      imagePath = imagePath.replace(/\\/g, "/");
      const fullImageUrl = `http://45.125.238.52:5000/api/file/image?urlPath=${encodeURIComponent(imagePath)}`;
           
      set({ uploading: false });
      message.success("Upload ảnh thành công!");
      return fullImageUrl;

    
    throw new Error(response.data.message);
  } catch (error: unknown) {
    let errorMsg = "Lỗi upload ảnh";
    
    if (isApiError(error)) {
      errorMsg = error.response?.data?.message || errorMsg;
    } else if (error instanceof Error) {
      errorMsg = error.message;
    }
    
    set({ uploading: false, error: errorMsg });
    message.error(errorMsg);
    return null;
  }
},

  // LẤY ẢNH
  getImage: async (urlPath: string) => {
    try {
      const response = await api.get("/api/file/image", {
        params: { urlPath },
        responseType: 'blob',
      });
      
      return URL.createObjectURL(response.data);
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải ảnh";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      message.error(errorMsg);
      throw new Error(errorMsg);
    }
  },

  // EXPORT FILE
  exportFile: async (columns: string[]) => {
    set({ error: null });
    
    try {
      const response = await api.post("/api/file/export", {
        "product-export-view-columns": columns
      });
      
      if (response.data["status-code"] === 200) {
        message.success("Export file thành công!");
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi export file";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      set({ error: errorMsg });
      message.error(errorMsg);
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));