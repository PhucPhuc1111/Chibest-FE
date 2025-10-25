"use client";

import PriceBookList from "@/components/pricebook/PriceBookList";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
export default function Page() {
  return (
    <div className="space-y-3">
      <PageBreadcrumb pageTitle="Hàng hóa" />
      <PriceBookList />
    </div>
  );
}
