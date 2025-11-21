"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SalesOrderList from "@/components/salesOrder/SalesOrderList";
export default function Page() {
   return (
    <div className="space-y-3 ">
      <PageBreadcrumb pageTitle="Phiếu bán hàng " />
      <SalesOrderList />
    </div>
  );
}