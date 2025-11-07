"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Tabs,
  Table,
  Select,
  Descriptions,
  Typography,
  Button,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  Input,
  message,
} from "antd";
import type { TabsProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useBranchDebtStore } from "@/stores/useBranchDebtStore";
import type {
  BranchDebtHistory,
  BranchDebtListItem,
  BranchDebtTransactionType,
} from "@/types/branch";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

const { Title, Text } = Typography;

const formatNumber = (value?: number) => (value ?? 0).toLocaleString("vi-VN");

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("vi-VN");
};

const transactionTypeLabels: Record<string, string> = {
  all: "Tất cả giao dịch",
  TransferIn: "Chuyển đến",
  TransferOut: "Chuyển đi",
  Return: "Hoàn trả",
  Custom: "Điều chỉnh",
};

const formatDateForApi = (value: Dayjs | Date) => dayjs(value).format("YYYY-MM-DDTHH:mm:ss.SSS");

export default function BranchDebtDetail({
  branch,
}: {
  branch: BranchDebtListItem;
}) {
  const {
    detail,
    getById,
    isLoadingDetail,
    createTransaction,
    isSubmittingTransaction,
  } = useBranchDebtStore();
  const [transactionType, setTransactionType] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTransactionType, setModalTransactionType] = useState<BranchDebtTransactionType>(
    "TransferIn"
  );
  const [form] = Form.useForm();

  const currentBranch =
    detail && detail.id === branch.id ? detail : branch;

  useEffect(() => {
    getById(branch.id, transactionType === "all" ? undefined : transactionType);
  }, [branch.id, transactionType, getById]);

  const handleOpenModal = (type: BranchDebtTransactionType) => {
    setModalTransactionType(type);
    form.setFieldsValue({
      transactionType: type,
      transactionDate: dayjs(),
      amount: undefined,
      note: "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFormSubmit = async (values: {
    transactionType: BranchDebtTransactionType;
    transactionDate: Dayjs;
    amount: string;
    note?: string;
  }) => {
    if (!branch.id) {
      message.error("Không xác định được chi nhánh");
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
        branchDebtId: branch.id,
        transactions: [
          {
            transactionType: values.transactionType,
            transactionDate,
            amount: Number(values.amount || 0),
            note: values.note,
            createdAt: formatDateForApi(new Date()),
          },
        ],
        filterType: transactionType === "all" ? undefined : transactionType,
      });

      message.success("Cập nhật công nợ chi nhánh thành công");
      handleCloseModal();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Không thể cập nhật công nợ");
      }
    }
  };

  const debtColumns: ColumnsType<BranchDebtHistory> = useMemo(
    () => [
      {
        title: "Ngày giao dịch",
        dataIndex: "transactionDate",
        width: 180,
        render: (value?: string) => formatDateTime(value),
      },
      {
        title: "Loại giao dịch",
        dataIndex: "transactionType",
        width: 160,
        render: (value?: string) => {
          if (!value) return "—";
          return transactionTypeLabels[value] ?? value;
        },
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        ellipsis: true,
        render: (value?: string) => value ?? "—",
      },
      {
        title: "Giá trị",
        dataIndex: "amount",
        align: "right",
        width: 140,
        render: (value?: number) => formatNumber(value),
      },
      {
        title: "Số dư trước",
        dataIndex: "balanceBefore",
        align: "right",
        width: 160,
        render: (value?: number) => formatNumber(value),
      },
      {
        title: "Số dư sau",
        dataIndex: "balanceAfter",
        align: "right",
        width: 160,
        render: (value?: number) => formatNumber(value),
      },
    ],
    []
  );

  const infoTab = (
    <div className="bg-white rounded-md border border-gray-200 p-4">
      <div className="flex justify-between items-center border-b pb-3 mb-3">
        <Title level={4} className="!mb-0">
          {currentBranch.name}
        </Title>
        <Text type="secondary">Cập nhật: {formatDateTime(currentBranch.lastUpdated)}</Text>
      </div>

      <Descriptions column={2} size="small" labelStyle={{ width: 180 }}>
        <Descriptions.Item label="Email">
          {currentBranch.email || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Giao dịch gần nhất">
          {formatDateTime(currentBranch.lastTransactionDate)}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng nợ">
          {formatNumber(currentBranch.totalDebt)} ₫
        </Descriptions.Item>
        <Descriptions.Item label="Đã trả">
          {formatNumber(currentBranch.paidAmount)} ₫
        </Descriptions.Item>
        <Descriptions.Item label="Hàng trả">
          {formatNumber(currentBranch.returnAmount)} ₫
        </Descriptions.Item>
        <Descriptions.Item label="Nợ cần trả">
          <Text strong>{formatNumber(currentBranch.remainingDebt)} ₫</Text>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  const debtTab = (
    <div className="bg-white rounded-md border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-3">
        <Text type="secondary">
          Tất cả giao dịch ({currentBranch.debtHistories?.length ?? 0})
        </Text>
        <Select
          value={transactionType}
          className="w-[220px]"
          options={[
            { label: transactionTypeLabels.all, value: "all" },
            { label: transactionTypeLabels.TransferIn, value: "TransferIn" },
            { label: transactionTypeLabels.TransferOut, value: "TransferOut" },
            { label: transactionTypeLabels.Return, value: "Return" },
            { label: transactionTypeLabels.Custom, value: "Custom" },
          ]}
          onChange={(value) => setTransactionType(value)}
        />
      </div>

      <Table
        columns={debtColumns}
        dataSource={currentBranch.debtHistories || []}
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
        <Button onClick={() => handleOpenModal("TransferIn")}>Chuyển đến</Button>
        <Button onClick={() => handleOpenModal("TransferOut")}>Chuyển đi</Button>
        <Button onClick={() => handleOpenModal("Return")}>Hoàn trả</Button>
        <Button type="primary" onClick={() => handleOpenModal("Custom")}>
          Điều chỉnh
        </Button>
      </div>
    </div>
  );

  const items: TabsProps["items"] = [
    { key: "info", label: "Thông tin", children: infoTab },
    { key: "debts", label: "Công nợ chi nhánh", children: debtTab },
  ];

  return (
    <div className="mt-2">
      <Tabs defaultActiveKey="info" items={items} />

      <Modal
        open={isModalOpen}
        title={transactionTypeLabels[modalTransactionType] + " công nợ"}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        confirmLoading={isSubmittingTransaction}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="transactionType"
            label="Loại giao dịch"
            initialValue={modalTransactionType}
            rules={[{ required: true, message: "Vui lòng chọn loại giao dịch" }]}
          >
            <Select
              options={[
                { label: transactionTypeLabels.TransferIn, value: "TransferIn" },
                { label: transactionTypeLabels.TransferOut, value: "TransferOut" },
                { label: transactionTypeLabels.Return, value: "Return" },
                { label: transactionTypeLabels.Custom, value: "Custom" },
              ]}
              onChange={(value) =>
                setModalTransactionType(value as BranchDebtTransactionType)
              }
            />
          </Form.Item>

          <Form.Item
            name="transactionDate"
            label="Thời gian giao dịch"
            rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
            initialValue={dayjs()}
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
              formatter={(value) => {
                if (!value) return "";
                const numeric = value.replace(/[^\d]/g, "");
                if (!numeric) return "";
                return `${numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ₫`;
              }}
              parser={(value) => (value ? value.replace(/[^\d]/g, "") : "")}
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

