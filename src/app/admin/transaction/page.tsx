"use client";
import { Transaction, useGetAllTransactions } from "@/app/data";
import AddAllergyModal from "@/components/AllergyModal/AddAllergyModal";
import DeleteAllergyModal from "@/components/AllergyModal/DeleteAllerfyModal";
import Loader from "@/components/common/Loader";

import AuthLayout from "@/components/Layouts/AuthLayout";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {
  Button,
  Image,
  Input,
  Pagination,
  PaginationProps,
  Space,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import { format, parseISO } from "date-fns";
import * as XLSX from "xlsx";
import Link from "next/link";

import React, { useMemo, useState } from "react";

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "hh:mm dd/MM/yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

const TransactionPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const pageIndex = 1;
  const pageSize = 500;

  const { data, isLoading, isError, error, refetch } = useGetAllTransactions(
    pageIndex,
    pageSize,
    searchText,
  );
  const onChange: TableProps<Transaction>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra,
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const columns: TableColumnsType<Transaction> = [
    {
      title: "Id",
      dataIndex: "userId",
      sorter: (a, b) => a.userId - b.userId,
      render: (text) => text || "Chưa có dữ liệu",
    },

    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (text) => text || "Chưa cập nhật",
    },

    {
      title: "Package",
      dataIndex: "packageName",
      sorter: (a, b) => a.packageName.localeCompare(b.packageName),
      render: (text) => text || "Chưa có dữ liệu",
    },

    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      render: (text) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text);
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a, b) => a.price - b.price,
      render: (text) => text || "Chưa có dữ liệu",
    },
    {
      title: "Paid At",
      dataIndex: "paidAt",
      sorter: (a, b) => a.paidAt.localeCompare(b.paidAt),
      render: (text) => formatDate(text) || "Chưa có dữ liệu",
    },
    {
      title: "Expiration date",
      dataIndex: "expiryDate",
      sorter: (a, b) => a.expiryDate.localeCompare(b.expiryDate),
      render: (text) => formatDate(text) || "Chưa có dữ liệu",
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (text) => {
        if (text === "Active")
          return <span className="font-semibold text-green-600">Active</span>;
        if (text === "Expired")
          return <span className="font-semibold text-red-600">Expired</span>;
        return text || "Unknown";
      },
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  const filteredData = Array.isArray(data)
    ? data.filter((item) =>
        item.email.toLowerCase().includes(searchText.toLowerCase()),
      )
    : [];

  const handleFileExport = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      [
        "Id",
        "Email",
        "Package name",
        "Price",
        "Description",
        "Paid At",
        "Expiration date",
      ], // Header row
      ...filteredData.map((item) => [
        item.userId,
        item.email,
        item.packageName,
        item.price,
        item.description,
        formatDate(item.paidAt), // Format date createdAt
        formatDate(item.expiryDate), // Format date updatedAt
        item.status,
      ]), // Data rows
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transaction");
    XLSX.writeFile(wb, "transaction_export.xlsx");
  };

  return (
    <DefaultLayout>
      <div className="">
        <div className="flex justify-between">
          <div className="mb-2">Total: {data?.length}</div>
          <Input
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 20, width: 300 }}
          />
          <div className="mb-2 flex space-x-3">
            {/* <AddAllergyModal /> */}
            <Button onClick={handleFileExport}>Export Excel</Button>
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <Table<Transaction>
            columns={columns}
            dataSource={filteredData}
            onChange={onChange}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default TransactionPage;
