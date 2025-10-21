"use client";
import { Modal, Input, InputNumber, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function ModalCreateService({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: "", price: 0 });

  return (
    <Modal
      title="Tạo dịch vụ"
      open={open}
      onCancel={onClose}
      onOk={() => onClose()}
      okText="Lưu"
      cancelText="Bỏ qua"
      width={700}
    >
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <div className="font-semibold text-sm mb-1">Tên dịch vụ</div>
          <Input
            placeholder="Bắt buộc"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <div className="font-semibold text-sm mb-1">Giá bán</div>
          <InputNumber
            min={0}
            className="w-full"
            value={form.price}
            onChange={(v) => setForm({ ...form, price: v || 0 })}
          />
        </div>
      </div>
      <div className="mt-4">
        <div className="font-semibold text-sm mb-1">Ảnh minh họa</div>
        <Upload listType="picture" maxCount={3}>
          <Button icon={<UploadOutlined />}>Thêm ảnh</Button>
        </Upload>
      </div>
    </Modal>
  );
}
