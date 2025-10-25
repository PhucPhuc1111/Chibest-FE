// src/app/api/purchaseOrders/[id]/route.ts
import { NextResponse } from "next/server";
import type { PurchaseOrder, PurchaseOrderItem } from "@/types/purchaseOrder";
import { GET as getAll } from "../route";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> } // Next 15
) {
  const { id } = await ctx.params;

  const res = await getAll();
  const list = (await res.json()) as PurchaseOrder[];
  const found = list.find((x) => x.id === decodeURIComponent(id));

  if (!found) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const items: PurchaseOrderItem[] = [
    {
      id: "HDA42XM",
      name: "Đầm maxi tơ ánh cổ yếm - XANH - M",
      qty: 1,
      unitPrice: 142000,
      discount: 0,
      buyPrice: 142000,
    },
    {
      id: "LQA111DL",
      name: "Quần lụa áo dài 02 - ĐỎ - L",
      qty: 2,
      unitPrice: 54000,
      discount: 0,
      buyPrice: 54000,
    },
    {
      id: "LQA111HS",
      name: "Quần lụa áo dài 02 - HỒNG - S",
      qty: 1,
      unitPrice: 54000,
      discount: 1000,
      buyPrice: 53000,
    },
  ];

  const detail: PurchaseOrder = {
    ...found,
    items,
    note: "Hàng đã trừ kho sale,",
  };

  return NextResponse.json(detail);
}
