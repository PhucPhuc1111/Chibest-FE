"use client";
import {
  Modal,
  Tabs,
  Form,
  Input,
  Select,
  InputNumber,
  Collapse,
  Upload,
  Button,
  Radio,
  Checkbox,
} from "antd";
import { useState } from "react";
import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";

const { TextArea } = Input;

export default function ModalCreateProduct({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [description, setDescription] = useState("");

  return (
    <Modal
      title="Tạo hàng hóa"
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 48 }}
      maskClosable={false}
      zIndex={100}
      styles={{
        mask: { zIndex: 99 },
        body: {
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
          padding: "16px 24px",
          background: "#fff",
        },
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={[
          { key: "1", label: "Thông tin" },
          { key: "2", label: "Mô tả" },
          { key: "3", label: "Chi nhánh kinh doanh" },
        ]}
      />

      {/* ================= TAB 1 - THÔNG TIN ================= */}
      {activeTab === "1" && (
        <Form
          form={form}
          layout="vertical"
          className="mt-2"
          initialValues={{
            cost: 0,
            price: 0,
            stock: 0,
            minStock: 0,
            maxStock: 999999999,
            weight: 0,
            directSale: true,
          }}
        >
          {/* HÀNG HÓA CƠ BẢN */}
          <div className="grid grid-cols-3 gap-4">
            <Form.Item label="Mã hàng" name="code">
              <Input placeholder="Tự động" disabled />
            </Form.Item>

            <Form.Item
              label="Tên hàng"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên hàng" }]}
            >
              <Input placeholder="Bắt buộc" />
            </Form.Item>

            <div className="flex flex-col items-center justify-start gap-2">
              <Upload maxCount={3} listType="picture-card">
                <button
                  type="button"
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  Thêm ảnh
                </button>
              </Upload>
              <p className="text-xs text-gray-400">Mỗi ảnh không quá 2 MB</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Form.Item
                label="Nhóm hàng"
                name="group"
                className="w-[48%]"
                rules={[{ required: true, message: "Bắt buộc chọn nhóm hàng" }]}
              >
                <Select
                  placeholder="Chọn nhóm hàng (Bắt buộc)"
                  options={[
                    { label: "Áo KIỂU/SOMI", value: "Áo KIỂU/SOMI" },
                    { label: "Quần JEANS", value: "Quần JEANS" },
                  ]}
                />
              </Form.Item>
              <a className="text-blue-500 text-xs">Tạo mới</a>
              <Form.Item label="Thương hiệu" name="brand" className="w-[48%]">
                <Select
                  placeholder="Chọn thương hiệu"
                  options={[
                    { label: "Nội địa", value: "Nội địa" },
                    { label: "Xuất khẩu", value: "Xuất khẩu" },
                  ]}
                />
              </Form.Item>
              <a className="text-blue-500 text-xs">Tạo mới</a>
            </div>
          </div>

          {/* ========== Collapse mới (API items) ========== */}
          <Collapse
            className="mt-4 border border-gray-200 rounded-md"
            defaultActiveKey={["price"]}
            items={[
              {
                key: "price",
                label: "Giá vốn, giá bán",
                children: (
                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item label="Giá vốn" name="cost">
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>
                    <Form.Item label="Giá bán" name="price">
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: "stock",
                label: "Tồn kho",
                children: (
                  <>
                    <p className="text-gray-500 text-sm mb-2">
                      Quản lý số lượng tồn kho và định mức tồn.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <Form.Item label="Tồn kho" name="stock">
                        <InputNumber min={0} className="w-full" />
                      </Form.Item>
                      <Form.Item label="Định mức tồn thấp nhất" name="minStock">
                        <InputNumber min={0} className="w-full" />
                      </Form.Item>
                      <Form.Item label="Định mức tồn cao nhất" name="maxStock">
                        <InputNumber min={0} className="w-full" />
                      </Form.Item>
                    </div>
                  </>
                ),
              },
              {
                key: "location",
                label: "Vị trí, trọng lượng",
                children: (
                  <>
                    <p className="text-gray-500 text-sm mb-2">
                      Quản lý việc sắp xếp kho, vị trí bán hàng hoặc trọng lượng
                      hàng hóa
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item label="Vị trí" name="location">
                        <Select placeholder="Chọn vị trí" options={[]} />
                      </Form.Item>
                      <Form.Item label="Trọng lượng" name="weight">
                        <InputNumber min={0} addonAfter="g" className="w-full" />
                      </Form.Item>
                    </div>
                  </>
                ),
              },
              {
                key: "units",
                label: "Quản lý theo đơn vị tính & hoa hồng",
                children: (
                  <>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500 text-sm mb-2">
                        Quản lý đơn vị tính và hoa hồng nhân viên.
                      </p>
                      <Button type="link">Thiết lập</Button>
                    </div>
                  </>
                ),
              },
            ]}
          />

          {/* Checkbox bán trực tiếp */}
          <Form.Item name="directSale" valuePropName="checked" className="mt-4">
            <Checkbox>Bán trực tiếp</Checkbox>
          </Form.Item>

          {/* Footer buttons */}
          <div className="flex justify-end items-center gap-2 mt-3 border-t pt-3">
            <Button onClick={onClose}>Bỏ qua</Button>
            <Button type="default">Lưu & Tạo thêm hàng</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form>
      )}

      {/* ================= TAB 2 - MÔ TẢ ================= */}
      {activeTab === "2" && (
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Mô tả</h4>
            <TiptapEditor content={description} onChange={setDescription} />
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              Mẫu ghi chú (hóa đơn, đặt hàng)
            </h4>
            <TextArea rows={3} />
          </div>
          <div className="flex justify-end items-center gap-2 border-t pt-3">
            <Button onClick={onClose}>Bỏ qua</Button>
            <Button type="primary">Lưu</Button>
          </div>
        </div>
      )}

      {/* ================= TAB 3 - CHI NHÁNH ================= */}
   {/* ================= TAB 3 - CHI NHÁNH ================= */}
{activeTab === "3" && (
  <Form layout="vertical" className="mt-4">
    <Form.Item label="Phạm vi áp dụng" name="scope" initialValue="all">
      <Radio.Group>
        <div className="flex flex-col gap-3">
          <Radio value="all">Toàn hệ thống</Radio>
          <Radio value="branch">Chi nhánh cụ thể</Radio>
        </div>
      </Radio.Group>
    </Form.Item>

    <Form.Item name="directSale" valuePropName="checked" className="mt-2">
      <Checkbox>Bán trực tiếp</Checkbox>
    </Form.Item>

    <div className="flex justify-end items-center gap-2 border-t pt-3">
      <Button onClick={onClose}>Bỏ qua</Button>
      <Button type="primary">Lưu</Button>
    </div>
  </Form>
)}

    </Modal>
  );
}
