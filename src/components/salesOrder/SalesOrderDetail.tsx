"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  Tabs, Table, Input, Tag, Button, Select, DatePicker, Modal, Tooltip, 
  Form, InputNumber, message 
} from "antd";
import type { TabsProps, TableProps } from "antd";
import type { 
  PurchaseOrderItem, 
  // UpdatePurchaseOrderPayload,
  PurchaseOrderStatus,
  UpdatePurchaseOrderPricesPayload 
} from "@/types/purchaseOrder";
import { usePurchaseOrderStore } from "@/stores/usePurchaseOrderStore";
import {
  DeleteOutlined,
  CopyOutlined,
  ExportOutlined,
  SaveOutlined,
  PrinterOutlined,
  UserOutlined,
  CalendarOutlined,
  UploadOutlined,
  MailOutlined,
  QuestionCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

interface PurchaseOrderDetailProps {
  id: string;
  onDeleted?: (deletedId: string) => void;
  onStatusUpdated?: (id: string, newStatus: PurchaseOrderStatus) => void;
}

interface PriceSettingForm {
  items: Array<{
    id: string;
    unitPrice: number;
    discount: number;
    reFee: number;
    note: string;
    actualQuantity: number;
  }>;
}

// Thêm status options
const STATUS_OPTIONS = [
  { value: "Draft", label: "Nháp" },
  { value: "Submitted", label: "Đã gửi" },
  { value: "Received", label: "Đã nhận" },
  { value: "Cancelled", label: "Đã hủy" },
];

export default function SalesOrderDetail({ id, onDeleted, onStatusUpdated }: PurchaseOrderDetailProps) {
  const { 
    detail, 
    getById, 
    deleteOrder, 
    getAll, 
    updateOrderStatus, 
    updateOrderPrices ,
  } = usePurchaseOrderStore();
  
  // const [loading, setLoading] = useState(false);
   const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPriceSetting, setShowPriceSetting] = useState(false);
  const [priceForm] = Form.useForm();
  const [savingPrice, setSavingPrice] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PurchaseOrderStatus>();

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
  }, [detail, getById, id]);
  useEffect(() => {
    if (detail) {
      setSelectedStatus(detail.status);
    }
  }, [detail]);
  const handleOpenPriceSetting = () => {
    if (!detail?.items) return;
    
    const initialValues: PriceSettingForm = {
      items: detail.items.map(item => ({
        id: item.id,
        unitPrice: item.unitPrice || 0,
        discount: item.discount || 0,
        reFee: item.reFee || 0,
        note: item.note || "",
        actualQuantity: item.actualQuantity || item.quantity || 0
      }))
    };
    
    priceForm.setFieldsValue(initialValues);
    setShowPriceSetting(true);
  };
  const handleSavePriceSetting = async (values: PriceSettingForm) => {
    if (!detail) return;
    
    setSavingPrice(true);
    try {
      const newSubTotal = values.items.reduce((sum, item) => {
        const itemTotal = (item.actualQuantity || 0) * (item.unitPrice || 0);
        return sum + itemTotal;
      }, 0);

      const newDiscountAmount = values.items.reduce((sum, item) => {
        return sum + (item.discount || 0);
      }, 0);

      const payload: UpdatePurchaseOrderPricesPayload = {
        "pay-method": detail.payMethod || "Cash",
        "sub-total": newSubTotal,
        "discount-amount": newDiscountAmount,
        "paid": newSubTotal - newDiscountAmount,
        "purchase-order-details": values.items.map(item => ({
          id: item.id,
          "unit-price": item.unitPrice,
          discount: item.discount,
          "re-fee": item.reFee,
          note: item.note,
          "actual-quantity": item.actualQuantity
        }))
      };

      const result = await updateOrderPrices(detail.id, payload);
      if (result.success) {
        message.success("Thiết lập giá thành công!");
        setShowPriceSetting(false);
        // Reload detail để hiển thị data mới
        await getById(id);
      }
    } catch (error: unknown) {
      message.error("Lỗi khi thiết lập giá");
      console.log(error);
    } finally {
      setSavingPrice(false);
    }
  };

  // Xử lý hiển thị confirm delete
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Xử lý xác nhận xóa
  const handleConfirmDelete = async () => {
    if (!detail) return;
    
    setDeleteLoading(true);
    try {
      const result = await deleteOrder(detail.id);
      
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

  // Xử lý hủy xóa
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Xử lý cập nhật status
  const handleStatusUpdate = async () => {
    if (!detail || !selectedStatus || selectedStatus === detail.status) {
      setEditingStatus(false);
      return;
    }

    setStatusLoading(true);
    try {
      const result = await updateOrderStatus(detail.id, selectedStatus);
      
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

  const handleStatusChange = (value: PurchaseOrderStatus) => {
    setSelectedStatus(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "blue";
      case "Submitted": return "orange"; 
      case "Received": return "green";
      case "Cancelled": return "red";
      default: return "default";
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "Draft": return "Nháp";
      case "Submitted": return "Đã gửi";
      case "Received": return "Đã nhận";
      case "Cancelled": return "Đã hủy";
      default: return status;
    }
  };

  const columns: TableProps<PurchaseOrderItem>["columns"] = useMemo(
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
        width: 140,
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
        title: (
          <span className="flex items-center justify-end gap-1">
            Giảm tái mua
            <Tooltip 
              title="Phí giảm giá cho từng sản phẩm mua lại" 
              placement="top"
            >
              <span style={{ color: '#1890ff', cursor: 'help', fontWeight: 'bold', fontSize: '14px' }}>
                <QuestionCircleOutlined />
              </span>
            </Tooltip>
          </span>
        ),
        dataIndex: "reFee",
        align: "right",
        width: 160,
        render: (v: number) => (v || 0).toLocaleString("vi-VN") + " đ",
      },
      {
        title: "Thành tiền",
        align: "right",
        width: 160,
        render: (_: unknown, record: PurchaseOrderItem) => {
          const total = (record.quantity || 0) * ((record.unitPrice || 0) - (record.reFee || 0)) - (record.discount || 0);
          return total.toLocaleString("vi-VN") + " đ";
        },
      },
    ],
    []
  );

  if (loading) {
    return <div className="px-3 py-2 text-center">Đang tải chi tiết phiếu nhập...</div>;
  }

  if (!detail) {
    return <div className="px-3 py-2 text-center text-gray-500">Không tìm thấy thông tin phiếu nhập</div>;
  }

  const order = detail;
  const statusColor = getStatusColor(order.status);
  const statusDisplayName = getStatusDisplayName(order.status);

  const totalQty = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0;
  const totalAmount = order.items?.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
    return sum + itemTotal;
  }, 0) ?? 0;

  const infoTab: TabsProps["items"] = [
    {
      key: "info",
      label: "Thông tin",
      children: (
        <div className="bg-white p-4 rounded-md border">
          {/* Modal xác nhận xóa */}
          <Modal
            title="Xác nhận xóa phiếu nhập"
            open={showDeleteConfirm}
            onOk={handleConfirmDelete}
            onCancel={handleCancelDelete}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            confirmLoading={deleteLoading}
          >
            <p>
              Bạn có chắc chắn muốn xóa phiếu nhập `<strong>{order.code}</strong>`? 
              Hành động này không thể hoàn tác.
            </p>
          </Modal>

          {/* Modal thiết lập giá */}
          <Modal
            title="Thiết lập giá sản phẩm"
            open={showPriceSetting}
            onCancel={() => setShowPriceSetting(false)}
            footer={[
              <Button key="cancel" onClick={() => setShowPriceSetting(false)}>
                Hủy
              </Button>,
              <Button 
                key="save" 
                type="primary" 
                loading={savingPrice}
                onClick={() => priceForm.submit()}
                icon={<SaveOutlined />}
              >
                Lưu thiết lập
              </Button>,
            ]}
            width={800}
          >
            <Form
              form={priceForm}
              layout="vertical"
              onFinish={handleSavePriceSetting}
            >
              <Form.List name="items">
                {(fields) => (
                  <div className="max-h-96 overflow-y-auto">
                    <Table
                      size="small"
                      pagination={false}
                      dataSource={fields}
                      rowKey={(record) => record.key}
                      columns={[
                        {
                          title: "Mã hàng",
                          width: 120,
                          render: (_, __, index) => order.items?.[index]?.sku || "—"
                        },
                        {
                          title: "Tên hàng", 
                          width: 200,
                          render: (_, __, index) => order.items?.[index]?.productName || "—"
                        },
                        {
                          title: "Đơn giá",
                          width: 120,
                          render: (_, __, index) => (
                            <Form.Item
                              name={[index, "unitPrice"]}
                              style={{ margin: 0 }}
                            >
                              <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value: string | undefined) => {
                                  if (!value) return 0;
                                  return parseFloat(value.replace(/\$\s?|(,*)/g, ''));
                                }}
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Giảm giá",
                          width: 100,
                          render: (_, __, index) => (
                            <Form.Item
                              name={[index, "discount"]}
                              style={{ margin: 0 }}
                            >
                              <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Phí tái",
                          width: 100,
                          render: (_, __, index) => (
                            <Form.Item
                              name={[index, "reFee"]}
                              style={{ margin: 0 }}
                            >
                              <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "SL thực nhận",
                          width: 100,
                          render: (_, __, index) => (
                            <Form.Item
                              name={[index, "actualQuantity"]}
                              style={{ margin: 0 }}
                            >
                              <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Ghi chú",
                          width: 150,
                          render: (_, __, index) => (
                            <Form.Item
                              name={[index, "note"]}
                              style={{ margin: 0 }}
                            >
                              <Input placeholder="Ghi chú" />
                            </Form.Item>
                          ),
                        },
                      ]}
                    />
                  </div>
                )}
              </Form.List>
            </Form>
          </Modal>

          {/* HEADER */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-lg font-semibold flex items-center gap-2 mb-2">
                {order.code}
                {!editingStatus && (
                  <Tag color={statusColor}>{statusDisplayName}</Tag>
                )}
              </div>
              <div className="text-sm text-gray-600">
                Chi nhánh nhập: <b>{order.branchName}</b>
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
                    {statusDisplayName} <EditOutlined className="ml-1" />
                  </Tag>
                </>
              )}
            </div>
          </div>

          {/* Người tạo + thông tin nhập */}
          <div className="text-sm text-gray-600 mb-3 flex justify-between items-center">
            <span>
              Người tạo: <b>{order.employeeName}</b>
            </span>
            <span>
              Thời gian: <b>{order.time ? new Date(order.time).toLocaleString('vi-VN') : "—"}</b>
            </span>
          </div>

          {/* --- Thông tin nhập hàng / NCC --- */}
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-700 mb-4">
            <div>
              <label className="block text-gray-600 mb-1">Tên NCC:</label>
              <Input
                value={order.supplierName || ""}
                placeholder="Nhập tên nhà cung cấp"
                className="h-8 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Người nhập:</label>
              <Select
                className="w-full text-sm"
                suffixIcon={<UserOutlined />}
                value={order.employeeName || undefined}
                options={[
                  { label: order.employeeName || "Không xác định", value: order.employeeName || "unknown" },
                ]}
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Ngày nhập:</label>
              <DatePicker
                className="w-full text-sm"
                suffixIcon={<CalendarOutlined />}
                format="DD/MM/YYYY HH:mm"
                showTime
                value={order.time ? dayjs(order.time) : null}
                disabled
              />
            </div>
          </div>

          {/* TABLE ITEMS */}
          <div className="border rounded-md p-3 bg-white mb-3">
            <div className="flex gap-3 mb-2">
              <Input placeholder="Tìm mã hàng" className="max-w-[160px]" />
              <Input placeholder="Tìm tên hàng" className="max-w-[220px]" />
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={handleOpenPriceSetting}
              >
                Thiết lập giá
              </Button>
            </div>

            <Table<PurchaseOrderItem>
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
                      Giảm giá:
                      <Tooltip 
                        title="Phí giảm giá = (số lượng x giảm tái mua + giá giảm)" 
                        placement="top"
                      >
                        <span style={{ color: '#2c2f31', cursor: 'help', fontWeight: 'bold', fontSize: '14px' }}>
                          <QuestionCircleOutlined />
                        </span>
                      </Tooltip>
                    </label>
                    <div className="text-right font-medium text-gray-800 flex-1">
                      {order.discountAmount?.toLocaleString("vi-VN") || "0"} đ
                    </div>
                  </div>

                  <div className="flex">
                    <label className="text-gray-600 w-[170px] text-right pr-2">
                      Cần trả NCC:
                    </label>
                    <div className="text-right font-semibold text-gray-900 flex-1">
                      {order.paid?.toLocaleString("vi-VN") || "0"} đ
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
              <Button className="flex items-center gap-1" icon={<UploadOutlined />}>
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