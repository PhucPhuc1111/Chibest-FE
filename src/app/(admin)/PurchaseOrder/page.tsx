import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PurchaseOrderList from "@/components/purchaseOrders/PurchaseOrderList";

export default function Page() {
   return (
    <div className="space-y-3 p-20">
      <PageBreadcrumb pageTitle="Nhập hàng " />
      <PurchaseOrderList />
    </div>
  );
}