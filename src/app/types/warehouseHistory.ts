export interface WarehouseHistoryType {
  Id: string;
  TransactionType: string;
  TransactionDate: string;
  Notes?: string | null;
  PurchaseHistoryId: string;
  StockItemId?: string | null;
  FromWarehouseId?: string | null;
  ToWarehouseId?: string | null;
  EmployeeId?: string | null;
  SupplierID?: string | null;
}