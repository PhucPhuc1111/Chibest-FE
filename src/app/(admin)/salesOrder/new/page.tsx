// src/app/(admin)/purchaseOrders/new/page.tsx
import SalesOrderNew from "@/components/salesOrder/SalesOrderNew";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
export default function NewPurchaseOrderPage() {
  return (
    <div className="space-y-3 p-20">
      <PageBreadcrumb pageTitle="Phiếu bán hàng" />
      <SalesOrderNew />
    </div>
  );
}
