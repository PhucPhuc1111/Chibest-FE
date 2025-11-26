"use client";

import { Tabs } from "antd";
import type { TabsProps } from "antd";
import ProductInfoTab from "./tabs/ProductInfoTab";
import ProductNoteTab from "./tabs/ProductNoteTab";
// import ProductWarehouseTab from "./tabs/ProductWarehouseTab";
import { ProductMaster, ProductVariant } from "@/types/product";
import { resolveProductImageSrc } from "@/utils/productImage";

const enhanceVariant = (item: ProductVariant): ProductVariant => ({
  ...item,
  avartarUrl: resolveProductImageSrc(item.avartarUrl),
});

export default function ProductTabsDetail({
  master,
  variant,
}: {
  master: ProductMaster;
  variant: ProductVariant;
}) {
  const normalizedMaster: ProductMaster = {
    ...master,
    avartarUrl: resolveProductImageSrc(master.avartarUrl),
    variants: master.variants?.map(enhanceVariant),
  };

  const normalizedVariant: ProductVariant = enhanceVariant(variant);

  const items: TabsProps["items"] = [
    {
      key: "info",
      label: "Thông tin",
      children: <ProductInfoTab master={normalizedMaster} variant={normalizedVariant} />,
    },
    {
      key: "note",
      label: "Mô tả, ghi chú",
      children: <ProductNoteTab master={normalizedMaster} variant={normalizedVariant} />,
    },
    // {
    //   key: "card",
    //   label: "Thẻ kho",
    //   children: <ProductWarehouseTab master={master} variant={variant} />,
    // },
    {
      key: "stock",
      label: "Tồn kho",
      children: (
        <div className="text-sm text-gray-600">
          (Demo) Chưa có số liệu tồn kho chi tiết theo kho.
        </div>
      ),
    },
    {
      key: "siblings",
      label: "Hàng hóa cùng loại",
      children: (
        <div className="text-sm">
          {normalizedMaster?.variants?.length ? (
            normalizedMaster.variants.map((v: ProductVariant) => (
              <div key={v.id} className="py-1">
                • {v.name} — Giá bán {v.sellingPrice?.toLocaleString()}₫
              </div>
            ))
          ) : (
            "Không có biến thể khác"
          )}
        </div>
      ),
    },
    {
      key: "channels",
      label: "Liên kết kênh bán",
      children: <div className="text-sm text-gray-600">(Demo)</div>,
    },
  ];

  return (
    <div className="px-4 py-3">
      <Tabs defaultActiveKey="info" items={items} />
    </div>
  );
}