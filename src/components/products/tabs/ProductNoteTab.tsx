"use client";
import { Input } from "antd";
import type { Product, Variant } from "@/types/product";

interface Props {
  master: Product;
  variant: Variant;
}

export default function ProductNoteTab({ master, variant }: Props) {
  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">
        Ghi chú / mô tả cho <b>{variant.name}</b> ({master.name})
      </div>
      <Input.TextArea rows={4} placeholder="Nhập mô tả..." />
      <Input.TextArea rows={3} placeholder="Nhập ghi chú..." />
    </div>
  );
}
