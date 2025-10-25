import { NextResponse } from "next/server";
import type { PriceBookItem } from "@/types/pricebook";

const groups = [
  "ÁO DÀI", "ÁO KHOÁC", "ÁO KIỂU/SOMI", "ÁO THUN", "CHÂN VÁY",
  "ĐẦM", "ĐỒ LÓT", "ĐỒ NGỦ", "HÀNG LEN", "CHIBEST ĐÀ NẴNG"
];

export async function GET() {
  const data: PriceBookItem[] = Array.from({ length: 25 }).map((_, i) => {
    const group = groups[i % groups.length];
    const cost = 54000 + (i % 3) * 1000;
    const importPrice = cost + 1000;
    const common = 95000 + ((i * 3) % 5000);
    return {
      id: `LQA11${100 + i}`,
      name: `Quần lụa áo dài 02 - ${["ĐỎ", "HỒNG", "TRẮNG", "XANH"][i % 4]} - ${
        ["S", "M", "L"][i % 3]
      }`,
      group,
      costPrice: cost,
      lastImport: importPrice,
      commonPrice: common,
    };
  });

  return NextResponse.json(data);
}
