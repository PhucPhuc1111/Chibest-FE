
// src/components/salesPlans/SalesPlanList.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Table, Tag, Input, Button, Select, Spin, Image } from "antd";
import type { TableProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SalesPlanDetail from "./SalesPlanDetail";
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
  "sample-quantity-description": string;
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

export default function SalesPlanList() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<SalesPlanProduct[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    sampleType: "",
    supplier: "",
    pageIndex: 1,
    pageSize: 15
  });

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
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
  }, [filters]);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, pageIndex: 1 }));
  };

  const handleSampleTypeChange = (value: string) => {
    setFilters(prev => ({ ...prev, sampleType: value, pageIndex: 1 }));
  };

  const handleSupplierChange = (value: string) => {
    setFilters(prev => ({ ...prev, supplier: value, pageIndex: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      sampleType: "",
      supplier: "",
      pageIndex: 1,
      pageSize: 15
    });
  };

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

  const columns: TableProps<SalesPlanProduct>["columns"] = useMemo(
    () => [
      {
        title: "",
        dataIndex: "_select",
        width: 48,
        fixed: "left",
        render: () => <input type="checkbox" className="mx-2" />,
      },
      {
        title: "",
        dataIndex: "avatar-url",
        width: 40,
        fixed: "left",
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
        width: 100,
        fixed: "left",
        render: (sku: string) => sku || "—"
      },
      { 
        title: "Tên sản phẩm", 
        dataIndex: "product-name", 
        width: 180,
        render: (name: string) => name || "—"
      },
      { 
        title: "Mẫu sống", 
        dataIndex: "sample-type", 
        width: 80,
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
        title: "Ngày giao mẫu", 
        dataIndex: "delivery-date", 
        width: 100,
        render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : "—"
      },
      // { 
      //   title: "Số lượng mẫu", 
      //   dataIndex: "sample-quantity", 
      //   width: 90,
      //   align: "center" as const,
      //   render: (quantity: number) => quantity || 0
      // },
      {
        title: "Số Lượng Mẫu",
        dataIndex: "sample-quantity-description",
        key: "sample-quantity-description",
        width: 100,
        render: (desc: string) => desc || "—"
      },
      { 
        title: "Tổng số lượng", 
        dataIndex: "total-quantity", 
        width: 100,
        align: "center" as const,
        render: (quantity: number) => quantity || 0
      },
      { 
        title: "Ngày chốt số lượng", 
        dataIndex: "finalize-date", 
        width: 100,
        render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : "—"
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
      // { 
      //   title: "Ghi chú", 
      //   dataIndex: "notes", 
      //   width: 200,
      //   ellipsis: true,
      //   render: (notes: string) => notes || "—"
      // },
      { 
        title: "Nhà cung cấp", 
        dataIndex: "supplier-name", 
        width: 120,
        render: (supplier: string) => supplier || "—"
      },
    ],
    []
  );

  const filteredProducts = products.filter(product => {
    const matchesSearch = !filters.search || 
      product["product-name"].toLowerCase().includes(filters.search.toLowerCase()) ||
      product.sku.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesSampleType = !filters.sampleType || product["sample-type"] === filters.sampleType;
    const matchesSupplier = !filters.supplier || product["supplier-name"] === filters.supplier;
    
    return matchesSearch && matchesSampleType && matchesSupplier;
  });

  const SAMPLE_TYPE_OPTIONS = [
    { value: "Hàng tái", label: "Hàng tái" },
    { value: "Mẫu hình", label: "Mẫu hình" },
    { value: "Mẫu tái", label: "Mẫu tái" },
    { value: "Mẫu sống", label: "Mẫu sống" },
  ];

  const SUPPLIER_OPTIONS = [
    { value: "NCC Phuc Le", label: "NCC Phuc Le" },
    { value: "NCC Viet", label: "NCC Viet" },
    { value: "NCC Hoang", label: "NCC Hoang" },
    { value: "NCC Vlus", label: "NCC Vlus" },
  ];

  return (
    <>
      <div className="flex gap-4">
        {/* SIDEBAR FILTER */}
        <aside className="w-[300px] min-h-screen shrink-0 bg-white rounded-md border border-gray-200 p-3">
          <div className="mb-3">
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Tìm theo mã hoặc tên"
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
            />
          </div>

          <div className="space-y-4">
            {/* Loại mẫu */}
            <div>
              <div className="text-[13px] font-semibold mb-1">Loại mẫu</div>
              <Select
                allowClear
                className="w-full"
                placeholder="Chọn loại mẫu"
                value={filters.sampleType}
                options={SAMPLE_TYPE_OPTIONS}
                onChange={handleSampleTypeChange}
              />
            </div>

            {/* Nhà cung cấp */}
            <div>
              <div className="text-[13px] font-semibold mb-1">Nhà cung cấp</div>
              <Select
                allowClear
                className="w-full"
                placeholder="Chọn nhà cung cấp"
                value={filters.supplier}
                options={SUPPLIER_OPTIONS}
                onChange={handleSupplierChange}
              />
            </div>

            <div className="pt-1">
              <Button type="link" onClick={resetFilters}>
                Mặc định
              </Button>
            </div>
          </div>
        </aside>

        {/* TABLE + EXPAND DETAIL INLINE */}
        <section className="flex-1">
          <div className="bg-white rounded-md border border-gray-200 min-h-screen">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <div className="text-[13px] text-gray-500">
                Tổng: <b>{filteredProducts.length.toLocaleString()}</b> sản phẩm
              </div>
              <div className="flex gap-2">
                <Button type="primary" onClick={handleCreateNew}>
                  + Tạo kế hoạch
                </Button>
                <Button>Xuất file</Button>
                <Button>⚙️</Button>
              </div>
            </div>

            {loading ? (
              <div className="py-10 flex justify-center">
                <Spin />
              </div>
            ) : (
              <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredProducts}
                size="middle"
                pagination={{ 
                  total: filteredProducts.length,
                  current: filters.pageIndex,
                  pageSize: filters.pageSize,
                  showSizeChanger: true,
                  pageSizeOptions: ['15', '20', '30', '50'],
                  onShowSizeChange: (current, size) => {
                    setFilters(prev => ({ ...prev, pageSize: size, pageIndex: 1 }));
                  },
                  onChange: (page, pageSize) => {
                    setFilters(prev => ({ 
                      ...prev, 
                      pageIndex: page, 
                      pageSize: pageSize || prev.pageSize 
                    }));
                  },
                }}
                scroll={{ x: 800 }}
                expandable={{
                  expandedRowRender: (record) => (
                    <SalesPlanDetail 
                      product={record}
                      onEdit={() => handleEdit(record)}
                    />
                  ),
                  expandRowByClick: true,
                  expandedRowKeys,
                  onExpand: (expanded, record) => {
                    setExpandedRowKeys(expanded ? [record.id] : []);
                  },
                  showExpandColumn: false, 
                }}
                onRow={(record) => ({
                  onClick: (event) => {
                    // Prevent expand when clicking on specific elements
                    const target = event.target as HTMLElement;
                    if (target.tagName === 'INPUT' || target.closest('button')) {
                      return;
                    }
                    
                    const isExpanded = expandedRowKeys.includes(record.id);
                    if (isExpanded) {
                      setExpandedRowKeys([]);
                    } else {
                      setExpandedRowKeys([record.id]);
                    }
                  },
                })}
                rowClassName="cursor-pointer hover:bg-blue-50"
                sticky
              />
            )}
          </div>
        </section>
      </div>

      {/* Modal Create/Edit Sales Plan */}
      <ModalCreateSalesPlan
        open={openCreateModal}
        onClose={handleModalClose}
        productData={editingProduct}
        isUpdate={!!editingProduct}
      />
    </>
  );
}