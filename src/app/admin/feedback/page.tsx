"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Select,
  Input,
  Modal,
  TableColumnsType,
  TableProps,
} from "antd";
import { Feedback } from "@/app/data";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useGetAllFeedback } from "@/app/data/feedback";
import { format, parseISO } from "date-fns";
import Loader from "@/components/common/Loader";

const FeedbackPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [showDetails, setShowDetails] = useState(false); // To toggle detail view
  const [mealDetails, setMealDetails] = useState<any>(null); // Store the selected meal details
  const pageIndex = 1;
  const pageSize = 500;
  const { data, isLoading, isError, error, refetch } = useGetAllFeedback(
    pageIndex,
    pageSize,
    searchText,
  );

  const onChange: TableProps<Feedback>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra,
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  function formatDate(dateString?: string): string {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "hh:mm dd/MM/yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  }
  // Function to parse and handle response (MealLog or MealPlan)
  const parseResponse = (response: string) => {
    try {
      // Clean up the response and remove escape characters
      const cleanedResponse = response
        .replace(/\\n/g, " ")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");

      // Check if the cleaned response is a valid JSON
      if (!isValidJSON(cleanedResponse)) {
        console.error("Invalid JSON format:", cleanedResponse);
        return [];
      }

      const parsed = JSON.parse(cleanedResponse);
      return parsed || [];
    } catch (e) {
      console.error("Failed to parse response:", e);
      return [];
    }
  };

  // Function to check if the string is a valid JSON
  const isValidJSON = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Function to handle the "View Details" button click
  const handleViewDetails = (response: string, type: string) => {
    let parsedData = [];

    // Handle the different types: MealLog and MealPlan
    if (type === "MealLog") {
      parsedData = parseResponse(response);
    } else if (type === "MealPlan") {
      const planData = parseResponse(response);
      parsedData =
        planData && planData.mealPlanDetails ? planData.mealPlanDetails : [];
    }

    setMealDetails(parsedData); // Set the details for the selected response
    setShowDetails(true); // Show the modal
  };

  const columns: TableColumnsType<Feedback> = [
    {
      title: "Id",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      render: (text) => text || "None",
    },
    {
      title: "Type",
      dataIndex: "type",
      sorter: (a, b) => a.response.localeCompare(b.response),
      render: (text) => text || "None",
    },

    {
      title: "Created by",
      dataIndex: "fullName",
      render: (text) => text || "None",
    },
    {
      title: "Feedback",
      dataIndex: "feedback",
      render: (text) => text || "None",
    },
    {
      title: "Reject reason",
      dataIndex: "rejectionReason",
      render: (text) => text || "None",
    },
    {
      title: "Recommended At",
      dataIndex: "recommendedAt",
      sorter: (a, b) =>
        new Date(a.recommendedAt).getTime() -
        new Date(b.recommendedAt).getTime(),
      render: (text) => formatDate(text),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) =>
        status === "Accepted" ? (
          <span className="text-green-500">Accepted</span>
        ) : status === "Unaccpected" ? (
          <span className="text-red-500">Rejected</span>
        ) : (
          "Chưa có dữ liệu"
        ),
    },
    {
      title: "Detail recommend",
      dataIndex: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            style={{ backgroundColor: "#2f855a", color: "white" }}
            onClick={() => handleViewDetails(record.response, record.type)} // Pass the response and type
          >
            Detail
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredData = Array.isArray(data)
    ? data.filter(
        (item) =>
          item.fullName.toLowerCase().includes(searchText.toLowerCase()) || // Search by fullName
          item.feedback.toLowerCase().includes(searchText.toLowerCase()) || // Search by feedback
          item.type.toLowerCase().includes(searchText.toLowerCase()) || // Search by type
          (item.recommendedAt &&
            formatDate(item.recommendedAt).includes(searchText)), // Search by date (formatted)
      )
    : [];

  // Close the modal when done viewing details
  const handleCloseModal = () => {
    setShowDetails(false);
    setMealDetails(null); // Reset meal details
  };

  return (
    <DefaultLayout>
      <div className="">
        <div className="flex justify-between">
          <div className="mb-2">Tổng cộng: {data?.length}</div>
          <Input
            placeholder="Tìm kiếm feedback"
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 20, width: 300 }}
          />
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <Table<Feedback>
            columns={columns}
            dataSource={filteredData}
            onChange={onChange}
          />
        )}
        {/* Modal to show details */}
        <Modal
          title="Detail"
          open={showDetails} // Use 'open' instead of 'visible' as 'visible' is deprecated
          onCancel={handleCloseModal}
          footer={[
            <Button key="back" onClick={handleCloseModal}>
              Close
            </Button>,
          ]}
        >
          <div>
            {Array.isArray(mealDetails) && mealDetails.length > 0 ? (
              mealDetails.map((item: any, index: number) => (
                <div key={item.FoodId || index}>
                  {" "}
                  {/* Use FoodId or index as key */}
                  {/* Dynamically display all the fields */}
                  {Object.keys(item).map((key) => (
                    <p key={key}>
                      <strong>{key}:</strong> {item[key]}
                    </p>
                  ))}
                </div>
              ))
            ) : (
              <p>Không có dữ liệu chi tiết.</p>
            )}
          </div>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default FeedbackPage;
