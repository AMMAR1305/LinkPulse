import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import PageTransition from '../components/ui/PageTransition';
import { FiUser, FiLogOut, FiCheckCircle, FiCalendar, FiShield, FiKey } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';

export default function Profile() {
  const { user, logout, setUser } = useAuth();
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.twoFactorEnabled || false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // 2FA Setup states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [setupSecret, setSetupSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in both password fields');
      return;
    }
    // Mock API Call for Password Change
    setTimeout(() => {
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    }, 1000);
  };

  const handle2FAEnableInitiate = async () => {
    setSetupLoading(true);
    try {
      const res = await api.post('/auth/2fa/setup');
      const { secret, otpauthUrl } = res.data.data;
      setSetupSecret(secret);
      setQrCodeUrl(otpauthUrl);
      setIsModalOpen(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to initiate 2FA setup');
    } finally {
      setSetupLoading(false);
    }
  };

  const handle2FAVerify = async (e) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }
    setVerifyLoading(true);
    try {
      await api.post('/auth/2fa/verify', { token: verificationCode });
      setUser({ ...user, twoFactorEnabled: true });
      setIs2FAEnabled(true);
      setIsModalOpen(false);
      setVerificationCode('');
      toast.success('Two-Factor Authentication enabled successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid verification code');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handle2FADisable = async () => {
    if (!window.confirm('Are you sure you want to disable Two-Factor Authentication? This will make your account less secure.')) {
      return;
    }
    setDisableLoading(true);
    try {
      await api.post('/auth/2fa/disable');
      setUser({ ...user, twoFactorEnabled: false });
      setIs2FAEnabled(false);
      toast.success('Two-Factor Authentication disabled.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setDisableLoading(false);
    }
  };

  const handle2FAToggle = () => {
    if (is2FAEnabled) {
      handle2FADisable();
    } else {
      handle2FAEnableInitiate();
    }
  };

  return (
    <PageTransition className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Account Settings</h2>
        <p className="text-slate-500 text-sm">Manage your profile, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Danger Zone */}
        <div className="col-span-1 space-y-6">
          <Card className="relative overflow-hidden border border-glassBorder bg-white p-6 shadow-sm rounded-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none" />
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="mb-4">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="h-24 w-24 rounded-full border-4 border-primary-50 object-cover shadow-sm" />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-premium flex items-center justify-center border-4 border-primary-50 shadow-md">
                    <FiUser size={36} className="text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{user?.name || "Premium User"}</h3>
              <p className="text-primary-600 font-bold text-sm mt-1 mb-4">{user?.email || "user@linknova.app"}</p>
              
              <div className="w-full space-y-3 pt-4 border-t border-glassBorder/60 text-left">
                <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-glassBorder">
                  <p className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-bold">Account Status</p>
                  <p className="text-emerald-700 text-sm font-bold flex items-center gap-1">
                    <FiCheckCircle size={14} /> Active
                  </p>
                </div>
                <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-glassBorder">
                  <p className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-bold">Plan Tier</p>
                  <p className="text-primary-600 text-sm font-bold capitalize">{user?.role || "Pro Plan"}</p>
                </div>
                <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-glassBorder">
                  <p className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-bold">Member Since</p>
                  <p className="text-slate-700 text-sm font-bold flex items-center gap-1.5">
                    <FiCalendar className="text-slate-400" size={14} /> 
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'August 24, 2023'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border border-rose-100 bg-rose-50/50 p-6 shadow-sm rounded-2xl">
            <div className="flex flex-col items-center text-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-rose-700 mb-1">Sign Out</h3>
                <p className="text-slate-500 text-xs font-medium">End your current session securely.</p>
              </div>
              <Button onClick={logout} variant="outline" className="text-rose-700 border-rose-200 hover:bg-rose-100/50 bg-white w-full text-xs font-bold py-2.5">
                <FiLogOut className="mr-2" /> Sign Out
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Security Section */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="p-6 border border-glassBorder bg-white shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-glassBorder/60">
              <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
                <FiShield size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Security Settings</h3>
                <p className="text-xs text-slate-400 font-medium">Keep your account secure with these settings.</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* 2FA Section */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Two-Factor Authentication (2FA)</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Add an extra layer of security to your account. Once enabled, you'll be required to enter a code from your authenticator app during login.</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-glassBorder rounded-xl gap-4">
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">Authenticator App</span>
                    <span className={`text-xs font-bold ${is2FAEnabled ? 'text-emerald-700' : 'text-amber-700'}`}>
                      Status: {is2FAEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handle2FAToggle}
                    loading={setupLoading || disableLoading}
                    className={`text-xs font-bold py-2 bg-white ${
                      is2FAEnabled 
                        ? 'border-rose-200 text-rose-700 hover:bg-rose-50' 
                        : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </Button>
                </div>
              </div>

              {/* Change Password */}
              <div className="pt-6 border-t border-glassBorder/60">
                <div className="flex items-center gap-2 mb-4">
                  <FiKey className="text-primary-500" />
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Change Password</h4>
                </div>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <Input 
                    type="password"
                    label="Current Password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input 
                    type="password"
                    label="New Password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    showToggle
                  />
                  <Button type="submit" variant="primary" className="mt-2 text-xs px-6 py-2.5 font-bold">
                    Update Password
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setVerificationCode(''); }} title="Enable Two-Factor Authentication (2FA)">
        <form onSubmit={handle2FAVerify} className="space-y-6 text-center">
          <p className="text-sm text-slate-600 text-left">
            1. Scan the QR code below using your authenticator app (such as Google Authenticator, Microsoft Authenticator, or Authy).
          </p>
          <div className="bg-white p-4 rounded-xl shadow-md border border-glassBorder inline-block">
            {qrCodeUrl && <QRCodeSVG value={qrCodeUrl} size={180} level="H" includeMargin={true} />}
          </div>
          <div className="text-left bg-slate-50 p-3 rounded-xl border border-glassBorder text-xs text-slate-600 break-all select-all">
            <span className="font-bold block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Alternatively, enter secret key manually:</span>
            <code>{setupSecret}</code>
          </div>
          <p className="text-sm text-slate-600 text-left pt-2 border-t border-glassBorder">
            2. Enter the 6-digit verification code generated by your authenticator app to complete the setup.
          </p>
          <Input 
            type="text"
            placeholder="000000"
            maxLength={6}
            required
            className="text-center font-mono text-xl tracking-widest"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
          />
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Button type="button" variant="outline" className="w-full py-2.5 text-xs font-bold" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={verifyLoading} className="w-full bg-primary-500 hover:bg-primary-600 text-xs font-bold py-2.5">
              Verify & Enable
            </Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
}
