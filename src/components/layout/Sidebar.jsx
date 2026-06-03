// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX, FiHome, FiLink, FiBarChart2, FiUser, FiGrid } from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", to: "/dashboard", icon: <FiHome size={18} /> },
  { name: "Create URL", to: "/create", icon: <FiLink size={18} /> },
  { name: "URL Management", to: "/manage", icon: <FiGrid size={18} /> },
  { name: "Analytics", to: "/analytics", icon: <FiBarChart2 size={18} /> },
  { name: "Profile", to: "/profile", icon: <FiUser size={18} /> },
];

export default function Sidebar({ open = true, toggle }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 transform ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 bg-white border-r border-glassBorder z-20 shadow-sm`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-glassBorder/60">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-premium flex items-center justify-center shadow-sm">
            <FiLink size={14} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">LinkNova</span>
        </div>
        <button onClick={toggle} className="text-slate-400 hover:text-slate-600 focus:outline-none md:hidden">
          <FiX size={20} />
        </button>
      </div>
      <nav className="mt-6 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mx-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-primary-50 text-primary-600 font-bold shadow-sm border-r-2 border-primary-500"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <span className="mr-3 text-slate-400 group-hover:text-slate-600">{item.icon}</span>
            <span className={`text-sm ${open ? "block" : "hidden"}`}>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
