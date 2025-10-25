export interface PriceBookItem {
  id: string;
  name: string;
  group: string;
  costPrice: number;     // Giá vốn
  lastImport: number;    // Giá nhập cuối
  commonPrice: number;   // Bảng giá chung
}

export interface PriceBookFilters {
  priceList?: string;
  groups?: string[];
  stockFilter?: string;
  compareCondition?: string;
  compareTarget?: string;
}
