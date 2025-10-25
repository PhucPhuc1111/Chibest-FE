"use client";

import { Tabs, Table, Input, Tag } from "antd";
import type { TabsProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  ExportOutlined,
  SaveOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import type { DamageDoc, DamageItemRow } from "@/types/damageitem";

export default function DamageItemDetail({ doc }: { doc: DamageDoc }) {
  const tagColor =
    doc.status === "Phiếu tạm" ? "orange" : doc.status === "Hoàn thành" ? "green" : "red";

  const columns: ColumnsType<DamageItemRow> = [
    { title: "Mã hàng", dataIndex: "id", width: 150 },
    { title: "Tên hàng", dataIndex: "name", width: 320 },
    { title: "SL hủy", dataIndex: "qty", align: "center", width: 120 },
    {
      title: "Giá hủy",
      dataIndex: "price",
      align: "right",
      width: 140,
      render: (v: number) => v.toLocaleString("vi-VN"),
    },
    {
      title: "Thành tiền",
      align: "right",
      width: 160,
      render: (r) => (r.qty * r.price).toLocaleString("vi-VN"),
    },
  ];

  const totalQty = doc.items.reduce((a, b) => a + b.qty, 0);
  const totalValue = doc.items.reduce((a, b) => a + b.qty * b.price, 0);

  const items: TabsProps["items"] = [
    {
      key: "info",
      label: "Thông tin",
      children: (
        <div className="bg-white p-4 rounded-md border">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold flex items-center gap-2">
              {doc.id} <Tag color={tagColor}>{doc.status}</Tag>
            </div>
            <div className="text-sm text-gray-500">
              Người tạo: <b>{doc.creator}</b>
              {doc.destroyer && (
                <>
                  {" "} | Người xuất hủy: <b>{doc.destroyer}</b>
                </>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-3">
            <div className="flex justify-between">
              <span>
                Chi nhánh: <b>{doc.branch}</b> — Thời gian: <b>{doc.time}</b>
              </span>
              <span>Ghi chú: <i>{doc.note || "—"}</i></span>
            </div>
          </div>

          {/* BẢNG HÀNG HÓA */}
          <div className="border rounded-md p-3 bg-white mb-3">
            <div className="flex gap-3 mb-2">
              <Input placeholder="Tìm mã hàng" className="max-w-[160px]" />
              <Input placeholder="Tìm tên hàng" className="max-w-[220px]" />
            </div>

            <Table
              rowKey="id"
              columns={columns}
              dataSource={doc.items}
              pagination={{ pageSize: 10, showSizeChanger: false }}
              size="small"
              rowClassName="hover:bg-blue-50"
              scroll={{ x: 1100 }}
            />

            {/* GHI CHÚ + TỔNG CỘNG */}
            <div className="mt-3 grid grid-cols-2">
              <div>
                <div className="flex gap-2 my-2">
                  <EditOutlined />
                  <p className="text-sm text-gray-500">Ghi chú xuất hủy</p>
                </div>
                <textarea
                  className="rounded border w-full h-20 p-2 text-sm"
                  placeholder="Ghi chú..."
                  defaultValue={doc.note}
                />
              </div>

              <div className="w-[280px] ml-auto text-sm text-gray-700 mt-4 border-t border-gray-200 pt-3">
                <div className="space-y-1.5">
                  <div className="flex">
                    <label className="text-gray-600 w-[160px] text-right pr-2">
                      Tổng số mặt hàng:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {doc.items.length}
                    </div>
                  </div>
                  <div className="flex">
                    <label className="text-gray-600 w-[160px] text-right pr-2">
                      Tổng SL hủy:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {totalQty}
                    </div>
                  </div>
                  <div className="flex">
                    <label className="text-gray-600 w-[160px] text-right pr-2">
                      Tổng giá trị hủy:
                    </label>
                    <div className="text-right font-semibold text-gray-900 flex-1">
                      {totalValue.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-between gap-2">
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
                <PrinterOutlined /> In
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
