import { NextResponse } from "next/server";
import type { StockTake } from "@/types/stocktake";
import { GET as getAll } from "../route";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const res = await getAll();
  const stocktakes = (await res.json()) as StockTake[];
  const found = stocktakes.find((x) => x.id === id);

  if (!found)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  // mock 10 sản phẩm kiểm kho
  found.items = Array.from({ length: 10 }).map((_, i) => ({
    id: `HDA013${i + 1}`,
    name: `Đầm gấm hoa ${["ĐỎ", "HỒNG", "KEM"][i % 3]} - ${["S", "M"][i % 2]}`,
    stock: 5 + i,
    actual: 5 + i,
    diff: 0,
    diffValue: 0,
  }));

  return NextResponse.json(found);
}
