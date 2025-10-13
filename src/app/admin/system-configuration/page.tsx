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
import {SystemConfiguration, useGetAllSystemConfigurations} from "@/app/data";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader"; // Import Loader component
import { useGetAllPackages } from "@/app/data/package";
import AddPackageModal from "@/components/PackageModal/AddPackageModal";
import UpdatePackageModal from "@/components/PackageModal/UpdatePackageModal";
import DeletePackageModal from "@/components/PackageModal/DeletePackageModal";
import UpdateConfigModal from "@/components/ConfigModal/UpdateConfigModal";
import DeleteConfigModal from "@/components/ConfigModal/DeleteConfigModal";
import AddConfigModal from "@/components/ConfigModal/AddConfigModal";


const SystemConfigurationPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const pageIndex = 1;
  const pageSize = 500;
  const { data, isLoading, isError, error, refetch } = useGetAllSystemConfigurations(
    pageIndex,
    pageSize,
    searchText,
  );

  // Handle table change
  const onChange: TableProps<SystemConfiguration>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  // Columns for the Table
  const columns: TableColumnsType<SystemConfiguration> = [
    {
      title: "Id",
      dataIndex: "configId",
      sorter: (a, b) => a.configId - b.configId,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
 
    {
      title: "minValue",
      dataIndex: "minValue",
      sorter: (a, b) => a.minValue - b.minValue,
    },
    {
        title: "maxValue",
        dataIndex: "maxValue",
        sorter: (a, b) => a.maxValue - b.maxValue,
      },
    {
      title: "unit",
      dataIndex: "unit",
      sorter: (a, b) => a.unit.localeCompare(b.unit),
    },
    {
      title: "description",
      dataIndex: "description",
   
    },
  
    {
      title: "Edit",
      dataIndex: "action",
      render: (_: any, record: SystemConfiguration) => (
        <Space size="middle">
          <UpdateConfigModal configId={record.configId} refetch={refetch} />
          {/* <DeleteConfigModal configId={record.configId} refetch={refetch} /> */}
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
        item.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <DefaultLayout>
      <div>
        <div className="flex justify-between">
          <div className="mb-2">Total: {data?.length}</div>
          <Input
            placeholder="Search  name"
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 20, width: 300 }}
          />
          <div className="flex space-x-3 mb-2">
            <div>
              <AddConfigModal /> {/* Modal for adding new ingredient */}
            </div>
         
          </div>
        </div>

        {/* Show Loader when data is loading */}
        {isLoading ? (
          <Loader />
        ) : (
          <Table<SystemConfiguration> columns={columns} dataSource={filteredData} onChange={onChange} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default SystemConfigurationPage;
