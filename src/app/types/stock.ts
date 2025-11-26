export interface StockItemType {
  Id: string;
  ChipCode?: string | null;
  ImportDate: string;
  LastTransactionDate?: string | null;
  Status: string;
  ProductID: string;
  BranchId?: string | null;
}