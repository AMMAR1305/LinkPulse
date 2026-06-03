import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import PageTransition from '../components/ui/PageTransition';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FiTrash2, FiExternalLink, FiBarChart2, FiSearch, FiFilter, FiLink, FiCheckSquare, FiSquare } from 'react-icons/fi';
import CopyButton from '../components/ui/CopyButton';
import { motion, AnimatePresence } from 'framer-motion';
import { getExpiryInfo, timeAgo } from '../utils/date';

export default function URLManagement() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Bulk Actions State
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Modal State
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await api.get('/url');
      setUrls(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, data = null) => {
    setModalState({ isOpen: true, type, data });
  };

  const closeModal = () => {
    if (!actionLoading) setModalState({ isOpen: false, type: null, data: null });
  };

  // --- Actions ---
  const handleSingleDelete = async () => {
    const id = modalState.data;
    setActionLoading(true);
    try {
      await api.delete(`/url/${id}`);
      toast.success('URL deleted successfully');
      setUrls(urls.filter(u => (u._id || u.id) !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      toast.error('Failed to delete URL');
    } finally {
      setActionLoading(false);
      closeModal();
    }
  };

  const handleSingleStatus = async () => {
    const url = modalState.data;
    setActionLoading(true);
    const newStatus = url.status === 'disabled' ? 'active' : 'disabled';
    try {
      await api.patch(`/url/${url._id || url.id}/status`, { status: newStatus });
      toast.success(`URL marked as ${newStatus}`);
      setUrls(urls.map(u => (u._id || u.id) === (url._id || url.id) ? { ...u, status: newStatus } : u));
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setActionLoading(false);
      closeModal();
    }
  };

  const handleBulkDelete = async () => {
    setActionLoading(true);
    try {
      const promises = Array.from(selectedIds).map(id => api.delete(`/url/${id}`).catch(() => null));
      await Promise.all(promises);
      toast.success(`Deleted ${selectedIds.size} URLs`);
      setUrls(urls.filter(u => !selectedIds.has(u._id || u.id)));
      setSelectedIds(new Set());
    } catch (error) {
      toast.error('Bulk delete encountered errors');
    } finally {
      setActionLoading(false);
      closeModal();
    }
  };

  const handleBulkStatus = async () => {
    const newStatus = modalState.data;
    setActionLoading(true);
    try {
      const promises = Array.from(selectedIds).map(id => api.patch(`/url/${id}/status`, { status: newStatus }).catch(() => null));
      await Promise.all(promises);
      toast.success(`Marked ${selectedIds.size} URLs as ${newStatus}`);
      setUrls(urls.map(u => selectedIds.has(u._id || u.id) ? { ...u, status: newStatus } : u));
      setSelectedIds(new Set());
    } catch (error) {
      toast.error('Bulk status update encountered errors');
    } finally {
      setActionLoading(false);
      closeModal();
    }
  };

  const confirmAction = () => {
    switch (modalState.type) {
      case 'delete': return handleSingleDelete();
      case 'status': return handleSingleStatus();
      case 'bulk_delete': return handleBulkDelete();
      case 'bulk_status': return handleBulkStatus();
      default: return;
    }
  };

  // --- Filter & Sort ---
  const filteredAndSortedUrls = useMemo(() => {
    let result = [...urls];
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(u => u.originalUrl?.toLowerCase().includes(lowerQuery) || u.shortUrl?.toLowerCase().includes(lowerQuery) || u.alias?.toLowerCase().includes(lowerQuery));
    }
    if (statusFilter !== 'all') {
      result = result.filter(u => {
        const { status } = getExpiryInfo(u.expiryDate);
        return (status === 'expired' ? 'expired' : u.status || 'active') === statusFilter;
      });
    }
    result.sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'most_clicked') return (b.clicks || 0) - (a.clicks || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return result;
  }, [urls, searchQuery, statusFilter, sortBy]);

  // --- Checkbox Logic ---
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedUrls.length && filteredAndSortedUrls.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedUrls.map(u => u._id || u.id)));
    }
  };

  const toggleSelectOne = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const isAllSelected = filteredAndSortedUrls.length > 0 && selectedIds.size === filteredAndSortedUrls.length;

  // --- Modal Rendering ---
  const renderModalContent = () => {
    if (modalState.type === 'delete') {
      return (
        <div className="text-center pb-2">
          <p className="text-slate-650 mb-6 leading-relaxed">Are you sure you want to permanently delete this URL? This action cannot be undone.</p>
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 text-sm font-semibold" onClick={closeModal}>Cancel</Button>
            <Button className="flex-1 bg-red-650 hover:bg-red-700 text-white shadow-none border-0 text-sm font-semibold" loading={actionLoading} onClick={confirmAction}>Delete</Button>
          </div>
        </div>
      );
    }
    if (modalState.type === 'status') {
      const isDisabling = modalState.data?.status === 'active' || !modalState.data?.status;
      return (
        <div className="text-center pb-2">
          <p className="text-slate-650 mb-6 leading-relaxed">
            Are you sure you want to <strong className={isDisabling ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>{isDisabling ? 'DISABLE' : 'ENABLE'}</strong> this URL?
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-glassBorder text-sm text-slate-600 font-bold mb-6 truncate">{modalState.data?.shortUrl}</div>
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 text-sm font-semibold" onClick={closeModal}>Cancel</Button>
            <Button className="flex-1 text-sm font-semibold" loading={actionLoading} onClick={confirmAction}>Confirm</Button>
          </div>
        </div>
      );
    }
    if (modalState.type === 'bulk_delete') {
      return (
        <div className="text-center pb-2">
          <p className="text-slate-650 mb-6 leading-relaxed">Are you sure you want to permanently delete <strong className="text-rose-600 font-bold">{selectedIds.size} URLs</strong>? This will remove all associated statistics.</p>
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 text-sm font-semibold" onClick={closeModal}>Cancel</Button>
            <Button className="flex-1 bg-red-650 hover:bg-red-700 text-white shadow-none border-0 text-sm font-semibold" loading={actionLoading} onClick={confirmAction}>Delete All</Button>
          </div>
        </div>
      );
    }
    if (modalState.type === 'bulk_status') {
      const isDisabling = modalState.data === 'disabled';
      return (
        <div className="text-center pb-2">
          <p className="text-slate-655 mb-6 leading-relaxed">
            Are you sure you want to <strong className={isDisabling ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>{isDisabling ? 'DISABLE' : 'ENABLE'}</strong> <strong className="text-slate-900 font-bold">{selectedIds.size} URLs</strong>?
          </p>
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 text-sm font-semibold" onClick={closeModal}>Cancel</Button>
            <Button className="flex-1 text-sm font-semibold" loading={actionLoading} onClick={confirmAction}>Confirm</Button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <PageTransition className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Manage URLs</h2>
          <p className="text-slate-500 text-sm">View, edit, and track your links.</p>
        </div>
        <Link to="/create">
          <Button>Create New URL</Button>
        </Link>
      </div>

      <Card className="p-4 mb-6 flex flex-col md:flex-row gap-4 border border-glassBorder bg-white rounded-2xl shadow-sm">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full bg-white border border-glassBorder rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            placeholder="Search by Original URL, Short URL, or Alias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="relative flex items-center border border-glassBorder bg-white rounded-xl px-3 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
            <FiFilter className="text-slate-400 mr-2" />
            <select 
              className="bg-transparent text-sm text-slate-650 focus:outline-none py-2.5 appearance-none pr-4"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <select 
            className="border border-glassBorder bg-white rounded-xl px-4 py-2.5 text-sm text-slate-655 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 appearance-none transition-all"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="most_clicked">Sort: Most Clicked</option>
          </select>
        </div>
      </Card>

      {/* Bulk Actions Header */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="bg-primary-50 border border-primary-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 overflow-hidden shadow-sm"
          >
            <span className="text-primary-750 font-bold px-2 text-sm">{selectedIds.size} URL(s) selected</span>
            <div className="flex gap-2">
              <Button variant="outline" className="py-1.5 px-3 text-xs bg-white border-glassBorder" onClick={() => openModal('bulk_status', 'active')}>Enable All</Button>
              <Button variant="outline" className="py-1.5 px-3 text-xs bg-white border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => openModal('bulk_status', 'disabled')}>Disable All</Button>
              <Button variant="outline" className="py-1.5 px-3 text-xs bg-white border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => openModal('bulk_delete')}>Delete All</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="overflow-hidden p-0 border border-glassBorder bg-white shadow-sm rounded-2xl">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-glassBorder text-xs tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4 w-12">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600 transition-colors">
                    {isAllSelected ? <FiCheckSquare size={18} className="text-primary-500" /> : <FiSquare size={18} />}
                  </button>
                </th>
                <th className="px-6 py-4">Short URL</th>
                <th className="px-6 py-4">Original URL</th>
                <th className="px-6 py-4">Status & Expiry</th>
                <th className="px-6 py-4">Performance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glassBorder/60">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-4" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredAndSortedUrls.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-0">
                    <EmptyState 
                      icon={FiLink}
                      title={urls.length === 0 ? "No URLs Created Yet" : "No Matches Found"}
                      description={urls.length === 0 ? "Create your first shortened URL and start tracking analytics." : "Try adjusting your search query or filters to find what you're looking for."}
                      action={urls.length === 0 ? <Link to="/create"><Button>Create URL</Button></Link> : <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>Clear Filters</Button>}
                      className="border-none bg-transparent shadow-none"
                    />
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredAndSortedUrls.map((url, i) => {
                    const id = url._id || url.id;
                    const isSelected = selectedIds.has(id);
                    const { text: expiryText, status: expiryStatus } = getExpiryInfo(url.expiryDate);
                    const displayStatus = expiryStatus === 'expired' ? 'expired' : (url.status || 'active');
                    
                    return (
                      <motion.tr 
                        key={id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.03 }}
                        className={`hover:bg-slate-50/50 transition-colors group ${isSelected ? 'bg-primary-50/10' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <button onClick={() => toggleSelectOne(id)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            {isSelected ? <FiCheckSquare size={18} className="text-primary-500" /> : <FiSquare size={18} />}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-primary-500 hover:text-primary-650 hover:underline inline-flex items-center gap-1 transition-colors">
                            {url.shortUrl.replace(/^https?:\/\//, '')}
                          </a>
                        </td>
                        <td className="px-6 py-4 max-w-[200px]">
                          <p className="truncate text-slate-705 font-bold" title={url.originalUrl}>{url.originalUrl}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 items-start">
                            <Badge status={displayStatus} className="uppercase tracking-wider px-2.5 text-[9px] font-bold">{displayStatus}</Badge>
                            <span className="text-xs text-slate-400 whitespace-nowrap">{expiryText}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-slate-800 font-bold">{url.clicks || 0} clicks</span>
                            <span className="text-xs text-slate-400 whitespace-nowrap">Visited {timeAgo(url.lastVisited)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {displayStatus !== 'expired' && (
                              <button 
                                onClick={() => openModal('status', url)} 
                                className={`px-2.5 py-1 text-xs font-bold rounded-md border transition-all ${
                                  displayStatus === 'active' 
                                    ? 'text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100' 
                                    : 'text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                                  }`}
                              >
                                {displayStatus === 'active' ? 'Disable' : 'Enable'}
                              </button>
                            )}
                            
                            <div className="flex items-center space-x-1.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                              <CopyButton textToCopy={url.shortUrl} className="p-1.5 hover:text-slate-800 hover:bg-slate-50 rounded-md transition" />
                              <Link to={`/url/${id}`} className="p-1.5 hover:text-primary-500 hover:bg-primary-50 rounded-md transition" title="Analytics">
                                <FiBarChart2 size={16} />
                              </Link>
                              <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:text-slate-800 hover:bg-slate-50 rounded-md transition" title="Open">
                                <FiExternalLink size={16} />
                              </a>
                              <button onClick={() => openModal('delete', id)} className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-md transition" title="Delete">
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={modalState.isOpen} onClose={closeModal} title={
        modalState.type === 'delete' || modalState.type === 'bulk_delete' ? 'Confirm Deletion' : 'Confirm Status Change'
      }>
        {renderModalContent()}
      </Modal>
    </PageTransition>
  );
}
