export interface SalesOrderLineType {
  Id: string;
  UnitPrice: number;
  Quantity: number;
  Discount: number;
  LineTotal: number;
  SalesOrderId: string;
  ProductId: string;
}