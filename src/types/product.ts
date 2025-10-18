// ========== PRODUCT TYPES ==========

export interface Variant {
  id: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  createdAt?: string;
  image?: string;
  attrs?: {
    color?: string;
    size?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  variant?: string;
  group: string;
  type: string;
  sellType: string;
  point: string;
  image: string;
  price: number;
  cost: number;
  stock: number;
 createdAt: string;
  supplier?: string;
  attrs?: {
    color?: string;
    size?: string;
  };
  variants?: Variant[];
}

export interface WarehouseRecord {
  id: string;
  time: string;
  type: string;
  partner?: string;
  tradePrice?: number;
  cost?: number;
  qty?: number;
  ending?: number;
}
