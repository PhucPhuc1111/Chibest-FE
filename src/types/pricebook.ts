// types/pricebook.ts
export interface PriceBookItem {
  id: string;
  "product-id": string;
  "selling-price": number;
  "effective-date": string;
  "expiry-date": string | null;
  note: string | null;
  "created-at": string;
  "created-by": string;
  "branch-id": string | null;
}

export interface PriceBookResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": PriceBookItem[];
}