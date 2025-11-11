import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StockTakeNew from "@/components/stocktakes/StockTakeNew";

export default function Page() {
   return (
    <div className="space-y-3">
      <PageBreadcrumb pageTitle="Trả hàng Nhập" />
      <StockTakeNew />
    </div>
  );
}