// components/products/ProductList.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useBranchStore } from "@/stores/useBranchStore";
import { useSessionStore } from "@/stores/useSessionStore";
import { Button, Input, Select, Table, Skeleton, Dropdown, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import SubVariantTable from "./SubVariantTable";
import ModalCreateProduct from "./modals/ModalCreateProduct";
import ModalCreateService from "./modals/ModalCreateService";
import ModalCreateCombo from "./modals/ModalCreateCombo";
import { TableProduct } from "@/types/product";
interface ProductFilters {
  SearchTerm?: string;
  CategoryId?: string;
  Status?: string;
  FromDate?: string;
  ToDate?: string;
  BranchId?: string;
  PageNumber?: number;
  PageSize?: number;
}

export default function ProductList() {
  const {
    products,
    loading,
    error,
    getProducts,
    searchProducts,
  } = useProductStore();

  const { categories, getCategories } = useCategoryStore();
  const {  getBranches } = useBranchStore();
  const activeBranchId = useSessionStore((state) => state.activeBranchId);
  const setActiveBranchId = useSessionStore((state) => state.setActiveBranchId);

  const [openType, setOpenType] = useState<"product" | "service" | "combo" | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    PageNumber: 1,
    PageSize: 10,
  });
   const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  // Fetch data khi component mount và khi filters thay đổi
  useEffect(() => {
    getProducts(filters);
    getCategories();
    getBranches();
  }, [filters]);

  // Đồng bộ BranchId với session store
  useEffect(() => {
    setFilters((prev) => {
      const normalizedBranchId = activeBranchId ?? undefined;
      if (prev.BranchId === normalizedBranchId) {
        return prev;
      }
      return {
        ...prev,
        BranchId: normalizedBranchId,
        PageNumber: 1,
      };
    });
  }, [activeBranchId]);

  // Hiển thị error nếu có
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Transform categories cho select options
  const categoryOptions = useMemo(() => {
    return categories.map(cat => ({
      label: cat.name,
      value: cat.id,
    }));
  }, [categories]);

  // Transform products từ API format sang frontend format cho table
  const tableProducts = useMemo(() => {
    const masterProducts = products.filter(product => product.isMaster);
      return masterProducts.map(product => {
    // Tìm tất cả variants của product này (có parentSku trùng với sku của master)
    const variants = products.filter(variant => 
      variant.parentSku === product.sku && !variant.isMaster
    );
    return {
      id: product.id,
      name: product.name,
      variant: product.description || "",
      sellingPrice: product.sellingPrice || 0, 
      costPrice: product.costPrice || 0,      
      stockQuantity: product.stockQuantity || 0, 
      createdAt: "",
      avartarUrl: product.avartarUrl || "/default-product.png",
      type: "product",
      group: product.categoryName || "",
      supplier: product.brand || "",
      attrs: {
        color: product.color,
        size: product.size,
      },
      status: product.status,
      sku: product.sku,
      description: product.description,
      color: product.color,
      size: product.size,
      brand: product.brand,
      material: product.material,
      weight: product.weight,
      isMaster: product.isMaster,
      parentSku: product.parentSku,
      variants: variants, 
    };
  
  });
  }, [products]);

  // Cập nhật filters
  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      PageNumber: 1, // Reset về trang 1 khi filter
    }));

    if ("BranchId" in newFilters) {
      const branchValue = newFilters.BranchId ?? null;
      if (activeBranchId !== branchValue) {
        setActiveBranchId(branchValue);
      }
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      PageNumber: 1,
      PageSize: 10,
      BranchId: activeBranchId ?? undefined,
    });
  };

  // Search products
  const handleSearch = (value: string) => {
    if (value.trim()) {
      searchProducts(value);
    } else {
      getProducts();
    }
  };


  const handleExpand = (expanded: boolean, record: TableProduct) => {
    if (expanded) {
       setExpandedRowKeys([record.id]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  // Cột bảng
  const columns: ColumnsType<TableProduct> = [
    {
      title: "",
      dataIndex: "select",
      width: 48,
      render: () => <input type="checkbox" className="mx-2" />,
      fixed: "left",
    },
    {
      title: "Mã hàng",
      dataIndex: "sku",
      width: 180,
      fixed: "left",
      render: (sku: string, record: TableProduct) => (
        <div className="flex items-center gap-2">
          <img src={record.avartarUrl} className="w-8 h-10 rounded"/>
          <div>
            <div className="font-medium">{sku}</div>
          </div>
        </div>
      ),
      sorter: (a, b) => (a.sku || "").localeCompare(b.sku || ""),
    },
    {
      title: "Tên hàng",
      dataIndex: "name",
      ellipsis: true,
      render: (name: string, record: TableProduct) => (
        <div>
          <div>{name}</div>
          <div className="text-xs text-gray-500">
            {record.color && `Màu: ${record.color}`} 
            {record.size && ` • Size: ${record.size}`}
          </div>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Giá bán",
      dataIndex: "sellingPrice",
      align: "right" as const,
      width: 120,
      render: (v: number) => v?.toLocaleString() + "₫",
      sorter: (a, b) => (a.sellingPrice || 0) - (b.sellingPrice || 0),
    },
    {
      title: "Giá vốn",
      dataIndex: "costPrice",
      align: "right" as const,
      width: 120,
      render: (v: number) => v?.toLocaleString() + "₫",
      sorter: (a, b) => (a.costPrice || 0) - (b.costPrice || 0),
    },
    {
      title: "Tồn kho",
      dataIndex: "stockQuantity",
      align: "center" as const,
      width: 100,
      sorter: (a, b) => (a.stockQuantity || 0) - (b.stockQuantity || 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (status: string) => (
        <span className={`px-2 py-1 rounded text-xs ${
          status === "Available" ? "bg-green-100 text-green-800" : 
          status === "Unavailable" ? "bg-red-100 text-red-800" : 
          "bg-gray-100 text-gray-800"
        }`}>
          {status === "Available" ? "Đang bán" : 
           status === "Unavailable" ? "Ngừng bán" : 
           status === "OutOfStock" ? "Hết hàng" : status}
        </span>
      ),
    },
  ];

  // Dropdown items cho tạo mới
  const dropdownItems = [
    {
      key: "product",
      label: "Hàng hóa",
      onClick: () => setOpenType("product"),
    },
  ];

  return (
    <div className="flex gap-4">
      {/* Sidebar Filter */}
      <aside className="w-[300px] shrink-0 bg-white rounded-md border border-gray-200 p-3">
        <div className="mb-3">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Theo mã, tên hàng"
            onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
            onBlur={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-[13px] font-semibold mb-1">Nhóm hàng</div>
            <Select
              className="w-full"
              allowClear
              placeholder="Chọn nhóm hàng"
              options={categoryOptions}
              onChange={(v) => handleFilterChange({ CategoryId: v })}
            />
          </div>

          <div>
            <div className="text-[13px] font-semibold mb-1">Trạng thái</div>
            <Select
              className="w-full"
              allowClear
              placeholder="Chọn trạng thái"
              options={[
                { label: "Đang bán", value: "Available" },
                { label: "Ngừng bán", value: "Unavailable" },
                { label: "Hết hàng", value: "OutOfStock" },
              ]}
              onChange={(v) => handleFilterChange({ Status: v })}
            />
          </div>

          <div className="pt-1">
            <Button type="link" onClick={resetFilters}>
              Mặc định
            </Button>
          </div>
        </div>
      </aside>

      {/* Table cấp 1 */}
      <section className="flex-1">
        <div className="bg-white rounded-md border border-gray-200 p-2">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="text-[13px] text-gray-500">
              Tổng: <b>{tableProducts.length.toLocaleString()}</b> hàng hoá
            </div>
            <div className="flex gap-2">
              <Dropdown
                menu={{ items: dropdownItems }}
                trigger={["hover"]}
                placement="bottomRight"
              >
                <Button type="primary">+ Tạo mới</Button>
              </Dropdown>
              <Button>Import file</Button>
              <Button>Export file</Button>
            </div>
          </div>

          {loading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : (
            <Table
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={tableProducts}
              size="middle"
              pagination={{ 
                pageSize: filters.PageSize,
                current: filters.PageNumber,
                total: tableProducts.length,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                  handleFilterChange({ 
                    PageNumber: page, 
                    PageSize: pageSize 
                  });
                }
              }}
              scroll={{ x: 1200 }}
              expandable={{
              expandedRowRender: (record) => (
                  <SubVariantTable master={record} />
                ),
                expandedRowKeys: expandedRowKeys, 
                onExpand: handleExpand, 
                rowExpandable: () => true,
              }}
              rowClassName="hover:bg-blue-50"
              sticky
            />
          )}
        </div>
      </section>

      {/* Modals */}
      <ModalCreateProduct open={openType === "product"} onClose={() => setOpenType(null)} />
      <ModalCreateService open={openType === "service"} onClose={() => setOpenType(null)} />
      <ModalCreateCombo open={openType === "combo"} onClose={() => setOpenType(null)} />
    </div>
  );
}