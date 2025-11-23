// src/components/salesPlans/modals/ModalCreateSalesPlan.tsx
"use client";

import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Button,
  message,
} from "antd";
import { useState, useEffect, useRef } from "react";
import dayjs from 'dayjs';
import ProductImageUploader from "../../products/components/ProductImageUploader";
import { useFileStore } from "@/stores/useFileStore";

interface SalesPlanProduct {
  id: string;
  sku: string;
  "product-name": string;
  "avatar-url": string | null;
  "sample-type": string;
  "delivery-date": string;
  "sample-quantity": number;
  "total-quantity": number;
  "finalize-date": string;
  status: string;
  notes: string;
  "supplier-name": string;
  "cost-price": number;
  "selling-price": number;
  "stock-quantity"?: number;
  "brand"?: string;
  "inventory-location"?: string;
  "weight"?: number;
}

interface ModalCreateSalesPlanProps {
  open: boolean;
  onClose: () => void;
  productData?: SalesPlanProduct | null;
  isUpdate?: boolean;
}

interface FormValues {
  sku: string;
  "product-name": string;
  "sample-type": string;
  "delivery-date": dayjs.Dayjs;
  "sample-quantity": number;
  "total-quantity": number;
  "finalize-date": dayjs.Dayjs;
  status: string;
  notes: string;
  "supplier-name": string;
  "cost-price": number;
  "selling-price": number;
  "stock-quantity": number;
  "brand": string;
  "inventory-location": string;
  "weight": number;
}

