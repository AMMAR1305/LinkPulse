import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import PageTransition from '../components/ui/PageTransition';
import api from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { timeAgo, getExpiryInfo } from '../utils/date';

export default function PublicStats() {
  const { shortCode } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/public/stats/${shortCode}`)
      .then(res => setStats(res.data))
      .catch(err => setError(err?.response?.data?.message || 'Stats not found'))
      .finally(() => setLoading(false));
  }, [shortCode]);

  if (loading) {
    return (
      <PageTransition className="min-h-screen bg-background p-6 flex flex-col items-center pt-20">
        <Skeleton className="h-10 w-48 mb-6" />
        <Card className="w-full max-w-3xl p-8 bg-white border border-glassBorder"><Skeleton className="h-64 w-full" /></Card>
      </PageTransition>
    );
  }

  if (error || !stats) {
    return (
      <PageTransition className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{error || 'Stats not found'}</h2>
        <Link to="/" className="text-primary-600 font-bold hover:underline">Go to Home</Link>
      </PageTransition>
    );
  }

  const { status, text: expiryText } = getExpiryInfo(stats.expiryDate);

  return (
    <PageTransition className="min-h-screen bg-background p-6 pb-20 font-sans">
      <div className="max-w-4xl mx-auto space-y-6 pt-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Public Analytics</h1>
          <p className="text-slate-500 font-bold text-base">Live stats for /{shortCode}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 md:col-span-2 flex flex-col justify-center border border-glassBorder bg-white shadow-sm rounded-2xl">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Overview</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Clicks</p>
                <p className="text-3xl font-extrabold text-slate-900">{stats.clicks || 0}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Last Visited</p>
                <p className="text-lg font-bold text-slate-800">{timeAgo(stats.lastVisited)}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Status</p>
                <Badge status={status}>{status === 'active' ? 'Active' : 'Expired'}</Badge>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Expiry</p>
                <p className="text-sm font-bold text-slate-700">{expiryText}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 flex flex-col items-center justify-center text-center border border-glassBorder bg-white shadow-sm rounded-2xl">
            <div className="bg-white p-3 rounded-xl mb-4 border border-glassBorder shadow-sm">
              <QRCodeSVG value={stats.shortUrl || window.location.origin + '/' + shortCode} size={120} />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Scan to visit</p>
          </Card>
        </div>

        {stats.clickTrend && stats.clickTrend.length > 0 && (
          <Card className="p-6 border border-glassBorder bg-white shadow-sm rounded-2xl">
            <h2 className="text-base font-bold text-slate-800 mb-6">Click Trend (30 Days)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.clickTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E3DF" vertical={false} />
                  <XAxis dataKey="date" stroke="#94A3B8" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis stroke="#94A3B8" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E3DF', borderRadius: '8px', color: '#0F172A' }}
                    itemStyle={{ color: '#00A88F' }}
                  />
                  <Line type="monotone" dataKey="clicks" stroke="#00A88F" strokeWidth={3} dot={{ fill: '#00A88F', r: 3 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>
    </PageTransition>
  );
}
