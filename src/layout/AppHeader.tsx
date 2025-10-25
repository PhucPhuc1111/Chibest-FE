"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import { BoxCubeIcon, CalenderIcon, GridIcon, PieChartIcon } from "@/icons";
import Image from "next/image";
import Link from "next/link";
import React, { useState ,useEffect,useRef} from "react";


const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
 const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const {  toggleSidebar, toggleMobileSidebar } = useSidebar();
 const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };
type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
    megaMenu?: boolean;
  };
    // ======== MAIN NAV ITEMS =========
const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Tổng quan",
    // subItems: [
    //    { name: "Dashboard", path: "/", pro: false },
    //   { name: "Chi nhánh", path: "/branch/branch-list", pro: false },
    //   { name: "Quản lý nhân viên", path: "/system-management/user-list", pro: false },

    // ],
     path: "/",
  },
  {
    icon: <CalenderIcon />,
    name: "Hàng hóa",
      megaMenu: true,
    // subItems: [
    //   { name: "Kho hàng", path: "/warehouse/warehouse-list", pro: false },
    //   { name: "Loại sản phẩm", path: "/category/category-list", pro: false },
    //   { name: "Quy cách", path: "/unit/unit-list", pro: false },
    //   { name: "Sản phẩm", path: "/product/product-list", pro: false },
    //   { name: "Mã vạch- Nhãn sản phẩm", path: "/ean/ean-list", pro: false },

    // ],
  
  },
   {
      icon: <PieChartIcon />,
      name: "Đơn hàng",
      path: "/order/demo",
    },
    {
      icon: <BoxCubeIcon />,
      name: "Khách hàng",
      path: "/customer/demo",
    },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "Quản lý kho",
  //   subItems: [
  //     { name: "Nhập kho", path: "/stockin/stockin-list", pro: false },
  //     { name: "Chuyển hàng", path: "/move/move-list", pro: false },
  //     { name: "Xóa tag", path: "/clear-tag/clear-tag-list", pro: false },
  //   ],
  // },
  // {
  
  //   icon: <PieChartIcon />,
  //   name: "Kiểm kê",
  //   path:"/inventory/inventory-list",
  // },
  // {
  //   icon: <PieChartIcon />,
  //   name: "Báo cáo",
  //   subItems: [
  //     { name: "Đối soát", path: "/report/report-list", pro: false },]
  // },

];

  // ======== HÀNG HÓA MEGA MENU DATA =========
 const hangHoaMegaMenu = [
    {
      title: "Hàng hóa",
      items: [
        { name: "Danh sách hàng hóa", path: "/products" },
        { name: "Thiết lập giá", path: "/pricebook" },
      ],
    },
    {
      title: "Kho hàng",
      items: [
        { name: "Chuyển hàng", path: "/transfers" },
        { name: "Kiểm kho", path: "/stocktakes" },
        { name: "Xuất hủy", path: "/damageitems" },
      ],
    },
    {
      title: "Nhập hàng",
      items: [
        { name: "Nhà cung cấp", path: "/suppliers" },
        { name: "Nhập hàng", path: "/nhaphang/demo2" },
        { name: "Trả hàng nhập", path: "/nhaphang/demo3" },
      ],
    },
  ];

  // ======== MEGA MENU COMPONENT =========
  const renderMegaMenu = () => (
    <div
      className="absolute left-0 top-full mt-2 bg-white dark:bg-gray-900 shadow-lg rounded-xl p-5 grid grid-cols-3 gap-8 w-[760px] z-50 border border-gray-200 dark:border-gray-700 transition-all"
      onMouseEnter={() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }}
      onMouseLeave={() => setActiveMenu(null)}
    >
      {hangHoaMegaMenu.map((group, idx) => (
        <div key={idx}>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3 uppercase tracking-wide">
            {group.title}
          </h4>
          <ul className="space-y-2">
            {group.items.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.path}
                  className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const toggleApplicationMenu = () => setApplicationMenuOpen(!isApplicationMenuOpen);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  // ======== HEADER ========
  return (
     <div className="sticky top-0 w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 z-[50] lg:border-b">
      {/* Header top row */}
      <header className="flex flex-col lg:flex-row w-full bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 lg:justify-normal lg:border-b-0 lg:px-6 lg:py-4">
          {/* Sidebar toggle button */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 rounded-lg"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              width={60}
              height={60}
              src="/images/logo/logo.jpg"
              alt="Logo"
              className="rounded-lg"
            />
          </Link>

          {/* Application Menu (3 dots mobile) */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            ⋮
          </button>

          {/* Search bar */}
          <div className="hidden lg:block flex-1">
            <form>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search or type command..."
                  className="w-full h-11 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent pl-11 pr-4 text-sm text-gray-800 dark:text-white shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/40 transition"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right side (Theme, Notif, User) */}
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-6`}
        >
          <div className="flex items-center gap-3">
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>
          <UserDropdown />
        </div>
      </header>

      {/* ======== NAVBAR ======== */}
      <nav className="hidden lg:flex items-center  bg-amber-100 dark:text-brand-500 dark:bg-gray-900  text-sm">
        {navItems.map((nav) => (
          <div
            key={nav.name}
            className="relative p-1"
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              if (nav.megaMenu) setActiveMenu(nav.name);
            }}
            onMouseLeave={() => {
              timeoutRef.current = setTimeout(() => setActiveMenu(null), 200);
            }}
          >
            {/* Main nav item */}
            <button
              className={`flex items-center  gap-2 px-4 py-2 rounded-lg  hover:bg-amber-200 dark:hover:bg-gray-800 transition ${
                activeMenu === nav.name ? "text-black-600 bg-amber-200 rounded-lg dark:bg-gray-800" : ""
              }`}
            >
              {nav.icon}
              <span>{nav.name}</span>
              {nav.megaMenu && (
                <svg
                  className="w-4 h-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M5.5 8l4.5 4 4.5-4" />
                </svg>
              )}
            </button>

            {/* Render mega menu */}
            {nav.megaMenu && activeMenu === nav.name && renderMegaMenu()}

            {/* Normal submenu */}
            {nav.subItems && (
              <div className="absolute left-0 top-full mt-2 bg-white dark:bg-gray-900 shadow-lg rounded-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all">
                {nav.subItems.map((sub) => (
                  <Link
                    key={sub.name}
                    href={sub.path}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default AppHeader;
