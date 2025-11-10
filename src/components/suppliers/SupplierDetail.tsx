"use client";

import { useEffect, useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Select,
  Tag,
  Input,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
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
} from "@ant-design/icons";
import type { Supplier, SupplierDebtHistory } from "@/types/supplier";
import { useSupplierStore } from "@/stores/useSupplierStore";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

/* -------------------- Helper format number -------------------- */
const formatNumber = (v?: number) => (v ?? 0).toLocaleString("vi-VN");
const formatDateForApi = (value: Dayjs | Date) => dayjs(value).format("YYYY-MM-DDTHH:mm:ss.SSS");

/* -------------------- Component chính -------------------- */
export default function SupplierDetail({ supplier }: { supplier: Supplier }) {
  const {
    detail,
    getById,
    isLoadingDetail,
    createTransaction,
    isSubmittingTransaction,
    deleteHistory,
    isDeletingHistory,
  } = useSupplierStore();
  const [transactionType, setTransactionType] = useState<string>("all");
  const [modalType, setModalType] = useState<"Custom" | "Payment" | null>(null);
  const [form] = Form.useForm();
  const [deletingHistoryId, setDeletingHistoryId] = useState<string | null>(null);

  const transactionTypeLabels: Record<string, string> = {
    Custom: "Điều chỉnh",
    Purchase: "Nhập hàng",
    Return: "Trả hàng",
    Payment: "Thanh toán",
  };

  const handleOpenModal = (type: "Custom" | "Payment") => {
    setModalType(type);
    form.setFieldsValue({
      transactionDate: dayjs(),
      amount: undefined,
      note: "",
    });
  };

  const handleCloseModal = () => {
    setModalType(null);
    form.resetFields();
  };

  const currentSupplier = detail ?? supplier;
  const supplierDebtId = currentSupplier.id ?? supplier.id;
  const disableActions =
    isLoadingDetail || !supplierDebtId || isDeletingHistory || isSubmittingTransaction;

  const handleDeleteHistory = async (history: SupplierDebtHistory) => {
    const historyId = history.id;
    if (!historyId) {
      message.error("Không xác định được mã giao dịch");
      return;
    }
    setDeletingHistoryId(historyId);
    try {
      await deleteHistory({
        supplierDebtId,
        historyId,
        filterType: transactionType,
      });
      message.success("Đã xoá giao dịch công nợ");
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Không thể xoá giao dịch");
      }
    } finally {
      setDeletingHistoryId(null);
    }
  };

  const handleFormSubmit = async (values: {
    transactionDate: Dayjs;
    amount: string;
    note?: string;
  }) => {
    if (!modalType) return;
    if (!supplierDebtId) {
      message.error("Không xác định được nhà cung cấp");
      return;
    }

    const transactionDate = values.transactionDate
      ? formatDateForApi(values.transactionDate)
      : undefined;

    if (!transactionDate) {
      message.error("Vui lòng chọn thời gian giao dịch");
      return;
    }

    try {
      await createTransaction({
        supplierDebtId,
        transactions: [
          {
            transactionType: modalType,
            transactionDate,
            amount: Number(values.amount || 0),
            note: values.note,
            createdAt: formatDateForApi(new Date()),
          },
        ],
        filterType: transactionType,
      });

      message.success("Cập nhật công nợ thành công");
      handleCloseModal();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Không thể cập nhật công nợ");
      }
    }
  };

  const status = currentSupplier.status ?? "Đang hoạt động";
  const isInactive = status === "Ngừng hoạt động";
  const creator =
    currentSupplier.creator && currentSupplier.creator.trim().length > 0
      ? currentSupplier.creator
      : "—";
  const createdAt = currentSupplier.createdAt
    ? new Date(currentSupplier.createdAt).toLocaleString("vi-VN")
    : "—";

  useEffect(() => {
    const type = transactionType === "all" ? undefined : transactionType;
    getById(supplier.id, type);
  }, [supplier.id, transactionType, getById]);

  const formatDateTime = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("vi-VN");
  };

  /* -------------------- Cấu hình bảng nợ -------------------- */
  const debtColumns: ColumnsType<SupplierDebtHistory> = [
    {
      title: "Ngày giao dịch",
      dataIndex: "transactionDate",
      width: 180,
      render: (v?: string) => formatDateTime(v),
    },
    {
      title: "Loại giao dịch",
      dataIndex: "transactionType",
      width: 160,
      render: (v?: string) => {
        if (!v) return "—";
        return transactionTypeLabels[v] ?? v;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      ellipsis: true,
      render: (v?: string) => v ?? "—",
    },
    {
      title: "Giá trị",
      dataIndex: "amount",
      align: "right",
      width: 140,
      render: (v?: number) => formatNumber(v),
    },
    {
      title: "Số dư trước",
      dataIndex: "balanceBefore",
      align: "right",
      width: 160,
      render: (v?: number) => formatNumber(v),
    },
    {
      title: "Số dư sau",
      dataIndex: "balanceAfter",
      align: "right",
      width: 160,
      render: (v?: number) => {
        const amount = v ?? 0;
        const isNegative = amount < 0;
        return (
          <span className={isNegative ? "text-red-600" : "text-green-600"}>
            {formatNumber(amount)}
          </span>
        );
      },
    },
    {
      title: "",
      dataIndex: "actions",
      width: 100,
      align: "center",
      render: (_: unknown, record) => {
        const historyId = record.id;
        const isDeleting = deletingHistoryId === historyId && isDeletingHistory;
        const disabled = !historyId || isDeletingHistory;

        return (
          <Popconfirm
            title="Xoá giao dịch?"
            description="Thao tác này không thể hoàn tác."
            okText="Xoá"
            cancelText="Hủy"
            okButtonProps={{ loading: isDeleting }}
            onConfirm={() => handleDeleteHistory(record)}
            disabled={disabled}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              disabled={disabled}
              loading={isDeleting}
            />
          </Popconfirm>
        );
      },
    },
  ];

  /* -------------------- Tab Thông tin -------------------- */
  const currentDebt = currentSupplier.currentDebt ?? currentSupplier.remainingDebt ?? 0;

  const infoTab = (
    <div className="bg-white rounded-md border border-gray-200 p-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3 mb-3">
        <div className="text-lg font-bold flex items-center gap-2">
          {currentSupplier.name}
          <Tag
            color={isInactive ? "red" : "green"}
            className="rounded"
          >
            {status}
          </Tag>
        </div>
        <div className="text-sm text-gray-500">
          Người tạo: <b>{creator}</b> | Ngày tạo:{" "}
          <b>{createdAt}</b>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="grid grid-cols-2 gap-x-10 gap-y-3 mb-4 text-sm">
        <div className="space-y-2">
          <div>
            <label className="text-gray-600 w-[150px] inline-block">
              Điện thoại:
            </label>
            <span className="font-medium">{currentSupplier.phone || "—"}</span>
          </div>
          <div>
            <label className="text-gray-600 w-[150px] inline-block">Địa chỉ:</label>
            <span className="font-medium italic text-gray-700">
              {currentSupplier.address || "Chưa có"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-gray-600 w-[180px] inline-block">Tổng mua:</label>
            <span className="font-semibold text-blue-600">
              {formatNumber(currentSupplier.totalPurchase)} ₫
            </span>
          </div>
          <div>
            <label className="text-gray-600 w-[180px] inline-block">Hàng lỗi:</label>
            <span className="font-semibold text-black">
              - {formatNumber(currentSupplier.returnAmount)} ₫
            </span>
          </div>
          <div>
            <label className="text-gray-600 w-[180px] inline-block">Đã trả nợ:</label>
            <span className="font-semibold text-black">
              - {formatNumber(currentSupplier.payAmount)} ₫
            </span>
          </div>
          <div>
            <label className="text-gray-600 w-[180px] inline-block">
              Nợ cần trả hiện tại:
            </label>
            <span
              className={
                currentDebt > 0
                  ? "font-semibold text-red-600"
                  : "font-semibold text-green-600"
              }
            >
              {formatNumber(currentDebt)} ₫
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
          Tất cả các giao dịch ({detail?.debtHistories?.length || 0})
        </div>
        <Select
          value={transactionType}
          className="w-[200px]"
          options={[
            { label: "Tất cả giao dịch", value: "all" },
            { label: transactionTypeLabels.Custom, value: "Custom" },
            { label: transactionTypeLabels.Purchase, value: "Purchase" },
            { label: transactionTypeLabels.Return, value: "Return" },
            { label: transactionTypeLabels.Payment, value: "Payment" },
          ]}
          onChange={(value) => setTransactionType(value)}
        />
      </div>

      <Table
        columns={debtColumns}
        dataSource={detail?.debtHistories || []}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        size="small"
        rowClassName="hover:bg-blue-50"
        scroll={{ x: 900 }}
        locale={{ emptyText: "Chưa có giao dịch nào" }}
        loading={isLoadingDetail}
        rowKey={(record) =>
          record.id || `${record.transactionDate ?? "unknown"}-${record.createdAt ?? "created"}`
        }
      />

      <div className="flex justify-end gap-2 mt-4">
        <Button
          icon={<ToolOutlined />}
          onClick={() => handleOpenModal("Custom")}
          disabled={disableActions}
        >
          Điều chỉnh
        </Button>
        <Button
          icon={<DollarOutlined />}
          type="primary"
          onClick={() => handleOpenModal("Payment")}
          disabled={disableActions}
        >
          Thanh toán
        </Button>
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

      <Modal
        open={modalType !== null}
        title={modalType ? `${transactionTypeLabels[modalType]} công nợ` : ""}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        confirmLoading={isSubmittingTransaction}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="transactionDate"
            label="Thời gian giao dịch"
            rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
          >
            <DatePicker showTime className="w-full" format="DD/MM/YYYY HH:mm" />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Giá trị"
            className="w-full"
            rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}
          >
            <InputNumber<string>
              min="0"
              className="!w-full"
              controls={false}
              stringMode
              placeholder="Nhập số tiền"
              formatter={value => {
                if (!value) return "";
                const numeric = value.replace(/[^\d]/g, "");
                if (!numeric) return "";
                return `${numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ₫`;
              }}
              parser={value => (value ? value.replace(/[^\d]/g, "") : "")}
            />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Nhập ghi chú" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
