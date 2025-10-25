import { NextResponse } from "next/server";
import type { DamageDoc } from "@/types/damageitem";
import { GET as getAll } from "../route";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; // Next.js 15: params là Promise
  const res = await getAll();
  const data = (await res.json()) as DamageDoc[];
  const found = data.find((x) => x.id === decodeURIComponent(id));
  return found
    ? NextResponse.json(found)
    : NextResponse.json({ message: "Not found" }, { status: 404 });
}
