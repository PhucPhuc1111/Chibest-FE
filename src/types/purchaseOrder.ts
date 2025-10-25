// src/types/purchaseOrder.ts

export type PurchaseOrderStatus = "Phiếu tạm" | "Đã nhập hàng" | "Đã hủy";

export interface PurchaseOrderItem {
  id: string;          // mã hàng
  name: string;        // tên hàng
  qty: number;         // số lượng
  unitPrice: number;   // đơn giá
  discount?: number;   // giảm giá từng dòng (đ)
  buyPrice?: number;   // giá nhập (sau giảm)
}

export interface PurchaseOrder {
  id: string;                 // PNxxxxx
  time: string;               // "23/10/2025 12:23"
  supplierCode?: string;      // Mã NCC
  supplierName?: string;      // Tên NCC
  branch?: string;            // chi nhánh
  creator: string;            // người tạo
  receiver?: string;          // người nhập
  needPayToSupplier: number;  // Cần trả NCC
  status: PurchaseOrderStatus;
  note?: string | null;
  items?: PurchaseOrderItem[];
}
