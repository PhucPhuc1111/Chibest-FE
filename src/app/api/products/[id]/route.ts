import { NextResponse } from "next/server";
import type { Product } from "@/types/product";
import { GET as getAll } from "../route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const allResponse = await getAll(req);
  const allProducts = (await allResponse.json()) as Product[];
  const found = allProducts.find((p) => p.id === params.id);

  if (!found) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(found);
}
