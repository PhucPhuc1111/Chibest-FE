export type SupplierStatus = "Đang hoạt động" | "Ngừng hoạt động";

export interface SupplierDebtHistory {
  id?: string;
  transactionType?: string;
  transactionDate?: string;
  amount?: number;
  balanceBefore?: number;
  balanceAfter?: number;
  note?: string;
  description?: string;
  createdAt?: string;
  remainingDebt?: number;
}

export interface SupplierDebt {
  id: string; // Mã phiếu
  time: string; // Thời gian
  type: "Điều chỉnh" | "Thanh toán"  | "Mua hàng" | "Trả hàng"|"Phiếu nhập";
  amount: number; // Giá trị
  debt: number; // Nợ cần trả NCC sau phiếu
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  group?: string | null;
  createdAt?: string;
  totalPurchase?: number;
  totalDebt?: number;
  payAmount?: number;
  returnAmount?: number;
  remainingDebt?: number;
  currentDebt?: number;
  status?: SupplierStatus;
  creator?: string;
  branch?: string;
  address?: string;
  note?: string | null;
  lastTransactionDate?: string;
  lastUpdated?: string;

  debts?: SupplierDebt[];
  debtHistories?: SupplierDebtHistory[];
}

export interface SupplierDebtListItem extends Supplier {
  totalDebt: number;
  payAmount: number;
  returnAmount: number;
  remainingDebt: number;
}
