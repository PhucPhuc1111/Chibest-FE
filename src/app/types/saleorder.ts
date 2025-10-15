export interface SalesOrderType {
  Id: string;
  OrderNumber: string;
  OrderDate: string;
  TotalAmount: number;
  Status: 'New' | 'Confirmed' | 'Paid' | 'Cancelled';
  BranchId: string;
  CustomerId?: string | null;
  EmployeeId?: string | null;
}