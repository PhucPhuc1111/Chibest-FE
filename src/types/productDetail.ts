export interface ProductDetail {
  id: string;
  chipCode: string;
  purchasePrice: number;
  importDate: string;
  lastTransactionDate: string | null;
  status: string;
  productId: string;
  branchId: string;
  onlineBranchId: string | null;
  containerCode: string | null;
}

export interface ProductDetailQueryParams {
  ChipCode?: string;
  ProductId?: string;
  BranchId?: string;
  Status?: string;
  SupplierId?: string;
  ImportDateFrom?: string;
  ImportDateTo?: string;
  PageNumber?: number;
  PageSize?: number;
  SortBy?: string;
  SortDescending?: boolean;
}