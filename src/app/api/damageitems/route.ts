import { NextResponse } from "next/server";
import type { DamageDoc } from "@/types/damageitem";

const genItems = (seed: number) => {
  const goods = [
    ["HQA32DS", "Quần tây suông ruby ko đai - ĐEN - S"],
    ["HQA32DM", "Quần tây suông ruby ko đai - ĐEN - M"],
    ["HVA102S", "Chân váy jean bi dây đai - S"],
    ["HVA102M", "Chân váy jean bi dây đai - M"],
    ["DBAT107", "Đồ bộ dài viền ren"],
    ["LDA21DM", "Đầm bi phối lưới nhún eo - ĐEN - M"],
    ["LDA21TL", "Đầm bi phối lưới nhún eo - TRẮNG - L"],
    ["AAC63X", "Áo somi kẻ sọc tay gấp line - XANH"],
  ];
  return Array.from({ length: 4 + (seed % 3) }).map((_, i) => {
    const g = goods[(seed + i) % goods.length];
    const qty = 1 + ((seed + i) % 6);
    const price = 45000 + ((seed * 7 + i * 3) % 120000);
    return { id: g[0], name: g[1], qty, price };
  });
};

export async function GET() {
  const docs: DamageDoc[] = Array.from({ length: 12 }).map((_, i) => {
    const id = `DMG10${(i + 1).toString().padStart(2, "0")}`;
    const statuses: DamageDoc["status"][] = ["Phiếu tạm", "Hoàn thành", "Đã hủy"];
    const status = statuses[i % 3];
    const items = genItems(i + 1);
    const total = items.reduce((a, b) => a + b.qty * b.price, 0);

    return {
      id,
      time: `${20 + ((i + 3) % 10)}/10/2025 ${9 + (i % 8)}:${(i % 2) ? "30" : "05"}`,
      branch: ["Chibest Quận 4", "Chibest Thủ Đức", "CHIBEST"][i % 3],
      note: i % 2 === 0 ? "Hàng lỗi hư kho Q4" : "Hư hỏng khi trưng bày",
      totalValue: total,
      status,
      creator: ["NV_KHO Q4", "QUẢN LÝ Q4", "KIMCHI"][i % 3],
      destroyer: ["NV_KHO Q4", "KIMCHI", "MIU"][2 - (i % 3)],
      items,
    };
  });

  return NextResponse.json(docs);
}
