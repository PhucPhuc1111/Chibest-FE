import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import { message } from "antd";
import type { Product } from "@/types/product";

// ✅ Định nghĩa interface cho API response item
interface RawProduct {
  id: string;
  "avartar-url": string | null;
  sku: string;
  name: string;
  description: string;
  color: string;
  size: string;
  style: string | null;
  brand: string;
  material: string | null;
  weight: number;
  "is-master": boolean;
  status: string;
  "category-name": string;
  "parent-sku": string | null;
  "cost-price": number;
  "selling-price": number;
  "stock-quantity": number;
}

// ✅ Định nghĩa API response structure
interface ProductApiResponse {
  "status-code": number;
  message: string;
  data: {
    "data-list": RawProduct[];
    "total-count": number;
  };
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

interface ProductActions {
  searchProducts: (searchTerm?: string) => Promise<{ success: boolean; message?: string }>;
  clearError: () => void;
}

// Config để control message cho từng API
interface ApiConfig {
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  customSuccessMessage?: string;
  customErrorMessage?: string;
}

// ✅ Type cho set function từ Zustand
type SetState<T> = (fn: (state: T) => void) => void;

// ✅ Type cho API call function
type ApiCallFunction = () => Promise<{ data: ProductApiResponse }>;

// ✅ Type cho success callback
type SuccessCallback = (data: ProductApiResponse['data']) => void;

// ✅ Type cho kết quả trả về
interface ApiResult {
  success: boolean;
  message?: string;
  data?: ProductApiResponse['data'];
}

// Helper function để xử lý API call với config
const handleApiCall = async (
  set: SetState<ProductState>,
  apiCall: ApiCallFunction,
  successCallback?: SuccessCallback,
  config: ApiConfig = {}
): Promise<ApiResult> => {
  const { 
    showSuccessMessage = false,
    showErrorMessage = true,
    customSuccessMessage,
    customErrorMessage 
  } = config;

  // Set loading state
  set((s: ProductState) => {
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
      set((s: ProductState) => {
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
        data: res.data.data 
      };
    } else {
      // API trả về status code không phải 200
      set((s: ProductState) => {
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
    set((s: ProductState) => {
      s.isLoading = false;
      s.error = err instanceof Error ? err.message : "Unknown error";
    });
    
    // Hiển thị message lỗi nếu được enable
    if (showErrorMessage) {
      let errorMessage = "Có lỗi xảy ra ";
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string;Message?: string  } } };
      
        errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.Message || errorMessage;
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

// Helper để transform product data
const transformProductData = (data: RawProduct[]): Product[] => {
  return data.map(item => ({
    id: item.id,
    avartarUrl: item["avartar-url"],
    sku: item.sku,
    name: item.name,
    description: item.description,
    color: item.color,
    size: item.size,
    style: item.style,
    brand: item.brand,
    material: item.material,
    weight: item.weight,
    isMaster: item["is-master"],
    status: item.status,
    categoryName: item["category-name"],
    parentSku: item["parent-sku"],
    costPrice: item["cost-price"],
    sellingPrice: item["selling-price"],
    stockQuantity: item["stock-quantity"],
  }));
};

export const useProductStore = create<ProductState & ProductActions>()(
  immer((set) => ({
    // INITIAL STATE
    products: [],
    isLoading: false,
    error: null,
    totalCount: 0,

    // ACTIONS
    searchProducts: async (searchTerm = "") => {
      return handleApiCall(
        set as SetState<ProductState>,
        () => api.get("/api/product", {
          params: {
            SearchTerm: searchTerm,
            PageNumber: 1,
            PageSize: 50,
          },
        }) as Promise<{ data: ProductApiResponse }>,
        (data) => {
          const products = transformProductData(data["data-list"]);
          set((s: ProductState) => {
            s.products = products;
            s.totalCount = data["total-count"];
          });
        },
        { 
          showSuccessMessage: false,
          showErrorMessage: true
        }
      );
    },

    clearError: () => {
      set((s) => {
        s.error = null;
      });
    },
  }))
);

export default useProductStore;