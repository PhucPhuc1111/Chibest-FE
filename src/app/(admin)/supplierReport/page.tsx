"use client";

import SupplierReport from "@/components/supplierReport/SupplierReport";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
export default function Page() {
  return (
    <div >
     <PageBreadcrumb pageTitle="Báo cáo kế hoạch" />
      <SupplierReport />
    </div>

  );

  
}
