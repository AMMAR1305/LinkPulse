import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import PageTransition from '../components/ui/PageTransition';
import { toast } from 'react-toastify';
import { FiLink } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, password });
      toast.success('Registration successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
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
    <PageTransition className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden font-sans">
      
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
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px]"
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
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]"
        />

        {/* Floating shapes in empty spaces */}
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          className="absolute top-[15%] left-[10%] text-primary-500/10 text-2xl font-bold select-none"
        >
          +
        </motion.div>
        <motion.div 
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[10%] text-amber-500/10 text-xl font-bold select-none"
        >
          ▲
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg relative z-10"
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
          <Card className="p-8 bg-white border border-glassBorder shadow-xl rounded-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-950">Create your account</h2>
              <p className="text-slate-500 mt-1.5 text-sm">Start managing and tracking your links in seconds.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={childVariants}>
                <Input
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </motion.div>
              
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

              <motion.div variants={childVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  showToggle
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  showToggle
                />
              </motion.div>

              <motion.div variants={childVariants}>
                <Button type="submit" loading={loading} className="w-full py-3 mt-4 text-sm font-semibold">
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </motion.div>
            </form>

            <motion.p variants={childVariants} className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-bold hover:text-primary-800 hover:underline transition-colors">
                Log in
              </Link>
            </motion.p>
          </Card>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
