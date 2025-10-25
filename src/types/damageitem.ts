export type DamageStatus = "Phiếu tạm" | "Hoàn thành" | "Đã hủy";

export interface DamageItemRow {
  id: string;      // mã hàng
  name: string;    // tên hàng
  qty: number;     // số lượng hủy
  price: number;   // giá hủy
}

export interface DamageDoc {
  id: string;                // Mã xuất hủy
  time: string;              // "25/10/2025 10:30"
  branch: string;            // Chi nhánh
  note?: string;             // Ghi chú
  totalValue: number;        // Tổng giá trị hủy
  status: DamageStatus;      // Phiếu tạm | Hoàn thành | Đã hủy
  creator: string;           // Người tạo
  destroyer?: string;        // Người xuất hủy
  items: DamageItemRow[];    // Danh sách hàng hủy
}
