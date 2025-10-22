"use client";

import {
  Modal,
  Tabs,
  Form,
  Input,
  Select,
  InputNumber,
  Collapse,
  Button,
  Radio,
  Checkbox,
} from "antd";
import { useState } from "react";
import TiptapEditor from "@/components/ui/tiptap/TiptapEditor";
import ProductImageUploader from "../components/ProductImageUploader";

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
          padding: 0,
           scrollbarGutter: "stable",
          background: "#fff",
        },
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: "1", label: "Thông tin" },
          { key: "2", label: "Mô tả" },
          { key: "3", label: "Chi nhánh kinh doanh" },
        ]}
      />

      {/* =============== TAB 1: THÔNG TIN =============== */}
      {activeTab === "1" && (
        <Form
          form={form}
          layout="vertical"
          className=""
          initialValues={{
            cost: 0,
            price: 0,
            stock: 0,
            minStock: 0,
            maxStock: 9999,
            weight: 0,
            directSale: true,
          }}
        >
          {/* ----- Cơ bản ----- */}
          <div className="grid grid-flow-col grid-cols-3 gap-x-4  ">
            <Form.Item label="Mã hàng" name="code" className="col-span-2 ">
              <Input placeholder="Tự động" disabled />
            </Form.Item>

            <Form.Item
              label="Tên hàng"
              name="name"
              className="col-span-2"
              rules={[{ required: true, message: "Vui lòng nhập tên hàng" }]}
            >
              <Input placeholder="Bắt buộc" />
            </Form.Item>
            <div className="relative  ">
              <Form.Item
                label="Nhóm hàng"
                name="group"
                className="[&_label]:text-[13px] [&_label]:font-normal [&_label]:text-red-600"
                rules={[{ required: true, message: "Bắt buộc chọn nhóm hàng" }]}
              >
                <Select
                  placeholder="Chọn nhóm hàng"
                  options={[
                    { label: "Áo KIỂU/SOMI", value: "Áo KIỂU/SOMI" },
                    { label: "Quần JEANS", value: "Quần JEANS" },
                  ]}
                />
              </Form.Item>
              <a className="absolute top-0 right-0 font-bold text-blue-500 text-xs">Tạo mới</a>
            </div>

            <div className=" relative">
              <Form.Item label="Thương hiệu" name="brand" className="">
                <Select
                  placeholder="Chọn thương hiệu"
                  options={[
                    { label: "Nội địa", value: "Nội địa" },
                    { label: "Xuất khẩu", value: "Xuất khẩu" },
                  ]}
                />
              </Form.Item>
              <a className="absolute top-0 right-0 font-bold text-blue-500 text-xs">Tạo mới</a>
           </div>
            <Form.Item label={<span>&nbsp;</span>}className="row-span-3"
            >
              <ProductImageUploader />
            </Form.Item>

          </div>

    
<div className="mt-3 flex flex-col gap-4 ">

  {/* ====== Giá vốn, giá bán ====== */}
  <Collapse
    bordered
    className="border border-gray-200 rounded-md shadow-sm"
    defaultActiveKey={["price"]}
  >
    <Collapse.Panel header={<b>Giá vốn, giá bán</b>} key="price">
      <div className="grid grid-cols-2 gap-4">
        <Form.Item label="Giá vốn"  name="cost" className="mb-0 ">
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item label="Giá bán" name="price" className="mb-0">
          <InputNumber min={0} className="w-full" />
        </Form.Item>
      </div>
    </Collapse.Panel>
  </Collapse>

  {/* ====== Tồn kho ====== */}
  <Collapse
    bordered
    className="border border-gray-200 rounded-md shadow-sm"
    defaultActiveKey={["stock"]}
  >
    <Collapse.Panel header={<b>Tồn kho</b>} key="stock">
      <p className="text-gray-500 text-sm mb-3">
        Quản lý số lượng tồn kho và định mức tồn.
      </p>
      <div className="grid grid-cols-3 gap-4">
        <Form.Item label="Tồn kho" name="stock" className="mb-0">
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item label="Tồn thấp nhất" name="minStock" className="mb-0">
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item label="Tồn cao nhất" name="maxStock" className="mb-0">
          <InputNumber min={0} className="w-full" />
        </Form.Item>
      </div>
    </Collapse.Panel>
  </Collapse>

  {/* ====== Vị trí, trọng lượng ====== */}
  <Collapse
    bordered
    className="border border-gray-200 rounded-md shadow-sm"
    defaultActiveKey={["location"]}
  >
    <Collapse.Panel header={<b>Vị trí, trọng lượng</b>} key="location">
      <div className="grid grid-cols-2 gap-4">
        <Form.Item label="Vị trí" name="location" className="mb-0">
          <Select placeholder="Chọn vị trí" options={[]} />
        </Form.Item>
        <Form.Item label="Trọng lượng" name="weight" className="mb-0">
          <InputNumber min={0} addonAfter="g" className="w-full" />
        </Form.Item>
      </div>
    </Collapse.Panel>
  </Collapse>

  {/* ====== Đơn vị tính & Hoa hồng ====== */}
  <div className="border border-gray-200 rounded-md bg-white shadow-sm p-4">
    <div className="flex justify-between items-center">
      <div className="">
      <b >
        Quản lý đơn vị tính và hoa hồng nhân viên.
      </b>
      <p className="text-gray-600 text-sm">Thiết lập hoa hồng cho nhân viên theo % doanh thu hoặc giá trị cụ thể</p>
      </div>
      <Button type="link">Thiết lập</Button>
    </div>
  </div>

</div>



          {/* ----- Bán trực tiếp ----- */}
          <Form.Item name="directSale" valuePropName="checked" className="mt-4">
            <Checkbox>Bán trực tiếp</Checkbox>
          </Form.Item>

          {/* ----- Footer ----- */}
          <div className="flex justify-end items-center gap-2 mt-3 border-t pt-3">
            <Button onClick={onClose}>Bỏ qua</Button>
            <Button type="default">Lưu & Tạo thêm hàng</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form>
      )}

      {/* =============== TAB 2: MÔ TẢ =============== */}
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

      {/* =============== TAB 3: CHI NHÁNH =============== */}
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
