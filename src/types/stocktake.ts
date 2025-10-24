export type StockTakeStatus = "Phiếu tạm" | "Đã cân bằng kho" | "Đã hủy";

export interface StockTakeItem {
  id: string;
  name: string;
  stock: number;
  actual: number;
  diff: number;
  diffValue: number;
}

export interface StockTake {
  id: string;
  time: string;
  balanceDate?: string;
  totalQty: number;
  totalValue: number;
  totalDiff: number;
  increaseQty: number;
  decreaseQty: number;
  creator: string;
  status: StockTakeStatus;
  items: StockTakeItem[];
}
