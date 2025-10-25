"use client";

import { useEffect } from "react";
import { Tabs, Table, Button, Select, Tag, Input } from "antd";
import type { TabsProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  StopOutlined,
  FileSearchOutlined,
  DollarOutlined,
  ToolOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import type { Supplier, SupplierDebt } from "@/types/supplier";
import { useSupplierStore } from "@/stores/useSupplierStore";

/* -------------------- Helper format number -------------------- */
const formatNumber = (v?: number) => (v ?? 0).toLocaleString("vi-VN");

/* -------------------- Component chính -------------------- */
export default function SupplierDetail({ supplier }: { supplier: Supplier }) {
  const { detail, getById } = useSupplierStore();

  useEffect(() => {
    getById(supplier.id);
  }, [supplier.id, getById]);

  /* -------------------- Cấu hình bảng nợ -------------------- */
  const debtColumns: ColumnsType<SupplierDebt> = [
    {
      title: "Mã phiếu",
      dataIndex: "id",
      width: 140,
      render: (v: string) => (
        <span className="text-blue-600 hover:underline cursor-pointer">{v}</span>
      ),
    },
    { title: "Thời gian", dataIndex: "time", width: 160 },
    { title: "Loại", dataIndex: "type", width: 160 },
    {
      title: "Giá trị",
      dataIndex: "amount",
      align: "right",
      width: 160,
      render: (v?: number) => formatNumber(v),
    },
    {
      title: "Nợ cần trả nhà cung cấp",
      dataIndex: "debt",
      align: "right",
      width: 200,
      render: (v?: number) => (
        <span className={v && v < 0 ? "text-red-600" : "text-green-600"}>
          {formatNumber(v)}
        </span>
      ),
    },
  ];

  /* -------------------- Tab Thông tin -------------------- */
  const infoTab = (
    <div className="bg-white rounded-md border border-gray-200 p-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3 mb-3">
        <div className="text-lg font-semibold flex items-center gap-2">
          {supplier.name}
          <span className="text-gray-500 text-sm">({supplier.id})</span>
          <Tag
            color={supplier.status === "Ngừng hoạt động" ? "red" : "green"}
            className="rounded"
          >
            {supplier.status}
          </Tag>
        </div>
        <div className="text-sm text-gray-500">
          Người tạo: <b>{supplier.creator}</b> | Ngày tạo:{" "}
          <b>{supplier.createdAt}</b>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="grid grid-cols-2 gap-x-10 gap-y-3 mb-4 text-sm">
        <div className="space-y-2">
          <div>
            <label className="text-gray-600 w-[150px] inline-block">
              Điện thoại:
            </label>
            <span className="font-medium">{supplier.phone || "—"}</span>
          </div>
          <div>
            <label className="text-gray-600 w-[150px] inline-block">Email:</label>
            <span className="font-medium">{supplier.email || "Chưa có"}</span>
          </div>
          <div>
            <label className="text-gray-600 w-[150px] inline-block">Địa chỉ:</label>
            <span className="font-medium italic text-gray-700">
              {supplier.address || "Chưa có"}
            </span>
          </div>
          <div className="text-blue-600 text-sm mt-1 cursor-pointer hover:underline">
            Thêm thông tin xuất hoá đơn
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-gray-600 w-[180px] inline-block">
              Nhóm nhà cung cấp:
            </label>
            <span className="font-medium">{supplier.group || "Chưa có"}</span>
          </div>
          <div>
            <label className="text-gray-600 w-[180px] inline-block">Chi nhánh:</label>
            <span className="font-medium">{supplier.branch || "—"}</span>
          </div>
          <div>
            <label className="text-gray-600 w-[180px] inline-block">Tổng mua:</label>
            <span className="font-semibold text-blue-600">
              {formatNumber(supplier.totalPurchase)} ₫
            </span>
          </div>
          <div>
            <label className="text-gray-600 w-[180px] inline-block">
              Nợ cần trả hiện tại:
            </label>
            <span
              className={
                supplier.currentDebt < 0
                  ? "font-semibold text-red-600"
                  : "font-semibold text-green-600"
              }
            >
              {formatNumber(supplier.currentDebt)} ₫
            </span>
          </div>
        </div>
      </div>

      {/* Ghi chú */}
      <div className="border-t pt-3 mt-2">
        <div className="flex gap-2 items-center text-sm text-gray-600 mb-2">
          <FileSearchOutlined className="text-gray-400" />
          <span>Ghi chú</span>
        </div>
        <Input.TextArea
          placeholder="Nhập ghi chú..."
          rows={3}
          className="text-sm"
        />
      </div>

      {/* Nút hành động */}
      <div className="flex justify-between items-center border-t pt-3 mt-3">
        <div className="flex gap-2">
          <Button icon={<DeleteOutlined />}>Xóa</Button>
          <Button icon={<PrinterOutlined />}>In tem mã</Button>
        </div>
        <div className="flex gap-2">
          <Button icon={<StopOutlined />}>Ngừng hoạt động</Button>
          <Button type="primary" icon={<EditOutlined />}>
            Chỉnh sửa
          </Button>
        </div>
      </div>
    </div>
  );

  /* -------------------- Tab Nợ cần trả -------------------- */
  const debtTab = (
    <div className="bg-white rounded-md border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-gray-600">
          Tất cả các giao dịch ({detail?.debts?.length || 0})
        </div>
        <Select
          defaultValue="all"
          className="w-[200px]"
          options={[
            { label: "Tất cả giao dịch", value: "all" },
            { label: "Điều chỉnh", value: "adjust" },
            { label: "Phiếu nhập", value: "purchase" },
          ]}
        />
      </div>

      <Table
        rowKey="id"
        columns={debtColumns}
        dataSource={detail?.debts || []}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        size="small"
        rowClassName="hover:bg-blue-50"
        scroll={{ x: 900 }}
        locale={{ emptyText: "Chưa có giao dịch nào" }}
      />

      <div className="flex justify-end gap-2 mt-4">
        <Button icon={<ToolOutlined />}>Điều chỉnh</Button>
        <Button icon={<DollarOutlined />}>Thanh toán</Button>
        <Button icon={<PercentageOutlined />}>Chiết khấu thanh toán</Button>
      </div>
    </div>
  );

  const items: TabsProps["items"] = [
    { key: "info", label: "Thông tin", children: infoTab },
    { key: "debts", label: "Nợ cần trả nhà cung cấp", children: debtTab },
  ];

  return (
    <div className="mt-2">
      <Tabs defaultActiveKey="info" items={items} />
    </div>
  );
}
