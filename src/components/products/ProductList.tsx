"use client";

import { useEffect, useMemo } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { Button, DatePicker, Input, Select, Table ,Skeleton} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import SubVariantTable from "./SubVariantTable";
import type { Product } from "@/types/product";
const { RangePicker } = DatePicker;

export default function ProductList() {
  const {
    products,
    isLoading,
    getAllProducts,
    setFilters,
    resetFilters,
    filters,
  } = useProductStore();

  // fetch data mỗi khi filter đổi
  useEffect(() => {
    getAllProducts();
  }, [filters, getAllProducts]);

  // options filter (build từ data để demo)
  const groups = useMemo(
    () => Array.from(new Set(products.map((p) => p.group))),
    [products]
  );
  const suppliers = useMemo(
    () => Array.from(new Set(products.map((p) => p.supplier).filter(Boolean))),
    [products]
  );

  // Cột bảng cấp 1 (nhóm hàng)
  const columns: ColumnsType<Product> = [
    {
      title: "",
      dataIndex: "select",
      width: 48,
      render: () => <input type="checkbox" className="mx-2" />,
      fixed: "left",
    },
    {
      title: "Mã hàng",
      dataIndex: "id",
      width: 180,
      fixed: "left",
      render: (_: unknown, r: Product) => (
        <div className="flex items-center gap-2">
          <img src={r.image} className="w-8 h-10 rounded" alt={r.name} />
          <div>
            <div className="font-medium">{r.id}</div>
            <div className="text-xs text-gray-400">{r.id?.slice(0, 6)}...</div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Tên hàng",
      dataIndex: "name",
      ellipsis: true,
      render: (_: unknown, r: Product) => (
        <div>
          <div>{r.name}</div>
          <div className="text-xs text-gray-500">{r.variant}</div>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      align: "right" as const,
      width: 120,
      render: (v: number) => v?.toLocaleString(),
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
    },
    {
      title: "Giá vốn",
      dataIndex: "cost",
      align: "right" as const,
      width: 120,
      render: (v: number) => v?.toLocaleString(),
      sorter: (a, b) => (a.cost || 0) - (b.cost || 0),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      align: "center" as const,
      width: 100,
      sorter: (a, b) => (a.stock || 0) - (b.stock || 0),
    },
    // {
    //   title: "Khách đặt",
    //   dataIndex: "ordered",
    //   width: 110,
    //   align: "center" as const,
    //   render: () => 0,
    // },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      width: 190,
      render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "---"),
      sorter: (a, b) =>
        dayjs(a.createdAt || 0).unix() - dayjs(b.createdAt || 0).unix(),
    },
    {
      title: "Dự kiến hết hàng",
      dataIndex: "oos",
      width: 140,
      align: "center" as const,
      render: () => "0 ngày",
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
            defaultValue={filters.q}
            onPressEnter={(e) =>
              setFilters({ q: (e.target as HTMLInputElement).value })
            }
            onBlur={(e) =>
              setFilters({ q: (e.target as HTMLInputElement).value })
            }
          />
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-[13px] font-semibold mb-1">Nhóm hàng</div>
            <Select
              className="w-full"
              allowClear
              placeholder="Chọn nhóm hàng"
              options={groups.map((g) => ({ label: g, value: g }))}
              onChange={(v) => setFilters({ group: v ?? null })}
            />
          </div>

          <div>
            <div className="text-[13px] font-semibold mb-1">Tồn kho</div>
          
            <Select
              className="w-full"
              defaultValue={filters.stock}
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Hết hàng", value: "out" },
                { label: "Còn hàng", value: "in" },
              ]}
             onChange={(v) => setFilters({ stock: v as "all" | "out" | "in" })}

            />
          </div>

          <div>
            <div className="text-[13px] font-semibold mb-1">Thời gian tạo</div>
            <RangePicker
              className="w-full"
              onChange={(val) =>
                setFilters({
                  createdFrom: val?.[0]?.toISOString() ?? null,
                  createdTo: val?.[1]?.toISOString() ?? null,
                })
              }
            />
          </div>

          <div>
            <div className="text-[13px] font-semibold mb-1">Thuộc tính</div>
            <div className="space-y-2">
              <Input
                size="small"
                placeholder="MÀU"
                onBlur={(e) =>
                  setFilters({
                    color: e.target.value
                      ? e.target.value.toUpperCase()
                      : null,
                  })
                }
              />
              <Input
                size="small"
                placeholder="SIZE"
                onBlur={(e) => setFilters({ size: e.target.value || null })}
              />
            </div>
          </div>

          <div>
            <div className="text-[13px] font-semibold mb-1">Nhà cung cấp</div>
            <Select
              className="w-full"
              allowClear
              placeholder="Chọn nhà cung cấp"
              options={suppliers.map((s) => ({ label: s!, value: s! }))}
              onChange={(v) => setFilters({ supplier: v ?? null })}
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
              Tổng: <b>{products.length.toLocaleString()}</b> hàng hoá
            </div>
            <div className="flex gap-2">
              <Button type="primary">+ Tạo mới</Button>
              <Button>Import file</Button>
              <Button>Export file</Button>
              
            </div>
          </div>
   {isLoading ? (
      <Skeleton active paragraph={{ rows: 8 }} />
    ) : (
          <Table
            rowKey="id"
            loading={isLoading}
            columns={columns}
            dataSource={products}
            size="middle"
            pagination={{ pageSize: 10, showSizeChanger: false }}
            scroll={{ x: 1200 }}
            expandable={{
              expandedRowRender: (record) => (
                <SubVariantTable master={record} />
              ),
              rowExpandable: () => true,
            }}
            rowClassName="hover:bg-blue-50"
            sticky
          />
            )}
        </div>
      </section>
    </div>
  );
}
