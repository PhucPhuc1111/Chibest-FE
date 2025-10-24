import { NextResponse } from "next/server";
import type { StockTake } from "@/types/stocktake";

export async function GET() {
  const data: StockTake[] = Array.from({ length: 10 }).map((_, i) => {
    const id = `KK0${15690 + i}`;
    const date = `${3 + i}/10/2025 10:${30 + i}`;
    const balanced = i % 3 === 0 ? `${3 + i}/10/2025 12:${15 + i}` : undefined;
    const status =
      i % 3 === 0 ? "Đã cân bằng kho" : i % 2 === 0 ? "Phiếu tạm" : "Đã hủy";
    const creator = ["QUẢN LÝ Q4", "KHO TĐ", "KHO Q7"][i % 3];
    const totalQty = 1000 + i * 20;
    const totalValue = 150_000_000 + i * 3_500_000;

    return {
      id,
      time: date,
      balanceDate: balanced,
      totalQty,
      totalValue,
      totalDiff: 0,
      increaseQty: 0,
      decreaseQty: 0,
      creator,
      status,
      items: [],
    };
  });

  return NextResponse.json(data);
}
