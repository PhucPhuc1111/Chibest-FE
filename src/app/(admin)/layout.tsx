"use client";

// import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <div className="flex h-screen bg-gray-50">
    {/* Sidebar */}
    <AppSidebar />
    <Backdrop />

    {/* Main content */}
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <AppHeader />

      {/* Scrollable page area */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="w-full max-w-screen-2xl mx-auto px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
          {children}
        </div>
      </main>
    </div>
  </div>
);

}
