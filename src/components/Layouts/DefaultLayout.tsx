"use client";
import React, { useState, ReactNode, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const router = useRouter();

  useEffect(() => {
    const role = Cookies.get("userRole");

    if (role !== "Admin" && role !== "Nutritionist") {
      toast.error("Bạn không có quyền truy cập!");
      router.push("/");
    }
  }, []);
  return (
    <>
     <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
 
      <div className="flex">
        
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="relative flex flex-1 flex-col lg:ml-72.5">
          
          <main>
            <div className="mx-auto p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
         
        </div>
     
      </div>
  
    </>
  );
}
