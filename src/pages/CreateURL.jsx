import React, { useState, useRef } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { toast } from 'react-toastify';
import api from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { FiDownload, FiCopy, FiRefreshCcw } from 'react-icons/fi';
import PageTransition from '../components/ui/PageTransition';

export default function CreateURL() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const qrRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl) {
      toast.error("Original URL is required");
      return;
    }

    setLoading(true);
    try {
      const payload = { originalUrl };
      if (alias) payload.alias = alias;
      if (expiryDate) payload.expiryDate = new Date(expiryDate).toISOString();

      const response = await api.post('/url', payload);
      toast.success("Short URL created successfully!");
      setShortUrl(response.data.data.shortUrl);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create short URL");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalUrl('');
    setAlias('');
    setExpiryDate('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard!");
  };

  const downloadQR = () => {
    const canvas = document.createElement("canvas");
    const svg = qrRef.current.querySelector("svg");
    const xml = new XMLSerializer().serializeToString(svg);
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64 = b64Start + svg64;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${alias || 'link'}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = image64;
  };

  return (
    <PageTransition className="max-w-2xl mx-auto">
      <Card className="p-8 relative overflow-hidden border border-glassBorder bg-white shadow-sm rounded-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <h2 className="text-2xl font-bold text-slate-900 mb-1 relative z-10">Create New Short Link</h2>
        <p className="text-slate-505 text-slate-500 text-sm mb-6 relative z-10 font-medium">Paste your long URL below to create a trackable, manageable short link.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <Input
            label="Original URL"
            type="url"
            placeholder="https://example.com/very-long-url-path"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Custom Alias (Optional)"
              type="text"
              placeholder="my-custom-link"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
            <Input
              label="Expiry Date (Optional)"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={handleReset} className="flex-1 text-xs font-bold py-2.5">
              <FiRefreshCcw className="mr-2" /> Reset
            </Button>
            <Button type="submit" loading={loading} className="flex-[2] bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold py-2.5 shadow-sm">
              {loading ? 'Creating...' : 'Shorten URL'}
            </Button>
          </div>
        </form>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); handleReset(); }} title="Your Link is Ready!">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="bg-white p-4 rounded-xl shadow-md border border-glassBorder" ref={qrRef}>
            {shortUrl && <QRCodeSVG value={shortUrl} size={160} level="H" includeMargin={true} />}
          </div>
          <div className="w-full bg-slate-50 p-4 rounded-xl border border-glassBorder text-left">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Your shortened URL:</p>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 font-bold text-lg hover:text-primary-800 hover:underline break-all">
              {shortUrl}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button onClick={copyToClipboard} variant="outline" className="w-full py-2.5 text-xs font-bold">
              <FiCopy className="mr-2" /> Copy Link
            </Button>
            <Button onClick={downloadQR} className="w-full bg-primary-500 hover:bg-primary-600 text-xs font-bold py-2.5">
              <FiDownload className="mr-2" /> Download QR
            </Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
