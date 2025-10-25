export type SupplierStatus = "Đang hoạt động" | "Ngừng hoạt động";

export interface SupplierDebt {
  id: string; // Mã phiếu
  time: string; // Thời gian
  type: "Điều chỉnh" | "Thanh toán" | "Chiết khấu thanh toán" | "Mua hàng" | "Trả hàng"|"Phiếu nhập";
  amount: number; // Giá trị
  debt: number; // Nợ cần trả NCC sau phiếu
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  group?: string | null;
  createdAt: string;
  totalPurchase: number;
  currentDebt: number;
  status: SupplierStatus;
  creator: string;
  branch?: string;
  address?: string;
  note?: string | null;

  debts?: SupplierDebt[];
}
