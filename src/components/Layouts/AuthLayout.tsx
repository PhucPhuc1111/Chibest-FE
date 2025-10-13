// components/Layouts/AuthLayout.tsx
"use client";
import React, { ReactNode } from "react";
import Header from "@/components/Header";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
    
        <Header sidebarOpen={false} setSidebarOpen={() => {}} /> 
 
     
      <main>
        <div className="">
          {children}
        </div>
      </main>
    </>
  );
}
