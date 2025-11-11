// types/purchaseOrder.ts
export type PurchaseOrderStatus = "Draft" | "Submitted" | "Received" | "Cancelled";

export interface PurchaseOrderSummary {
  id: string;
  code: string;
  time: string;
  supplierName: string;
  subTotal: number;
  status: PurchaseOrderStatus;
}

export interface PurchaseOrderItem {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  actualQuantity: number;
  unitPrice: number;
  discount: number;
  reFee: number;
  note: string | null;
}

export interface PurchaseOrder {
  id: string;
  code: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  subTotal: number;
  discountAmount: number;
  paid: number;
  note: string | null;
  status: PurchaseOrderStatus;
  warehouseName: string;
  employeeName: string;
  supplierName: string;
  payMethod?: string;
  items: PurchaseOrderItem[];
}

export interface CreatePurchaseOrderPayload {
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
export interface ImportedProduct {
  id: string;
  quantity: number;
  "actual-quantity": number | null;
  "unit-price": number;
  discount: number;
  "re-fee": number;
  note: string | null;
  "product-name": string;
  sku: string;
}

export interface UpdatePurchaseOrderPayload {
  "pay-method": string;
  "sub-total": number;
  "discount-amount": number;
  paid: number;
  status: string;
  "purchase-order-details": Array<{
    id: string;
    "unit-price": number;
    discount: number;
    "re-fee": number;
    note: string;
    "actual-quantity": number;
  }>;
}


export interface UpdatePurchaseOrderPricesPayload {
  "pay-method": string;
  "sub-total": number;
  "discount-amount": number;
  "paid": number;
  "purchase-order-details": Array<{
    id: string;
    "unit-price": number;
    discount: number;
    "re-fee": number;
    note: string;
    "actual-quantity": number;
  }>;
}