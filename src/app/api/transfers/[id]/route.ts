import { NextResponse } from "next/server";
import type { Transfer } from "@/types/transfer";
import { GET as getAll } from "../route";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 params giờ là Promise
) {
  const { id } = await context.params;         // 👈 phải await
  const decodedId = decodeURIComponent(id);

  const res = await getAll();
  const transfers = (await res.json()) as Transfer[];
  const found = transfers.find((x) => x.id === decodedId);

  return found
    ? NextResponse.json(found)
    : NextResponse.json({ message: "Not found" }, { status: 404 });
}
