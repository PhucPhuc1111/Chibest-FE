
"use client";
import SalesPlanList from "@/components/salesPlans/SalesPlanList";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
export default function Page() {
  return (
    <div className="space-y-3 ">
      <PageBreadcrumb pageTitle="Kế hoạch bán hàng" />
      <SalesPlanList />
    </div>
  );
}
