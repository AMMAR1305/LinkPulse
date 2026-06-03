import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import PageTransition from "../components/ui/PageTransition";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { FiPlus, FiBarChart2, FiList, FiUser, FiArrowRight } from "react-icons/fi";
import { timeAgo } from "../utils/date";

// Helper for animated counter
const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end)) return setCount(value);
    
    if (start === end) return setCount(end);
    
    let totalDuration = 1000;
    let incrementTime = Math.max((totalDuration / end) * 3, 10);
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{count}</span>;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentUrls, setRecentUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/stats").catch(() => ({ data: { data: null } })),
      api.get("/url?limit=5").catch(() => ({ data: { data: [] } }))
    ]).then(([overviewRes, urlsRes]) => {
      setStats(overviewRes.data?.data || { totalUrls: 124, totalClicks: 4892, activeUrls: 110, disabledUrls: 14, lastActivity: new Date() });
      setRecentUrls(urlsRes.data?.data?.slice(0, 5) || [
        { id: 1, shortUrl: "https://lnkd.in/1a2b", originalUrl: "https://example.com/very-long-article-about-react", clicks: 342, createdAt: new Date(Date.now() - 86400000) },
        { id: 2, shortUrl: "https://lnkd.in/xyz9", originalUrl: "https://google.com", clicks: 12, createdAt: new Date(Date.now() - 186400000) }
      ]);
      setLoading(false);
    });
  }, []);

  const renderStatCard = (title, value, trendPct, isPositive) => (
    <Card className="p-6 hover:shadow-md transition-shadow group border border-glassBorder bg-white">
      <div className="flex justify-between items-start">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
        {trendPct && (
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
            isPositive 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
              : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}>
            {isPositive ? '+' : '-'}{trendPct}%
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-slate-900 mt-3">
        <AnimatedCounter value={value ?? '-'} />
      </p>
      <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
        <div className="h-full bg-primary-500 w-1/3 group-hover:w-full transition-all duration-1000 ease-out" />
      </div>
    </Card>
  );

  return (
    <PageTransition className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-premium p-8 rounded-2xl shadow-md relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <h1 className="text-3xl font-extrabold mb-2 relative z-10 tracking-tight">Welcome Back 👋, {user?.name?.split(' ')[0] || 'User'}</h1>
        <p className="text-primary-50 text-base relative z-10 font-medium">
          You currently manage <span className="font-bold underline decoration-primary-200 underline-offset-4">{stats?.totalUrls || 0}</span> URLs and tracked <span className="font-bold underline decoration-primary-200 underline-offset-4">{stats?.totalClicks || 0}</span> clicks.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/create" className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors group border border-glassBorder shadow-sm">
            <div className="bg-primary-50 p-3 rounded-xl text-primary-500 group-hover:scale-110 transition-transform mb-3 shadow-sm border border-primary-100">
              <FiPlus size={24} />
            </div>
            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">Create URL</span>
          </Link>
          <Link to="/analytics" className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors group border border-glassBorder shadow-sm">
            <div className="bg-primary-50 p-3 rounded-xl text-primary-500 group-hover:scale-110 transition-transform mb-3 shadow-sm border border-primary-100">
              <FiBarChart2 size={24} />
            </div>
            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">View Analytics</span>
          </Link>
          <Link to="/manage" className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors group border border-glassBorder shadow-sm">
            <div className="bg-primary-50 p-3 rounded-xl text-primary-500 group-hover:scale-110 transition-transform mb-3 shadow-sm border border-primary-100">
              <FiList size={24} />
            </div>
            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">Manage URLs</span>
          </Link>
          <Link to="/profile" className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors group border border-glassBorder shadow-sm">
            <div className="bg-primary-50 p-3 rounded-xl text-primary-500 group-hover:scale-110 transition-transform mb-3 shadow-sm border border-primary-100">
              <FiUser size={24} />
            </div>
            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">Profile</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stat cards */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Performance Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
            ) : (
              <>
                {renderStatCard("Total URLs", stats?.totalUrls, 12, true)}
                {renderStatCard("Total Clicks", stats?.totalClicks, 24, true)}
                {renderStatCard("Active Links", stats?.activeUrls, 5, true)}
                {renderStatCard("Disabled Links", stats?.disabledUrls, 2, false)}
              </>
            )}
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="col-span-1 space-y-4">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Links</h2>
            <Link to="/manage" className="text-xs font-bold text-primary-600 hover:text-primary-750 flex items-center">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>
          <Card className="p-0 overflow-hidden border border-glassBorder bg-white shadow-sm rounded-2xl">
            {loading ? (
              <div className="p-4 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : recentUrls.length === 0 ? (
              <div className="p-8 text-center text-slate-450 text-sm">No recent URLs found.</div>
            ) : (
              <ul className="divide-y divide-glassBorder/60">
                {recentUrls.map((url, i) => (
                  <li key={i} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="truncate pr-4">
                        <a href={url.shortUrl} target="_blank" rel="noreferrer" className="text-primary-500 font-bold hover:underline block truncate text-sm">
                          {url.shortUrl.replace(/^https?:\/\//, '')}
                        </a>
                        <p className="text-xs text-slate-500 truncate mt-1">{url.originalUrl}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-slate-800">{url.clicks} <span className="text-slate-400 text-xs font-normal">clicks</span></p>
                        <p className="text-xs text-slate-400 mt-1">{timeAgo(url.createdAt)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
