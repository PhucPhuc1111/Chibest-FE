// types/product.ts
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

export interface ProductListResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
  dataList: Product[];
}

export interface ProductSearchParams {
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