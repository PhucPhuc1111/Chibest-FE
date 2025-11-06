"use client";

import SupplierList from "@/components/suppliers/SupplierList";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
export default function Page() {
  return (
    <div className="space-y-3 ">
     <PageBreadcrumb pageTitle="Nhà cung cấp" />
      <SupplierList />
    </div>

  );

  
}
