// // types/transfer.ts
// export type TransferStatus = "Draft" | "Hoàn Thành" | "Đã Hủy";

// export interface TransferSummary {
//   id: string;
//   code: string;
//   fromWarehouseName: string;
//   toWarehouseName: string;
//   time: string;
//   subTotal: number;
//   status: TransferStatus;
// }

// export interface TransferItem {
//   id: string;
//   sku: string;
//   productName: string;
//   quantity: number;
//   actualQuantity: number;
//   unitPrice: number;
//   extraFee: number;
//   commissionFee: number;
//   discount: number;
//   note: string | null;
//   containerCode: string | null;
// }

// export interface Transfer {
//   id: string;
//   code: string;
//   time: string;
//   createdAt: string;
//   updatedAt: string;
//   subTotal: number;
//   discountAmount: number;
//   paid: number;
//   note: string | null;
//   status: TransferStatus;
//   fromWarehouseName: string;
//   toWarehouseName: string;
//   items: TransferItem[];
// }

// export interface CreateTransferPayload {
//   "invoice-code": string | null;
//   "order-date": string;
//   "pay-method": string;
//   "sub-total": number;
//   "discount-amount": number;
//   "paid": number;
//   "note": string;
//   "from-warehouse-id": string;
//   "to-warehouse-id": string;
//   "employee-id": string;
//   "transfer-order-details": Array<{
//     "quantity": number;
//     "unit-price": number;
//     "extra-fee": number;
//     "commission-fee": number;
//     "discount": number;
//     "note": string;
//     "product-id": string | null;
//   }>;
// }

// export interface CreateMultiTransferPayload {
//   "from-warehouse-id": string;
//   "employee-id": string;
//   "order-date": string;
//   "note": string;
//   "pay-method": string;
//   "discount-amount": number;
//   "sub-total": number;
//   "paid": number;
//   destinations: Array<{
//     "to-warehouse-id": string;
//     products: Array<{
//       "product-id": string;
//       quantity: number;
//       "unit-price": number;
//       "extra-fee": number;
//       "commission-fee": number;
//       discount: number;
//       note: string;
//     }>;
//   }>;
// }

// export interface UpdateTransferPayload {
//   "pay-method": string;
//   "sub-total": number;
//   "discount-amount": number;
//   "paid": number;
//   "status": TransferStatus;
//   "transfer-order-details": Array<{
//     "id": string;
//     "extra-fee": number;
//     "commission-fee": number;
//     "unit-price": number;
//     "actual-quantity": number;
//     "note": string;
//   }>;
// }

// // Interface cho API response từ import
// export interface ImportedTransferProduct {
//   id: string;
//   quantity: number;
//   "unit-price": number;
//   "extra-fee": number;
//   "commission-fee": number;
//   discount: number;
//   note: string | null;
//   "product-name": string;
//   sku: string;
//   "container-code": string | null;
// }
// types/transfer.ts
export type TransferStatus = "Draft" | "Submitted" | "Received" | "Cancelled";

export interface TransferSummary {
  id: string;
  code: string;
  fromWarehouseName: string;
  toWarehouseName: string;
  time: string;
  subTotal: number;
  status: TransferStatus;
}

export interface TransferItem {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  actualQuantity: number;
  unitPrice: number;
  extraFee: number;
  commissionFee: number;
  discount: number;
  note: string | null;
  containerCode: string | null;
}

export interface Transfer {
  id: string;
  code: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  subTotal: number;
  discountAmount: number;
  paid: number;
  note: string | null;
  status: TransferStatus;
  fromWarehouseName: string;
  toWarehouseName: string;
  payMethod?: string;
  items: TransferItem[];
}

export interface CreateTransferPayload {
  "invoice-code": string | null;
  "order-date": string;
  "pay-method": string;
  "sub-total": number;
  "discount-amount": number;
  "paid": number;
  "note": string;
  "from-warehouse-id": string;
  "to-warehouse-id": string;
  "employee-id": string;
  "transfer-order-details": Array<{
    "quantity": number;
    "unit-price": number;
    "extra-fee": number;
    "commission-fee": number;
    "discount": number;
    "note": string;
    "product-id": string | null;
  }>;
}

export interface CreateMultiTransferPayload {
  "from-warehouse-id": string;
  "employee-id": string;
  "order-date": string;
  "note": string;
  "pay-method": string;
  "discount-amount": number;
  "sub-total": number;
  "paid": number;
  destinations: Array<{
    "to-warehouse-id": string;
    products: Array<{
      "product-id": string;
      quantity: number;
      "unit-price": number;
      "extra-fee": number;
      "commission-fee": number;
      discount: number;
      note: string;
    }>;
  }>;
}

export interface UpdateTransferPayload {
  "pay-method": string;
  "sub-total": number;
  "discount-amount": number;
  "paid": number;
  "status": TransferStatus;
  "transfer-order-details": Array<{
    "id": string;
    "extra-fee": number;
    "commission-fee": number;
    "unit-price": number;
    "actual-quantity": number;
    "note": string;
  }>;
}

// Thêm types mới cho update status và prices riêng biệt
export type UpdateTransferStatusPayload = TransferStatus;

export interface UpdateTransferPricesPayload {
  "pay-method": string;
  "sub-total": number;
  "discount-amount": number;
  "paid": number;
  "transfer-order-details": Array<{
    "id": string;
    "extra-fee": number;
    "commission-fee": number;
    "unit-price": number;
    "actual-quantity": number;
    "note": string;
  }>;
}

// Interface cho API response từ import
export interface ImportedTransferProduct {
  id: string;
  quantity: number;
  "unit-price": number;
  "extra-fee": number;
  "commission-fee": number;
  discount: number;
  note: string | null;
  "product-name": string;
  sku: string;
  "container-code": string | null;
}