"use client";
import React, { useState } from "react";
import { Table, Space, Button, Input } from "antd"; // Import Space từ antd
import * as XLSX from "xlsx";
import type { TableColumnsType, TableProps } from "antd";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AddIngredientModal from "@/components/IngredientModal/AddIngredientModal";
import UpdateIngredientModal from "@/components/IngredientModal/UpdateIngredientModal";
import DeleteIngredientModal from "@/components/IngredientModal/DeleteIngredientModal";
import { Key } from "antd/es/table/interface";
import {Package} from "@/app/data";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader"; // Import Loader component
import { useGetAllPackages } from "@/app/data/package";
import AddPackageModal from "@/components/PackageModal/AddPackageModal";
import UpdatePackageModal from "@/components/PackageModal/UpdatePackageModal";
import DeletePackageModal from "@/components/PackageModal/DeletePackageModal";
import { format, parseISO } from "date-fns";

const PackagePage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const pageIndex = 1;
  const pageSize = 500;
  const { data, isLoading, isError, error, refetch } = useGetAllPackages(
    pageIndex,
    pageSize,
    searchText,
  );

  // Handle table change
  const onChange: TableProps<Package>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  // Columns for the Table
  const columns: TableColumnsType<Package> = [
    {
      title: "Id",
      dataIndex: "packageId",
      sorter: (a, b) => a.packageId - b.packageId,
    },
    {
      title: "Package name",
      dataIndex: "packageName",
      sorter: (a, b) => a.packageName.localeCompare(b.packageName),
    },
 
    {
      title: "Duration (ngày)",
      dataIndex: "duration",
      sorter: (a, b) => a.duration - b.duration,
    },
    {
        title: "Price (VNĐ)",
        dataIndex: "price",
        
        sorter: (a, b) => a.price - b.price,
        render: (text) => {
          return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(text);
        }
      },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
   
    {
      title: "Edit/Delete",
      dataIndex: "action",
      render: (_: any, record: Package) => (
        <Space size="middle">
          <UpdatePackageModal packageId={record.packageId} refetch={refetch} />
          <DeletePackageModal packageId={record.packageId} refetch={refetch} />
        </Space>
      ),
    },
  ];



  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // Filtered data based on search
  const filteredData = Array.isArray(data)
    ? data.filter((item) =>
        item.packageName.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];
    function formatDate(dateString?: string): string {
      if (!dateString) return "";
      try {
        return format(parseISO(dateString), "hh:mm dd/MM/yyyy");
      } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
      }
    }
 const handleFileExport = () => {
      const ws = XLSX.utils.aoa_to_sheet([
        ["Id", "Package Name", "Duration","Price ", "Description"], // Header row
        ...filteredData.map((item) => [
          item.packageId,
          item.packageName,
          item.duration,
          item.price,
          item.description,
         
        ]), // Data rows
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Package");
      XLSX.writeFile(wb, "package_export.xlsx");
    };
  return (
    <DefaultLayout>
      <div>
        <div className="flex justify-between">
          <div className="mb-2">Total: {data?.length}</div>
          <Input
            placeholder="Serch package name"
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 20, width: 300 }}
          />
          <div className="flex space-x-3 mb-2">
            <div>
              <AddPackageModal /> {/* Modal for adding new ingredient */}
            <Button onClick={handleFileExport}>Export Excel</Button>
            </div>
         
          </div>
        </div>

        {/* Show Loader when data is loading */}
        {isLoading ? (
          <Loader />
        ) : (
          <Table<Package> columns={columns} dataSource={filteredData} onChange={onChange} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default PackagePage;
