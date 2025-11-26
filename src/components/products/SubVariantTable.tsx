// // components/products/SubVariantTable.tsx
// "use client";

// import { Table, Button } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import { useState } from "react";
// import ProductTabsDetail from "./ProductTabsDetail";
// import ModalCreateProduct from "./modals/ModalCreateProduct";
// import { ProductMaster, ProductVariant } from "@/types/product";

// export default function SubVariantTable({ master }: { master: ProductMaster }) {
//   const [showCreateVariant, setShowCreateVariant] = useState(false);

//   const variants: ProductVariant[] = master.variants || [];

//   const columns: ColumnsType<ProductVariant> = [
//     {
//       title: "",
//       dataIndex: "select",
//       width: 48,
//       render: () => <input type="checkbox" className="mx-2" />,
//     },
//     {
//       title: "",
//       dataIndex: "icon",
//       width: 36,
//       render: (_: unknown, r: ProductVariant) => (
//         <img src={r.avartarUrl  || master.avartarUrl} className="w-6 h-7 rounded" alt={r.name} />
//       ),
//     },
//     {
//       title: "Mã hàng",
//       dataIndex: "sku",
//       width: 160,
//       render: (v: string) => (
//         <div className="font-medium text-gray-700">{v}</div>
//       ),
//     },
//     {
//       title: "Tên hàng",
//       dataIndex: "name",
//       ellipsis: true,
//       render: (name: string, record: ProductVariant) => (
//         <div>
//           <div>{name}</div>
//           <div className="text-xs text-gray-500">
//             {record.color && `Màu: ${record.color}`} 
//             {record.size && ` • Size: ${record.size}`}
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Giá bán",
//       dataIndex: "sellingPrice",
//       align: "right" as const,
//       width: 120,
//       render: (v: number) => v?.toLocaleString() + "₫",
//     },
//     {
//       title: "Giá vốn",
//       dataIndex: "costPrice",
//       align: "right" as const,
//       width: 120,
//       render: (v: number) => v?.toLocaleString() + "₫",
//     },
//     {
//       title: "Tồn kho",
//       dataIndex: "stockQuantity",
//       align: "center" as const,
//       width: 90,
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       width: 120,
//       render: (status: string) => (
//         <span className={`px-2 py-1 rounded text-xs ${
//           status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//         }`}>
//           {status === "Available" ? "Đang bán" : "Ngừng bán"}
//         </span>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-white border border-blue-200 rounded-md">
//       <Table<ProductVariant>
//         rowKey="id"
//         columns={columns}
//         dataSource={variants}
//         pagination={false}
//         size="small"
//         expandable={{
//           expandedRowRender: (record) => (
//             <ProductTabsDetail master={master} variant={record} />
//           ),
//         }}
//       />
//       <div className="p-3">
//         <Button 
//           type="primary" 
//           onClick={() => setShowCreateVariant(true)}
//           className="inline-flex items-center gap-2"
//         >
//           + Thêm hàng hóa cùng loại
//         </Button>
//       </div>

//       {/* Modal tạo variant */}
//       <ModalCreateProduct 
//         open={showCreateVariant} 
//         onClose={() => setShowCreateVariant(false)}
//         parentProduct={{
//           id: master.id,
//           sku: master.sku || "",
//           name: master.name,
//           "category-id": "", 
//           brand: master.brand || "",
//           "is-master": true
//         }}
//       />
//     </div>
//   );
// }

// components/products/SubVariantTable.tsx
"use client";

import { Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import ProductTabsDetail from "./ProductTabsDetail";
import ModalCreateProduct from "./modals/ModalCreateProduct";
import { ProductMaster, ProductVariant } from "@/types/product";
import Image from "next/image";
import { resolveProductImageSrc } from "@/utils/productImage";

export default function SubVariantTable({ master }: { master: ProductMaster }) {
  const [showCreateVariant, setShowCreateVariant] = useState(false);
  const [expandedVariantKeys, setExpandedVariantKeys] = useState<string[]>([]);

  const variants: ProductVariant[] = master.variants || [];
  const normalizedMasterAvatar = useMemo(
    () => resolveProductImageSrc(master.avartarUrl),
    [master.avartarUrl],
  );

  const handleVariantExpand = (expanded: boolean, record: ProductVariant) => {
    if (expanded) {
      setExpandedVariantKeys([record.id]);
    } else {
      setExpandedVariantKeys([]);
    }
  };

  const columns: ColumnsType<ProductVariant> = [
    {
      title: "",
      dataIndex: "select",
      width: 48,
      render: () => <input type="checkbox" className="mx-2" />,
    },
    {
      title: "",
      dataIndex: "icon",
      width: 36,
      render: (_: unknown, r: ProductVariant) => {
        const variantAvatar = r.avartarUrl
          ? resolveProductImageSrc(r.avartarUrl)
          : normalizedMasterAvatar;
        return (
          <Image
            src={variantAvatar || normalizedMasterAvatar}
            alt={r.name}
            width={24}
            height={28}
            className="w-6 h-7 rounded object-cover"
            unoptimized
          />
        );
      },
    },
    {
      title: "Mã hàng",
      dataIndex: "sku",
      width: 160,
      render: (v: string) => (
        <div className="font-medium text-gray-700">{v}</div>
      ),
    },
    {
      title: "Tên hàng",
      dataIndex: "name",
      ellipsis: true,
      render: (name: string, record: ProductVariant) => (
        <div>
          <div>{name}</div>
          <div className="text-xs text-gray-500">
            {record.color && `Màu: ${record.color}`} 
            {record.size && ` • Size: ${record.size}`}
          </div>
        </div>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "sellingPrice",
      align: "right" as const,
      width: 120,
      render: (v: number) => v?.toLocaleString() + "₫",
    },
    {
      title: "Giá vốn",
      dataIndex: "costPrice",
      align: "right" as const,
      width: 120,
      render: (v: number) => v?.toLocaleString() + "₫",
    },
    {
      title: "Tồn kho",
      dataIndex: "stockQuantity",
      align: "center" as const,
      width: 90,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (status: string) => (
        <span className={`px-2 py-1 rounded text-xs ${
          status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {status === "Available" ? "Đang bán" : "Ngừng bán"}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white border border-blue-200 rounded-md">
      <Table<ProductVariant>
        rowKey="id"
        columns={columns}
        dataSource={variants}
        pagination={false}
        size="small"
        expandable={{
          expandedRowRender: (record) => (
            <ProductTabsDetail master={master} variant={record} />
          ),
          expandedRowKeys: expandedVariantKeys,
          onExpand: handleVariantExpand,
          rowExpandable: () => true,
        }}
      />
      <div className="p-3">
        <Button 
          type="primary" 
          onClick={() => setShowCreateVariant(true)}
          className="inline-flex items-center gap-2"
        >
          + Thêm hàng hóa cùng loại
        </Button>
      </div>

      {/* Modal tạo variant */}
      <ModalCreateProduct 
        open={showCreateVariant} 
        onClose={() => setShowCreateVariant(false)}
        parentProduct={{
          id: master.id,
          sku: master.sku || "",
          name: master.name,
          "category-id": "", 
          brand: master.brand || "",
          "is-master": true
        }}
      />
    </div>
  );
}