export default function ModalCreateSalesPlan({
  open,
  onClose,
  productData = null,
  isUpdate = false,
}: ModalCreateSalesPlanProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [sku, setSku] = useState("");
  const formSubmittedRef = useRef(false);
  const { uploadImage } = useFileStore();

  useEffect(() => {
    if (open) {
      form.resetFields();
      formSubmittedRef.current = false;

      if (isUpdate && productData) {
        // Pre-fill data cho update
        setSku(productData.sku);
        setAvatarUrl(productData["avatar-url"] || "");
        
        setTimeout(() => {
          form.setFieldsValue({
            sku: productData.sku,
            "product-name": productData["product-name"],
            "sample-type": productData["sample-type"],
            "delivery-date": productData["delivery-date"] ? dayjs(productData["delivery-date"]) : null,
            "sample-quantity": productData["sample-quantity"],
            "total-quantity": productData["total-quantity"],
            "finalize-date": productData["finalize-date"] ? dayjs(productData["finalize-date"]) : null,
            status: productData.status,
            notes: productData.notes,
            "supplier-name": productData["supplier-name"],
            "cost-price": productData["cost-price"],
            "selling-price": productData["selling-price"],
            "stock-quantity": productData["stock-quantity"] || 0,
            "brand": productData["brand"] || "",
            "inventory-location": productData["inventory-location"] || "",
            "weight": productData["weight"] || 0,
          });
        }, 0);
      } else {
        // Set giá trị mặc định cho tạo mới
        setSku("");
        setAvatarUrl("");
        form.setFieldsValue({
          status: "Unavailable",
          "sample-quantity": 0,
          "total-quantity": 0,
          "cost-price": 0,
          "selling-price": 0,
          "stock-quantity": 0,
          "weight": 0,
        });
      }
    }
  }, [open, productData, isUpdate, form]);

  const handleImageUpload = async (files: File[]): Promise<string[]> => {
    try {
      if (!sku.trim()) {
        message.warning("Vui lòng nhập SKU trước khi upload ảnh");
        return [];
      }
      
      const file = files[0];
      const imageUrl = await uploadImage(file, sku, "sales-plan");
      if (imageUrl) {
        setAvatarUrl(imageUrl);
        message.success("Upload ảnh thành công");
        return [imageUrl];
      }

      return [];
    } catch (error) {
      console.error("Upload image error:", error);
      message.error("Upload ảnh thất bại");
      return [];
    }
  };

  const handleSubmit = async (values: FormValues) => {
    if (formSubmittedRef.current) return;
    formSubmittedRef.current = true;
    setLoading(true);

    try {
      // Format dates
      const formattedData = {
        ...values,
        "avatar-url": avatarUrl,
        "delivery-date": values["delivery-date"] ? values["delivery-date"].format('YYYY-MM-DD') : null,
        "finalize-date": values["finalize-date"] ? values["finalize-date"].format('YYYY-MM-DD') : null,
      };

      console.log("Submitting sales plan data:", formattedData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success(isUpdate ? "Cập nhật kế hoạch thành công" : "Tạo kế hoạch thành công");
      onClose();
    } catch (error) {
      console.error(`Error ${isUpdate ? 'updating' : 'creating'} sales plan:`, error);
      message.error(isUpdate ? "Cập nhật kế hoạch thất bại" : "Tạo kế hoạch thất bại");
    } finally {
      setLoading(false);
      formSubmittedRef.current = false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const SAMPLE_TYPE_OPTIONS = [
    { value: "Hàng tái", label: "Hàng tái" },
    { value: "Mẫu hình", label: "Mẫu hình" },
    { value: "Mẫu tái", label: "Mẫu tái" },
    { value: "Mẫu sống", label: "Mẫu sống" },
  ];

  const SUPPLIER_OPTIONS = [
    { value: "NCC Phuc Le", label: "NCC Phuc Le" },
    { value: "NCC Viet", label: "NCC Viet" },
    { value: "NCC Hoang", label: "NCC Hoang" },
    { value: "NCC Vlus", label: "NCC Vlus" },
  ];

  const STATUS_OPTIONS = [
    { value: "Unavailable", label: "Không khả dụng" },
    { value: "Available", label: "Khả dụng" },
    { value: "Pending", label: "Đang chờ" },
  ];

  return (
    <Modal
      title={isUpdate ? "Cập nhật kế hoạch" : "Tạo kế hoạch mới"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 48 }}
      maskClosable={false}
      zIndex={100}
      styles={{
        mask: { zIndex: 99 },
        body: {
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
          padding: 0,
          scrollbarGutter: "stable",
          background: "#fff",
        },
      }}
    >
      {/* Hiển thị thông báo nếu đang update */}
      {isUpdate && productData && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 m-4 rounded-md">
          <div className="text-sm text-yellow-800">
            <strong>Đang cập nhật sản phẩm:</strong> {productData["product-name"]} (SKU: {productData.sku})
          </div>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="p-4"
        initialValues={{
          "sample-quantity": 0,
          "total-quantity": 0,
          "cost-price": 0,
          "selling-price": 0,
          "stock-quantity": 0,
          "weight": 0,
          status: "Unavailable",
        }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Mã SKU"
                name="sku"
                rules={[{ required: true, message: "Vui lòng nhập mã SKU" }]}
              >
                <Input 
                  placeholder="Nhập mã SKU" 
                  onChange={(e) => setSku(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Tên sản phẩm"
                name="product-name"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>

              <Form.Item
                label="Loại mẫu"
                name="sample-type"
                rules={[{ required: true, message: "Vui lòng chọn loại mẫu" }]}
              >
                <Select
                  placeholder="Chọn loại mẫu"
                  options={SAMPLE_TYPE_OPTIONS}
                />
              </Form.Item>

              <Form.Item
                label="Nhà cung cấp"
                name="supplier-name"
                rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp" }]}
              >
                <Select
                  placeholder="Chọn nhà cung cấp"
                  options={SUPPLIER_OPTIONS}
                />
              </Form.Item>

              <Form.Item
                label="Ngày giao mẫu"
                name="delivery-date"
              >
                <DatePicker 
                  format="DD/MM/YYYY"
                  className="w-full"
                  placeholder="Chọn ngày giao mẫu"
                />
              </Form.Item>

              <Form.Item
                label="Ngày chốt số lượng"
                name="finalize-date"
              >
                <DatePicker 
                  format="DD/MM/YYYY"
                  className="w-full"
                  placeholder="Chọn ngày chốt số lượng"
                />
              </Form.Item>

              <Form.Item
                label="Số lượng mẫu"
                name="sample-quantity"
              >
                <InputNumber 
                  min={0}
                  className="w-full"
                  placeholder="Nhập số lượng mẫu"
                />
              </Form.Item>

              <Form.Item
                label="Tổng số lượng"
                name="total-quantity"
              >
                <InputNumber 
                  min={0}
                  className="w-full"
                  placeholder="Nhập tổng số lượng"
                />
              </Form.Item>

              <Form.Item
                label="Tồn kho"
                name="stock-quantity"
              >
                <InputNumber 
                  min={0}
                  className="w-full"
                  placeholder="Nhập tồn kho"
                />
              </Form.Item>

              <Form.Item
                label="Giá vốn"
                name="cost-price"
              >
                <InputNumber 
                  min={0}
                  className="w-full"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="Nhập giá vốn"
                />
              </Form.Item>

              <Form.Item
                label="Giá bán"
                name="selling-price"
              >
                <InputNumber 
                  min={0}
                  className="w-full"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="Nhập giá bán"
                />
              </Form.Item>

              <Form.Item
                label="Thương hiệu"
                name="brand"
                className="col-span-2"
              >
                <Input placeholder="Nhập thương hiệu" />
              </Form.Item>

              <Form.Item
                label="Vị trí kho"
                name="inventory-location"
                className="col-span-2"
              >
                <Input placeholder="Nhập vị trí kho" />
              </Form.Item>

              <Form.Item
                label="Trọng lượng (gram)"
                name="weight"
              >
                <InputNumber 
                  min={0}
                  className="w-full"
                  placeholder="Nhập trọng lượng"
                />
              </Form.Item>

              <Form.Item
                label="Trạng thái"
                name="status"
              >
                <Select
                  options={STATUS_OPTIONS}
                />
              </Form.Item>

              <Form.Item
                label="Ghi chú"
                name="notes"
                className="col-span-2"
              >
                <Input.TextArea 
                  rows={3}
                  placeholder="Nhập ghi chú..."
                />
              </Form.Item>
            </div>
          </div>

          {/* Upload ảnh */}
          <div className="w-64">
            <Form.Item label="Ảnh sản phẩm">
              <ProductImageUploader 
                onImagesChange={handleImageUpload}
                sku={sku}
                initialImage={avatarUrl}
                maxImages={5}
              />
              {avatarUrl && (
                <div className="mt-2 text-xs text-green-600">
                  ✓ Đã upload ảnh thành công
                </div>
              )}
            </Form.Item>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-2 mt-3 border-t pt-3">
          <Button onClick={onClose}>Bỏ qua</Button>
          {!isUpdate && (
            <Button type="default">Lưu & Tạo thêm</Button>
          )}
          <Button type="primary" htmlType="submit" loading={loading}>
            {isUpdate ? "Cập nhật" : "Lưu"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}