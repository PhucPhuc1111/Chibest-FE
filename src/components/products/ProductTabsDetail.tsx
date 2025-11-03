// "use client";

// import { Tabs } from "antd";
// import type { TabsProps } from "antd";
// import ProductInfoTab from "./tabs/ProductInfoTab";
// import ProductNoteTab from "./tabs/ProductNoteTab";
// import ProductWarehouseTab from "./tabs/ProductWarehouseTab";
// import type { Product, Variant } from "@/types/product";
// export default function ProductTabsDetail({
//   master,
//   variant,
// }: {
//   master: Product;
//   variant: Variant;
// }) {
//   const items: TabsProps["items"] = [
//     {
//       key: "info",
//       label: "Thông tin",
//       children: <ProductInfoTab master={master} variant={variant} />,
//     },
//     {
//       key: "note",
//       label: "Mô tả, ghi chú",
//       children: <ProductNoteTab master={master} variant={variant} />,
//     },
//     {
//       key: "card",
//       label: "Thẻ kho",
//       children: <ProductWarehouseTab master={master} variant={variant} />,
//     },
//     {
//       key: "stock",
//       label: "Tồn kho",
//       children: (
//         <div className="text-sm text-gray-600">
//           (Demo) Chưa có số liệu tồn kho chi tiết theo kho.
//         </div>
//       ),
//     },
//   {
//   key: "siblings",
//   label: "Hàng hóa cùng loại",
//   children: (
//     <div className="text-sm">
//       {master?.variants?.length ? (
//         master.variants.map((v: Variant) => (
//           <div key={v.id} className="py-1">
//             • {v.name} — Giá bán {v.price?.toLocaleString()}₫
//           </div>
//         ))
//       ) : (
//         "Không có biến thể khác"
//       )}
//     </div>
//   ),
// },

//     {
//       key: "channels",
//       label: "Liên kết kênh bán",
//       children: <div className="text-sm text-gray-600">(Demo)</div>,
//     },
//   ];

//   return (
//     <div className="px-4 py-3">
//       <Tabs defaultActiveKey="info" items={items} />
//     </div>
//   );
// }
