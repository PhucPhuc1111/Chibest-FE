export interface Product {
  id: string;
  avartarUrl: string | null;
  sku: string;
  name: string;
  description: string;
  color: string;
  size: string;
  style: string | null;
  brand: string;
  material: string | null;
  weight: number;
  isMaster: boolean;
  status: string;
  categoryName: string;
  parentSku: string | null;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
}

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
  "parent-sku"?: string;
  "selling-price": number;
  "cost-price": number;
  "branch-id": string;
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