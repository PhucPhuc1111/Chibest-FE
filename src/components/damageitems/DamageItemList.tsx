"use client";

import { useEffect, useMemo, useState } from "react";
import { Table, Tag, Input, Button, Select, Spin, Checkbox } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { useDamageItemStore } from "@/stores/useDamageItemStore";
import type { DamageDoc, DamageStatus } from "@/types/damageitem";
import DamageItemDetail from "./DamageItemDetail";
// tái dùng DateFilter đã dựng cho StockTakes
import StockDateFilter from "@/components/stocktakes/components/StockDateFilter";

export default function DamageItemList() {
  const {
    damageItems,
    isLoading,
    getAllDamageItems,
    setFilters,
    resetFilters,
    filters,
  } = useDamageItemStore();

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    getAllDamageItems();
  }, [filters, getAllDamageItems]);

  const creators = useMemo(
    () => Array.from(new Set(damageItems.map((d) => d.creator))),
    [damageItems]
  );
  const destroyers = useMemo(
    () => Array.from(new Set(damageItems.map((d) => d.destroyer).filter(Boolean))),
    [damageItems]
  );

  const columns: ColumnsType<DamageDoc> = [
    {
      title: "",
      dataIndex: "_chk",
      width: 48,
      fixed: "left",
      render: () => <input type="checkbox" className="mx-2" />,
    },
    { title: "Mã xuất hủy", dataIndex: "id", width: 180, fixed: "left" },
    {
      title: "Tổng giá trị hủy",
      dataIndex: "totalValue",
      align: "right",
      width: 160,
      render: (v: number) => v.toLocaleString("vi-VN"),
    },
    { title: "Thời gian", dataIndex: "time", width: 180 },
    { title: "Chi nhánh", dataIndex: "branch", width: 220 },
    { title: "Ghi chú", dataIndex: "note", ellipsis: true },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 140,
      render: (v) => {
        const color = v === "Phiếu tạm" ? "orange" : v === "Hoàn thành" ? "green" : "red";
        return <Tag color={color}>{v}</Tag>;
      },
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
            placeholder="Theo mã xuất hủy"
            defaultValue={filters.q}
            onPressEnter={(e) => setFilters({ q: (e.target as HTMLInputElement).value })}
            onBlur={(e) => setFilters({ q: (e.target as HTMLInputElement).value })}
          />
        </div>

        <div className="space-y-4">
          {/* Trạng thái */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Trạng thái</div>
            <Select<DamageStatus[]>
              mode="multiple"
              allowClear
              className="w-full"
              placeholder="Chọn trạng thái"
              value={filters.status}
              options={[
                { label: "Phiếu tạm", value: "Phiếu tạm" },
                { label: "Hoàn thành", value: "Hoàn thành" },
                { label: "Đã hủy", value: "Đã hủy" },
              ]}
              onChange={(v) => setFilters({ status: v && v.length ? v : undefined })}
            />
          </div>

          {/* Thời gian (giống StockTakes) */}
          <StockDateFilter
            onChange={(val) => {
              if (val.mode === "preset") {
                setFilters({ datePreset: val.value as string, fromDate: null, toDate: null });
              } else {
                const [from, to] = val.value as [string, string];
                setFilters({ fromDate: from, toDate: to, datePreset: null });
              }
            }}
          />

          {/* Người tạo */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Người tạo</div>
            <Select
              className="w-full"
              allowClear
              placeholder="Chọn người tạo"
              options={creators.map((c) => ({ label: c, value: c }))}
              onChange={(v) => setFilters({ creator: v ?? null })}
            />
          </div>

          {/* Người xuất hủy */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Người xuất hủy</div>
            <Select
              className="w-full"
              allowClear
              placeholder="Chọn người xuất hủy"
              options={destroyers.map((c) => ({ label: c!, value: c! }))}
              onChange={(v) => setFilters({ destroyer: v ?? null })}
            />
          </div>

          {/* (Demo) Nhóm tick bộ lọc nhanh */}
          <div className="pt-1">
            <Checkbox onChange={(e) => setFilters({ status: e.target.checked ? ["Phiếu tạm"] : undefined })}>
              Chỉ Phiếu tạm
            </Checkbox>
          </div>

          <div className="pt-1">
            <Button type="link" onClick={resetFilters}>
              Mặc định
            </Button>
          </div>
        </div>
      </aside>

      {/* ==== Table + master-detail inline ==== */}
      <section className="flex-1">
        <div className="bg-white rounded-md border border-gray-200">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <div className="text-[13px] text-gray-500">
              Tổng: <b>{damageItems.length.toLocaleString()}</b> phiếu xuất hủy
            </div>
            <div className="flex gap-2">
              <Button type="primary">+ Xuất hủy</Button>
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
              dataSource={damageItems}
              size="middle"
              pagination={{ pageSize: 15, showSizeChanger: false }}
              scroll={{ x: 1200 }}
              expandable={{
                expandedRowRender: (record) => <DamageItemDetail doc={record} />,
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
