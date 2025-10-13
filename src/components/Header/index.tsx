import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DropdownUser from "../Header/DropdownUser";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { baseURL } from "@/services/apiClient";

const Header = (props: {
  sidebarOpen: boolean;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [user, setUser] = useState<{
    email: string;
    role: string;
    name: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      refreshAccessToken();
      return;
    }

    fetchUserData(accessToken);
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch(`${baseURL}/api/user/whoami`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser({ email: data.email, role: data.role, name: data.name });

        // ✅ Lưu tất cả thông tin vào Cookies
        Cookies.set("userName", data.name, { expires: 7 });
        Cookies.set("userEmail", data.email, { expires: 7 });
        Cookies.set("userRole", data.role, { expires: 7 });
      } else {
        refreshAccessToken();
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng", error);
    }
  };

  // Hàm làm mới Access Token
  const refreshAccessToken = async () => {
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      handleLogout();
      return;
    }

    try {
      const response = await fetch(`${baseURL}/api/user/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        handleLogout();
        return;
      }

      const result = await response.json();
      Cookies.set("accessToken", result.accessToken, { expires: 1 / 24 });
      fetchUserData(result.accessToken);
    } catch (error) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userEmail");
    Cookies.remove("userRole");
    Cookies.remove("userName");
    setUser(null);
    router.push("/auth/signin");
  };

  return (
    <div className="sticky top-0 z-999 w-full bg-white px-2 py-3">
      <div className="flex justify-between">
        <div>
          <ol className="flex cursor-pointer space-x-15 p-5">
            <Link href="/">
              <li className="text-black hover:text-green-800">Trang chủ</li>
            </Link>
            <Link href="/product">
              <li className="text-black hover:text-green-800">Ứng dụng</li>
            </Link>
            <Link href="/contact">
              <li className="text-black hover:text-green-800">Liên hệ</li>
            </Link>
          </ol>
        </div>
        <div className="flex pr-16">
          <Link href="/">
            <Image
              src="/images/logo/logo.png"
              alt="Logo"
              width={60}
              height={60}
            />
          </Link>
          <div className="mt-2">
            <p className="text-xl font-bold text-black">
              NutriDiet Administrator
            </p>
            <p className="text-sm">Your Personal Nutrition</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <DropdownUser user={user} handleLogout={handleLogout} />
          ) : (
            <Link href="/auth/signin">
              <button className="w-48 rounded-md bg-green-800 p-2 text-white hover:bg-white hover:text-green-800">
                Đăng nhập
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
