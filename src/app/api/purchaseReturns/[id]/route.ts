import { NextResponse } from "next/server";
import type { PurchaseReturn } from "@/types/purchaseReturn";
import { GET as getAll } from "../route";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> } // ✅ params là Promise
) {
  const { id } = await ctx.params; // ✅ await để lấy giá trị thật

  const res = await getAll();
  const list = (await res.json()) as PurchaseReturn[];
  const found = list.find((x) => x.id === decodeURIComponent(id));

  if (!found)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  const detail: PurchaseReturn = {
    ...found,
    items: [
      {
        id: "EQD115ES",
        name: "Quần jean baggy ống nhỏ - DEN - S",
        qty: 2,
        buyPrice: 91000,
        returnPrice: 91000,
      },
      {
        id: "EQA31XS",
        name: "Quần baggy ống rộng tua line - XANH - S",
        qty: 2,
        buyPrice: 100000,
        returnPrice: 100000,
      },
    ],
  };

  return NextResponse.json(detail);
}
