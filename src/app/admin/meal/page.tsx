"use client";
import React, { useState } from "react";
import { Table, Space, Button, Input } from "antd"; // Import Space từ antd
import type { TableColumnsType, TableProps } from "antd";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Key } from "antd/es/table/interface";
import DeleteMealPlanModal from "@/components/MealPlanModel/DeleteMealPlanModal";
import Link from "next/link";
import { MealPlan, useGetAllMealPlans } from "@/app/data";
import { format, parseISO } from "date-fns";
import Loader from "@/components/common/Loader";
import Cookies from "js-cookie";
function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "hh:mm dd/MM/yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}
const userRole = Cookies.get("userRole");
const MealPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");

  const pageIndex = 1;
  const pageSize = 100;

  const { data, isLoading, isError, error, refetch } = useGetAllMealPlans(
    pageIndex,
    pageSize,
    searchText,
  );
  const columns: TableColumnsType<MealPlan> = [
    {
      title: "Id",
      dataIndex: "mealPlanId",
      sorter: (a, b) => (a.mealPlanId ?? 0) - (b.mealPlanId ?? 0),
    },
    {
      title: "Plan name",
      dataIndex: "planName",
      sorter: (a, b) => a.planName.localeCompare(b.planName),
    },
    {
      title: "Health goal",
      dataIndex: "healthGoal",
      filters: [
        { text: "Giảm cân", value: "Giảm cân" },
        { text: "Tăng cân", value: "Tăng cân" },
        { text: "Duy trì cân nặng", value: "Duy trì cân nặng" },
      ],
      onFilter: (value: string | boolean | Key, record: MealPlan) => {
        if (
          typeof record.healthGoal === "string" &&
          typeof value === "string"
        ) {
          return record.healthGoal
            .toLowerCase()
            .trim()
            .includes(value.toLowerCase().trim());
        }
        return false;
      },
      width: "30",
    },
    {
      title: "Duration (days)",
      dataIndex: "duration",
      sorter: (a, b) => (a.duration ?? 0) - (b.duration ?? 0),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      sorter: (a, b) => (a.createdBy ?? "").localeCompare(b.createdBy ?? ""),
    },
    {
      title: "Created At ",
      dataIndex: "createdAt",
      sorter: (a, b) =>
        new Date(a.createdAt ?? 0).getTime() -
        new Date(b.createdAt ?? 0).getTime(),
      render: (text) => formatDate(text),
    },

    {
      title: "Edit/Delete",
      dataIndex: "action",
      render: (_: any, record: MealPlan) => (
        <Space size="middle">
          <Link href={`/admin/meal/${record.mealPlanId}`}>
            <Button style={{ backgroundColor: "#2f855a", color: "white" }}>
              Detail
            </Button>
          </Link>
          {userRole !== "Admin" && (
            <DeleteMealPlanModal
              mealPlanId={record.mealPlanId!}
              refetch={refetch}
            />
          )}
          {/* <DeleteMealPlanModal
            mealPlanId={record.mealPlanId}
            refetch={refetch}
          /> */}
        </Space>
      ),
    },
  ];

  const onChange: TableProps<MealPlan>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra,
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredData = Array.isArray(data)
    ? data.filter((item) =>
        item.planName.toLowerCase().includes(searchText.toLowerCase()),
      )
    : [];

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (isError) {
  //   return <div>Error: {error?.message}</div>;
  // }

  return (
    <DefaultLayout>
      <div className="">
        <div className="flex justify-between">
          <div className="mb-2">Total: {data?.length}</div>
          <Input
            placeholder="Search meal plan name"
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 20, width: 300 }}
          />

          <div className="mb-2 flex space-x-3">
            {userRole !== "Admin" && (
              <Link href={"/admin/meal/create-meal"}>
                <Button style={{ backgroundColor: "#2f855a", color: "white" }}>
                  Add meal plan
                </Button>{" "}
              </Link>
            )}
            {/* <Link href={"/admin/meal/create-meal"}>
              <Button style={{ backgroundColor: "#2f855a", color: "white" }}>
                Add meal plan
              </Button>{" "}
            </Link> */}
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <Table<MealPlan>
            columns={columns}
            dataSource={filteredData}
            onChange={onChange}
            rowKey={(record) => record.mealPlanId ?? 0}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default MealPage;
