import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SalesPlanNew from "@/components/salesPlans/SalesPlanNew";
export const metadata = {
  title: "Chi Tiết Kế Hoạch Bán Hàng | Chibest",
};

export default function SalesPlanDetailPage() {
  return (
    <div className="space-y-3">
      <PageBreadcrumb pageTitle="Tạo kế hoạch bán hàng mới" />
      <SalesPlanNew  />
    </div>
  );
}