
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Chibest",
  description:
    "This is Next.js Calender page for Chibest  Tailwind CSS Admin Dashboard Template",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Chi nhánh" />
      <div className="flex justify-center">Hello</div>
    </div>
  );
}
