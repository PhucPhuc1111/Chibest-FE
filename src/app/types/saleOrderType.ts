export interface SaleOrderType {
  Id: string;
  OrderNumber: string;
  OrderDate: string;
  TotalAmount: number;
  Status: string;
  BranchId: string;
  CustomerId?: string | null;
  EmployeeId?: string | null;
}