
import PurchaseReturnList from "@/components/purchaseReturns/PurchaseReturnList";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
export default function Page() {
  return (
    <div className="space-y-3 ">
      <PageBreadcrumb pageTitle="Trả hàng nhập" />
      <PurchaseReturnList />
    </div>
  );
}
