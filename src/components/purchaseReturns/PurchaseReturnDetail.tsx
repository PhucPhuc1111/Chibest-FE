// src/components/purchaseReturns/PurchaseReturnDetail.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, Table, Input, Tag, Button, Modal, Select, message } from "antd";
import type { TabsProps, TableProps } from "antd";
import type { 
  PurchaseReturnItem, 
  PurchaseReturnStatus 
} from "@/types/purchaseReturn";
import { 
  STATUS_MAPPING, 
  STATUS_OPTIONS, 
  getStatusColor 
} from "@/types/purchaseReturn";
import { usePurchaseReturnsStore } from "@/stores/usePurchaseReturnStore";
import {
  DeleteOutlined,
  CopyOutlined,
  ExportOutlined,
  SaveOutlined,
  PrinterOutlined,
  MailOutlined,
  EditOutlined,
} from "@ant-design/icons";

interface PurchaseReturnDetailProps {
  id: string;
  onDeleted?: (deletedId: string) => void;
  onStatusUpdated?: (id: string, newStatus: PurchaseReturnStatus) => void;
}

export default function PurchaseReturnDetail({ id, onDeleted, onStatusUpdated }: PurchaseReturnDetailProps) {
  const { detail, getById, deleteReturn, getAll, updateReturnStatus } = usePurchaseReturnsStore();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PurchaseReturnStatus>();

  useEffect(() => {
    const loadDetail = async () => {
      if (!detail || detail.id !== id) {
        setLoading(true);
        const result = await getById(id);
        setLoading(false);
        if (!result.success && result.message) {
          message.error(result.message);
        }
      }
    };
    loadDetail();
  }, [id, detail, getById]);

  // Reset selected status when detail changes
  useEffect(() => {
    if (detail) {
      setSelectedStatus(detail.status);
    }
  }, [detail]);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!detail) return;
    
    setDeleteLoading(true);
    try {
      const result = await deleteReturn(detail.id);
      
      if (result.success) {
        await getAll();
        if (onDeleted) {
          onDeleted(detail.id);
        }
        setShowDeleteConfirm(false);
      } 
    } catch {
      // Error handled in store
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleStatusUpdate = async () => {
    if (!detail || !selectedStatus || selectedStatus === detail.status) {
      setEditingStatus(false);
      return;
    }

    setStatusLoading(true);
    try {
      const result = await updateReturnStatus(detail.id, selectedStatus);
      
      if (result.success) {
        setEditingStatus(false);
        if (onStatusUpdated) {
          onStatusUpdated(detail.id, selectedStatus);
        }
      }
    } catch {
      // Error handled in store
    } finally {
      setStatusLoading(false);
    }
  };

  const handleStatusChange = (value: PurchaseReturnStatus) => {
    setSelectedStatus(value);
  };

  const currentStatusLabel = detail ? STATUS_MAPPING[detail.status] : "";
  const statusColor = detail ? getStatusColor(detail.status) : "default";

  const columns: TableProps<PurchaseReturnItem>["columns"] = useMemo(
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
        width: 340,
        render: (name: string) => name || "—"
      },
      { 
        title: "Số lượng", 
        dataIndex: "quantity", 
        align: "center", 
        width: 120,
        render: (qty: number) => qty || 0
      },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        align: "right",
        width: 140,
        render: (v: number) => (v || 0).toLocaleString("vi-VN") + " đ",
      },
      {
        title: "Giá trả",
        dataIndex: "returnPrice",
        align: "right",
        width: 140,
        render: (v: number) => (v || 0).toLocaleString("vi-VN") + " đ",
      },
      {
        title: "Mã container",
        dataIndex: "containerCode",
        width: 140,
        render: (code: string) => code || "—"
      },
      {
        title: "Thành tiền",
        align: "right",
        width: 160,
        render: (_: unknown, record: PurchaseReturnItem) => {
          const total = (record.quantity || 0) * (record.returnPrice || 0);
          return total.toLocaleString("vi-VN") + " đ";
        },
      },
    ],
    []
  );

  if (loading) {
    return <div className="px-3 py-2 text-center">Đang tải chi tiết phiếu trả...</div>;
  }

  if (!detail) {
    return <div className="px-3 py-2 text-center text-gray-500">Không tìm thấy thông tin phiếu trả</div>;
  }

  const order = detail;

  const totalQty = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0;
  const totalAmount = order.items?.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.returnPrice || 0);
    return sum + itemTotal;
  }, 0) ?? 0;

  const infoTab: TabsProps["items"] = [
    {
      key: "info",
      label: "Thông tin",
      children: (
        <div className="bg-white p-4 rounded-md border">
          <Modal
            title="Xác nhận xóa phiếu trả"
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
              Bạn có chắc chắn muốn xóa phiếu trả `<strong>{order.code}</strong>`? 
              Hành động này không thể hoàn tác.
            </p>
          </Modal>

          {/* HEADER với Status Selector */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-lg font-semibold flex items-center gap-2 mb-2">
                {order.code}
                {!editingStatus && (
                  <Tag color={statusColor}>{currentStatusLabel}</Tag>
                )}
              </div>
              <div className="text-sm text-gray-600">
                Chi nhánh trả: <b>{order.fromBranchName}</b>
              </div>
            </div>
            
            {/* Status Selector */}
            <div className="flex items-center gap-2">
              {editingStatus ? (
                <>
                  <Select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    options={STATUS_OPTIONS}
                    style={{ width: 150 }}
                    placeholder="Chọn trạng thái"
                  />
                  <Button 
                    type="primary" 
                    size="small"
                    loading={statusLoading}
                    onClick={handleStatusUpdate}
                  >
                    Lưu
                  </Button>
                  <Button 
                    size="small"
                    onClick={() => {
                      setEditingStatus(false);
                      setSelectedStatus(order.status);
                    }}
                    disabled={statusLoading}
                  >
                    Hủy
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-600 mr-2">Trạng thái:</span>
                  <Tag color={statusColor} className="cursor-pointer" onClick={() => setEditingStatus(true)}>
                    {currentStatusLabel} <EditOutlined className="ml-1" />
                  </Tag>
                </>
              )}
            </div>
          </div>

          {/* Thông tin kho */}
          <div className="text-sm text-gray-600 mb-3">
            <span>
              Từ chi nhánh: <b>{order.fromBranchName}</b> → Đến: <b>{order.toBranchName}</b>
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

            <Table<PurchaseReturnItem>
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
                      Tổng tiền trả:
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {totalAmount.toLocaleString("vi-VN")} đ
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