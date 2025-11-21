export interface SalesPlanItem {
  id: string;
  "plan-id": string;
  "product-id": string;
  sku: string;
  "product-name": string;
  "avatar-url"?: string | null;
  "category-name": string;
  color: string;
  size: string;
  status: "Chưa xử lý" | "Đang xử lý" | "Đã hoàn thành";
  "cost-price": number;
  "selling-price": number;
  quantity: number;
  notes?: string;
  "created-at": string;
  "updated-at": string;
}

export interface SalesPlan {
  id: string;
  name: string;
  description?: string;
  "start-date": string;
  "end-date": string;
  status: "Chưa bắt đầu" | "Đang thực hiện" | "Hoàn thành";
  "created-at": string;
  "updated-at": string;
  "created-by": string;
  "supplier-id": string;
  "supplier-name": string;
  "total-items": number;
  "completed-items": number;
  "in-progress-items": number;
  "pending-items": number;
  items: SalesPlanItem[];
}

export interface SalesPlanResponse {
  "status-code": number;
  message: string;
  data: {
    "page-index": number;
    "page-size": number;
    "total-count": number;
    "total-page": number;
    "data-list": SalesPlan[];
  };
}

export interface SalesPlanFormData {
  name: string;
  description?: string;
  "start-date": string;
  "end-date": string;
  "supplier-id": string;
  items: Array<{
    "product-id": string;
    "cost-price": number;
    "selling-price": number;
    quantity: number;
    notes?: string;
  }>;
}