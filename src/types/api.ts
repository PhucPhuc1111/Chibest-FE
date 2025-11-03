// src/types/api.ts

/**
 * Định nghĩa cấu trúc phản hồi API tiêu chuẩn từ Backend
 * @template T Kiểu dữ liệu thực tế (payload) nằm trong trường 'data'
 */
export interface ApiResponse<T = unknown> {
  // Mã trạng thái nghiệp vụ (Business Logic Status Code)
  "status-code": number; 
  
  // Thông báo đi kèm (Ví dụ: "Data retrieved successfully.")
  message: string;
  
  // Dữ liệu thực tế được trả về (List, Detail, v.v.)
  data: T;
  
  // Nếu API GET List có trả về tổng số bản ghi (Optional)
  totalRecords?: number; 
}

// Định nghĩa cấu trúc lỗi mạng/HTTP
export interface ApiError {
  message: string;
  statusCode: number; // Ví dụ: 401, 404, 500
  // ... các trường lỗi khác nếu có
}