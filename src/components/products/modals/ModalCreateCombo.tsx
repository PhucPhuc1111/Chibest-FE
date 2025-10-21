"use client";
import { Modal, Input, InputNumber, Button, Table } from "antd";
import { useState } from "react";

export default function ModalCreateCombo({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: "", price: 0 });

  return (
    <Modal
      title="Tạo combo - đóng gói"
      open={open}
      onCancel={onClose}
      onOk={() => onClose()}
      okText="Lưu"
      cancelText="Bỏ qua"
      width={900}
     
    >
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <div className="font-semibold text-sm mb-1">Tên combo</div>
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
        <div className="font-semibold text-sm mb-2">Hàng thành phần</div>
        <Table
          columns={[
            { title: "STT", dataIndex: "index", width: 60 },
            { title: "Mã hàng", dataIndex: "code" },
            { title: "Tên hàng", dataIndex: "name" },
            { title: "Số lượng", dataIndex: "qty" },
          ]}
          dataSource={[]}
          pagination={false}
          size="small"
        />
        <Button type="dashed" className="mt-3 w-full">
          + Thêm hàng thành phần
        </Button>
      </div>
    </Modal>
  );
}
