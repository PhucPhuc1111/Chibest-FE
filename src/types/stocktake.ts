export interface StockAdjustmentDetail {
  id: string;
  systemQty: number;
  actualQty: number;
  differenceQty: number;
  unitCost: number;
  totalValueChange: number;
  reason: string | null;
  note: string | null;
  productName: string;
  sku: string;
}

export interface StockAdjustment {
  id: string;
  adjustmentCode: string;
  adjustmentDate: string;
  adjustmentType: string;
  branchName: string;
  employeeName: string;
  approveName: string | null;
  totalValueChange: number;
  status: string;
  reason: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  stockAdjustmentDetails: StockAdjustmentDetail[];
}

export interface StockAdjustmentSummary {
  id: string;
  adjustmentCode: string;
  adjustmentDate: string;
  adjustmentType: string;
  totalValueChange: number;
  status: string;
}

// Raw interfaces từ API
export interface RawStockAdjustmentDetail {
  id: string;
  "system-qty": number;
  "actual-qty": number;
  "difference-qty": number;
  "unit-cost": number;
  "total-value-change": number;
  reason: string | null;
  note: string | null;
  "product-name": string;
  sku: string;
}

export interface RawStockAdjustment {
  id: string;
  "adjustment-code": string;
  "adjustment-date": string;
  "adjustment-type": string;
  "branch-name": string;
  "employee-name": string;
  "approve-name": string | null;
  "total-value-change": number;
  status: string;
  reason: string | null;
  note: string | null;
  "created-at": string;
  "updated-at": string;
  "approved-at": string | null;
  "stock-adjustment-details": RawStockAdjustmentDetail[];
}

export interface RawStockAdjustmentSummary {
  id: string;
  "adjustment-code": string;
  "adjustment-date": string;
  "adjustment-type": string;
  "total-value-change": number;
  status: string;
}

// Request interfaces
export interface CreateStockAdjustmentRequest {
  "adjustment-code": string;
  "adjustment-date": string;
  "adjustment-type": string;
  "branch-id": string;
  "employee-id": string;
  status: string;
  note: string | null;
  "stock-adjustment-details": CreateStockAdjustmentDetailRequest[];
}

export interface CreateStockAdjustmentDetailRequest {
  "product-id": string;
  "system-qty": number;
  "actual-qty": number;
  "difference-qty": number;
  "unit-cost": number;
  reason?: string;
  note?: string | null;
}

export interface UpdateStockAdjustmentRequest {
  "adjustment-type": string;
  "approveby-id": string | null;
  note: string | null;
  status: string;
  "stock-adjustment-details": UpdateStockAdjustmentDetailRequest[];
}

export interface UpdateStockAdjustmentDetailRequest {
  id: string;
  "product-id": string;
  "system-qty": number;
  "actual-qty": number;
  "unit-cost": number;
  reason: string;
  note: string | null;
}

export interface GetStockAdjustmentsParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
  branchId?: string;
}