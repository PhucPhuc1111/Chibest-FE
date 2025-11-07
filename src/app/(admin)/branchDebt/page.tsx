"use client";

import BranchDebtList from "@/components/branchDebt/BranchDebtList";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function Page() {
  return (
    <div className="p-20">
      <PageBreadcrumb pageTitle="Công nợ chi nhánh" />
      <BranchDebtList />
    </div>
  );
}

