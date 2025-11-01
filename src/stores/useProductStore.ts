import { message } from 'antd';
// import { create } from "zustand";
// import { immer } from "zustand/middleware/immer";
// import api from "@/api/axiosInstance";
// import type { Product } from "@/types/product"; // ✅ dùng chung type chuẩn

// type Filters = {
//   q: string;
//   group?: string | null;
//   stock?: "all" | "out" | "in";
//   createdFrom?: string | null;
//   createdTo?: string | null;
//   color?: string | null;
//   size?: string | null;
//   supplier?: string | null;
// };

// type State = {
//   products: Product[];
//   product: Product | null;
//   isLoading: boolean;
//   error: string | null;
//   filters: Filters;
// };

// type Actions = {
//   setFilters: (p: Partial<Filters>) => void;
//   resetFilters: () => void;
//   getAllProducts: () => Promise<void>;
//   getProductById: (id: string) => Promise<void>;
// };

// export const useProductStore = create<State & Actions>()(
//   immer((set, get) => ({
//     products: [],
//     product: null,
//     isLoading: false,
//     error: null,
//     filters: { q: "", stock: "all" },

//     setFilters: (p) =>
//       set((s) => {
//         s.filters = { ...s.filters, ...p };
//       }),

//     resetFilters: () =>
//       set((s) => {
//         s.filters = { q: "", stock: "all" };
//       }),

//     getAllProducts: async () => {
//       set((s) => {
//         s.isLoading = true;
//         s.error = null;
//       });

//       const { filters } = get();
//       const params: Record<string, unknown> = {}; // ✅ không còn any
//       Object.entries(filters).forEach(([k, v]) => {
//         if (v !== undefined && v !== null && v !== "" && v !== "all")
//           params[k] = v;
//       });

//       try {
//         const res = await api.get<Product[]>("/products", { params });
//         set((s) => {
//           s.products = res.data;
//           s.isLoading = false;
//         });
//       } catch (e) {
//         set((s) => {
//           s.isLoading = false;
//           s.error = e instanceof Error ? e.message : "Fetch error";
//         });
//       }
//     },

//     getProductById: async (id: string) => {
//       set((s) => {
//         s.isLoading = true;
//         s.error = null;
//       });
//       try {
//         const res = await api.get<Product>(`/products/${id}`);
//         set((s) => {
//           s.product = res.data;
//           s.isLoading = false;
//         });
//       } catch (e) {
//         set((s) => {
//           s.isLoading = false;
//           s.error = e instanceof Error ? e.message : "Fetch error";
//         });
//       }
//     },
//   }))
// );
// stores/useProductStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from "@/api/axiosInstance";
import { log } from "console";

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  color: string;
  size: string;
  brand: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  categoryName: string;
  status: string;
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
          const products: Product[] = res.data.data["data-list"].map((item: any) => ({
            id: item.id,
            sku: item.sku,
            name: item.name,
            description: item.description,
            color: item.color,
            size: item.size,
            brand: item.brand,
            costPrice: item["cost-price"],
            sellingPrice: item["selling-price"],
            stockQuantity: item["stock-quantity"],
            categoryName: item["category-name"],
            status: item.status,
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
      } catch (err: any) {
        set((s) => {
          s.isLoading = false;
          s.error = err instanceof Error ? err.message : "Fetch error";
        });
        // console.log("ee" ,err.response.data.Message);
        
        return { success: false, message: err.response.data.Message || "Không thể tải danh sách sản phẩm" };
      }
    },

    clearError: () => {
      set((s) => {
        s.error = null;
      });
    },
  }))
);

// Export default
export default useProductStore;