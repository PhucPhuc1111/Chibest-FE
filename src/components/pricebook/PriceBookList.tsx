"use client";

import { useEffect, useState } from "react";
import { Table, Input, Button, Select, Spin, Divider } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { usePriceBookStore } from "@/stores/usePriceBookStore";
import type { PriceBookItem } from "@/types/pricebook";

export default function PriceBookList() {
  const { items, isLoading, getAll, resetFilters, updatePrice } =
    usePriceBookStore();
  const [editing, setEditing] = useState<Record<string, number>>({});

  useEffect(() => {
    getAll();
  }, [getAll]);

  const handlePriceChange = (id: string, value: string) => {
    const num = parseInt(value.replace(/\D/g, ""), 10) || 0;
    setEditing((prev) => ({ ...prev, [id]: num }));
  };

  const handlePriceBlur = (id: string) => {
    if (editing[id] !== undefined) {
      updatePrice(id, editing[id]);
    }
  };

  const columns: ColumnsType<PriceBookItem> = [
    { title: "Mã hàng", dataIndex: "id", width: 160, fixed: "left" },
    { title: "Tên hàng", dataIndex: "name", width: 340 },
    {
      title: "Giá vốn",
      dataIndex: "costPrice",
      align: "right",
      width: 120,
      render: (v: number) => v.toLocaleString("vi-VN"),
    },
    {
      title: "Giá nhập cuối",
      dataIndex: "lastImport",
      align: "right",
      width: 140,
      render: (v: number) => v.toLocaleString("vi-VN"),
    },
    {
      title: "Bảng giá chung",
      dataIndex: "commonPrice",
      align: "right",
      width: 180,
      render: (_, record) => (
        <Input
          value={
            editing[record.id]?.toLocaleString("vi-VN") ??
            record.commonPrice.toLocaleString("vi-VN")
          }
          onChange={(e) => handlePriceChange(record.id, e.target.value)}
          onBlur={() => handlePriceBlur(record.id)}
          className="w-[120px] text-right"
        />
      ),
    },
  ];

  return (
    <div className="flex gap-4">
      {/* ==== Sidebar Filter ==== */}
      <aside className="w-[300px] shrink-0 bg-white rounded-md border border-gray-200 p-3">
        <div className="mb-3">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Theo mã, tên hàng"
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
          <div >
            <div className="w-full font-semibold mb-1">Nhóm hàng</div>
       
              <Select
              mode="multiple"
              showSearch
              allowClear
              className="w-full"
              placeholder="Chọn nhóm hàng"
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
              defaultValue="Tất cả"
              className="w-full"
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
          <Divider className="my-2 " />
          <div className="space-y-2 ">
            <div className="text-[13px] font-semibold ">Giá bán</div>
            <div >
              <Select
              defaultValue="Chọn điều kiện"
              className="w-full "
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
              defaultValue="Chọn giá so sánh"
              className="w-full"
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
              Tổng: <b>{items.length.toLocaleString()}</b> hàng hóa
            </div>
            <div className="flex gap-2">
              <Button type="primary">+ Bảng giá</Button>
              <Button>Import</Button>
              <Button>Xuất file</Button>
              <Button>⚙️</Button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-10 flex justify-center">
              <Spin />
            </div>
          ) : (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={items}
              size="middle"
              pagination={{ pageSize: 20, showSizeChanger: false }}
              scroll={{ x: 1200 }}
              rowClassName="hover:bg-blue-50"
              sticky
            />
          )}
        </div>
      </section>
    </div>
  );
}
