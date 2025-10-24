"use client";

import { Tabs, Table, Input, Tag, Pagination } from "antd";
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
import type { StockTake, StockTakeItem } from "@/types/stocktake";
import { useState } from "react";

export default function StockTakeDetail({ stocktake }: { stocktake: StockTake }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(stocktake.items.length / pageSize);
  const visibleItems = stocktake.items.slice((page - 1) * pageSize, page * pageSize);

  const tagColor =
    stocktake.status === "Phiếu tạm"
      ? "orange"
      : stocktake.status === "Đã cân bằng kho"
      ? "green"
      : "red";

  const columns: ColumnsType<StockTakeItem> = [
    { title: "Mã hàng", dataIndex: "id", width: 150 },
    { title: "Tên hàng", dataIndex: "name", width: 320 },
    { title: "Tồn kho", dataIndex: "stock", align: "center", width: 120 },
    { title: "Thực tế", dataIndex: "actual", align: "center", width: 120 },
    { title: "SL lệch", dataIndex: "diff", align: "center", width: 100 },
    {
      title: "Giá trị lệch",
      dataIndex: "diffValue",
      align: "right",
      width: 160,
      render: (v: number) => v.toLocaleString("vi-VN"),
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "info",
      label: "Thông tin",
      children: (
        <div className="bg-white p-4 rounded-md border">
          {/* HEADER THÔNG TIN PHIẾU */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold flex items-center gap-2">
              {stocktake.id} <Tag color={tagColor}>{stocktake.status}</Tag>
            </div>
            <div className="text-sm text-gray-500">
              Người tạo: <b>{stocktake.creator}</b>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-3">
            <div className="flex justify-between">
              <span>
                Ngày tạo: <b>{stocktake.time}</b>
              </span>
              {stocktake.balanceDate && (
                <span>
                  Ngày cân bằng: <b>{stocktake.balanceDate}</b>
                </span>
              )}
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
              dataSource={visibleItems}
              pagination={false}
              size="small"
              scroll={{ x: 1000 }}
              rowClassName="hover:bg-blue-50 cursor-pointer"
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-3">
                <Pagination
                  current={page}
                  total={stocktake.items.length}
                  pageSize={pageSize}
                  showSizeChanger={false}
                  onChange={(p) => setPage(p)}
                />
                <span className="text-sm text-gray-500">
                  Tổng: {stocktake.items.length} hàng hóa
                </span>
              </div>
            )}

            {/* FOOTER TỔNG + GHI CHÚ */}
            <div className="mt-4 grid grid-cols-2">
              {/* GHI CHÚ */}
              <div>
                <div className="flex gap-2 items-center mb-1">
                  <EditOutlined />
                  <p className="text-sm text-gray-500">Ghi chú kiểm kho</p>
                </div>
                <textarea
                  className="rounded border w-full h-20 p-2 text-sm"
                  placeholder="Ghi chú..."
                />
              </div>

              {/* TỔNG CỘNG KIỂU KIOTVIET */}
              <div className="w-[280px] ml-auto text-sm text-gray-700 mt-4 border-t border-gray-200 pt-3">
                <div className="space-y-1.5">
                  <div className="flex">
                    <label className="text-gray-600 w-[160px] text-right pr-2">
                      Tổng thực tế:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {stocktake.totalQty.toLocaleString("vi-VN")}
                    </div>
                  </div>
                  <div className="flex">
                    <label className="text-gray-600 w-[160px] text-right pr-2">
                      Tổng lệch tăng:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {stocktake.increaseQty}
                    </div>
                  </div>
                  <div className="flex">
                    <label className="text-gray-600 w-[160px] text-right pr-2">
                      Tổng lệch giảm:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {stocktake.decreaseQty}
                    </div>
                  </div>
                  <div className="flex">
                    <label className="text-gray-600 w-[160px] text-right pr-2">
                      Tổng chênh lệch:
                    </label>
                    <div className="text-right font-semibold text-gray-900 flex-1">
                      {stocktake.totalDiff.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NÚT HÀNH ĐỘNG */}
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
