"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Tag,
  Input,
  Button,
  Select,
  // DatePicker,
  Checkbox,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import type { PurchaseReturn } from "@/types/purchaseReturn";
import { usePurchaseReturnStore } from "@/stores/usePurchaseReturnStore";
import PurchaseReturnDetail from "./PurchaseReturnDetail";
import DateFilter from "../ui/DateFilter/DateFilter";
// const { RangePicker } = DatePicker;

export default function PurchaseReturnList() {
  const { isLoading,list, getAll,setFilters } = usePurchaseReturnStore();

  // mock sidebar filters (UI giống PO – chưa bắt buộc wire API)
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    getAll();
  }, [getAll]);

  const columns: ColumnsType<PurchaseReturn> = useMemo(
    () => [
      {
        title: "",
        dataIndex: "_select",
        width: 44,
        fixed: "left",
        render: () => <input type="checkbox" className="mx-2" />,
      },
      { title: "Mã trả hàng nhập", dataIndex: "id", width: 180, fixed: "left" },
      { title: "Thời gian", dataIndex: "time", width: 180 },
      { title: "Nhà cung cấp", dataIndex: "supplierName", width: 260 },
      {
        title: "Tổng tiền hàng",
        dataIndex: "total",
        align: "right",
        width: 140,
        render: (v: number) => v?.toLocaleString("vi-VN"),
      },
      {
        title: "Giảm giá",
        dataIndex: "discount",
        align: "right",
        width: 120,
        render: (v: number) => v?.toLocaleString("vi-VN"),
      },
      {
        title: "NCC cần trả",
        dataIndex: "supplierPay",
        align: "right",
        width: 140,
        render: (v: number) => v?.toLocaleString("vi-VN"),
      },
      {
        title: "NCC đã trả",
        dataIndex: "supplierPaid",
        align: "right",
        width: 140,
        render: (v: number) => v?.toLocaleString("vi-VN"),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: 140,
        render: (v) => {
          const color = v === "Phiếu tạm" ? "orange" : v === "Đã trả hàng" ? "green" : "red";
          return <Tag color={color}>{v}</Tag>;
        },
      },
    ],
    []
  );

  return (
    <div className="flex gap-4">
      {/* ===== Sidebar Filter (giống PurchaseOrder) ===== */}
      <aside className="w-[300px] shrink-0 bg-white rounded-md border border-gray-200 p-3">
        <div className="mb-3">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Theo mã phiếu trả"
          />
        </div>

        <div className="space-y-4">
          {/* Trạng thái */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Trạng thái</div>
            <div className="flex flex-col gap-2 text-[13px]">
              <Checkbox defaultChecked> Phiếu tạm </Checkbox>
              <Checkbox defaultChecked> Đã trả hàng </Checkbox>
              <Checkbox> Đã hủy </Checkbox>
            </div>
          </div>

          {/* Thời gian */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Thời gian</div>
            {/* <Select
              className="w-full mb-2"
              defaultValue="thisMonth"
              options={[
                { label: "Tháng này", value: "thisMonth" },
                { label: "Tuần này", value: "thisWeek" },
                { label: "Hôm nay", value: "today" },
              ]}
            />
            <RangePicker className="w-full" /> */}
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
              className="w-full"
              allowClear
              placeholder="Chọn người tạo"
              options={[
                { label: "QUẢN LÝ Q4", value: "QLQ4" },
                { label: "NV_KHO Q4", value: "NVKHO" },
              ]}
            />
          </div>

          {/* Người trả */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Người trả</div>
            <Select
              className="w-full"
              allowClear
              placeholder="Chọn người trả"
              options={[
                { label: "QUẢN LÝ Q4", value: "QLQ4" },
                { label: "NV_KHO Q4", value: "NVKHO" },
              ]}
            />
          </div>

          {/* Chi phí nhập hoàn lại */}
          <div>
            <div className="text-[13px] font-semibold mb-1">Chi phí nhập hoàn lại</div>
            <Select
              className="w-full"
              allowClear
              placeholder="Chọn loại chi phí"
              options={[
                { label: "Phí vận chuyển", value: "ship" },
                { label: "Phí xử lý", value: "process" },
              ]}
            />
          </div>
        </div>
      </aside>

      {/* ===== Bảng + master-detail inline ===== */}
      <section className="flex-1">
        <div className="bg-white rounded-md border border-gray-200">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <div className="text-[13px] text-gray-500">
              Tổng: <b>{list.length.toLocaleString()}</b> phiếu trả
            </div>
            <div className="flex gap-2">
              <Button type="primary">+ Trả hàng nhập</Button>
         
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
              dataSource={list}
              size="middle"
              pagination={{
                pageSize: 15,
                showTotal: (t) => `1 - ${Math.min(15, t)} trong ${t} phiếu`,
              }}
              scroll={{ x: 1200 }}
              expandable={{
                expandedRowRender: (record) => (
                  <div className="px-3 py-2">
                    <PurchaseReturnDetail id={record.id} />
                  </div>
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
