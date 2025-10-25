"use client";

import DamageItemList from "@/components/damageitems/DamageItemList";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
export default function Page() {
    return (

         <div className="space-y-3">
      <PageBreadcrumb pageTitle="Hàng hóa" />
      <DamageItemList />
    </div>
    )
 

  
}
