import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

// Page components (lazy load for performance)
const Landing = React.lazy(() => import("../pages/Landing"));
const Login = React.lazy(() => import("../pages/Login"));
const Register = React.lazy(() => import("../pages/Register"));
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const CreateURL = React.lazy(() => import("../pages/CreateURL"));
const URLManagement = React.lazy(() => import("../pages/URLManagement"));
const Analytics = React.lazy(() => import("../pages/Analytics"));
const URLDetails = React.lazy(() => import("../pages/URLDetails"));
const Profile = React.lazy(() => import("../pages/Profile"));
const PublicStats = React.lazy(() => import("../pages/PublicStats"));

export default function AppRouter() {
  const location = useLocation();

  return (
    <React.Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">Loading…</div>}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/public/stats/:shortCode" element={<PublicStats />} />
        {/* Protected area with MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateURL />} />
            <Route path="/manage" element={<URLManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/url/:id" element={<URLDetails />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
        </Routes>
      </AnimatePresence>
    </React.Suspense>
  );
}
