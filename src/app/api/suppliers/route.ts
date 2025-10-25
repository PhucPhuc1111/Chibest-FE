import { NextResponse } from "next/server";
import type { Supplier,SupplierStatus  } from "@/types/supplier";

// Seed 20 NCC (demo)
const seed: Supplier[] = [
  {
    id: "NCC01",
    name: "LAN THUN",
    phone: "0399835278",
    email: "",
    group: null,
    createdAt: "08/01/2025 10:46",
    totalPurchase: 724_388_000,
    currentDebt: 1_513_471_500,
    status: "Đang hoạt động",
    creator: "LIÊU,JB",
    branch: "Chibest Gò Vấp",
    address: "A20 Vĩnh Phát, Xã Ninh Hiệp, H. Gia Lâm, Hà Nội",
    note: null,
  },
  {
    id: "NCC02",
    name: "DÂY NỊT LONG THỦY",
    phone: "09387129898",
    email: "",
    group: null,
    createdAt: "09/01/2025 09:00",
    totalPurchase: 64_899_000,
    currentDebt: 0,
    status: "Đang hoạt động",
    creator: "LIÊU,JB",
    branch: "Chibest Gò Vấp",
    address: "—",
    note: null,
  },
  {
    id: "NCC03",
    name: "ANH CHÂU",
    phone: "0966472978",
    email: "",
    group: "ÁO DÀI",
    createdAt: "12/01/2025 14:32",
    totalPurchase: 4_735_342_000,
    currentDebt: -314_241_000,
    status: "Đang hoạt động",
    creator: "LIÊU,JB",
    branch: "Chibest Quận 4",
    address: "",
    note: null,
  },
  {
    id: "NCC04",
    name: "NGUYỄN THỦY",
    phone: "0988334784",
    email: "",
    group: "ĐẦM",
    createdAt: "14/01/2025 10:20",
    totalPurchase: 1_981_509_500,
    currentDebt: 102_100_000,
    status: "Đang hoạt động",
    creator: "LIÊU,JB",
    branch: "Chibest Quận 4",
    address: "",
    note: null,
  },
  {
    id: "NCC05",
    name: "LEN HƯƠNG TÚ",
    phone: "0975524315",
    email: "",
    group: "ÁO KHOÁC",
    createdAt: "08/01/2025 10:46",
    totalPurchase: 32_519_568_200,
    currentDebt: 59_106_843_217,
    status: "Đang hoạt động",
    creator: "LIÊU,JB",
    branch: "Chibest Quận 4",
    address: "",
    note: null,
  },
  // ... thêm 15 bản ghi đa dạng
  {
    id: "NCC06",
    name: "ĐỒ BỘ THÁO",
    phone: "0975191360",
    email: "",
    group: "ĐỒ BỘ",
    createdAt: "08/01/2025 10:46",
    totalPurchase: 170_701_000,
    currentDebt: -41_134_000,
    status: "Đang hoạt động",
    creator: "LIÊU,JB",
    branch: "Chibest Quận 4",
    address: "",
    note: null,
  },
  {
    id: "NCC07",
    name: "LEN NHUNG KHIẾT",
    phone: "0973354041",
    email: "",
    group: "ÁO THUN",
    createdAt: "08/01/2025 10:46",
    totalPurchase: 402_981_000,
    currentDebt: -32_957_000,
    status: "Đang hoạt động",
    creator: "LIÊU,JB",
    branch: "Chibest Quận 4",
    address: "",
    note: null,
  },
  {
    id: "NCC08",
    name: "LEN DƯƠNG THỊNH",
    phone: "0977880731",
    email: "",
    group: "ÁO KHOÁC",
    createdAt: "08/01/2025 10:46",
    totalPurchase: 0,
    currentDebt: 421_827_000,
    status: "Đang hoạt động",
    creator: "LIÊU,JB",
    branch: "Chibest Gò Vấp",
    address: "A20 Vĩnh Phát, Xã Ninh Hiệp, H. Gia Lâm, Hà Nội",
    note: null,
  },
  {
    id: "NCC09",
    name: "LEN KHOAN THÚY",
    phone: "0982545933",
    email: "",
    group: "ÁO THUN",
    createdAt: "09/01/2025 12:10",
    totalPurchase: 350_778_000,
    currentDebt: 19_330_000,
    status: "Đang hoạt động",
    creator: "LIÊU,JB",
    branch: "Chibest Quận 4",
    address: "",
    note: null,
  },
  {
    id: "NCC10",
    name: "LEN QUANG HÀ",
    phone: "0989407053",
    email: "",
    group: "ĐẦM",
    createdAt: "10/01/2025 09:00",
    totalPurchase: 350_778_000,
    currentDebt: 4_088_000,
    status: "Đang hoạt động",
    creator: "LIÊU,JB",
    branch: "Chibest Quận 4",
    address: "",
    note: null,
  },
  // bổ sung để đủ 20 NCC (giá trị ngẫu nhiên hợp lý)
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `NCC${10 + i + 1}`,
    name: `NHÀ CUNG CẤP ${i + 1}`,
    phone: `0900000${i}`,
    email: "",
    group: i % 2 ? "ÁO THUN" : "ĐẦM",
    createdAt: "15/01/2025 10:00",
    totalPurchase: Math.floor(100_000_000 + Math.random() * 600_000_000),
    currentDebt: Math.floor(-50_000_000 + Math.random() * 300_000_000),
   status: (i % 7 === 0 ? "Ngừng hoạt động" : "Đang hoạt động") as SupplierStatus,

    creator: "LIÊU,JB",
    branch: "Chibest Quận 4",
    address: "",
    note: null,
  })),
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const group = searchParams.get("group");
  const totalFrom = Number(searchParams.get("totalFrom") ?? "") || null;
  const totalTo = Number(searchParams.get("totalTo") ?? "") || null;
  const debtFrom = Number(searchParams.get("debtFrom") ?? "") || null;
  const debtTo = Number(searchParams.get("debtTo") ?? "") || null;
  const statusParams = searchParams.getAll("status");

  let data = seed;

  if (q) {
    data = data.filter(
      (d) =>
        d.id.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.phone?.includes(q)
    );
  }
  if (group) data = data.filter((d) => (d.group || "") === group);
  if (totalFrom !== null) data = data.filter((d) => d.totalPurchase >= totalFrom);
  if (totalTo !== null) data = data.filter((d) => d.totalPurchase <= totalTo);
  if (debtFrom !== null) data = data.filter((d) => d.currentDebt >= debtFrom);
  if (debtTo !== null) data = data.filter((d) => d.currentDebt <= debtTo);
  if (statusParams.length) data = data.filter((d) => statusParams.includes(d.status));

  return NextResponse.json(data);
}
