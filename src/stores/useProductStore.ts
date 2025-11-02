import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import type { Product } from "@/types/product";


// ✅ Định nghĩa interface cho API response item
interface RawProduct {
id: string;
  "avartar-url": string | null;    // Thêm field này
  sku: string;
  name: string;
  description: string;
  color: string;
  size: string;
  style: string | null;
  brand: string;
  material: string | null;
  weight: number;
  "is-master": boolean;            // API trả về kebab-case
  status: string;
  "category-name": string;
  "parent-sku": string | null;     // API trả về kebab-case
  "cost-price": number;            // API trả về kebab-case
  "selling-price": number;         // API trả về kebab-case
  "stock-quantity": number;        // API trả về kebab-case
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

export const useProductStore = create<ProductState & ProductActions>()(
  immer((set) => ({
    // INITIAL STATE
    products: [],
    isLoading: false,
    error: null,
    totalCount: 0,

    // ACTIONS
    searchProducts: async (searchTerm = "") => {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      try {
        const res = await api.get("/api/product", {
          params: {
            SearchTerm: searchTerm,
            PageNumber: 1,
            PageSize: 50,
          },
        });

        if (res.data["status-code"] === 200) {
         const products: Product[] = res.data.data["data-list"].map((item: RawProduct) => ({
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

          set((s) => {
            s.products = products;
            s.totalCount = res.data.data["total-count"];
            s.isLoading = false;
          });
          return { success: true, message: res.data.message };
        } else {
          set((s) => { s.isLoading = false; });
          return { success: false, message: res.data.message || "Không có dữ liệu sản phẩm" };
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Fetch error";
        
        set((s) => {
          s.isLoading = false;
          s.error = errorMessage;
        });
        
        let apiErrorMessage = "Không thể tải danh sách sản phẩm";
        if (err && typeof err === 'object' && 'response' in err) {
          const errorObj = err as { response?: { data?: { Message?: string } } };
          apiErrorMessage = errorObj.response?.data?.Message || apiErrorMessage;
        }
        
        return { success: false, message: apiErrorMessage };
      }
    },

    clearError: () => {
      set((s) => {
        s.error = null;
      });
    },
  }))
);

export default useProductStore;