"use client";

import { useEffect, useMemo } from "react";
import { Tabs, Table, Input, Tag, Button, Select, DatePicker } from "antd";
import type { TabsProps, TableProps } from "antd";
import type { PurchaseOrderItem } from "@/types/purchaseOrder";
import { usePurchaseOrderStore } from "@/stores/usePurchaseOrderStore";
import {
  DeleteOutlined,
  CopyOutlined,
  ExportOutlined,
  SaveOutlined,
  PrinterOutlined,
  UserOutlined,
  CalendarOutlined,
  UploadOutlined ,
    MailOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

export default function PurchaseOrderDetail({ id }: { id: string }) {
  const { detail, getById } = usePurchaseOrderStore();

  useEffect(() => {
    if (!detail || detail.id !== id) {
      getById(id);
    }
  }, [id]);

  const columns: TableProps<PurchaseOrderItem>["columns"] = useMemo(
    () => [
      { title: "Mã hàng", dataIndex: "id", width: 150 },
      { title: "Tên hàng", dataIndex: "name", width: 340 },
      { title: "Số lượng", dataIndex: "qty", align: "center", width: 120 },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        align: "right",
        width: 140,
        render: (v: number) => v.toLocaleString(),
      },
      {
        title: "Giảm giá",
        dataIndex: "discount",
        align: "right",
        width: 120,
        render: (v?: number) => (v ?? 0).toLocaleString(),
      },
      {
        title: "Giá nhập",
        dataIndex: "buyPrice",
        align: "right",
        width: 140,
        render: (_: unknown, r) =>
          (r.buyPrice ?? Math.max(r.unitPrice - (r.discount ?? 0), 0)).toLocaleString(),
      },
      {
        title: "Thành tiền",
        align: "right",
        width: 160,
        render: (_: unknown, r) =>
          (r.qty * (r.buyPrice ?? r.unitPrice - (r.discount ?? 0))).toLocaleString(),
      },
    ],
    []
  );

  const order = detail;
  if (!order) return null;

  const tagColor =
    order.status === "Phiếu tạm"
      ? "orange"
      : order.status === "Đã nhập hàng"
      ? "green"
      : "red";

  const totalQty = order.items?.reduce((a, b) => a + b.qty, 0) ?? 0;
  const totalPrice =
    order.items?.reduce((a, b) => {
      const price = b.buyPrice ?? b.unitPrice - (b.discount ?? 0);
      return a + price * b.qty;
    }, 0) ?? 0;

  const infoTab: TabsProps["items"] = [
    {
      key: "info",
      label: "Thông tin",
      children: (
        <div className="bg-white p-4 rounded-md border">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold flex items-center gap-2">
              {order.id} <Tag color={tagColor}>{order.status}</Tag>
            </div>
            <div className="text-sm text-gray-500">Chibest Quận 4</div>
          </div>

          {/* Người tạo + thông tin nhập */}
          <div className="text-sm text-gray-600 mb-3 flex justify-between items-center">
            <span>
              Người tạo: <b>{order.creator}</b>
            </span>
          </div>

          {/* --- Thông tin nhập hàng / NCC --- */}
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-700 mb-4">
            <div>
              <label className="block text-gray-600 mb-1">Tên NCC:</label>
              <Input
                value={order.supplierName ?? ""}
                placeholder="Nhập tên nhà cung cấp"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Người nhập:</label>
              <Select
                className="w-full text-sm"
                suffixIcon={<UserOutlined />}
                defaultValue={order.receiver || order.creator}
                options={[
                  { label: "QUẢN LÝ Q4", value: "QUẢN LÝ Q4" },
                  { label: "NV_KHO Q4", value: "NV_KHO Q4" },
                  { label: "ADMIN", value: "ADMIN" },
                ]}
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Ngày nhập:</label>
              <DatePicker
                className="w-full text-sm"
                suffixIcon={<CalendarOutlined />}
                format="DD/MM/YYYY HH:mm"
                showTime
                defaultValue={dayjs(order.time, "DD/MM/YYYY HH:mm")}
              />
            </div>
          </div>

          {/* TABLE ITEMS */}
          <div className="border rounded-md p-3 bg-white mb-3">
            <div className="flex gap-3 mb-2">
              <Input placeholder="Tìm mã hàng" className="max-w-[160px]" />
              <Input placeholder="Tìm tên hàng" className="max-w-[220px]" />
            </div>

            <Table<PurchaseOrderItem>
              rowKey="id"
              columns={columns}
              dataSource={order.items ?? []}
              pagination={false}
              size="small"
              scroll={{ x: 1100 }}
            />

            {/* FOOTER GRID */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <textarea
                  className="rounded border w-full h-24 p-2 text-sm"
                  defaultValue={order.note ?? ""}
                  placeholder="Ghi chú..."
                />
              </div>

              {/* Tổng hợp bên phải */}
              <div className="w-[320px] ml-auto text-sm text-gray-700 mt-1 border-t border-gray-200 pt-3">
                <div className="space-y-1.5">
                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Số lượng mặt hàng:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {order.items?.length ?? 0}
                    </div>
                  </div>

                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Tổng tiền hàng (1):
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {totalPrice.toLocaleString("vi-VN")}
                    </div>
                  </div>

                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Giảm giá:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      0
                    </div>
                  </div>

                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Cần trả NCC:
                    </label>
                    <div className="text-right font-semibold text-gray-900 flex-1">
                      {order.needPayToSupplier.toLocaleString("vi-VN")}
                    </div>
                  </div>

                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Tổng SL:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {totalQty}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex space-x-2">
              <Button className="flex items-center gap-1" icon={<DeleteOutlined />}>
                Hủy
              </Button>
              <Button className="flex items-center gap-1" icon={<CopyOutlined />}>
                Sao chép
              </Button>
              <Button className="flex items-center gap-1" icon={<ExportOutlined />}>
                Xuất file
              </Button>
              <Button className="flex items-center gap-1" icon={<MailOutlined />}>
                Gửi mail
              </Button>
            </div>
            <div className="flex space-x-2">
                 <Button type="primary" className="flex items-center gap-1" icon={<ExportOutlined />}>
                Mở phiếu
              </Button>
                 <Button  className="flex items-center gap-1" icon={<SaveOutlined />}>
                Lưu
              </Button>
              <Button className="flex items-center gap-1" icon={<UploadOutlined  />}>
                Trả hàng nhập
              </Button>
              <Button className="flex items-center gap-1" icon={<PrinterOutlined />}>
                In mã tem
              </Button>
             
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="px-3 py-2">
      <Tabs defaultActiveKey="info" items={infoTab} />
    </div>
  );
}
