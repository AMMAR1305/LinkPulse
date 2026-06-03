import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import PageTransition from '../components/ui/PageTransition';
import { toast } from 'react-toastify';
import { FiLink } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 2FA login verification states
  const [show2FA, setShow2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  
  const navigate = useNavigate();
  const { login, verify2FALogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data && data.twoFactorRequired) {
        setTempToken(data.tempToken);
        setShow2FA(true);
      } else {
        toast.success('Logged in successfully');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    if (twoFactorCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }
    setLoading(true);
    try {
      await verify2FALogin(tempToken, twoFactorCode);
      toast.success('Logged in successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden font-sans">
      
      {/* Background Enhancements to fill empty whitespace */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Animated Background Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E4E3DF_1px,transparent_1px),linear-gradient(to_bottom,#E4E3DF_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.2]" />
        
        {/* Floating Morphing Orbs */}
        <motion.div 
          animate={{
            x: [0, 45, -30, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 50, -50, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]"
        />

        {/* Floating shapes in empty spaces */}
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          className="absolute top-[15%] right-[10%] text-primary-500/10 text-2xl font-bold select-none"
        >
          +
        </motion.div>
        <motion.div 
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[10%] text-amber-500/10 text-xl font-bold select-none"
        >
          ▲
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <motion.div variants={childVariants} className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center shadow-md">
              <FiLink size={24} className="text-white" />
            </div>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">LinkNova</span>
          </Link>
        </motion.div>

        <motion.div variants={childVariants}>
          <Card className="p-8 bg-white border border-glassBorder shadow-xl rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              {!show2FA ? (
                <motion.div
                  key="login-section"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-950 font-sans">Welcome back</h2>
                    <p className="text-slate-500 mt-1 text-sm font-sans">Log in to manage your short links and analytics.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <motion.div variants={childVariants}>
                      <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </motion.div>
                    
                    <motion.div variants={childVariants} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700">Password</label>
                        <Link to="/forgot-password" style={{ display: 'none' }} className="text-sm text-primary-500 hover:text-primary-750 transition-colors font-medium">
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        showToggle
                      />
                    </motion.div>

                    <motion.div variants={childVariants}>
                      <Button type="submit" loading={loading} className="w-full py-3 mt-4 text-sm font-semibold">
                        {loading ? 'Logging in...' : 'Log In'}
                      </Button>
                    </motion.div>
                  </form>

                  <motion.p variants={childVariants} className="mt-8 text-center text-sm text-slate-500 font-sans">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 font-bold hover:text-primary-800 hover:underline transition-colors">
                      Sign up
                    </Link>
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="2fa-section"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-950 font-sans">Security Check</h2>
                    <p className="text-slate-500 mt-1 text-sm font-sans">
                      Two-Factor Authentication (2FA) is enabled. Enter the 6-digit code from your authenticator app.
                    </p>
                  </div>

                  <form onSubmit={handle2FASubmit} className="space-y-5">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 font-sans">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-glass border border-glassBorder text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 text-center text-2xl tracking-[0.6em] font-mono font-bold"
                        maxLength={6}
                        autoFocus
                      />
                    </div>

                    <Button type="submit" loading={loading} className="w-full py-3 mt-4 text-sm font-semibold">
                      {loading ? 'Verifying...' : 'Verify & Log In'}
                    </Button>

                    <button
                      type="button"
                      onClick={() => {
                        setShow2FA(false);
                        setTwoFactorCode('');
                        setTempToken('');
                      }}
                      className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-700 mt-4 flex items-center justify-center gap-1.5 transition-colors font-sans"
                    >
                      ← Back to Login
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
