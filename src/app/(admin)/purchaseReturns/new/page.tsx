import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PurchaseReturnNew from "@/components/purchaseReturns/PurchaseReturnNew";

export default function Page() {
   return (
    <div className="space-y-3">
      <PageBreadcrumb pageTitle="Trả hàng Nhập" />
      <PurchaseReturnNew />
    </div>
  );
}