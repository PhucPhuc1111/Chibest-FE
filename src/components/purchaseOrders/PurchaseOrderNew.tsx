"use client";

import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  DatePicker,
  Form,
  message,
  Empty,
} from "antd";
import type { TableProps } from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  CheckOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { usePurchaseOrderStore } from "@/stores/usePurchaseOrderStore";
import type { CreatePurchaseOrderPayload } from "@/types/purchaseOrder";
import dayjs from "dayjs";

interface ProductRow {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export default function PurchaseOrderNew() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { createOrder, isLoading } = usePurchaseOrderStore();
  const [products, setProducts] = useState<ProductRow[]>([]);

  const handleProductChange = (index: number, field: keyof ProductRow, value: any) => {
    const newList = [...products];
    newList[index] = { ...newList[index], [field]: value };

    if (["quantity", "unitPrice", "discount"].includes(field)) {
      const item = newList[index];
      newList[index].total =
        (item.quantity || 0) * (item.unitPrice || 0) - (item.discount || 0);
    }
    setProducts(newList);
  };

  const addProductRow = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        sku: "",
        productName: "",
        quantity: 0,
        unitPrice: 0,
        discount: 0,
        total: 0,
      },
    ]);
  };

  const columns: TableProps<ProductRow>["columns"] = [
    {
      title: "STT",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã hàng",
      dataIndex: "sku",
      width: 120,
      render: (value, record, index) => (
        <Input
          value={value}
          placeholder="Nhập mã hàng"
          onChange={(e) => handleProductChange(index, "sku", e.target.value)}
        />
      ),
    },
    {
      title: "Tên hàng",
      dataIndex: "productName",
      width: 220,
      render: (value, record, index) => (
        <Input
          value={value}
          placeholder="Nhập tên hàng"
          onChange={(e) =>
            handleProductChange(index, "productName", e.target.value)
          }
        />
      ),
    },
    {
      title: "ĐVT",
      width: 80,
      render: () => "Cái",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: 100,
      render: (value, record, index) => (
        <Input
          type="number"
          value={value}
          placeholder="0"
          onChange={(e) =>
            handleProductChange(index, "quantity", Number(e.target.value))
          }
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      width: 120,
      render: (value, record, index) => (
        <Input
          type="number"
          value={value}
          placeholder="0"
          onChange={(e) =>
            handleProductChange(index, "unitPrice", Number(e.target.value))
          }
        />
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      width: 100,
      render: (value, record, index) => (
        <Input
          type="number"
          value={value}
          placeholder="0"
          onChange={(e) =>
            handleProductChange(index, "discount", Number(e.target.value))
          }
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      width: 140,
      render: (_, record) => (
        <span>{record.total.toLocaleString("vi-VN")} đ</span>
      ),
    },
  ];

  const totalAmount = products.reduce((sum, p) => sum + p.total, 0);

  const handleSave = async (status: "Draft" | "Completed") => {
    try {
      const values = await form.validateFields();

      if (products.length === 0) {
        messageApi.warning("Vui lòng thêm ít nhất một sản phẩm!");
        return;
      }

      const payload: CreatePurchaseOrderPayload = {
        "invoice-code": `NH-${new Date().getFullYear()}-${Math.random()
          .toString(36)
          .substr(2, 5)
          .toUpperCase()}`,
        "order-date": new Date().toISOString(),
        "pay-method": "Tiền mặt",
        "sub-total": totalAmount,
        "discount-amount": products.reduce((s, i) => s + i.discount, 0),
        "paid": totalAmount,
        "note": values.note || "",
        "warehouse-id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "employee-id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "supplier-id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "purchase-order-details": products.map((p) => ({
          "quantity": p.quantity,
          "unit-price": p.unitPrice,
          "discount": p.discount,
          "re-fee": 0,
          "note": "",
          "product-id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        })),
      };

      const result = await createOrder(payload);
      if (result.success) {
        messageApi.success(
          `Phiếu nhập đã được ${
            status === "Draft" ? "lưu tạm" : "hoàn thành"
          } thành công!`
        );
        router.push("/purchaseOrders");
      } else messageApi.error(result.message || "Tạo phiếu nhập thất bại");
    } catch {
      messageApi.error("Vui lòng kiểm tra lại thông tin!");
    }
  };

  return (
    <>
      {contextHolder}
      <div className="bg-gray-50 p-3 min-h-screen">
        <div className="flex gap-4">
          {/* Left Table */}
          <div className="flex-1 bg-white rounded-md border border-gray-200">
            <div className="border-b px-4 py-2 flex justify-between items-center">
              <h2 className="font-semibold">Nhập hàng</h2>
              <Input
                placeholder="Tìm hàng hóa theo mã hoặc tên (F3)"
                className="w-1/3"
              />
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[450px]">
                <p className="text-gray-700 font-medium mb-1">
                  Thêm sản phẩm từ file excel
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  (Tải về file mẫu:
                  <a href="#" className="text-blue-500 ml-1">
                    Excel file
                  </a>
                  )
                </p>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={addProductRow}
                >
                  Chọn file dữ liệu
                </Button>
              </div>
            ) : (
              <div className="p-3">
                <Table
                  bordered
                  size="small"
                  rowKey="id"
                  columns={columns}
                  dataSource={products}
                  pagination={false}
                  scroll={{ x: 1000 }}
                />
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="w-[340px] bg-white border border-gray-200 rounded-md p-4 flex flex-col justify-between">
            <Form form={form} layout="vertical" className="space-y-2">
              <Form.Item label="Nhà cung cấp" name="supplier">
                <Select placeholder="Chọn nhà cung cấp">
                  <Select.Option value="Phúc">Phúc</Select.Option>
                  <Select.Option value="An">An</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Mã phiếu nhập" name="invoiceCode">
                <Input placeholder="Mã phiếu tự động" disabled />
              </Form.Item>

              <Form.Item label="Trạng thái" name="status" initialValue="Phiếu tạm">
                <Input value="Phiếu tạm" disabled />
              </Form.Item>

              <Form.Item label="Ngày nhập" name="orderDate" initialValue={dayjs()}>
                <DatePicker
                  className="w-full"
                  format="DD/MM/YYYY HH:mm"
                  showTime
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>

              <div className="pt-1 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Tổng tiền hàng</span>
                  <span>{totalAmount.toLocaleString("vi-VN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Giảm giá</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span>Chi phí nhập trả NCC</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Cần trả nhà cung cấp</span>
                  <span>{totalAmount.toLocaleString("vi-VN")}</span>
                </div>
              </div>

              <Form.Item label="Ghi chú" name="note">
                <Input.TextArea rows={2} placeholder="Ghi chú" />
              </Form.Item>
            </Form>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                icon={<SaveOutlined />}
                onClick={() => handleSave("Draft")}
                loading={isLoading}
                className="flex-1"
              >
                Lưu tạm
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleSave("Completed")}
                loading={isLoading}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                Hoàn thành
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
