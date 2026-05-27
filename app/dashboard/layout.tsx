"use client";

import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { SIDEBAR_NAV } from "../lib/sidebar-nav";
import {
  FaChevronDown,
  FaChevronRight,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";

interface UserResponse {
  user: string | null;
  error: AxiosError | null;
}

function SidebarItem({
  item,
  pathname,
  onNavigate,
}: {
  item: (typeof SIDEBAR_NAV)[number];
  pathname: string;
  onNavigate?: () => void;
}) {
  const isActive =
    pathname === item.href ||
    item.children?.some((c: { href: string }) => pathname === c.href);
  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            onClick={() => setOpen(!open)}
            className={`flex-1 flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-md transition-colors ${
              isActive
                ? "text-amber-700 bg-amber-50"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.icon === "settings" && (
              <FaCog size={13} className="text-gray-400" />
            )}
            <span className="flex-1 text-left">{item.label}</span>
            {open ? (
              <FaChevronDown size={10} className="text-gray-400" />
            ) : (
              <FaChevronRight size={10} className="text-gray-400" />
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            onClick={onNavigate}
            className={`flex-1 flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-md transition-colors ${
              isActive
                ? "text-amber-700 bg-amber-50"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </Link>
        )}
      </div>

      {hasChildren && open && (
        <div className="ml-4 border-l-2 border-gray-100 pl-2 mt-0.5 space-y-0.5">
          {item.children!.map((child: { label: string; href: string }) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                pathname === child.href
                  ? "text-amber-700 bg-amber-50 font-medium"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const { error } = await getUser();
      if (error) {
        push("/");
        return;
      }
      setIsSuccess(true);
    })();
  }, [push]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-800 tracking-wide">
          AKKAWI Dashboard
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-60 bg-white border-r border-gray-200 overflow-y-auto transition-transform lg:translate-x-0 lg:static lg:z-auto ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 pt-5 pb-3 border-b border-gray-100">
          <Link
            href="/dashboard"
            className="text-sm font-bold text-gray-800 tracking-wide hover:text-amber-700 transition-colors"
          >
            AKKAWI Dashboard
          </Link>
        </div>

        <nav className="p-3 space-y-1">
          {SIDEBAR_NAV.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 lg:ml-0">
        <div className="pt-16 lg:pt-0">
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

async function getUser(): Promise<UserResponse> {
  try {
    const { data } = await axios.get("/api/auth/me");
    return { user: data, error: null };
  } catch (e) {
    const error = e as AxiosError;
    return { user: null, error };
  }
}
