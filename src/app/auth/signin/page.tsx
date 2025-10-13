"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "@/components/Layouts/AuthLayout";
import { useRouter } from "next/navigation";
import { baseURL } from "@/services/apiClient";
import { SigninFormSchema } from "@/app/auth/auth";
import Cookies from "js-cookie";

export type SigninFormData = z.infer<typeof SigninFormSchema>;

// Hàm làm mới Access Token
const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      throw new Error("Refresh Token không tồn tại");
    }

    const response = await fetch(`${baseURL}/api/user/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Không thể làm mới Access Token");
    }

    const result = await response.json();

    // Lưu Access Token mới
    Cookies.set("accessToken", result.data.accessToken, { expires: 1 / 24 });

    return result.data.accessToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Hàm gọi API có tự động làm mới Access Token khi bị lỗi 401
const fetchWithAuth = async (
  url: string,
  options: { headers?: HeadersInit } = {},
) => {
  let accessToken = Cookies.get("accessToken");

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    // Access Token hết hạn -> làm mới
    accessToken = await refreshAccessToken();
    if (accessToken) {
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  }

  return response.json();
};

const SignIn: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    resolver: zodResolver(SigninFormSchema),
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<SigninFormData> = async (data) => {
    try {
      const response = await fetch(`${baseURL}/api/user/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Sai email hoặc mật khẩu");
      }

      const result = await response.json();

      if (
        !result.data ||
        !result.data.role ||
        !result.data.accessToken ||
        !result.data.refreshToken
      ) {
        throw new Error("Dữ liệu không hợp lệ từ máy chủ");
      }

      if (result.data.role !== "Admin" && result.data.role !== "Nutritionist") {
        toast.error("Bạn không có quyền truy cập vào trang quản trị!");
        return;
      }

      // Lưu Access Token & Refresh Token
      Cookies.set("accessToken", result.data.accessToken, { expires: 1 / 24 }); // Token sống 1 giờ
      Cookies.set("refreshToken", result.data.refreshToken, { expires: 7 }); // Token sống 7 ngày
      Cookies.set("userRole", result.data.role, { expires: 7 });
      Cookies.set("userName", result.data.name, { expires: 7 });

      toast.success("Đăng nhập thành công!");
     
      // Delay the navigation to make sure cookies are set
      setTimeout(() => {
        window.location.href="/admin/dashboard"
      }, 500);
    } catch (error: any) {
      toast.error(error.message || "Đã xảy ra lỗi không mong muốn");
    }
  };

  return (
    <div className="h-screen">
      <AuthLayout>
        <div className="flex items-center justify-center bg-gray-100 pt-7 dark:bg-gray-900">
          <div className="w-full max-w-md rounded-xl border border-gray-300 bg-white p-8 shadow-xl dark:border-green-700 dark:bg-green-800">
            <div className="flex flex-col items-center">
              {/* Logo */}
              <Link href="/" className="mb-4">
                <Image
                  src="/images/logo/logo.png"
                  alt="Logo"
                  width={80}
                  height={80}
                  className="rounded-full shadow-lg"
                />
              </Link>
              <p className="mb-4 text-center text-gray-600 dark:text-gray-300">
                Hệ thống đề xuất chế độ ăn uống lành mạnh.
              </p>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
                Đăng nhập
              </h2>
              <p className="mb-6 text-center text-gray-500 dark:text-gray-300">
                Chỉ quản trị viên được phép đăng nhập
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        value={field.value ?? ""}
                        type="email"
                        className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mật khẩu
                  </label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        value={field.value ?? ""}
                        type="password"
                        className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-green-700 py-3 text-white transition hover:bg-green-800 hover:shadow-lg disabled:bg-gray-400"
                >
                  {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </AuthLayout>
    </div>
  );
};

export default SignIn;
