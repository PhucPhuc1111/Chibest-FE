"use client";

import { Button, Descriptions, Tag, Modal } from "antd";
import { Image } from 'antd';
import { ProductMaster, ProductVariant, ParentProduct } from "@/types/product";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { useAttributeStore } from "@/stores/useAttributeStore";
import ModalCreateProduct from "../modals/ModalCreateProduct";
import ModalUpdateProduct from "../modals/ModalUpdateProduct";

interface Props {
  master: ProductMaster;
  variant: ProductVariant;
  onDeleteSuccess?: () => void;
  onSuccess?: () => void;
}

type MasterLegacyFields = {
  "category-id"?: string;
  "is-master"?: boolean;
};

const toParentProduct = (product: ProductMaster): ParentProduct => {
  const legacyFields = product as ProductMaster & MasterLegacyFields;

  return {
    id: product.id,
    sku: product.sku ?? "",
    name: product.name,
    "category-id": legacyFields["category-id"] ?? "",
    brand: product.brand ?? "",
    "is-master": legacyFields["is-master"] ?? product.isMaster ?? true,
  };
};

export default function ProductInfoTab({ master, variant, onDeleteSuccess, onSuccess }: Props) {
  const [showCreateVariant, setShowCreateVariant] = useState(false);
  const data = { ...master, ...variant };
  const { deleteProduct } = useProductStore();
  const { colors, sizes, getColors, getSizes } = useAttributeStore();
  
  // State modal chỉnh sửa
  const [openEditModal, setOpenEditModal] = useState(false);
  
  // Fetch colors và sizes từ store (chỉ 1 lần nếu chưa có)
  useEffect(() => {
    getColors();
    getSizes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Lấy color và size name từ store
  const variantWithIds = variant as ProductVariant & { colorId?: string; sizeId?: string };
  const colorName = variantWithIds.colorId 
    ? colors.find(c => c.id === variantWithIds.colorId)?.code || ""
    : "";
  const sizeName = variantWithIds.sizeId 
    ? sizes.find(s => s.id === variantWithIds.sizeId)?.code || ""
    : "";

  const handleDelete = () => {
    Modal.confirm({
      title: "Xác nhận xóa sản phẩm",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa sản phẩm "${data.name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const success = await deleteProduct(data.id);
          if (success && onDeleteSuccess) {
            // Đợi một chút để đảm bảo API đã xử lý xong trước khi fetch lại
            setTimeout(() => {
              onDeleteSuccess();
            }, 300);
          }
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      },
    });
  };

  return (
    <div className="bg-white p-3 rounded-md">
      <div className="flex gap-4">
        {/* Ảnh sản phẩm */}
        <Image.PreviewGroup items={[data.avartarUrl || "/images/noimage.png"]}>
          <Image
            src={data.avartarUrl || "/images/noimage.png"}
            alt={data.name}
            width={96}
            height={112}
            className="rounded-md object-cover border border-gray-200 cursor-pointer"
            preview={{ mask: "Xem ảnh" }}
          />
        </Image.PreviewGroup>
        
        {/* Thông tin chi tiết */}
        <div className="flex-1">
          {/* Tên + thuộc tính */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[18px] font-semibold">{variant.name}</h3>
            {colorName && <Tag>{colorName}</Tag>}
            {sizeName && <Tag>{sizeName}</Tag>}
          </div>

          {/* Tag loại sản phẩm */}
          <div className="flex gap-2 mb-3">
            <Tag color="green">{data.isMaster ? 'Sản phẩm chính' : 'Biến thể'}</Tag>
            {(() => {
              const normalized = (data.status || "").toLowerCase();
              let tagColor: string = "default";
              let label: string = data.status || "Không xác định";

              if (normalized === "available") {
                tagColor = "green";
                label = "Đang bán";
              } else if (normalized === "unavailable") {
                tagColor = "red";
                label = "Ngừng bán";
              } else if (normalized === "noncommercial") {
                tagColor = "default";
                label = "Chưa bán";
              }

              return <Tag color={tagColor}>{label}</Tag>;
            })()}
          </div>

          {/* Mô tả chi tiết */}
          <Descriptions
            column={3}
            size="small"
            styles={{ label: { width: 140 } }}
            className="max-w-full"
          >
            <Descriptions.Item label="Mã hàng">{variant.sku}</Descriptions.Item>
            <Descriptions.Item label="Giá vốn">{variant.costPrice?.toLocaleString()}₫</Descriptions.Item>
            <Descriptions.Item label="Giá bán">{variant.sellingPrice?.toLocaleString()}₫</Descriptions.Item>
            <Descriptions.Item label="Tồn kho">{variant.stockQuantity}</Descriptions.Item>
            <Descriptions.Item label="Trọng lượng">{data.weight || 0} g</Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="items-end justify-between flex mt-4">
        <div>
          <Button danger onClick={handleDelete}><DeleteOutlined /> Xóa</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="primary" onClick={() => setOpenEditModal(true)}><EditOutlined /> Chỉnh sửa</Button>
          <Button>In tem mã</Button>
          <Button>...</Button>
        </div>
      </div>

      {/* Modal tạo variant */}
      <ModalCreateProduct
        open={showCreateVariant}
        onClose={() => setShowCreateVariant(false)}
        parentProduct={data.isMaster ? toParentProduct(master) : null}
        onSuccess={onSuccess}
      />

      {/* Modal chỉnh sửa sản phẩm */}
      {openEditModal && (
        <ModalUpdateProduct
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          productData={data}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
}
