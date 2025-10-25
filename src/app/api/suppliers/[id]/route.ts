import { NextResponse } from "next/server";
import type { Supplier } from "@/types/supplier";
import { GET as getAll } from "../route";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> } // Next 15: params là Promise
) {
  const { id } = await ctx.params;
  const res = await getAll(new Request("http://local"));
  const list = (await res.json()) as Supplier[];
  const found = list.find((x) => x.id === decodeURIComponent(id));

  if (!found) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  // ✅ Gắn mock công nợ chi tiết (đúng type SupplierDebt)
  const debts = [
    {
      id: "CB248833",
      time: "01/05/2025 00:00",
      type: "Điều chỉnh" as const,
      amount: 421_827_000,
      debt: 421_827_000,
    },
    {
      id: "CB248834",
      time: "02/05/2025 08:45",
      type: "Phiếu nhập" as const,
      amount: 195_500_000,
      debt: 617_327_000,
    },
    {
      id: "CB248835",
      time: "05/05/2025 12:30",
      type: "Thanh toán" as const,
      amount: -150_000_000,
      debt: 467_327_000,
    },
  ];

  const detail: Supplier = {
    ...found,
    debts,
  };

  return NextResponse.json(detail);
}
