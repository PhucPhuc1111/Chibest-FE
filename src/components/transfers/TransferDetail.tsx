// src/components/transfers/TransferDetail.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, Table, Input, Tag, Button, Modal } from "antd";
import type { TabsProps, TableProps } from "antd";
import type { TransferItem } from "@/types/transfer";
import { useTransferStore } from "@/stores/useTransferStore";
import {
  DeleteOutlined,
  CopyOutlined,
  ExportOutlined,
  SaveOutlined,
  PrinterOutlined,
  MailOutlined,
} from "@ant-design/icons";

interface TransferDetailProps {
  id: string;
  onDeleted?: (deletedId: string) => void;
}

export default function TransferDetail({ id, onDeleted }: TransferDetailProps) {
  const { detail, getById, deleteTransfer, getAll } = useTransferStore();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      if (!detail || detail.id !== id) {
        setLoading(true);
        const result = await getById(id);
        setLoading(false);
        if (!result.success && result.message) {
          // Handle error if needed
        }
      }
    };
    loadDetail();
  }, [id, detail, getById]);

  // Xử lý hiển thị confirm delete
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Xử lý xác nhận xóa
  const handleConfirmDelete = async () => {
    if (!detail) return;
    
    setDeleteLoading(true);
    try {
      const result = await deleteTransfer(detail.id);
      
      if (result.success) {
        await getAll();
        // Gọi callback để thông báo cho parent component
        if (onDeleted) {
          onDeleted(detail.id);
        }
        // Đóng confirm
        setShowDeleteConfirm(false);
      } 
    } catch {
      // Handle error
    } finally {
      setDeleteLoading(false);
    }
  };

  // Xử lý hủy xóa
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "blue";
      case "Hoàn Thành": return "green";
      case "Đã Hủy": return "red";
      default: return "default";
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "Draft": return "Nháp";
      case "Hoàn Thành": return "Hoàn thành";
      case "Đã Hủy": return "Đã hủy";
      default: return status;
    }
  };

  const columns: TableProps<TransferItem>["columns"] = useMemo(
    () => [
      { 
        title: "Mã hàng", 
        dataIndex: "sku", 
        width: 150,
        render: (sku: string) => sku || "—"
      },
      { 
        title: "Tên hàng", 
        dataIndex: "productName", 
        width: 300,
        render: (name: string) => name || "—"
      },
      { 
        title: "Số lượng", 
        dataIndex: "quantity", 
        align: "center", 
        width: 100,
        render: (qty: number) => qty || 0
      },
      { 
        title: "Số lượng thực tế", 
        dataIndex: "actualQuantity", 
        align: "center", 
        width: 140,
        render: (qty: number) => qty || 0
      },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        align: "right",
        width: 120,
        render: (v: number) => (v || 0).toLocaleString("vi-VN") + " đ",
      },
      {
        title: "Phí phụ thu",
        dataIndex: "extraFee",
        align: "right",
        width: 120,
        render: (v: number) => (v || 0).toLocaleString("vi-VN") + " đ",
      },
      {
        title: "Phí hoa hồng",
        dataIndex: "commissionFee",
        align: "right",
        width: 120,
        render: (v: number) => (v || 0).toLocaleString("vi-VN") + " đ",
      },
      {
        title: "Giảm giá",
        dataIndex: "discount",
        align: "right",
        width: 120,
        render: (v: number) => (v || 0).toLocaleString("vi-VN") + " đ",
      },
      {
        title: "Thành tiền",
        align: "right",
        width: 160,
        render: (_: unknown, record: TransferItem) => {
          const quantity = record.quantity || 0;
          const subtotal = record.unitPrice || 0;
          const extraFee = record.extraFee || 0;
          const commissionFee = record.commissionFee || 0;
          const discount = record.discount || 0;
          const total = quantity * (subtotal + extraFee + commissionFee) - discount;
          return total.toLocaleString("vi-VN") + " đ";
        },
      },
    ],
    []
  );

  if (loading) {
    return <div className="px-3 py-2 text-center">Đang tải chi tiết phiếu chuyển...</div>;
  }

  if (!detail) {
    return <div className="px-3 py-2 text-center text-gray-500">Không tìm thấy thông tin phiếu chuyển</div>;
  }

  const order = detail;
  const statusColor = getStatusColor(order.status);
  const statusDisplayName = getStatusDisplayName(order.status);

  const totalQty = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0;
  const totalAmount = order.items?.reduce((sum, item) => {
    const itemTotal = ((item.unitPrice || 0) + (item.extraFee || 0) + (item.commissionFee || 0))  * (item.quantity || 0);
    return sum + itemTotal;
  }, 0) ?? 0;
  const totalExtraFee = order.items?.reduce((sum, item) => sum + (item.extraFee || 0), 0) ?? 0;
  const totalCommissionFee = order.items?.reduce((sum, item) => sum + (item.commissionFee || 0), 0) ?? 0;

  const infoTab: TabsProps["items"] = [
    {
      key: "info",
      label: "Thông tin",
      children: (
        <div className="bg-white p-4 rounded-md border">
          <Modal
            title="Xác nhận xóa phiếu chuyển"
            open={showDeleteConfirm}
            onOk={handleConfirmDelete}
            onCancel={handleCancelDelete}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            confirmLoading={deleteLoading}
            styles={{
              mask: { zIndex: 1000 },
              wrapper: { zIndex: 1001 }
            }}
          >
            <p>
              Bạn có chắc chắn muốn xóa phiếu chuyển `<strong>{order.code}</strong>`? 
              Hành động này không thể hoàn tác.
            </p>
          </Modal>

          {/* HEADER */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold flex items-center gap-2">
              {order.code} <Tag color={statusColor}>{statusDisplayName}</Tag>
            </div>
            <div className="text-sm text-gray-500">Kho đi: {order.fromWarehouseName}</div>
          </div>

          {/* Thông tin kho */}
          <div className="text-sm text-gray-600 mb-3">
            <span>
              Từ kho: <b>{order.fromWarehouseName}</b> → Đến kho: <b>{order.toWarehouseName}</b>
            </span>
          </div>

          {/* Thời gian */}
          <div className="text-sm text-gray-600 mb-3 flex justify-between items-center">
            <span>
              Thời gian: <b>{order.time ? new Date(order.time).toLocaleString('vi-VN') : "—"}</b>
            </span>
          </div>

          {/* TABLE ITEMS */}
          <div className="border rounded-md p-3 bg-white mb-3">
            <div className="flex gap-3 mb-2">
              <Input placeholder="Tìm mã hàng" className="max-w-[160px]" />
              <Input placeholder="Tìm tên hàng" className="max-w-[220px]" />
            </div>

            <Table<TransferItem>
              rowKey="id"
              columns={columns}
              dataSource={order.items || []}
              pagination={false}
              size="small"
              scroll={{ x: 1200 }}
            />

            {/* FOOTER GRID */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 mb-1">Ghi chú:</label>
                <textarea
                  className="rounded border w-full h-24 p-2 text-sm"
                  value={order.note || ""}
                  placeholder="Ghi chú..."
                  readOnly
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
                      {order.items?.length || 0}
                    </div>
                  </div>

                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Tổng tiền hàng:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {totalAmount.toLocaleString("vi-VN")} đ
                    </div>
                  </div>

                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Phí phụ thu:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {totalExtraFee.toLocaleString("vi-VN")} đ
                    </div>
                  </div>

                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Phí hoa hồng:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {totalCommissionFee.toLocaleString("vi-VN")} đ
                    </div>
                  </div>

                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Giảm giá:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {order.discountAmount?.toLocaleString("vi-VN") || "0"} đ
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
              <Button 
                className="flex items-center gap-1" 
                icon={<DeleteOutlined />}
                onClick={handleDeleteClick}
                loading={deleteLoading}
                danger
              >
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
              <Button className="flex items-center gap-1" icon={<SaveOutlined />}>
                Lưu
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