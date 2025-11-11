// types/purchaseReturn.ts
export type PurchaseReturnStatus = "Draft" | "Submitted" | "Received" | "Cancelled";

// Mapping để hiển thị tiếng Việt
export const STATUS_MAPPING: Record<PurchaseReturnStatus, string> = {
  "Draft": "Chờ Xử Lý",
  "Submitted": "Đã Gửi", 
  "Received": "Đã Nhận",
  "Cancelled": "Đã Hủy"
};

export const STATUS_OPTIONS = [
  { label: "Chờ Xử Lý", value: "Draft" },
  { label: "Đã Gửi", value: "Submitted" },
  { label: "Đã Nhận", value: "Received" },
  { label: "Đã Hủy", value: "Cancelled" },
];

export const getStatusColor = (status: PurchaseReturnStatus): string => {
  switch (status) {
    case "Draft": return "orange";
    case "Submitted": return "blue";
    case "Received": return "green";
    case "Cancelled": return "red";
    default: return "default";
  }
};

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