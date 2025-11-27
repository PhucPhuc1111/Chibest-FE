"use client";

import { Tabs } from "antd";
import type { TabsProps } from "antd";
import ProductInfoTab from "./tabs/ProductInfoTab";
import ProductNoteTab from "./tabs/ProductNoteTab";
// import ProductWarehouseTab from "./tabs/ProductWarehouseTab";
import { ProductMaster, ProductVariant } from "@/types/product";
import { resolveProductImageSrc, buildProductVideoUrl } from "@/utils/productImage";
import { useState, useMemo } from "react";

const enhanceVariant = (item: ProductVariant): ProductVariant => ({
  ...item,
  avartarUrl: resolveProductImageSrc(item.avartarUrl),
});

export default function ProductTabsDetail({
  master,
  variant,
  onDeleteSuccess,
  onSuccess,
}: {
  master: ProductMaster;
  variant: ProductVariant;
  onDeleteSuccess?: () => void;
  onSuccess?: () => void;
}) {
  const [activeKey, setActiveKey] = useState("info");
  const [videoLoaded, setVideoLoaded] = useState(false);

  const normalizedMaster = useMemo<ProductMaster>(() => ({
    ...master,
    avartarUrl: resolveProductImageSrc(master.avartarUrl),
    variants: master.variants?.map(enhanceVariant),
  }), [master]);

  const normalizedVariant = useMemo<ProductVariant>(
    () => enhanceVariant(variant),
    [variant],
  );

  const videoUrl = useMemo(() => {
    const masterVideo = (normalizedMaster as ProductMaster & { videoUrl?: string }).videoUrl;
    const variantVideo = (normalizedVariant as ProductVariant & { videoUrl?: string }).videoUrl;
    return buildProductVideoUrl(variantVideo || masterVideo);
  }, [normalizedMaster, normalizedVariant]);

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    if (key === "video") {
      setVideoLoaded(true);
    }
  };
  const items: TabsProps["items"] = [
    {
      key: "info",
      label: "Thông tin",
      children: <ProductInfoTab master={normalizedMaster} variant={normalizedVariant} onDeleteSuccess={onDeleteSuccess} onSuccess={onSuccess} />,
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
    {
      key: "video",
      label: "Video duyệt mẫu",
      children: (
        <div className="text-sm">
          {videoUrl ? (
            videoLoaded ? (
              <video
                controls
                className="w-full rounded-md bg-black"
                src={videoUrl}
              >
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            ) : (
              <button
                type="button"
                className="text-blue-600 underline"
                onClick={() => setVideoLoaded(true)}
              >
                Tải video
              </button>
            )
          ) : (
            <div className="text-gray-500">Chưa có video mẫu.</div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 py-3">
      <Tabs activeKey={activeKey} onChange={handleTabChange} items={items} />
    </div>
  );
}