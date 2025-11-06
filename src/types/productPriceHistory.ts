export interface ProductPriceHistory {
  id: string;
  sellingPrice: number;
  costPrice: number;
  effectiveDate: string;
  expiryDate: string | null;
  note: string | null;
  createdAt: string;
  createdBy: string;
  productId: string;
  branchId: string | null;
}

// ✅ ĐỊNH NGHĨA RAW INTERFACE CHO DATA TỪ API
export interface RawProductPriceHistory {
  id: string;
  "selling-price": number;
  "cost-price": number;
  "effective-date": string;
  "expiry-date": string | null;
  note: string | null;
  "created-at": string;
  "created-by": string;
  "product-id": string;
  "branch-id": string | null;
}

export interface ProductPriceHistoryQueryParams {
  ProductId?: string;
  BranchId?: string;
  CreatedBy?: string;
  EffectiveDateFrom?: string;
  EffectiveDateTo?: string;
  ExpiryDateFrom?: string;
  ExpiryDateTo?: string;
  IsActive?: boolean;
  Note?: string;
  PageNumber?: number;
  PageSize?: number;
  SortBy?: string;
  SortDescending?: boolean;
}

export interface CreateProductPriceHistoryRequest {
  "selling-price": number;
  "cost-price": number;
  "effective-date": string;
  "expiry-date"?: string;
  note?: string;
  "product-id": string;
  "branch-id"?: string;
}