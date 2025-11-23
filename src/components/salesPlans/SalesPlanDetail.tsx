// src/components/salesPlans/SalesPlanDetail.tsx
"use client";

import { Tabs,  Tag, Image, Button } from "antd";
import type { TabsProps } from "antd";
import { EditOutlined } from "@ant-design/icons";

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

interface SalesPlanDetailProps {
  product: SalesPlanProduct;
  onEdit: () => void;
}

export default function SalesPlanDetail({ product, onEdit }: SalesPlanDetailProps) {
  const getSampleTypeColor = (sampleType: string) => {
    const colorMap: { [key: string]: string } = {
      "Hàng tái": "blue",
      "Mẫu hình": "green",
      "Mẫu tái": "orange",
      "Mẫu sống": "purple"
    };
    return colorMap[sampleType] || "default";
  };

  const infoTab: TabsProps["items"] = [
    {
      key: "info",
      label: "Thông tin",
      children: (
        <div className="bg-white p-4 rounded-md border">
          <div className="flex gap-4 mb-6">
            {/* Ảnh sản phẩm */}
            <div className="flex-shrink-0">
              <Image
                src={product["avatar-url"] || "/images/noimage.png"}
                alt={product["product-name"]}
                width={96}
                height={112}
                className="rounded-md border border-gray-200 object-cover"
                preview={{
                  mask: "Xem ảnh",
                }}
                fallback="/images/noimage.png"
              />
            </div>

            {/* Thông tin chi tiết */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-semibold">{product["product-name"]}</h2>
                <Tag color={getSampleTypeColor(product["sample-type"])}>
                  {product["sample-type"]}
                </Tag>
                <Tag color={product.status === "Unavailable" ? "red" : "green"}>
                  {product.status === "Unavailable" ? "Không khả dụng" : "Khả dụng"}
                </Tag>
              </div>

              {/* Bố cục giống Product Detail */}
              <div className="space-y-4">
                {/* Dòng 1 */}
                <div className="flex gap-8 text-sm">
                  <div className="flex-1 items-center">
                    <div className="text-gray-600 mb-1">Mã hàng</div>
                    <div className="font-medium border-b border-gray-200 pb-1">{product.sku}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-600 mb-1">Nhà cung cấp</div>
                    <div className="font-medium border-b border-gray-200 pb-1">{product["supplier-name"]}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-600 mb-1">Thương hiệu</div>
                    <div className="font-medium border-b border-gray-200 pb-1">{product["brand"] || "Chưa có"}</div>
                  </div>
                     <div className="flex-1">
                    <div className="text-gray-600 mb-1">Trọng lượng</div>
                    <div className="font-medium border-b border-gray-200 pb-1">
                      {product["weight"] || 0} g
                    </div>
                  </div>
                </div>

                {/* Dòng 2 */}
                <div className="flex gap-8 text-sm">
                    <div className="flex-1">
                    <div className="text-gray-600 mb-1">Loại mẫu</div>
                    <div className="font-medium border-b border-gray-200 pb-1">{product["sample-type"]}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-600 mb-1">Tồn kho</div>
                    <div className="font-medium border-b border-gray-200 pb-1">{product["stock-quantity"] || 0}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-600 mb-1">Giá vốn</div>
                    <div className="font-medium border-b border-gray-200 pb-1">
                      {product["cost-price"]?.toLocaleString()}₫
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-600 mb-1">Giá bán</div>
                    <div className="font-medium border-b border-gray-200 pb-1">
                      {product["selling-price"]?.toLocaleString()}₫
                    </div>
                  </div>
                </div>


                {/* Dòng 4 - Thông tin kế hoạch */}
                <div className="flex gap-8 text-sm">
                
                  <div className="flex-1">
                    <div className="text-gray-600 mb-1">Ngày giao mẫu</div>
                    <div className="font-medium border-b border-gray-200 pb-1">
                      {product["delivery-date"] ? new Date(product["delivery-date"]).toLocaleDateString('vi-VN') : "—"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-600 mb-1">Ngày chốt số lượng</div>
                    <div className="font-medium border-b border-gray-200 pb-1">
                      {product["finalize-date"] ? new Date(product["finalize-date"]).toLocaleDateString('vi-VN') : "—"}
                    </div>
                  </div>
                   <div className="flex-1">
                    <div className="text-gray-600 mb-1">Số lượng mẫu</div>
                    <div className="font-medium border-b border-gray-200 pb-1 text-blue-600">
                      {product["sample-quantity"]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-600 mb-1">Tổng số lượng</div>
                    <div className="font-medium border-b border-gray-200 pb-1 text-green-600">
                      {product["total-quantity"]}
                    </div>
                  </div>
                </div>

           
              </div>

              {/* Ghi chú */}
              {product.notes && (
                <div className="mt-6 p-3 bg-gray-50 rounded-md border">
                  <h3 className="font-medium mb-2 text-gray-700">Ghi chú</h3>
                  <div className="text-gray-700">
                    {product.notes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
              Chỉnh sửa
            </Button>
            <Button>In tem mã</Button>
            <Button>Xuất file</Button>
          </div>
        </div>
      ),
    },
    {
      key: "demo",
      label: "Demo",
      children: (
        <div className="p-4 text-center text-gray-500 bg-white rounded-md border">
          <p>Demo - Thông tin thẻ kho sẽ được hiển thị ở đây</p>
          <p className="text-sm mt-2">Các tính năng bổ sung sẽ được phát triển trong tương lai</p>
        </div>
      ),
    },
  ];

  return (
    <div className="px-3 py-2">
      <Tabs defaultActiveKey="info" items={infoTab} />
    </div>
  );
}