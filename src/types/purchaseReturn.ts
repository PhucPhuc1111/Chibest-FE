export type PurchaseReturnStatus = "Phiếu tạm" | "Đã trả hàng" | "Đã hủy";

export interface PurchaseReturnItem {
  id: string;
  name: string;
  qty: number;
  buyPrice: number;
  returnPrice: number;
  discount?: number;
}

export interface PurchaseReturn {
  id: string;
  time: string;
  supplierName: string;
  creator: string;
  receiver: string;
  branch: string;
  total: number;
  discount: number;
  supplierPay: number;
  supplierPaid: number;
  status: PurchaseReturnStatus;
  note?: string;
  items?: PurchaseReturnItem[];
}
