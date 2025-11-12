"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useProductStore } from "@/stores/useProductStore";
import { Card, Descriptions, Tag, Image, Skeleton } from "antd";

// Định nghĩa interface phù hợp với data từ API
interface ProductDetail {
  id: string;
  name: string;
  sellingPrice: number; 
  costPrice: number;    
  stockQuantity: number;
  avartarUrl?: string;
  sku?: string;
  description?: string;
  color?: string;
  size?: string;
  brand?: string;
  material?: string;
  weight?: number;
  isMaster?: boolean;
  status?: string;
  parentSku?: string | null;
  categoryName?: string; 
  style?: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const { products, loading, getProducts } = useProductStore();

  useEffect(() => {
    if (id) {
      getProducts();
    }
  }, [id, getProducts]);

  // Tìm product theo ID
  const product = products.find(p => p.id === id) as ProductDetail | undefined;

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">
            <h2 className="text-lg font-medium text-gray-600">Không tìm thấy sản phẩm</h2>
            <p className="text-gray-500">Sản phẩm với ID {id} không tồn tại</p>
          </div>
        </Card>
      </div>
    );
  }

  // Tìm các variants của product này (nếu là master)
  const variants = product.isMaster 
    ? products.filter(p => p.parentSku === product.sku && !p.isMaster)
    : [];

  return (
    <div className="p-6">
      <Card title="Chi tiết sản phẩm">
        <div className="flex gap-6">
          {/* Ảnh sản phẩm */}
          <div className="flex-shrink-0">
            <Image
              src={product.avartarUrl || "/images/noimage.png"}
              alt={product.name || "Ảnh sản phẩm"}
              width={200}
              height={240}
              className="rounded-md border border-gray-200"
              preview={{
                mask: "Xem ảnh",
              }}
            />
          </div>

          {/* Thông tin chi tiết */}
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-3">
                <Tag color="blue">{product.isMaster ? "Sản phẩm chính" : "Biến thể"}</Tag>
                <Tag color={product.status === "Available" ? "green" : "red"}>
                  {product.status === "Available" ? "Đang bán" : "Ngừng bán"}
                </Tag>
                {product.color && <Tag>Màu: {product.color}</Tag>}
                {product.size && <Tag>Size: {product.size}</Tag>}
              </div>
            </div>

            <Descriptions 
              column={2} 
              bordered 
              size="small"
              className="mb-4"
            >
              <Descriptions.Item label="Mã hàng (SKU)" span={1}>
                {product.sku}
              </Descriptions.Item>
              <Descriptions.Item label="Nhóm hàng" span={1}>
                {product.categoryName || "Chưa phân loại"}
              </Descriptions.Item>
              
              <Descriptions.Item label="Giá bán" span={1}>
                <span className="font-semibold text-green-600">
                  {product.sellingPrice?.toLocaleString()}₫
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Giá vốn" span={1}>
                {product.costPrice?.toLocaleString()}₫
              </Descriptions.Item>
              
              <Descriptions.Item label="Tồn kho" span={1}>
                <span className={`font-medium ${
                  product.stockQuantity > 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {product.stockQuantity}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Thương hiệu" span={1}>
                {product.brand || "Chưa có"}
              </Descriptions.Item>

              <Descriptions.Item label="Chất liệu" span={1}>
                {product.material || "Chưa có"}
              </Descriptions.Item>
              <Descriptions.Item label="Trọng lượng" span={1}>
                {product.weight ? `${product.weight}g` : "0g"}
              </Descriptions.Item>

              <Descriptions.Item label="Kiểu dáng" span={1}>
                {product.style || "Chưa có"}
              </Descriptions.Item>
              <Descriptions.Item label="Parent SKU" span={1}>
                {product.parentSku || "Không có"}
              </Descriptions.Item>
            </Descriptions>

            {/* Mô tả */}
            {product.description && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Mô tả sản phẩm</h3>
                <div 
                  className="text-gray-700 bg-gray-50 p-3 rounded-md"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Thông tin biến thể nếu là master product */}
            {product.isMaster && variants.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Biến thể ({variants.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {variants.map(variant => (
                    <div key={variant.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{variant.name}</div>
                          <div className="text-sm text-gray-600">
                            {variant.color && `Màu: ${variant.color}`} 
                            {variant.size && ` • Size: ${variant.size}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{variant.sellingPrice?.toLocaleString()}₫</div>
                          <div className="text-sm text-gray-500">Tồn: {variant.stockQuantity}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}