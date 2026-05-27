"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { CMS_SECTIONS, LIST_SECTIONS } from "../lib/cms-sections";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const closeSidebar = () => {
    if (isMobile) setIsOpen(false);
  };

  const handleLogout = async () => {
    document.cookie = "OurSiteJWT=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  const linkClass =
    "block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors text-sm";

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div id="sidenavv" className="relative">
        <nav
          className={`fixed top-0 left-0 h-full bg-[#343a40] text-white z-50 transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-hide ${
            isMobile
              ? isOpen
                ? "translate-x-0 w-64"
                : "-translate-x-full w-64"
              : isOpen
                ? "translate-x-0 w-[220px]"
                : "-translate-x-full w-[220px]"
          }`}
          style={{
            padding: isOpen ? "16px" : "0",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <style jsx>{`
            nav::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-center flex-1 text-lg font-semibold">AKKAWI</h3>
              {isMobile && (
                <button
                  onClick={closeSidebar}
                  className="text-white hover:text-gray-300 p-2 -mr-2"
                  aria-label="Close sidebar"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <ul className="flex-1 list-none p-0 m-0 space-y-1">
              <li>
                <a href="/dashboard" onClick={closeSidebar} className={linkClass}>
                  Overview
                </a>
              </li>

              <li className="pt-3 mt-2 border-t border-white/10">
                <span className="block px-3 py-1 text-[10px] font-bold tracking-widest text-white/45 uppercase">
                  Pages
                </span>
              </li>
              {CMS_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={s.path} onClick={closeSidebar} className={linkClass}>
                    {s.title}
                  </a>
                </li>
              ))}

              <li className="pt-3 mt-2 border-t border-white/10">
                <span className="block px-3 py-1 text-[10px] font-bold tracking-widest text-white/45 uppercase">
                  Lists
                </span>
              </li>
              {LIST_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={s.path} onClick={closeSidebar} className={linkClass}>
                    {s.title}
                  </a>
                </li>
              ))}

              <li className="mt-6 pt-4 border-t border-white border-opacity-10">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                  className={`${linkClass} cursor-pointer`}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {(!isMobile || !isOpen) && (
          <button
            onClick={toggleSidebar}
            className={`fixed top-5 z-50 bg-black text-white border-none cursor-pointer p-2 text-lg rounded transition-all duration-300 ${
              isMobile ? "left-2" : isOpen ? "left-[220px]" : "left-2"
            }`}
            aria-label="Toggle sidebar"
          >
            {isOpen ? <FaArrowLeft /> : <FaArrowRight />}
          </button>
        )}

        {!isMobile && (
          <div
            className="transition-all duration-300"
            style={{ marginLeft: isOpen ? "220px" : "0" }}
          />
        )}
      </div>
    </>
  );
}
