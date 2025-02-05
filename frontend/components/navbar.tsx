"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Guest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(userData.name || userData.fullName || "User");
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("Guest");
    router.push("/login");
  };

  const categories = [
    "Categories",
    "Sale",
    "Clearance",
    "New stock",
    "Trending",
  ];

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-end px-4 py-2 text-sm text-gray-600 border-b border-gray-50">
          <div className="flex items-center space-x-6">
            <Link
              href="/help"
              className="hover:text-gray-900 transition-colors"
            >
              Help
            </Link>
            <Link
              href="/orders"
              className="hover:text-gray-900 transition-colors"
            >
              Orders
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="hover:text-gray-900 cursor-pointer transition-colors"
            >
              Hi, {userName}
            </Link>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
            >
              ECOMMERCE
            </Link>

            {/* Main Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {categories.map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Search and Cart */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-40 py-1.5 pl-8 pr-4 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-gray-300 transition-colors"
                />
                <FaSearch
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <Link
                href="/cart"
                className="relative text-gray-700 hover:text-gray-900 transition-colors"
              >
                <FaShoppingCart size={20} />
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
