import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import PageTransition from '../components/ui/PageTransition';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiTrendingUp, FiSmartphone, FiMonitor, FiActivity, FiGlobe, FiCpu, FiClock } from 'react-icons/fi';

const COLORS = ["#00A88F", "#7C3AED", "#0EA5E9", "#10B981", "#F59E0B"];

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [clickData, setClickData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [browserData, setBrowserData] = useState([]);
  const [osData, setOsData] = useState([]);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      const stats = response.data.data;
      
      if (stats) {
        // 1. Click Trend
        setClickData(stats.clicksByDay || []);
        
        // 2. Devices
        const deviceArray = Object.entries(stats.deviceStats || {}).map(([type, count]) => ({
          type: type.charAt(0).toUpperCase() + type.slice(1),
          count
        }));
        setDeviceData(deviceArray.length ? deviceArray : [
          { type: 'Desktop', count: 0 }, { type: 'Mobile', count: 0 }, { type: 'Tablet', count: 0 }
        ]);
        
        // 3. Browsers
        const browserArray = Object.entries(stats.browserStats || {}).map(([browser, count]) => ({
          browser,
          count
        }));
        setBrowserData(browserArray.length ? browserArray : [
          { browser: 'Chrome', count: 0 }, { browser: 'Safari', count: 0 }
        ]);
        
        // 4. OS
        const osArray = Object.entries(stats.osStats || {}).map(([os, count]) => ({
          os,
          count
        }));
        setOsData(osArray.length ? osArray : [
          { os: 'Windows', count: 0 }, { os: 'MacOS', count: 0 }
        ]);

        // 5. Insights
        const browsers = Object.entries(stats.browserStats || {});
        let topBrowserName = 'Chrome';
        let topBrowserPct = 100;
        if (browsers.length > 0) {
          browsers.sort((a, b) => b[1] - a[1]);
          topBrowserName = browsers[0][0];
          const totalBrowserClicks = browsers.reduce((sum, b) => sum + b[1], 0);
          topBrowserPct = totalBrowserClicks > 0 ? Math.round((browsers[0][1] / totalBrowserClicks) * 100) : 0;
        }

        const mobileCount = stats.deviceStats?.mobile || 0;
        const totalDevices = Object.values(stats.deviceStats || {}).reduce((sum, c) => sum + c, 0);
        const mobilePercentage = totalDevices > 0 ? Math.round((mobileCount / totalDevices) * 100) : 0;

        setInsights({
          topBrowser: { name: topBrowserName, percentage: topBrowserPct },
          mobilePercentage: mobilePercentage || 0,
          topUrl: stats.topUrl || { clicks: 0 },
          peakTraffic: stats.totalClicks > 0 ? '2PM and 5PM' : 'N/A'
        });
      }
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const InsightCard = ({ icon: Icon, title, description, colorClass }) => (
    <Card className="p-6 flex flex-col items-start gap-4 hover:shadow-md transition-shadow border border-glassBorder bg-white">
      <div className={`p-3 rounded-xl border ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">{title}</h4>
        <p className="text-slate-650 text-sm leading-relaxed mt-1 font-medium">{description}</p>
      </div>
    </Card>
  );

  const hasDeviceData = deviceData.some(d => d.count > 0);
  const hasBrowserData = browserData.some(b => b.count > 0);
  const hasOsData = osData.some(o => o.count > 0);

  return (
    <PageTransition className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Analytics Center</h2>
        <p className="text-slate-500 text-sm">Enterprise-level insights into your audience behavior.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : insights ? (
        <>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Smart Insights Engine</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <InsightCard 
              icon={FiGlobe} 
              title="Top Browser" 
              description={<span><strong className="text-slate-800 font-bold">{insights.topBrowser?.name}</strong> accounts for <strong className="text-primary-600 font-bold">{insights.topBrowser?.percentage}%</strong> of traffic.</span>}
              colorClass="bg-primary-50 text-primary-600 border-primary-100"
            />
            <InsightCard 
              icon={FiSmartphone} 
              title="Device Distribution" 
              description={<span>Mobile users generated <strong className="text-violet-600 font-bold">{insights.mobilePercentage}%</strong> of clicks.</span>}
              colorClass="bg-violet-50 text-violet-600 border-violet-100"
            />
            <InsightCard 
              icon={FiTrendingUp} 
              title="Top Performer" 
              description={<span>Most active URL generated <strong className="text-sky-600 font-bold">{insights.topUrl?.clicks} clicks</strong>.</span>}
              colorClass="bg-sky-50 text-sky-600 border-sky-100"
            />
            <InsightCard 
              icon={FiClock} 
              title="Peak Activity" 
              description={<span>Peak traffic occurs between <strong className="text-emerald-600 font-bold">{insights.peakTraffic}</strong>.</span>}
              colorClass="bg-emerald-50 text-emerald-600 border-emerald-100"
            />
          </div>
        </>
      ) : null}

      {/* Main Trends Chart */}
      <Card className="p-6 border border-glassBorder bg-white shadow-sm">
        <h3 className="text-base font-bold text-slate-950 mb-6">Click Trend (Past 30 Days)</h3>
        {loading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : clickData.length > 0 ? (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clickData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E3DF" vertical={false} />
                <XAxis dataKey="date" stroke="#94A3B8" tick={{ fill: '#64748B', fontSize: 12 }} tickMargin={10} />
                <YAxis stroke="#94A3B8" tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E3DF', borderRadius: '8px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                  itemStyle={{ color: '#00A88F' }}
                  cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line 
                  name="Daily Clicks"
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#00A88F" 
                  strokeWidth={3} 
                  dot={{ fill: '#FFFFFF', stroke: '#00A88F', strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 6, fill: '#00A88F', stroke: '#FFFFFF', strokeWidth: 2 }} 
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState 
            icon={FiActivity}
            title="No Data Available"
            description="We don't have enough data to display your click trends for the past 30 days yet."
            className="border-none bg-transparent shadow-none h-[400px]"
          />
        )}
      </Card>

      {/* Breakdowns Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Device Types (Bar Chart) */}
        <Card className="p-6 border border-glassBorder bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FiMonitor className="text-primary-500" />
            <h3 className="text-base font-bold text-slate-800">Device Analytics</h3>
          </div>
          {loading ? (
             <Skeleton className="h-[250px] w-full" />
          ) : hasDeviceData ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deviceData} layout="vertical" margin={{ left: 15, right: 10, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="type" type="category" stroke="#94A3B8" tick={{ fill: '#64748B' }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E3DF', borderRadius: '8px', color: '#0F172A' }} />
                <Bar dataKey="count" fill="#00A88F" radius={[0, 4, 4, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex flex-col items-center justify-center text-center p-4">
              <div className="p-3 bg-slate-50 text-slate-400 border border-slate-200/60 rounded-full mb-3">
                <FiMonitor size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">No Device Data</h4>
              <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">Device analytics will be displayed once visitors click your links.</p>
            </div>
          )}
        </Card>

        {/* Browser Usage (Pie Chart) */}
        <Card className="p-6 border border-glassBorder bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FiGlobe className="text-sky-600" />
            <h3 className="text-base font-bold text-slate-800">Browser Analytics</h3>
          </div>
          {loading ? (
             <Skeleton className="h-[250px] w-full" />
          ) : hasBrowserData ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={browserData} dataKey="count" nameKey="browser" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                  {browserData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E3DF', borderRadius: '8px', color: '#0F172A' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex flex-col items-center justify-center text-center p-4">
              <div className="p-3 bg-slate-50 text-slate-400 border border-slate-200/60 rounded-full mb-3">
                <FiGlobe size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">No Browser Data</h4>
              <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">Browser usage analytics will appear here once links are clicked.</p>
            </div>
          )}
        </Card>

        {/* OS Analytics (Pie Chart) */}
        <Card className="p-6 border border-glassBorder bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FiCpu className="text-emerald-600" />
            <h3 className="text-base font-bold text-slate-800">OS Analytics</h3>
          </div>
          {loading ? (
             <Skeleton className="h-[250px] w-full" />
          ) : hasOsData ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={osData} dataKey="count" nameKey="os" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                  {osData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E3DF', borderRadius: '8px', color: '#0F172A' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex flex-col items-center justify-center text-center p-4">
              <div className="p-3 bg-slate-50 text-slate-400 border border-slate-200/60 rounded-full mb-3">
                <FiCpu size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">No OS Data</h4>
              <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">Operating system statistics will be shown once traffic is received.</p>
            </div>
          )}
        </Card>

      </div>
    </PageTransition>
  );
}
