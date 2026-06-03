import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import PageTransition from "../ui/PageTransition";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background text-slate-800">
      <Sidebar open={sidebarOpen} toggle={toggleSidebar} />
      <div className={`flex flex-col flex-1 ${sidebarOpen ? "md:pl-64" : "pl-0"} transition-all duration-300`}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
