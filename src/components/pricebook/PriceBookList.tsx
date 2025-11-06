"use client";

import { useEffect } from "react";
import { Table, Input, Button, Select, Spin, Divider, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { usePriceBookStore } from "@/stores/usePriceBookStore";
import type { PriceBookItem } from "@/types/pricebook";

export default function PriceBookList() {
  const { items, isLoading, getAll, resetFilters, filters, setFilters } =
    usePriceBookStore();

  useEffect(() => {
    getAll();
  }, [getAll, filters.pageIndex, filters.pageSize]);

  const handleSearch = (value: string) => {
    setFilters({ search: value, pageIndex: 1 });
  };

  const handleCategoryChange = (value: string[]) => {
    setFilters({ category: value, pageIndex: 1 });
  };

  const handleStockStatusChange = (value: string) => {
    setFilters({ stockStatus: value, pageIndex: 1 });
  };

  const handlePriceConditionChange = (value: string) => {
    setFilters({ priceCondition: value, pageIndex: 1 });
  };

  const handlePriceTypeChange = (value: string) => {
    setFilters({ priceType: value, pageIndex: 1 });
  };

  const columns: ColumnsType<PriceBookItem> = [
    // { 
    //   title: "ID", 
    //   dataIndex: "id", 
    //   width: 120, 
    //   fixed: "left",
    //   render: (id: string) => id.substring(0, 8) + "..."
    // },
    { 
      title: "Product ID", 
      dataIndex: "product-id", 
      width: 120,
      render: (id: string) => id.substring(0, 30) + "..."
    },
    {
      title: "Giá bán",
      dataIndex: "selling-price",
      // align: "right",
      width: 80,
      render: (v: number) => v?.toLocaleString("vi-VN") + " đ" || "0 đ",
    },
    {
      title: "Hiệu lực từ",
      dataIndex: "effective-date",
      width: 80,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : "—"
    },
    {
      title: "Hết hiệu lực",
      dataIndex: "expiry-date",
      width: 80,
      render: (date: string | null) => date ? new Date(date).toLocaleDateString('vi-VN') : "—"
    },

    // {
    //   title: "Ngày tạo",
    //   dataIndex: "created-at",
    //   width: 80,
    //   render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : "—"
    // },
  
    // {
    //   title: "Branch ID",
    //   dataIndex: "branch-id",
    //   width: 120,
    //   render: (id: string | null) => id ? id.substring(0, 8) + "..." : "—"
    // },
    {
      title: "Trạng thái",
      dataIndex: "expiry-date",
      width: 120,
      render: (expiryDate: string | null) => {
        const now = new Date();
        const expiry = expiryDate ? new Date(expiryDate) : null;
        
        if (!expiry) {
          return <Tag color="green">Đang hiệu lực</Tag>;
        } else if (expiry > now) {
          return <Tag color="blue">Sắp hết hạn</Tag>;
        } else {
          return <Tag color="red">Hết hiệu lực</Tag>;
        }
      },
    },
  ];

  return (
    <div className="flex gap-4 ">
      {/* ==== Sidebar Filter ==== */}
      <aside className="w-[300px] shrink-0 bg-white rounded-md border border-gray-200 p-3">
        <div className="mb-3">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm..."
            defaultValue={filters.search}
            onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
            onBlur={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {/* Bảng giá */}
          <div>
            <div className="text-[13px] font-semibold mb-1 flex justify-between">
              <span>Bảng giá</span>
              <Button type="link" size="small">
                Tạo mới
              </Button>
            </div>
            <Select
              mode="multiple"
              className="w-full"
              defaultValue={["Bảng giá chung"]}
              options={[{ label: "Bảng giá chung", value: "Bảng giá chung" }]}
            />
          </div>

          {/* Nhóm hàng */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Nhóm hàng</div>
            <Select
              mode="multiple"
              showSearch
              allowClear
              className="w-full"
              placeholder="Chọn nhóm hàng"
              value={filters.category}
              onChange={handleCategoryChange}
              options={[
                { label: "ÁO DÀI", value: "ÁO DÀI" },
                { label: "ÁO THUN", value: "ÁO THUN" },
                { label: "ĐẦM", value: "ĐẦM" },
                { label: "CHÂN VÁY", value: "CHÂN VÁY" },
                { label: "ĐỒ NGỦ", value: "ĐỒ NGỦ" },
                { label: "HÀNG LEN", value: "HÀNG LEN" },
              ]}
            />
          </div>

          {/* Tồn kho */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Tồn kho</div>
            <Select
              value={filters.stockStatus}
              className="w-full"
              onChange={handleStockStatusChange}
              options={[
                { label: "Tất cả", value: "Tất cả" },
                { label: "Dưới định mức tồn", value: "Dưới định mức tồn" },
                { label: "Vượt định mức tồn", value: "Vượt định mức tồn" },
                { label: "Còn hàng trong kho", value: "Còn hàng trong kho" },
                { label: "Hết hàng trong kho", value: "Hết hàng trong kho" },
              ]}
            />
          </div>

          {/* Giá bán */}
          <Divider className="my-2" />
          <div className="space-y-2">
            <div className="text-[13px] font-semibold">Giá bán</div>
            <div>
              <Select
                value={filters.priceCondition}
                className="w-full"
                onChange={handlePriceConditionChange}
                options={[
                  { label: "Chọn điều kiện", value: "none" },
                  { label: "Nhỏ hơn", value: "<" },
                  { label: "Nhỏ hơn hoặc bằng", value: "<=" },
                  { label: "Bằng", value: "=" },
                  { label: "Lớn hơn", value: ">" },
                ]}
              />
            </div>
            <div>
              <Select
                value={filters.priceType}
                className="w-full"
                onChange={handlePriceTypeChange}
                options={[
                  { label: "Chọn giá so sánh", value: "none" },
                  { label: "Giá vốn", value: "cost" },
                  { label: "Giá nhập cuối", value: "import" },
                ]}
              />
            </div>
          </div>

          <div className="pt-1">
            <Button type="link" onClick={resetFilters}>
              Mặc định
            </Button>
          </div>
        </div>
      </aside>

      {/* ==== Table ==== */}
      <section className="flex-1">
        <div className="bg-white rounded-md border border-gray-200">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <div className="text-[13px] text-gray-500">
              Tổng: <b>{items.length.toLocaleString()}</b> bản ghi giá
            </div>
            <div className="flex gap-2">
              <Button type="primary">+ Thiết lập giá</Button>
              <Button>Import</Button>
              <Button>Xuất file</Button>
              {/* <Button>⚙️</Button> */}
            </div>
          </div>

          {isLoading ? (
            <div className="py-0 flex justify-center">
              <Spin />
            </div>
          ) : (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={items}
              size="middle"
              pagination={{ 
                pageSize: filters.pageSize,
                current: filters.pageIndex,
                total: items.length,
                showSizeChanger: true,
                pageSizeOptions: ['20', '50', '100'],
                onChange: (page, pageSize) => setFilters({ pageIndex: page, pageSize: pageSize || 20 }),
              }}
              scroll={{ x: 480 }}
              //  scroll={{ x: 'max-content' }}
              rowClassName="hover:bg-blue-50"
              sticky
            />
          )}
        </div>
      </section>
    </div>
  );
}