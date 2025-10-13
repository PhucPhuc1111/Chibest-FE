"use client";
import React, { useState } from "react";
import { Table, Space, Button, Input, Modal } from "antd"; // Import Space từ antd
import * as XLSX from "xlsx";
import type { TableColumnsType, TableProps } from "antd";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AddIngredientModal from "@/components/IngredientModal/AddIngredientModal";
import UpdateIngredientModal from "@/components/IngredientModal/UpdateIngredientModal";
import DeleteIngredientModal from "@/components/IngredientModal/DeleteIngredientModal";
import { Key } from "antd/es/table/interface";
import Cookies from "js-cookie";
import {
  importIngredientExcelAnalyzeFile,
  importIngredientExcelDuplicateFile,
  importIngredientExcelFile,
  Ingredient,
  useGetAllIngredients,
} from "@/app/data";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader"; // Import Loader component

const IngredientPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const pageIndex = 1;
  const pageSize = 500;
  const [localData, setLocalData] = useState<Ingredient[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateIngredientNames, setDuplicateIngredientNames] = useState<
    string[]
  >([]);
  const [importAll, setImportAll] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { data, isLoading, isError, error, refetch } = useGetAllIngredients(
    pageIndex,
    pageSize,
    searchText,
  );
  const userRole = Cookies.get("userRole");
  // Handle table change
  const onChange: TableProps<Ingredient>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra,
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  // Columns for the Table
  const columns: TableColumnsType<Ingredient> = [
    {
      title: "Id",
      dataIndex: "ingredientId",
      sorter: (a, b) => a.ingredientId - b.ingredientId,
    },
    {
      title: "Ingredient Name",
      dataIndex: "ingredientName",
      sorter: (a, b) => a.ingredientName.localeCompare(b.ingredientName),
    },
    {
      title: "Calories (kcal)",
      dataIndex: "calories",
      sorter: (a, b) => a.calories - b.calories,
    },
    {
      title: "Protein (g)",
      dataIndex: "protein",
      sorter: (a, b) => a.protein - b.protein,
    },
    {
      title: "Fat (g)",
      dataIndex: "fat",
      sorter: (a, b) => a.fat - b.fat,
    },
    {
      title: "Carbs (g)",
      dataIndex: "carbs",
      sorter: (a, b) => a.carbs - b.carbs,
    },
    {
      title: "Edit/Delete",
      dataIndex: "action",
      render: (_: any, record: Ingredient) => (
        <Space size="middle">
          <UpdateIngredientModal
            ingredientId={record.ingredientId}
            refetch={refetch}
          />
          {userRole !== "Admin" && (
            <DeleteIngredientModal
              ingredientId={record.ingredientId}
              refetch={refetch}
            />
          )}
        </Space>
      ),
    },
  ];

  //  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //      const file = e.target.files?.[0];
  //      if (file) {
  //        const formData = new FormData();
  //        formData.append('excelFile', file);
  //        try {
  //          // Import the Excel file and get the response message
  //          const response = await importIngredientExcelFile(formData);

  //          // Show the success message from the API in the toast
  //          toast.success(response.message); // Display message returned by the API

  //          // Refetch the data to ensure the table updates
  //          refetch();

  //          // Reset the file input value to allow re-upload
  //          if (e.target) {
  //            e.target.value = ""; // Reset the file input
  //          }
  //        } catch (error) {
  //          console.error("Error importing Excel file:", error);
  //          toast.error("Import Excel file thất bại"); // Default error message
  //        }
  //      }
  //    };

  // Handle file export
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file); // Store the file in the state

      const formData = new FormData();
      formData.append("excelFile", file);

      try {
        // Analyze the file to check for new and duplicate items
        const analyzeResponse =
          await importIngredientExcelAnalyzeFile(formData);

        if (analyzeResponse.data.duplicateIngredientCount === 0) {
          // No duplicates, proceed with import
          const importResponse = await importIngredientExcelFile(formData);
          toast.success(`Import successful: ${importResponse.message}`);
          refetch(); // Refresh data
        } else {
          // There are duplicates, show the modal
          setDuplicateIngredientNames(
            analyzeResponse.data.duplicateIngredientName,
          );
          setShowDuplicateModal(true);
        }
        e.target.value = ""; // Reset the file input after processing
      } catch (error) {
        console.error("Error importing Excel file:", error);
        toast.error("Failed to import Excel file. Please try again.");
      }
    }
  };

  // Import only new items (ignores duplicates)
  const handleImportNewOnly = async () => {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append("excelFile", uploadedFile);

      try {
        // Import only new foods (ignores duplicates)
        const response = await importIngredientExcelFile(formData);
        toast.success(`Import successful: ${response.message}`);
        refetch(); // Refresh data
        setShowDuplicateModal(false); // Close the modal
      } catch (error) {
        console.error("Error importing new foods:", error);
        toast.error("Failed to import new ingredients. Please try again.");
      }
    }
  };

  // Import all items, including duplicates
  const handleImportAll = async () => {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append("excelFile", uploadedFile);

      try {
        // Import all foods, including duplicates
        const response = await importIngredientExcelDuplicateFile(formData);
        toast.success(`Import successful: ${response.message}`);
        refetch(); // Refresh data
        setShowDuplicateModal(false); // Close the modal
      } catch (error) {
        console.error("Error importing all foods:", error);
        toast.error("Failed to import all ingredients. Please try again.");
      }
    }
  };

  const handleCancelImport = () => {
    setShowDuplicateModal(false); // Close the modal without doing anything
  };
  const handleFileExport = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Ingredient Name", "Calories(kcal)", "Protein(g)", "Fat(g)", "Carbs(g)"], // Header row
      ...filteredData.map((item) => [
        item.ingredientName,
        item.calories,
        item.protein,
        item.fat,
        item.carbs,
      ]), // Data rows
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ingredient");
    XLSX.writeFile(wb, "ingredients_export.xlsx");
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // Filtered data based on search
  const filteredData = Array.isArray(data)
    ? data.filter((item) =>
        item.ingredientName.toLowerCase().includes(searchText.toLowerCase()),
      )
    : [];

  return (
    <DefaultLayout>
      <div>
        <div className="flex justify-between">
          <div className="mb-2">Total: {data?.length}</div>
          <div className="mb-2 italic text-gray-500">
            Default unit of ingredient is 100g or 100ml
          </div>
          <Input
            placeholder="Search ingredient name"
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 20, width: 300 }}
          />
          <div className="mb-2 flex space-x-3">
            {userRole !== "Admin" && (
              <>
                <div>
                  <AddIngredientModal /> {/* Modal for adding new ingredient */}
                </div>

                <input
                  type="file"
                  accept=".xlsx, .xls"
                  style={{ display: "none" }}
                  id="fileInput"
                  onChange={handleFileUpload}
                />
                <Button
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  Import Excel
                </Button>
              </>
            )}
            <Button onClick={handleFileExport}>Export Excel</Button>
          </div>
        </div>

        {/* Show Loader when data is loading */}
        {isLoading ? (
          <Loader />
        ) : (
          <Table<Ingredient>
            columns={columns}
            dataSource={filteredData}
            onChange={onChange}
          />
        )}
        <Modal
          title="Duplicate ingredient"
          visible={showDuplicateModal}
          onCancel={handleCancelImport}
          footer={[
            <Button key="cancel" onClick={handleCancelImport}>
              Cancel
            </Button>,
            <Button
              key="importNew"
              style={{ backgroundColor: "#2f855a", color: "white" }}
              type="primary"
              onClick={handleImportNewOnly}
            >
              Import new ingredient
            </Button>,
            <Button
              key="importAll"
              type="primary"
              style={{ backgroundColor: "#2f855a", color: "white" }}
              onClick={handleImportAll}
            >
              Import all ingredient
            </Button>,
          ]}
        >
          <div>
            <p>Duplicate ingredients:</p>
            <ul>
              {duplicateIngredientNames.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default IngredientPage;
