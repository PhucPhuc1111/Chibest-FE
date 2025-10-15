export interface PurchaseHistoryType {
  Id: string;
  InvoiceNumber?: string | null;
  Quantity: number;
  UnitPrice: number;
  TotalPrice: number;
  PurchaseDate: string;
  Note?: string | null;
  ProductId: string;
  WarehouseId?: string | null;
  SupplierId?: string | null;
}