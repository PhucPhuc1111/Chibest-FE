import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PurchaseOrderList from "@/components/purchaseOrders/PurchaseOrderList";

export default function Page() {
   return (
    <div className="space-y-3">
      <PageBreadcrumb pageTitle="Hàng hóa" />
      <PurchaseOrderList />
    </div>
  );
}
