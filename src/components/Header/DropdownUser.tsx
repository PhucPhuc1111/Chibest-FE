import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import Cookies from "js-cookie";

const DropdownUser = ({
  user,
  handleLogout,
}: {
  user: { name: string; email: string; role: string } | null;
  handleLogout: () => void;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div>
      {user ? (
        <ClickOutside
          onClick={() => setDropdownOpen(false)}
          className="relative"
        >
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-4"
          >
            <span className="hidden text-right lg:block">
              <span className="block text-sm font-medium text-black">
                {user.name}
              </span>
              <span className="block text-xs">{user.role}</span>
            </span>
            <span className="h-12 w-12 rounded-full">
              <Image
                src="/images/user/user-01.png"
                width={112}
                height={112}
                alt="User"
              />
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-4 w-48 rounded-lg bg-white shadow-lg">
              <ul>
                <li>
                  <Link
                    href="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                   Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </ClickOutside>
      ) : (
        <Link href="/auth/signin">
          <button className="rounded bg-green-800 px-4 py-2 text-white">
            Quản trị viên đăng nhập
          </button>
        </Link>
      )}
    </div>
  );
};

export default DropdownUser;
