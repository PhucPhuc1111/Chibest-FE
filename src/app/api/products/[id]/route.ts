import { NextResponse } from "next/server";
import type { Product } from "@/types/product";
import { GET as getAll } from "../route";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } 
) {
  const { id } = await context.params; 

  const allResponse = await getAll(new Request("http://local"));
  const allProducts = (await allResponse.json()) as Product[];

  const found = allProducts.find((p) => p.id === id);

  if (!found) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(found);
}
