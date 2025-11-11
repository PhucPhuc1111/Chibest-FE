export type Status = "Draft" | "Submitted" | "Received" | "Cancelled";

// Mapping để hiển thị tiếng Việt
export const STATUS_MAPPING: Record<Status, string> = {
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

export const getStatusColor = (status: Status): string => {
  switch (status) {
    case "Draft": return "orange";
    case "Submitted": return "blue";
    case "Received": return "green";
    case "Cancelled": return "red";
    default: return "default";
  }
};