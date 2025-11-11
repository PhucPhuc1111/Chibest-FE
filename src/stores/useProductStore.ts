import { create } from "zustand";
import api from "@/api/axiosInstance";
import { message } from "antd";
import type { Product,ProductQueryParams ,ProductCreateRequest} from "@/types/product";

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
interface ApiResponse {
  "status-code": number;
  message: string;
  data: {
    "data-list": RawProduct[];
    "total-count": number;
  };
}
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

interface ProductActions {
  getProducts: (params?: ProductQueryParams) => Promise<void>;
  createProduct: (product: ProductCreateRequest) => Promise<boolean>;
  searchProducts: (searchTerm: string) => Promise<void>;
  updateProduct: (product: Record<string, unknown>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateProductStatus: (id: string, status: string) => Promise<boolean>;
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

export const useProductStore = create<ProductState & ProductActions>((set, get) => ({
  // INIT STATE
  products: [],
  loading: false,
  error: null,
  totalCount: 0,
  //  searchProducts: async (searchTerm: string) => {
  //   const params: ProductQueryParams = {
  //     SearchTerm: searchTerm,
  //     PageNumber: 1,
  //     PageSize: 50, 
  //     // SortBy: "name", 
  //     // SortDescending: false,
  //   };
    
  //   return get().getProducts(params);
  // },
// Trong useProductStore - SỬA SEARCH
searchProducts: async (searchTerm: string) => {
  set({ loading: true, error: null });
  
  try {
    const response = await api.get<ApiResponse>("/api/product", { 
      params: {
        SearchTerm: searchTerm,
        PageNumber: 1,
        PageSize: 50,
        // KHÔNG filter IsMaster để tìm cả variant
      }
    });
    
    if (response.data["status-code"] === 200) {
      const foundProducts: Product[] = response.data.data["data-list"].map((item: RawProduct) => ({
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

      // ✅ QUAN TRỌNG: Nếu tìm thấy variant, fetch thêm master product
      const variants = foundProducts.filter(p => !p.isMaster);
      if (variants.length > 0) {
        const masterSkus = [...new Set(variants.map(v => v.parentSku).filter(Boolean))];
        
        // Fetch tất cả master products của các variant tìm thấy
        for (const masterSku of masterSkus) {
          if (masterSku) {
            try {
              const masterResponse = await api.get<ApiResponse>("/api/product", { 
                params: {
                  SearchTerm: masterSku,
                  PageNumber: 1,
                  PageSize: 1,
                }
              });
              
              if (masterResponse.data["status-code"] === 200) {
                const masterProducts: Product[] = masterResponse.data.data["data-list"].map((item: RawProduct) => ({
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
                
                // Thêm master products vào kết quả
                foundProducts.push(...masterProducts.filter(m => m.isMaster));
              }
            } catch (error) {
              console.warn(`Không thể fetch master product cho SKU: ${masterSku}`, error);
            }
          }
        }
      }

      // Loại bỏ trùng lặp
      const uniqueProducts = foundProducts.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
      );
      
      set({ 
        products: uniqueProducts,
        totalCount: uniqueProducts.length,
        loading: false 
      });
    }
  } catch (error: unknown) {
    // ... error handling
  }
},
  // LẤY DANH SÁCH SẢN PHẨM
  getProducts: async (params?: ProductQueryParams) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get<ApiResponse>("/api/product", { params });
      
      if (response.data["status-code"] === 200) {
        // Transform data từ API format sang frontend format
        const products: Product[] = response.data.data["data-list"].map((item: RawProduct) => ({
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
        
        set({ 
          products: products,
          totalCount: response.data.data["total-count"],
          loading: false 
        });
      }
    } catch (error: unknown) {
      let errorMsg = "Lỗi tải danh sách sản phẩm";
      
      if (isApiError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      set({ loading: false, error: errorMsg });
      message.error(errorMsg);
    }
  },

  // TẠO SẢN PHẨM MỚI
  createProduct: async (product: ProductCreateRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.post("/api/product", product, {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      });
      
      if (response.data["status-code"] === 201) {
        set({ loading: false });
        message.success("Tạo sản phẩm thành công!");
        
        // Load lại danh sách sau khi tạo
        get().getProducts();
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi tạo sản phẩm";
      
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

  // CẬP NHẬT SẢN PHẨM
  updateProduct: async (product: Record<string, unknown>) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.put("/api/product", product, {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      });
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Cập nhật sản phẩm thành công!");
        
        // Load lại danh sách sau khi cập nhật
        get().getProducts();
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi cập nhật sản phẩm";
      
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

  // XÓA SẢN PHẨM
  deleteProduct: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.delete(`/api/product/${id}`);
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Xóa sản phẩm thành công!");
        
        // Cập nhật danh sách hiện tại
        const currentProducts = get().products;
        set({ products: currentProducts.filter(product => product.id !== id) });
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi xóa sản phẩm";
      
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

  // CẬP NHẬT TRẠNG THÁI SẢN PHẨM
  updateProductStatus: async (id: string, status: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.patch(`/api/product/${id}/status`, status, {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      });
      
      if (response.data["status-code"] === 200) {
        set({ loading: false });
        message.success("Cập nhật trạng thái thành công!");
        
        // Cập nhật trạng thái trong danh sách hiện tại
        const currentProducts = get().products;
        const updatedProducts = currentProducts.map(product =>
          product.id === id ? { ...product, status } : product
        );
        set({ products: updatedProducts });
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (error: unknown) {
      let errorMsg = "Lỗi cập nhật trạng thái";
      
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
