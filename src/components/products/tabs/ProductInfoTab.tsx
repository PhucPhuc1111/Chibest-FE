"use client";

import { Button, Descriptions, Tag, Modal } from "antd";
import { Image } from 'antd';
import { ProductMaster, ProductVariant } from "@/types/product";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import ModalCreateProduct from "../modals/ModalCreateProduct";

interface Props {
  master: ProductMaster;
  variant: ProductVariant;
}

export default function ProductInfoTab({ master, variant }: Props) {
  const data = { ...master, ...variant };
  const { deleteProduct } = useProductStore();
  
  // State modal chỉnh sửa
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleDelete = () => {
    Modal.confirm({
      title: "Xác nhận xóa sản phẩm",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa sản phẩm "${data.name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        await deleteProduct(data.id);
      },
    });
  };

  return (
    <div className="bg-white p-3 rounded-md">
      <div className="flex gap-4">
        {/* Ảnh sản phẩm */}
        <Image.PreviewGroup items={[data.avartarUrl || '']}>
          <Image
            src={data.avartarUrl || '/default-product.png'}
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
            <h3 className="text-[18px] font-semibold">{master.name}</h3>
            {data.color && <Tag>{data.color}</Tag>}
            {data.size && <Tag>{data.size}</Tag>}
          </div>

          {/* Tag loại sản phẩm */}
          <div className="flex gap-2 mb-3">
            <Tag color="blue">Sản phẩm</Tag>
            <Tag color="green">{data.isMaster ? 'Master' : 'Variant'}</Tag>
            <Tag>{data.status}</Tag>
          </div>

          {/* Mô tả chi tiết */}
          <Descriptions
            column={3}
            size="small"
            styles={{ label: { width: 140 } }}
            className="max-w-full"
          >
            <Descriptions.Item label="Mã hàng">{variant.sku}</Descriptions.Item>
            <Descriptions.Item label="Tồn kho">{variant.stockQuantity}</Descriptions.Item>
            <Descriptions.Item label="Giá vốn">{variant.costPrice?.toLocaleString()}₫</Descriptions.Item>
            <Descriptions.Item label="Giá bán">{variant.sellingPrice?.toLocaleString()}₫</Descriptions.Item>
            <Descriptions.Item label="Thương hiệu">{data.brand || 'Chưa có'}</Descriptions.Item>
            <Descriptions.Item label="Định mức tồn">0 - 0</Descriptions.Item>
            <Descriptions.Item label="Vị trí">Chưa có</Descriptions.Item>
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
          <Button>+ Thêm hàng hóa cùng loại</Button>
          <Button>...</Button>
        </div>
      </div>

      {/* Modal chỉnh sửa sản phẩm */}
      {openEditModal && (
        <ModalCreateProduct
           open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          productData={data}
          isUpdate={true}
          parentProduct={data.isMaster ? master : null}
        />
      )}
    </div>
  );
}
