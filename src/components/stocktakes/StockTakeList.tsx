"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Table,
  Tag,
  Input,
  Button,
  Select,
  // DatePicker,
  Spin,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { StockTake, StockTakeStatus } from "@/types/stocktake";
import { useStockTakeStore } from "@/stores/useStockTakeStore";
import StockTakeDetail from "./StockTakeDetail";
import StockDateFilter from "./components/StockDateFilter";
// const { RangePicker } = DatePicker;

export default function StockTakeList() {
  const {
    stockTakes,
    isLoading,
    getAllStockTakes,
    setFilters,
    resetFilters,
    filters,
    getStockTakeById,
    details,
  } = useStockTakeStore();

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    getAllStockTakes();
  }, [filters, getAllStockTakes]);

  const columns: ColumnsType<StockTake> = useMemo(
    () => [
      { title: "", dataIndex: "_", width: 48, render: () => <input type="checkbox" /> },
      { title: "Mã kiểm kho", dataIndex: "id", width: 180 },
      { title: "Thời gian", dataIndex: "time", width: 180 },
      { title: "Ngày cân bằng", dataIndex: "balanceDate", width: 180 },
      {
        title: "SL thực tế",
        dataIndex: "totalQty",
        align: "right",
        width: 120,
        render: (v: number) => v.toLocaleString(),
      },
      {
        title: "Tổng thực tế",
        dataIndex: "totalValue",
        align: "right",
        width: 160,
        render: (v: number) => v.toLocaleString(),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: 150,
        render: (v) => {
          const color =
            v === "Phiếu tạm" ? "orange" : v === "Đã cân bằng kho" ? "green" : "red";
          return <Tag color={color}>{v}</Tag>;
        },
      },
    ],
    []
  );

  return (
    <div className="flex gap-4">
      {/* Sidebar */}
      <aside className="w-[300px] bg-white border rounded-md p-3">
        <div className="mb-3">
          <Input
            prefix={<SearchOutlined />}
            allowClear
            placeholder="Theo mã phiếu kiểm"
            onPressEnter={(e) =>
              setFilters({ q: (e.target as HTMLInputElement).value })
            }
          />
        </div>

        <div className="space-y-4">
          <div>
            {/* <div className="text-[13px] font-semibold mb-1">Ngày tạo</div> */}
            {/* <RangePicker
              className="w-full"
              onChange={(val) =>
                setFilters({
                  fromDate: val?.[0]?.toISOString() ?? null,
                  toDate: val?.[1]?.toISOString() ?? null,
                })
              }
            /> */}
           
            <StockDateFilter
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

          <div>
            <div className="text-[13px] font-semibold mb-1">Trạng thái</div>
            <Select<StockTakeStatus[]>
              mode="multiple"
              allowClear
              className="w-full"
              placeholder="Chọn trạng thái"
              options={[
                { label: "Phiếu tạm", value: "Phiếu tạm" },
                { label: "Đã cân bằng kho", value: "Đã cân bằng kho" },
                { label: "Đã hủy", value: "Đã hủy" },
              ]}
              value={filters.status}
              onChange={(v) =>
                setFilters({ status: v && v.length ? v : undefined })
              }
            />
          </div>

          <div>
            <div className="text-[13px] font-semibold mb-1">Người tạo</div>
            <Input
              placeholder="Chọn người tạo"
              onBlur={(e) =>
                setFilters({ creator: e.target.value || null })
              }
            />
          </div>

          <div className="pt-1">
            <Button type="link" onClick={resetFilters}>
              Mặc định
            </Button>
          </div>
        </div>
      </aside>

      {/* Table */}
      <section className="flex-1">
        <div className="bg-white border rounded-md">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <div className="text-[13px] text-gray-500">
              Tổng: <b>{stockTakes.length}</b> phiếu kiểm kho
            </div>
            <div className="space-x-2">
              <Button type="primary">+ Kiểm kho</Button>
              <Button type="default" > Xuất file</Button>
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
              dataSource={stockTakes}
              size="middle"
              pagination={{
                pageSize: 15,
                showTotal: (t) => `1 - ${Math.min(15, t)} trong ${t} phiếu`,
              }}
              scroll={{ x: 1100 }}
              expandable={{
                expandedRowRender: (record) =>
                  details[record.id] ? (
                    <StockTakeDetail stocktake={details[record.id]} />
                  ) : (
                    <div className="p-4 text-gray-500 text-sm">
                      Đang tải chi tiết phiếu...
                    </div>
                  ),
                expandRowByClick: true,
                expandedRowKeys,
                onExpand: async (expanded, record) => {
                  if (expanded) await getStockTakeById(record.id);
                  setExpandedRowKeys(expanded ? [record.id] : []);
                },
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
