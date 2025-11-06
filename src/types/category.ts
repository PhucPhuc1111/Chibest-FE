export interface Category {
  id: string;
  type: string;
  name: string;
  description: string;
  "parent-id": string | null;
  "parent-name": string | null;
  "product-count": number;
  children: Category[] | null;
}

export interface CategoryCreateRequest {
  id?: string;
  type: string;
  name: string;
  description: string;
  "parent-id"?: string | null;
}

export interface CategoryQueryParams {
  Type?: string;
  Name?: string;
  ParentId?: string;
  OnlyRoot?: boolean;
  PageNumber?: number;
  PageSize?: number;
  SortBy?: string;
  SortDescending?: boolean;
}

export interface CategoryListResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": Category[];
}

export interface CategoryApiResponse<T> {
  "status-code": number;
  message: string;
  data: T;
}