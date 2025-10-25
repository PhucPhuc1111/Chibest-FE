// src/components/purchaseOrders/PurchaseOrderList.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Tag,
  Input,
  Button,
  Select,
//   DatePicker,
  Spin,
} from "antd";
import type { TableProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { usePurchaseOrderStore } from "@/stores/usePurchaseOrderStore";
import type { PurchaseOrder, PurchaseOrderStatus } from "@/types/purchaseOrder";
import PurchaseOrderDetail from "./PurchaseOrderDetail";
import DateFilter from "../ui/DateFilter/DateFilter";
// const { RangePicker } = DatePicker;

export default function PurchaseOrderList() {
  const {
    list,
    isLoading,
    getAll,
    setFilters,
    resetFilters,
    filters,
  } = usePurchaseOrderStore();

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    getAll();
  }, [filters, getAll]);

  const columns: TableProps<PurchaseOrder>["columns"] = useMemo(
    () => [
      {
        title: "",
        dataIndex: "_select",
        width: 48,
        fixed: "left",
        render: () => <input type="checkbox" className="mx-2" />,
      },
      { title: "Mã nhập hàng", dataIndex: "id", width: 160, fixed: "left" },
      { title: "Thời gian", dataIndex: "time", width: 180 },
      { title: "Mã NCC", dataIndex: "supplierCode", width: 120 },
      { title: "Nhà cung cấp", dataIndex: "supplierName", width: 240 },
      {
        title: "Cần trả NCC",
        dataIndex: "needPayToSupplier",
        align: "right",
        width: 160,
        render: (v: number) => v?.toLocaleString("vi-VN"),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: 140,
        render: (v) => {
          const color =
            v === "Phiếu tạm" ? "orange" : v === "Đã nhập hàng" ? "green" : "red";
          return <Tag color={color}>{v}</Tag>;
        },
      },
    ],
    []
  );

  return (
    <div className="flex gap-4">
      {/* SIDEBAR FILTER */}
      <aside className="w-[300px] shrink-0 bg-white rounded-md border border-gray-200 p-3">
        <div className="mb-3">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Theo mã phiếu nhập"
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
          {/* Trạng thái */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Trạng thái</div>
            <Select<PurchaseOrderStatus[]>
              mode="multiple"
              allowClear
              className="w-full"
              placeholder="Chọn trạng thái"
              value={filters.status}
              options={[
                { label: "Phiếu tạm", value: "Phiếu tạm" },
                { label: "Đã nhập hàng", value: "Đã nhập hàng" },
                { label: "Đã hủy", value: "Đã hủy" },
              ]}
              onChange={(v) => setFilters({ status: v && v.length ? v : undefined })}
            />
          </div>

          {/* Thời gian */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Thời gian</div>
            {/* <RangePicker
              className="w-full"
              onChange={(val) =>
                setFilters({
                  fromDate: val?.[0]?.toISOString() ?? null,
                  toDate: val?.[1]?.toISOString() ?? null,
                })
              }
            /> */}
            <DateFilter 
                                      onChange={(val) => {
                                        if (val.mode === "preset") {
                                          setFilters({ datePreset: val.value }); // string
                                        } else {
                                          const [from, to] = val.value;          // [YYYY-MM-DD, YYYY-MM-DD]
                                          setFilters({ fromDate: from, toDate: to, datePreset: null });
                                        }
                                      }}
                                    />
          </div>

          {/* Người tạo */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Người tạo</div>
            <Select
              allowClear
              className="w-full"
              placeholder="Chọn người tạo"
              options={[
                { label: "QUẢN LÝ Q4", value: "QUẢN LÝ Q4" },
                { label: "KHO Q4", value: "KHO Q4" },
              ]}
              onChange={(v) => setFilters({ creator: v ?? null })}
            />
          </div>

          {/* Người nhập */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Người nhập</div>
            <Select
              allowClear
              className="w-full"
              placeholder="Chọn người nhập"
              options={[
                { label: "QUẢN LÝ Q4", value: "QUẢN LÝ Q4" },
                { label: "KHO Q4", value: "KHO Q4" },
              ]}
              onChange={(v) => setFilters({ receiver: v ?? null })}
            />
          </div>

          {/* Chi phí nhập trả NCC */}
          <div>
            <div className="text-[13px] font-semibold mb-1">
              Chi phí nhập trả NCC
            </div>
            <Select
              allowClear
              className="w-full"
              placeholder="Chọn loại chi phí"
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Vận chuyển", value: "van-chuyen" },
                { label: "Phụ phí", value: "phu-phi" },
              ]}
              onChange={(v) => setFilters({ extraCostType: v ?? null })}
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
        <div className="bg-white rounded-md border border-gray-200">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <div className="text-[13px] text-gray-500">
              Tổng: <b>{list.length.toLocaleString()}</b> phiếu nhập
            </div>
            <div className="flex gap-2">
              <Button type="primary">+ Nhập hàng</Button>
              <Button>Xuất file</Button>
              <Button>⚙️</Button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-10 flex justify-center">
              <Spin />
            </div>
          ) : (
            <Table<PurchaseOrder>
              rowKey="id"
              columns={columns}
              dataSource={list}
              size="middle"
              pagination={{ pageSize: 15, showSizeChanger: false }}
              scroll={{ x: 1200 }}
              expandable={{
                expandedRowRender: (record) => (
                  <PurchaseOrderDetail id={record.id} />
                ),
                expandRowByClick: true,
                expandedRowKeys,
                onExpand: (expanded, record) => {
                  setExpandedRowKeys(expanded ? [record.id] : []);
                },
              }}
              rowClassName="cursor-pointer hover:bg-blue-50"
              sticky
            />
          )}
        </div>
      </section>
    </div>
  );
}
