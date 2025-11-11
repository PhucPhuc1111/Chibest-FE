import StockTakeList from "../../../components/stocktakes/StockTakeList";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
export default function Page() {
  return (
    <div className="space-y-3">
       <PageBreadcrumb pageTitle="Phiếu kiểm kho" />
      <StockTakeList />
    </div>
  );
}
