
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Chibest",
  description:
    "This is Next.js Calender page for Chibest  Tailwind CSS Admin Dashboard Template",

};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Quy cách" />
     
    </div>
  );
}
