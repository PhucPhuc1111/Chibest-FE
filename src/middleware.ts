import { NextRequest, NextResponse } from "next/server";


export async function middleware(req: NextRequest) {
  let token = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const role = req.cookies.get("userRole")?.value;


  if (!token && !refreshToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (role !== "Admin" && role !== "Nutritionist") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!token && refreshToken) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      const data = await response.json();
      token = data.accessToken;

      // Tạo Response mới và cập nhật Cookie Access Token
      const res = NextResponse.next();
      if (token) {
        res.cookies.set("accessToken", token, { httpOnly: true, secure: true, path: "/" });
      }
      return res;
    } catch (error) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  
  // Kiểm tra quyền truy cập cho Nutritionist
  if (role === "Nutritionist") {
    const path = req.nextUrl.pathname;

    // Kiểm tra nếu đường dẫn bắt đầu với các path cho phép
    const allowedPaths = [
      "/admin/dashboard",
      "/admin/disease",
      "/admin/food",
      "/admin/feedback",
      "/admin/allergy",
      "/admin/ingredient",
      "/admin/meal",
    ];

    // Kiểm tra nếu path bắt đầu bằng một trong các path cho phép hoặc là một subpath của chúng
    if (!allowedPaths.some(allowedPath => path.startsWith(allowedPath))) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  return NextResponse.next();
}
// Áp dụng middleware cho tất cả các route bắt đầu với "/admin/"
export const config = {
  matcher: "/admin/:path*",
};
