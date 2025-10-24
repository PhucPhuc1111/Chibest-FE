import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TransferList from "@/components/transfers/TransferList";

export default function Page() {
  return (
    <div className="space-y-3">
      <PageBreadcrumb pageTitle="Chuyển hàng" />
      <TransferList />
    </div>
  );
}
