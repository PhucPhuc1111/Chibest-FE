// "use client";
// import { Table } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import dayjs from "dayjs";
// import type { Product, Variant, WarehouseRecord } from "@/types/product";

// interface Props {
//   master: Product;
//   variant: Variant;
// }

// export default function ProductWarehouseTab({  variant }: Props) {
//   const data: WarehouseRecord[] = [
//     {
//       id: "PN0001",
//       time: "2025-10-18T17:32:00",
//       type: "Nhận hàng",
//       tradePrice: 82000,
//       cost: 82000,
//       qty: 10,
//       ending: variant.stock,
//     },
//     {
//       id: "CB272072",
//       time: "2025-10-16T11:48:00",
//       type: "Cập nhật giá vốn",
//       tradePrice: 82000,
//       cost: 82000,
//       qty: 0,
//       ending: 0,
//     },
//   ];

//   const columns: ColumnsType<WarehouseRecord> = [
//     { title: "Chứng từ", dataIndex: "id", width: 160 },
//     {
//       title: "Thời gian",
//       dataIndex: "time",
//       width: 160,
//       render: (v: string) => dayjs(v).format("DD/MM/YYYY HH:mm"),
//     },
//     { title: "Loại giao dịch", dataIndex: "type", width: 220 },
//     { title: "Đối tác", dataIndex: "partner", width: 160 },
//     {
//       title: "Giá GD",
//       dataIndex: "tradePrice",
//       align: "right",
//       width: 120,
//       render: (v?: number) => (v ? v.toLocaleString() : ""),
//     },
//     {
//       title: "Giá vốn",
//       dataIndex: "cost",
//       align: "right",
//       width: 120,
//       render: (v?: number) => (v ? v.toLocaleString() : ""),
//     },
//     { title: "Số lượng", dataIndex: "qty", align: "center", width: 100 },
//     { title: "Tồn cuối", dataIndex: "ending", align: "center", width: 100 },
//   ];

//   return (
//     <div className="bg-white">
//       <Table
//         rowKey="id"
//         columns={columns}
//         dataSource={data}
//         pagination={false}
//         size="small"
//         scroll={{ x: 900 }}
//       />
//       <div className="mt-3 text-sm text-blue-600 cursor-pointer">
//         ↳ Xuất file
//       </div>
//     </div>
//   );
// }
