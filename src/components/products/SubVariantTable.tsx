// "use client";

// import { Table } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import dayjs from "dayjs";
// import ProductTabsDetail from "./ProductTabsDetail";
// import type { Product, Variant } from "@/types/product";
// // type Variant = {
// //   id: string;
// //   name: string;
// //   price: number;
// //   cost: number;
// //   stock: number;
// //   createdAt?: string;
// //   image?: string;
// //   attrs?: { color?: string; size?: string };
// // };

// export default function SubVariantTable({ master }: { master: Product }) {
//   // Nếu API chưa có variants → tạo 1 variant từ master để không bị trống
//   const variants: Variant[] =
//     master?.variants && master.variants.length
//       ? master.variants
//       : [
//           {
//             id: master.id,
//             name: `${master.name} ${master.variant ? `- ${master.variant}` : ""}`.trim(),
//             price: master.price,
//             cost: master.cost,
//             stock: master.stock,
//             createdAt: master.createdAt,
//             image: master.image,
//             attrs: master.attrs,
//           },
//         ];

//   const columns: ColumnsType<Variant> = [
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
//       render: (_: unknown, r) => (
//         <img src={r.image || master.image} className="w-6 h-7 rounded" />
//       ),
//     },
//     {
//       title: "Mã hàng",
//       dataIndex: "id",
//       width: 160,
//       render: (v: string) => (
//         <div className="font-medium text-gray-700">{v}</div>
//       ),
//     },
//     {
//       title: "Tên hàng",
//       dataIndex: "name",
//       ellipsis: true,
//     },
//     {
//       title: "Giá bán",
//       dataIndex: "price",
//       align: "right" as const,
//       width: 120,
//       render: (v: number) => v?.toLocaleString(),
//     },
//     {
//       title: "Giá vốn",
//       dataIndex: "cost",
//       align: "right" as const,
//       width: 120,
//       render: (v: number) => v?.toLocaleString(),
//     },
//     {
//       title: "Tồn kho",
//       dataIndex: "stock",
//       align: "center" as const,
//       width: 90,
//     },
//     // {
//     //   title: "Khách đặt",
//     //   dataIndex: "ordered",
//     //   width: 100,
//     //   align: "center" as const,
//     //   render: () => 0,
//     // },
//     {
//       title: "Thời gian tạo",
//       dataIndex: "createdAt",
//       width: 180,
//       render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "---"),
//     },
//     {
//       title: "Dự kiến hết hàng",
//       dataIndex: "oos",
//       width: 140,
//       align: "center" as const,
//       render: () => "0 ngày",
//     },
//   ];

//   return (
//     <div className="bg-white border border-blue-200 rounded-md">
//       <Table<Variant>
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
//         <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm">
//           + Thêm hàng hóa cùng loại
//         </button>
//       </div>
//     </div>
//   );
// }
// components/products/SubVariantTable.tsx
"use client";

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import ProductTabsDetail from "./ProductTabsDetail";

// Định nghĩa kiểu cho variant data từ API
interface ProductVariant {
  id: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  createdAt?: string;
  image?: string;
  attrs?: { color?: string; size?: string };
  sku?: string;
  description?: string;
  color?: string;
  size?: string;
  brand?: string;
  material?: string;
  weight?: number;
  isMaster?: boolean;
  status?: string;
}

interface ProductMaster {
  id: string;
  name: string;
  variant?: string;
  price: number;
  cost: number;
  stock: number;
  createdAt?: string;
  image?: string;
  attrs?: { color?: string; size?: string };
  variants?: ProductVariant[];
  sku?: string;
  description?: string;
  color?: string;
  size?: string;
  brand?: string;
  material?: string;
  weight?: number;
  isMaster?: boolean;
  status?: string;
}

export default function SubVariantTable({ master }: { master: ProductMaster }) {
  // Tạo variants từ master data (vì API không có variants riêng)
  const variants: ProductVariant[] = [
    {
      id: master.id,
      name: master.name,
      price: master.price,
      cost: master.cost,
      stock: master.stock,
      createdAt: master.createdAt,
      image: master.image,
      attrs: master.attrs,
      sku: master.sku,
      description: master.description,
      color: master.color,
      size: master.size,
      brand: master.brand,
      material: master.material,
      weight: master.weight,
      isMaster: master.isMaster,
      status: master.status,
    },
  ];

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
      render: (_: unknown, r: ProductVariant) => (
        <img src={r.image || master.image} className="w-6 h-7 rounded" alt={r.name} />
      ),
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
      dataIndex: "price",
      align: "right" as const,
      width: 120,
      render: (v: number) => v?.toLocaleString() + "₫",
    },
    {
      title: "Giá vốn",
      dataIndex: "cost",
      align: "right" as const,
      width: 120,
      render: (v: number) => v?.toLocaleString() + "₫",
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      align: "center" as const,
      width: 90,
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      width: 180,
      render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "---"),
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
        }}
      />
      <div className="p-3">
        <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm">
          + Thêm hàng hóa cùng loại
        </button>
      </div>
    </div>
  );
}