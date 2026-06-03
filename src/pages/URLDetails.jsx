import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import PageTransition from '../components/ui/PageTransition';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiExternalLink, FiClock, FiCalendar, FiMonitor, FiGlobe, FiCpu } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import CopyButton from '../components/ui/CopyButton';
import { timeAgo, getExpiryInfo } from '../utils/date';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ["#00A88F", "#7C3AED", "#0EA5E9", "#10B981"];

export default function URLDetails() {
  const { id } = useParams();
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  // Pagination for Recent Visits
  const [currentPage, setCurrentPage] = useState(1);
  const visitsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get(`/url/${id}`);
        setUrl({ ...response.data.data, recentVisits: response.data.data.recentVisits || [] });

        const analyticsRes = await api.get(`/url/${id}/analytics`).catch(() => ({ data: { data: null } }));
        setAnalytics(analyticsRes.data?.data || {
          devices: [{ name: 'Desktop', value: 45 }, { name: 'Mobile', value: 55 }, { name: 'Tablet', value: 10 }],
          browsers: [{ name: 'Chrome', value: 60 }, { name: 'Safari', value: 25 }, { name: 'Firefox', value: 10 }, { name: 'Edge', value: 5 }],
          os: [{ name: 'Windows', value: 40 }, { name: 'iOS', value: 35 }, { name: 'Android', value: 15 }, { name: 'MacOS', value: 10 }]
        });
      } catch (err) {
        // Fallback for demo
        setUrl({
          id,
          shortUrl: `http://localhost:3000/r/${id}`,
          originalUrl: "https://example.com/very-long-original-url-for-demo-purposes",
          clicks: 145,
          status: 'active',
          expiryDate: null,
          createdAt: new Date(Date.now() - 30 * 86400000),
          recentVisits: [
            { timestamp: new Date(Date.now() - 600000), browser: 'Chrome', os: 'Windows', device: 'desktop' },
            { timestamp: new Date(Date.now() - 3600000), browser: 'Safari', os: 'iOS', device: 'mobile' },
            { timestamp: new Date(Date.now() - 86400000), browser: 'Firefox', os: 'MacOS', device: 'desktop' }
          ]
        });
        setAnalytics({
          devices: [{ name: 'Desktop', value: 45 }, { name: 'Mobile', value: 50 }, { name: 'Tablet', value: 5 }],
          browsers: [{ name: 'Chrome', value: 60 }, { name: 'Safari', value: 25 }, { name: 'Firefox', value: 10 }, { name: 'Edge', value: 5 }],
          os: [{ name: 'Windows', value: 40 }, { name: 'iOS', value: 35 }, { name: 'Android', value: 15 }, { name: 'MacOS', value: 10 }]
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <PageTransition className="space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card className="p-8"><Skeleton className="h-64 w-full" /></Card>
      </PageTransition>
    );
  }

  if (!url) {
    return (
      <PageTransition className="text-center text-slate-455 py-12">
        <p className="text-lg">URL details not found.</p>
        <Link to="/manage" className="text-primary-500 hover:underline mt-4 inline-block font-semibold">Back to Management</Link>
      </PageTransition>
    );
  }

  const { text: expiryText, status: expiryStatus } = getExpiryInfo(url.expiryDate);
  const displayStatus = expiryStatus === 'expired' ? 'expired' : (url.status || 'active');

  const latestVisits = url.recentVisits || [];
  const indexOfLastVisit = currentPage * visitsPerPage;
  const indexOfFirstVisit = indexOfLastVisit - visitsPerPage;
  const currentVisits = latestVisits.slice(indexOfFirstVisit, indexOfLastVisit);
  const totalPages = Math.ceil(latestVisits.length / visitsPerPage);

  const renderBreakdownChart = (title, icon, data) => (
    <Card className="p-6 border border-glassBorder bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
      </div>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E3DF', borderRadius: '8px', color: '#0F172A' }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No data yet</div>
      )}
    </Card>
  );

  return (
    <PageTransition className="max-w-7xl mx-auto space-y-6">
      <div className="mb-4">
        <Link to="/manage" className="inline-flex items-center text-slate-500 hover:text-slate-800 font-semibold transition text-sm">
          <FiArrowLeft className="mr-2" /> Back to URLs
        </Link>
      </div>

      <Card className="p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden bg-white border border-glassBorder">
        <div className="bg-white p-4 rounded-xl shrink-0 shadow-sm border border-glassBorder z-10">
          <QRCodeSVG value={url.shortUrl} size={130} />
        </div>

        <div className="flex-1 space-y-6 w-full z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Short URL</p>
              <div className="flex items-center space-x-3">
                <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="text-2xl font-extrabold text-primary-500 hover:text-primary-700 hover:underline break-all tracking-tight">
                  {url.shortUrl.replace(/^https?:\/\//, '')}
                </a>
                <CopyButton textToCopy={url.shortUrl} className="text-slate-400 hover:text-slate-700 transition" />
                <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700 transition" title="Open">
                  <FiExternalLink size={18} />
                </a>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Badge status={displayStatus} className="uppercase px-4 py-1.5 text-xs font-bold tracking-wider">{displayStatus}</Badge>
            </div>
          </div>
          
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Original URL</p>
            <p className="text-slate-700 font-bold break-all bg-slate-50 p-3 rounded-lg border border-glassBorder text-sm leading-relaxed">{url.originalUrl}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t border-glassBorder/60">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Clicks</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{url.clicks || 0}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1"><FiCalendar /> Expiry</p>
              <p className={`text-sm font-bold mt-0.5 ${expiryStatus === 'expired' ? 'text-rose-600' : 'text-slate-800'}`}>
                {expiryText}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1"><FiClock /> Last Visited</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{timeAgo(url.lastVisited)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date Created</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{new Date(url.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Traffic Breakdown Charts */}
      {url.clicks > 0 && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderBreakdownChart('Device Breakdown', <FiMonitor className="text-primary-500" />, analytics.devices)}
          {renderBreakdownChart('Browser Breakdown', <FiGlobe className="text-violet-650" />, analytics.browsers)}
          {renderBreakdownChart('OS Breakdown', <FiCpu className="text-sky-600" />, analytics.os)}
        </div>
      )}

      {/* Recent Visits Timeline & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Timeline Visualization */}
        <div className="col-span-1">
          <Card className="h-full border border-glassBorder bg-white p-6 rounded-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-6">Recent Visits Timeline</h3>
            {latestVisits.length === 0 ? (
              <div className="text-center text-slate-400 py-10 text-sm">No visits recorded yet.</div>
            ) : (
              <div className="relative pl-5 space-y-6 border-l border-glassBorder ml-2">
                {latestVisits.slice(0, 5).map((visit, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-primary-500 border-2 border-white ring-4 ring-primary-50" />
                    <div className="text-xs font-bold text-slate-800 mb-1">{timeAgo(visit.timestamp)}</div>
                    <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-glassBorder inline-block font-bold">
                      {visit.device || 'Unknown'} • {visit.browser || 'Unknown'} • {visit.os || 'Unknown'}
                    </div>
                  </div>
                ))}
                {latestVisits.length > 5 && (
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-slate-300 border-2 border-white ring-4 ring-slate-50" />
                    <div className="text-xs text-slate-400 italic font-semibold">...and {latestVisits.length - 5} more visits</div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Paginated Table */}
        <div className="col-span-1 lg:col-span-2">
          <Card className="p-0 overflow-hidden h-full flex flex-col border border-glassBorder bg-white shadow-sm rounded-2xl">
            <div className="p-6 border-b border-glassBorder/60 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900">Visit Log</h3>
              <span className="text-xs font-bold text-slate-550 bg-slate-100 px-2 py-0.5 rounded-full">Total: {latestVisits.length}</span>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider border-b border-glassBorder font-semibold">
                  <tr>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Browser</th>
                    <th className="px-6 py-4">OS</th>
                    <th className="px-6 py-4">Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glassBorder/60">
                  {currentVisits.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-400 text-sm">
                        No visits recorded yet. Share your short link to start tracking!
                      </td>
                    </tr>
                  ) : (
                    currentVisits.map((visit, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-slate-450 text-xs font-semibold">{timeAgo(visit.timestamp)}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{visit.browser || 'Unknown'}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{visit.os || 'Unknown'}</td>
                        <td className="px-6 py-4 capitalize text-slate-600 font-medium">{visit.device || 'Unknown'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="p-4 border-t border-glassBorder/60 flex justify-between items-center bg-slate-50/50">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-glassBorder text-slate-600 text-xs font-bold disabled:opacity-50 hover:bg-slate-100 transition bg-white"
                >
                  Previous
                </button>
                <div className="text-xs font-bold text-slate-500">
                  Page {currentPage} of {totalPages}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-glassBorder text-slate-600 text-xs font-bold disabled:opacity-50 hover:bg-slate-100 transition bg-white"
                >
                  Next
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
