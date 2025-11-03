// types/purchaseReturn.ts
export type PurchaseReturnStatus = "Chờ Xử Lý" | "Hoàn Thành" | "Đã Hủy";

export interface PurchaseReturnSummary {
  id: string;
  code: string;
  time: string;
  subTotal: number;
  status: PurchaseReturnStatus;
}

export interface PurchaseReturnItem {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  returnPrice: number;
  note: string | null;
  containerCode: string | null;
}

export interface PurchaseReturn {
  id: string;
  code: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  subTotal: number;
  note: string | null;
  status: PurchaseReturnStatus;
  fromWarehouseName: string;
  toWarehouseName: string;
  items: PurchaseReturnItem[];
}

export interface CreatePurchaseReturnPayload {
  "invoice-code": string | null;
  "order-date": string;
  "pay-method": string;
  "sub-total": number;
  "discount-amount": number;
  "paid": number;
  "note": string;
  "warehouse-id": string;
  "employee-id": string;
  "supplier-id": string;
  "purchase-order-details": Array<{
    "quantity": number;
    "unit-price": number;
    "discount": number;
    "re-fee": number;
    "note": string;
    "product-id": string | null;
  }>;
}

// Interface cho API response từ import
export interface ImportedPurchaseReturnProduct {
  id: string;
  quantity: number;
  "unit-price": number;
  "return-price": number;
  note: string | null;
  "product-name": string;
  sku: string;
  "container-code": string | null;
}