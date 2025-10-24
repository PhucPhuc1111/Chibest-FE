export type TransferStatus = "Phiếu tạm" | "Đang chuyển" | "Đã nhận";

export interface TransferProductItem {
  id: string;          // mã hàng
  name: string;        // tên hàng
  qtyTransfer: number; // số lượng chuyển
  qtyReceive: number;  // số lượng nhận
  price: number;       // giá chuyển/nhận
}

export interface Transfer {
  id: string;                     // mã chuyển hàng (TRF010318...)
  dateTransfer: string;           // "23/10/2025 21:50"
  dateReceive?: string;           // có khi đã nhận
  fromBranch: string;             // "Chibest Quận 4"
  toBranch: string;               // "Chibest Thủ Đức"
  value: number;                  // tổng giá trị chuyển
  status: TransferStatus;         // Phiếu tạm | Đang chuyển | Đã nhận
  creator: string;                // người tạo
  receiver?: string;              // người nhận (nếu đã nhận)
  products: TransferProductItem[];// danh sách hàng
}
