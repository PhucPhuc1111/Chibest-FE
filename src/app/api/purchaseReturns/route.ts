import { NextResponse } from "next/server";
import type { PurchaseReturn } from "@/types/purchaseReturn";

export async function GET() {
  const list: PurchaseReturn[] = [
    {
      id: "THN09556",
      time: "23/10/2025 17:26",
      supplierName: "Hàng sale quần jean",
      creator: "QUẢN LÝ Q4",
      receiver: "QUẢN LÝ Q4",
      branch: "Chibest Quận 4",
      total: 12_002_000,
      discount: 0,
      supplierPay: 12_002_000,
      supplierPaid: 0,
      status: "Đã trả hàng",
    },
    ...Array.from({ length: 7 }).map((_, i) => ({
      id: `THN0095${60 + i}`,
      time: `2${i}/10/2025 ${12 + i}:3${i}`,
      supplierName: `Hàng sale ${["áo", "quần", "đầm", "kaki", "set"][i % 5]}`,
      creator: "QUẢN LÝ Q4",
      receiver: "QUẢN LÝ Q4",
      branch: "Chibest Quận 4",
      total: Math.floor(5_000_000 + Math.random() * 80_000_000),
      discount: 0,
      supplierPay: Math.floor(5_000_000 + Math.random() * 80_000_000),
      supplierPaid: 0,
      status: "Đã trả hàng" as const,
    })),
  ];

  return NextResponse.json(list);
}
