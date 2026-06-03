import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiBell, FiMenu, FiChevronDown, FiUser, FiHome, FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Welcome to LinkNova!",
      message: "Create your first short link and start tracking clicks.",
      time: "Just now",
      read: false,
      link: "/create",
    },
    {
      id: 2,
      title: "Secure Your Account",
      message: "Enable 2FA in profile settings to add an extra layer of security.",
      time: "2 hours ago",
      read: false,
      link: "/profile",
    },
  ]);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const dropdownRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (n) => {
    // Mark as read
    setNotifications(notifications.map(item => item.id === n.id ? { ...item, read: true } : item));
    setShowNotifications(false);
    navigate(n.link);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-glassBorder/80 sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="text-slate-500 hover:text-slate-800 focus:outline-none p-1 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <FiMenu size={20} />
        </button>
        <Link to="/dashboard" className="text-xl font-bold text-slate-900 tracking-tight md:hidden">
          LinkNova
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications Bell */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative text-slate-500 hover:text-slate-800 focus:outline-none p-2 rounded-full hover:bg-slate-105 transition-all ${
              showNotifications ? "bg-slate-100 text-slate-800" : "hover:bg-slate-100"
            }`}
          >
            <FiBell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 inline-flex h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white border border-glassBorder shadow-xl rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-glassBorder pb-3 mb-3">
                <span className="font-bold text-sm text-slate-900">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs font-bold text-primary-500 hover:text-primary-700 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors text-left relative ${
                        n.read ? "hover:bg-slate-50" : "bg-primary-50/20 border border-primary-100/50 hover:bg-primary-50/40"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-xs font-bold ${n.read ? 'text-slate-800' : 'text-primary-800'}`}>
                          {n.title}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                      {!n.read && (
                        <span className="absolute bottom-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-primary-500"></span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-slate-400 text-xs font-sans">All caught up!</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <div 
            className={`flex items-center space-x-2.5 cursor-pointer p-1.5 rounded-xl transition-all border ${
              showProfileMenu 
                ? "bg-slate-105 border-slate-200" 
                : "hover:bg-slate-100 border-transparent hover:border-slate-205"
            }`}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="h-8 w-8 rounded-full object-cover border border-slate-200" />
            ) : (
              <FaUserCircle size={28} className="text-slate-400" />
            )}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-bold text-slate-800 leading-tight">{user?.name || "User"}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account</span>
            </div>
            <FiChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`} />
          </div>

          {/* Profile Dropdown Panel */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2.5 w-48 bg-white border border-glassBorder shadow-xl rounded-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
              <div className="px-3 py-2 border-b border-glassBorder mb-1.5">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.name || "User"}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email || "user@example.com"}</p>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
              >
                <FiUser size={14} className="text-slate-400" />
                My Profile
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/dashboard");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
              >
                <FiHome size={14} className="text-slate-400" />
                Dashboard
              </button>

              <div className="border-t border-glassBorder my-1.5"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition-colors"
              >
                <FiLogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
