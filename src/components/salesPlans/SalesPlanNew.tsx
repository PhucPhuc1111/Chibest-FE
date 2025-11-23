// src/components/salesPlans/SalesPlanNew.tsx
"use client";

import { useState, useEffect } from "react";
import { Table, Tag, Image, Button, Spin } from "antd";
import type { TableProps } from "antd";
import ModalCreateSalesPlan from "./modals/ModalCreateSalesPlan";

// Interface từ data JSON
interface SalesPlanProduct {
  id: string;
  sku: string;
  "product-name": string;
  "avatar-url": string | null;
  "sample-type": string;
  "delivery-date": string;
  "sample-quantity": number;
  "total-quantity": number;
  "finalize-date": string;
  status: string;
  notes: string;
  "supplier-name": string;
  "cost-price": number;
  "selling-price": number;
  "stock-quantity"?: number;
  "brand"?: string;
  "inventory-location"?: string;
  "weight"?: number;
}

interface SalesPlanDataResponse {
  "status-code": number;
  message: string;
  data: {
    "page-index": number;
    "page-size": number;
    "total-count": number;
    "total-page": number;
    "data-list": SalesPlanProduct[];
  };
}

export default function SalesPlanNew() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<SalesPlanProduct[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SalesPlanProduct | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch data từ file JSON
        const response = await fetch('/data/salesPlanData.json');
        const data: SalesPlanDataResponse = await response.json();
        
        if (data["status-code"] === 200) {
          setProducts(data.data["data-list"]);
        } else {
          console.error('Failed to load data:', data.message);
        }
      } catch (error) {
        console.error('Error loading sales plan data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEdit = (product: SalesPlanProduct) => {
    setEditingProduct(product);
    setOpenCreateModal(true);
  };

  const handleCreateNew = () => {
    setEditingProduct(null);
    setOpenCreateModal(true);
  };

  const handleModalClose = () => {
    setOpenCreateModal(false);
    setEditingProduct(null);
  };

  const columns: TableProps<SalesPlanProduct>["columns"] = [
    {
      title: "Hình sản phẩm",
      dataIndex: "avatar-url",
      width: 80,
      render: (avatarUrl: string | null, record: SalesPlanProduct) => (
        <div className="flex items-center justify-center">
          <Image
            width={40}
            height={40}
            src={avatarUrl || "/images/noimage.png"}
            alt={record["product-name"]}
            className="rounded object-cover"
            fallback="/images/noimage.png"
            preview={false}
          />
        </div>
      ),
    },
    { 
      title: "Mã SKU", 
      dataIndex: "sku", 
      width: 120,
    },
    { 
      title: "Tên sản phẩm", 
      dataIndex: "product-name", 
      width: 200,
    },
    { 
      title: "Loại mẫu", 
      dataIndex: "sample-type", 
      width: 120,
      render: (sampleType: string) => (
        <Tag color={
          sampleType === "Hàng tái" ? "blue" :
          sampleType === "Mẫu hình" ? "green" :
          sampleType === "Mẫu tái" ? "orange" : "purple"
        }>
          {sampleType}
        </Tag>
      )
    },
    { 
      title: "Nhà cung cấp", 
      dataIndex: "supplier-name", 
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={status === "Unavailable" ? "red" : "green"}>
          {status === "Unavailable" ? "Không khả dụng" : "Khả dụng"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Chỉnh sửa
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kế hoạch bán hàng mới</h1>
        <Button type="primary" onClick={handleCreateNew}>
          + Tạo kế hoạch mới
        </Button>
      </div>

      {loading ? (
        <div className="py-10 flex justify-center">
          <Spin />
        </div>
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={products}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      )}

      {/* Modal Create/Edit Sales Plan */}
      <ModalCreateSalesPlan
        open={openCreateModal}
        onClose={handleModalClose}
        productData={editingProduct}
        isUpdate={!!editingProduct}
      />
    </div>
  );
}