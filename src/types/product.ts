// =========================================
// 🧱 1. Product (API Response chính)
// =========================================
export interface Product {
  id: string;
  avartarUrl?: string; // undefined nếu không có
  sku: string;
  name: string;
  description: string;
  color: string;
  size: string;
  style?: string;
  brand: string;
  material?: string;
  weight: number;
  isMaster: boolean;
  status: string;
  categoryName?: string;
  parentSku?: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
}

// =========================================
// 🧱 2. ProductCreateRequest (API gửi lên)
// =========================================
export interface ProductCreateRequest {
  sku: string;
  name: string;
  description: string;
  "avatar-url"?: string;
  color: string;
  size: string;
  style?: string;
  brand: string;
  material?: string;
  weight: number;
  "is-master": boolean;
  status: string;
  "category-id": string;
  "parent-sku"?: string | null;
  "selling-price": number;
  "cost-price": number;
  "branch-id": string;
}

// =========================================
// 🧱 3. ProductVariant
// =========================================
export interface ProductVariant {
  id: string;
  name: string;
  sellingPrice: number;
  costPrice: number;
  stockQuantity: number;
  createdAt?: string;
  avartarUrl?: string;
  sku?: string;
  description?: string;
  color?: string;
  size?: string;
  brand?: string;
  material?: string;
  weight?: number;
  isMaster?: boolean;
  status?: string;
  parentSku?: string | null;
  categoryName?: string;
  style?: string;
}

// =========================================
// 🧱 4. ProductMaster
// =========================================
export interface ProductMaster {
  id: string;
  name: string;
  sellingPrice: number;
  costPrice: number;
  stockQuantity: number;
  createdAt?: string;
  avartarUrl?: string;
  variants?: ProductVariant[];
  sku?: string;
  description?: string;
  color?: string;
  size?: string;
  brand?: string;
  material?: string;
  weight?: number;
  isMaster?: boolean;
  status?: string;
  parentSku?: string | null;
  categoryName?: string;
  style?: string;
}

// =========================================
// 🧱 5. TableProduct
// =========================================
export interface TableProduct {
  id: string;
  name: string;
  variant: string;
  sellingPrice: number;
  costPrice: number;
  stockQuantity: number;
  createdAt: string;
  avartarUrl: string;
  type: string;
  group: string;
  supplier: string;
  attrs: {
    color?: string;
    size?: string;
  };
  status: string;
  sku: string;
  description?: string;
  color?: string;
  size?: string;
  brand?: string;
  material?: string;
  weight?: number;
  isMaster: boolean;
  parentSku?: string;
  variants: ProductVariant[];
}
export interface ProductQueryParams {
  SearchTerm?: string;
  Status?: string;
  CategoryId?: string;
  IsMaster?: boolean;
  Brand?: string;
  BranchId?: string;
  PageNumber?: number;
  PageSize?: number;
  SortBy?: string;
  SortDescending?: boolean;
}