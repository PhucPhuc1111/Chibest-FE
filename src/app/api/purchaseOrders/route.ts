// src/app/api/purchaseOrders/route.ts
import { NextResponse } from "next/server";
import type { PurchaseOrder,PurchaseOrderStatus } from "@/types/purchaseOrder";

export async function GET() {
  const data: PurchaseOrder[] = [
    {
      id: "PN031533",
      time: "23/10/2025 12:23",
      supplierCode: "NCC26",
      supplierName: "LEN DƯƠNG THỊNH",
      branch: "Chibest Quận 4",
      creator: "QUẢN LÝ Q4",
      receiver: "QUẢN LÝ Q4",
      needPayToSupplier: 142_000,
      status: "Đã nhập hàng",
    },
    {
      id: "PN031538",
      time: "23/10/2025 17:07",
      supplierCode: "NCC29",
      supplierName: "LEN HƯƠNG TÚ",
      branch: "Chibest Quận 4",
      creator: "QUẢN LÝ Q4",
      receiver: "QUẢN LÝ Q4",
      needPayToSupplier: 77_000,
      status: "Đã nhập hàng",
    },
    {
      id: "PN031529",
      time: "22/10/2025 20:43",
      supplierCode: "NCC27",
      supplierName: "LEN NHUNG KHIẾT",
      branch: "Chibest Quận 4",
      creator: "QUẢN LÝ Q4",
      receiver: "QUẢN LÝ Q4",
      needPayToSupplier: 132_000,
      status: "Đã nhập hàng",
    },
    {
      id: "PN031456",
      time: "13/10/2025 17:40",
      supplierCode: "NCC10",
      supplierName: "HOAN NGỌC",
      branch: "Chibest Quận 4",
      creator: "QUẢN LÝ Q4",
      receiver: "QUẢN LÝ Q4",
      needPayToSupplier: 13_000,
      status: "Đã nhập hàng",
    },
    {
      id: "PN031424",
      time: "09/10/2025 18:05",
      supplierCode: "NCC21",
      supplierName: "ĐỖ BỘ NHƯ HUYỀN",
      branch: "Chibest Quận 4",
      creator: "QUẢN LÝ Q4",
      receiver: "QUẢN LÝ Q4",
      needPayToSupplier: 26_000,
      status: "Đã nhập hàng",
    },
    // vài phiếu tạm để lọc
    ...Array.from({ length: 5 }).map((_, i) => ({
      id: `PN03140${i}`,
      time: `0${5 + i}/10/2025 11:3${i}`,
      supplierCode: `NCC1${i}`,
      supplierName: `NHÀ CUNG CẤP ${i + 1}`,
      branch: "Chibest Quận 4",
      creator: "QUẢN LÝ Q4",
      receiver: "QUẢN LÝ Q4",
      needPayToSupplier: 10_000 * (i + 1),
   status: (i % 2 ? "Phiếu tạm" : "Đã nhập hàng") as PurchaseOrderStatus

    })),
  ];

  return NextResponse.json(data);
}
