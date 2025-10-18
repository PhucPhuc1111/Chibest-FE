import { NextResponse } from "next/server";

type Product = {
  id: string;
  name: string;
  variant: string;      // “KEM - S”
  group: string;        // “Áo KIỂU/SOMI”
  type: string;         // “Hàng hóa thường”
  sellType: string;     // “Bán trực tiếp”
  point: string;        // “Không tích điểm”
  image: string;
  price: number;
  cost: number;
  stock: number;        // tồn kho
  createdAt: string;    // ISO
  supplier?: string;    // nhà cung cấp
  attrs?: { color?: string; size?: string } // thuộc tính
};
const imageUrl =
  "https://dptmgixyejobj-domestic307-sg.vcdn.cloud/2025/10/17/shopledaihanh/e7bcf1affe1d48ceb66530db0cb5eef9.jpeg";
const mockProducts: Product[] = [
  {
    id: "HAA103KS",
    name: "Áo tơ tầng viền ren",
    variant: "KEM - S",
    group: "Áo KIỂU/SOMI",
    type: "Hàng hóa thường",
    sellType: "Bán trực tiếp",
    point: "Không tích điểm",
    image: imageUrl,
    price: 155000,
    cost: 92000,
    stock: 0,
    createdAt: "2025-10-17T15:18:00",
    supplier: "Nhà cung cấp A",
    attrs: { color: "KEM", size: "S" },
  },
  {
    id: "HAA103KM",
    name: "Áo tơ tầng viền ren",
    variant: "KEM - M",
    group: "Áo KIỂU/SOMI",
    type: "Hàng hóa thường",
    sellType: "Bán trực tiếp",
    point: "Không tích điểm",
   image: imageUrl,
    price: 155000,
    cost: 92000,
    stock: 3,
    createdAt: "2025-10-17T15:18:00",
    supplier: "Nhà cung cấp A",
    attrs: { color: "KEM", size: "M" },
  },
  {
    id: "HAA103DM",
    name: "Áo tơ tầng viền ren",
    variant: "ĐEN - S",
    group: "Áo KIỂU/SOMI",
    type: "Hàng hóa thường",
    sellType: "Bán trực tiếp",
    point: "Không tích điểm",
    image: imageUrl,
    price: 155000,
    cost: 92000,
    stock: 6,
    createdAt: "2025-10-17T15:19:00",
    supplier: "Nhà cung cấp A",
    attrs: { color: "ĐEN", size: "S" },
  },
  {
    id: "HAA104TS",
    name: "Áo bbd linen cổ viền ren",
    variant: "TRẮNG - S",
    group: "Áo KIỂU/SOMI",
    type: "Hàng hóa thường",
    sellType: "Bán trực tiếp",
    point: "Không tích điểm",
   image: imageUrl,
    price: 149000,
    cost: 85000,
    stock: 10,
    createdAt: "2025-10-17T15:21:00",
    supplier: "Nhà cung cấp B",
    attrs: { color: "TRẮNG", size: "S" },
  },
  {
    id: "QJ001BL",
    name: "Quần jeans xanh đậm",
    variant: "BLUE - M",
    group: "Quần JEANS",
    type: "Hàng hóa thường",
    sellType: "Bán trực tiếp",
    point: "Không tích điểm",
  image: imageUrl,
    price: 299000,
    cost: 210000,
    stock: 2,
    createdAt: "2025-10-15T12:00:00",
    supplier: "Nhà cung cấp C",
    attrs: { color: "XANH", size: "M" },
  },
  // thêm vài sản phẩm để bảng “dày” hơn
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: `SP10${i}`,
    name: `Hàng mẫu ${i + 1}`,
    variant: i % 2 === 0 ? "KEM - S" : "ĐEN - M",
    group: i % 2 === 0 ? "Áo KIỂU/SOMI" : "Quần JEANS",
    type: "Hàng hóa thường",
    sellType: "Bán trực tiếp",
    point: "Không tích điểm",
   image: imageUrl,
    price: 100000 + i * 5000,
    cost: 60000 + i * 3000,
    stock: i % 3 === 0 ? 0 : i + 1,
    createdAt: `2025-10-1${(i % 9) + 1}T09:0${i}:00`,
    supplier: i % 2 === 0 ? "Nhà cung cấp A" : "Nhà cung cấp B",
    attrs: { color: i % 2 === 0 ? "KEM" : "ĐEN", size: i % 2 === 0 ? "S" : "M" },
  })),
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // query params
  const q = (searchParams.get("q") || "").toLowerCase();
  const group = searchParams.get("group");                 // “Áo KIỂU/SOMI”
  const stock = searchParams.get("stock");                 // all | out | in
  const supplier = searchParams.get("supplier");
  const createdFrom = searchParams.get("createdFrom");
  const createdTo = searchParams.get("createdTo");
  const color = searchParams.get("color");
  const size = searchParams.get("size");

  let data = [...mockProducts];

  if (q) {
    data = data.filter(
      p =>
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.variant.toLowerCase().includes(q)
    );
  }
  if (group) data = data.filter(p => p.group === group);
  if (supplier) data = data.filter(p => p.supplier === supplier);
  if (stock === "out") data = data.filter(p => p.stock <= 0);
  if (stock === "in") data = data.filter(p => p.stock > 0);
  if (createdFrom) data = data.filter(p => new Date(p.createdAt) >= new Date(createdFrom));
  if (createdTo) data = data.filter(p => new Date(p.createdAt) <= new Date(createdTo));
  if (color) data = data.filter(p => p.attrs?.color === color);
  if (size) data = data.filter(p => p.attrs?.size === size);

  return NextResponse.json(data);
}
