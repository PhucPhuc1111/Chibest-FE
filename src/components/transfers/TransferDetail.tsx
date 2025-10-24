"use client";

import { Tabs, Table, Input, Tag } from "antd";
import type { TabsProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import type { Transfer, TransferProductItem } from "@/types/transfer";
import {
  EditOutlined ,
  DeleteOutlined,
  CopyOutlined,
  ExportOutlined,
  SaveOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
export default function TransferDetail({ transfer }: { transfer: Transfer }) {
  const router = useRouter();

  const tagColor =
    transfer.status === "Đang chuyển"
      ? "blue"
      : transfer.status === "Phiếu tạm"
      ? "orange"
      : "green";

  // ===== Cột bảng sản phẩm =====
  const columns: ColumnsType<TransferProductItem> = [
    { title: "Mã hàng", dataIndex: "id", width: 150 },
    { title: "Tên hàng", dataIndex: "name", width: 320 },
    {
      title: "Số lượng chuyển",
      dataIndex: "qtyTransfer",
      align: "center",
      width: 140,
    },
    {
      title: "Số lượng nhận",
      dataIndex: "qtyReceive",
      align: "center",
      width: 140,
    },
    {
      title: "Giá chuyển/nhận",
      dataIndex: "price",
      align: "right",
      width: 160,
      render: (v: number) => v.toLocaleString(),
    },
    {
      title: "Thành tiền chuyển",
      align: "right",
      width: 180,
      render: (r) => (r.qtyTransfer * r.price).toLocaleString(),
    },
    {
      title: "Thành tiền nhận",
      align: "right",
      width: 180,
      render: (r) => (r.qtyReceive * r.price).toLocaleString(),
    },
  ];

  // ===== Tổng cộng =====
  const totalQtyTransfer = transfer.products.reduce(
    (a, b) => a + b.qtyTransfer,
    0
  );
  const totalValueTransfer = transfer.products.reduce(
    (a, b) => a + b.qtyTransfer * b.price,
    0
  );

  // ===== Tab duy nhất: "Thông tin" =====
  const items: TabsProps["items"] = [
    {
      key: "info",
      label: "Thông tin",
      children: (
        <div className="bg-white p-4 rounded-md border">
          {/* HEADER THÔNG TIN PHIẾU */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold flex items-center gap-2">
              {transfer.id} <Tag color={tagColor}>{transfer.status}</Tag>
            </div>
            <div className="text-sm text-gray-500">
              Người tạo: <b>{transfer.creator}</b>
              {transfer.receiver && (
                <>
                  {" "} | Người nhận: <b>{transfer.receiver}</b>
                </>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-3">
            <div className="flex justify-between">
              <span>
                Chuyển từ: <b>{transfer.fromBranch}</b> (
                {transfer.dateTransfer})
              </span>
              <span>
                Chuyển đến: <b>{transfer.toBranch}</b>{" "}
                {transfer.dateReceive && `(${transfer.dateReceive})`}
              </span>
            </div>
          </div>

          {/* BẢNG SẢN PHẨM */}
          <div className="border rounded-md p-3 bg-white mb-3">
            <div className="flex gap-3 mb-2">
              <Input placeholder="Tìm mã hàng" className="max-w-[160px]" />
              <Input placeholder="Tìm tên hàng" className="max-w-[220px]" />
            </div>

            <Table
              rowKey="id"
              columns={columns}
              dataSource={transfer.products}
              pagination={false}
              size="small"
              onRow={(r) => ({
                onClick: () => router.push(`/admin/products/${r.id}`),
              })}
              rowClassName="cursor-pointer hover:bg-blue-50"
              scroll={{ x: 1200 }}
            />

            <div className="mt-3 grid grid-cols-2">
              <div>
                <div className="flex gap-2 my-2">
                 <EditOutlined />
                <p className="text-sm text-gray-500">Ghi chú chuyển</p>
                </div>

                <textarea
                  className="rounded border w-full h-20 p-2 text-sm"
                  placeholder="Ghi chú..."
                />
              </div>
              {/* --- PHẦN TỔNG KIỂU KIOTVIET (CĂN PHẢI LABEL) --- */}
            <div className="w-[280px] ml-auto text-sm text-gray-700 mt-4 border-t border-gray-200 pt-3">
            <div className="space-y-1.5">
                <div className="flex">
                <label className="text-gray-600 w-[160px] text-right pr-2">
                    Tổng số mặt hàng:
                </label>
                <div className="text-right font-medium text-gray-800 flex-1">
                    {transfer.products.length}
                </div>
                </div>

                <div className="flex">
                <label className="text-gray-600 w-[160px] text-right pr-2">
                    Tổng SL chuyển:
                </label>
                <div className="text-right font-medium text-gray-800 flex-1">
                    {totalQtyTransfer}
                </div>
                </div>

                <div className="flex">
                <label className="text-gray-600 w-[160px] text-right pr-2">
                    Tổng giá trị chuyển:
                </label>
                <div className="text-right font-semibold text-gray-900 flex-1">
                    {totalValueTransfer.toLocaleString("vi-VN")} ₫
                </div>
                </div>

                <div className="flex">
                <label className="text-gray-600 w-[160px] text-right pr-2">
                    Tổng SL nhận:
                </label>
                <div className="text-right font-medium text-gray-800 flex-1">
                    {totalQtyTransfer}
                </div>
                </div>

                <div className="flex">
                <label className="text-gray-600 w-[160px] text-right pr-2">
                    Tổng giá trị nhận:
                </label>
                <div className="text-right font-semibold text-gray-900 flex-1">
                    {totalValueTransfer.toLocaleString("vi-VN")} ₫
                </div>
                </div>
            </div>
            </div>

            </div>
          </div>

          {/* NÚT HÀNH ĐỘNG */}
          <div className=" flex items-center justify-between gap-2">
            <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded flex items-center gap-1">
              <DeleteOutlined /> Hủy
            </button>
            <button className="px-3 py-1 border rounded flex items-center gap-1">
              <CopyOutlined /> Sao chép
            </button>
            <button className="px-3 py-1 border rounded flex items-center gap-1">
              <ExportOutlined /> Xuất file
            </button>
            <button className="px-3 py-1 border rounded flex items-center gap-1">
              <PrinterOutlined /> In tem mã
            </button>
            </div>
            <div className="flex space-x-2">
             <button className="px-3 py-1 border rounded flex items-center gap-1">
              < PrinterOutlined /> In 
            </button>
            <button className="px-3 py-1 border rounded flex items-center gap-1">
              <SaveOutlined /> Lưu
            </button>
            </div>
            
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-2">
      <Tabs defaultActiveKey="info" items={items} />
    </div>
  );
}
