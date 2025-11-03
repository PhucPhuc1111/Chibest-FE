// src/app/(admin)/purchaseOrders/new/page.tsx
import PurchaseOrderNew from "@/components/purchaseOrders/PurchaseOrderNew";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
export default function NewPurchaseOrderPage() {
  return (
    <div className="space-y-3 ">
      <PageBreadcrumb pageTitle="Nhập hàng" />
      <PurchaseOrderNew />
    </div>
  );
}
