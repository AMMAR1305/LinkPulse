import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FiZap, FiBarChart2, FiLink, FiShield, FiClock, FiSmartphone, FiChevronDown, FiCopy, FiCheck, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

const features = [
  { icon: <FiZap size={22} />, title: "URL Shortening", desc: "Create short links instantly with our high-speed shortening engine." },
  { icon: <FiLink size={22} />, title: "Custom Alias", desc: "Brand your links with custom aliases to increase click-through rates." },
  { icon: <FiSmartphone size={22} />, title: "Device Analytics", desc: "Understand your audience with detailed device, browser, and OS breakdowns." },
  { icon: <FiBarChart2 size={22} />, title: "Click Analytics", desc: "Track every click in real-time with comprehensive data visualization." },
  { icon: <FiClock size={22} />, title: "URL Expiry", desc: "Set automatic expiration dates for time-sensitive campaigns." },
  { icon: <FiShield size={22} />, title: "Status Control", desc: "Enable or disable your links at any time with a single click." },
];

const testimonials = [
  { name: "Sarah Jenkins", role: "Marketing Director at TechFlow", quote: "LinkNova completely transformed how we track our campaign performance. The analytics are incredibly detailed." },
  { name: "David Chen", role: "Indie Hacker", quote: "The best URL management SaaS I've used. The design is clean, warm, minimalist, and the API is blazing fast." },
  { name: "Elena Rodriguez", role: "Social Media Manager", quote: "Custom aliases and QR codes in one platform saved me hours of work every week. Highly recommended!" },
];

const faqs = [
  { q: "Is LinkNova completely free to use?", a: "Yes, our core shortening and analytics features are completely free. We also offer premium tiers for high-volume enterprise users." },
  { q: "Can I change the destination of a short link later?", a: "Yes, registered users can manage and edit the destination URL of their existing short links from the dashboard." },
  { q: "How detailed are the analytics?", a: "We provide comprehensive analytics including total clicks, unique visitors, browser types, operating systems, and device categories." },
  { q: "Do short links expire?", a: "By default, they do not expire. However, you can set custom expiration dates for time-sensitive campaigns." },
];

function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-glassBorder last:border-0 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center text-left focus:outline-none"
      >
        <span className="text-base font-bold text-slate-800">{faq.q}</span>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-slate-400 hover:text-primary-500"
        >
          <FiChevronDown className={isOpen ? "text-primary-500" : "text-slate-400"} size={20} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-slate-600 text-sm leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Landing() {
  // Live Simulator States
  const [inputUrl, setInputUrl] = useState("");
  const [simState, setSimState] = useState("idle"); // idle, loading, ready
  const [simmedShort, setSimmedShort] = useState("");
  const [copied, setCopied] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 70, 
        damping: 15 
      } 
    },
    hover: {
      y: -10,
      scale: 1.025,
      borderColor: "#00A88F",
      boxShadow: "0 20px 40px -15px rgba(0, 168, 143, 0.12), 0 0 0 1px rgba(0, 168, 143, 0.05)",
      transition: { type: "spring", stiffness: 350, damping: 20 }
    }
  };

  const handleSimulate = (e) => {
    e.preventDefault();
    if (!inputUrl) return;
    setSimState("loading");
    setTimeout(() => {
      const randomCode = Math.random().toString(36).substring(2, 7);
      setSimmedShort(`linknova.co/${randomCode}`);
      setSimState("ready");
    }, 1200);
  };

  const copySimmed = () => {
    navigator.clipboard.writeText(simmedShort);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-background text-slate-800 min-h-screen flex flex-col font-sans selection:bg-primary-500/20 relative overflow-hidden">
      
      {/* Background Enhancements to fill empty whitespace */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Animated Background Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E4E3DF_1px,transparent_1px),linear-gradient(to_bottom,#E4E3DF_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.25]" />
        
        {/* Floating Morphing Orbs */}
        <motion.div 
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 70, -60, 0],
            scale: [1, 0.85, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[35%] right-[5%] w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[110px]"
        />
        <motion.div 
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-primary-500/8 rounded-full blur-[130px]"
        />

        {/* Floating particles/shapes in empty margin spaces */}
        <motion.div 
          animate={{ y: [0, -12, 0], rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[12%] text-primary-500/20 text-2xl font-bold select-none"
        >
          +
        </motion.div>
        <motion.div 
          animate={{ y: [0, 15, 0], rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[50%] left-[8%] text-amber-500/20 text-3xl select-none"
        >
          ○
        </motion.div>
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[40%] right-[8%] text-primary-500/20 text-xl font-bold select-none"
        >
          ▲
        </motion.div>
        <motion.div 
          animate={{ y: [0, 18, 0], rotate: 180 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] left-[6%] text-slate-400/20 text-2xl font-bold select-none"
        >
          +
        </motion.div>
      </div>

      {/* Header / Navbar on Landing Page */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-glassBorder/60 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center shadow-sm">
            <FiLink size={16} className="text-white" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">LinkNova</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
            Login
          </Link>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/register" className="px-5 py-2 text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-lg shadow-sm transition-all">
              Sign up
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 border border-primary-100 px-3.5 py-1.5 rounded-full"
          >
            All-in-one link management platform!
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight text-slate-900 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Create Custom <span className="text-primary-500 underline decoration-primary-300 underline-offset-4">Branded</span> Short URLs Instantly
          </motion.h1>

          <motion.p 
            className="text-base md:text-lg text-slate-600 mb-10 max-w-3xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Craft memorable branded short links & dynamic QR codes for seamless sharing. Drive more clicks, boost brand visibility & track performance with user-friendly URL shortener, custom domains & detailed analytics.
          </motion.p>

          {/* Interactive Live Shortener Simulator */}
          <motion.div 
            className="w-full max-w-2xl bg-white border border-glassBorder p-5 rounded-2xl shadow-md mb-8 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {simState === "idle" && (
                <motion.form 
                  key="sim-form"
                  onSubmit={handleSimulate} 
                  className="flex flex-col sm:flex-row gap-3"
                  exit={{ opacity: 0, y: -10 }}
                >
                  <input
                    type="url"
                    placeholder="Paste a long link here to try..."
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    required
                    className="flex-1 px-4 py-3 border border-glassBorder rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all bg-background text-slate-800 placeholder-slate-400"
                  />
                  <button type="submit" className="px-7 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-sm text-sm transition-colors flex items-center justify-center shrink-0">
                    Get Started Free <FiArrowRight className="ml-1.5" />
                  </button>
                </motion.form>
              )}

              {simState === "loading" && (
                <motion.div 
                  key="sim-loading"
                  className="flex flex-col items-center justify-center py-6 space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Generating Branded Link...</p>
                </motion.div>
              )}

              {simState === "ready" && (
                <motion.div 
                  key="sim-ready"
                  className="flex flex-col md:flex-row items-center justify-between gap-5 py-2 text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-50 p-2 rounded-lg border border-primary-100 shrink-0">
                      <QRCodeSVG value={simmedShort} size={64} includeMargin={true} className="rounded" />
                    </div>
                    <div className="truncate">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Short Link Ready</p>
                      <a href={`https://${simmedShort}`} target="_blank" rel="noreferrer" className="text-lg font-bold text-primary-600 hover:underline">
                        {simmedShort}
                      </a>
                      <p className="text-xs text-slate-500 mt-0.5 truncate max-w-sm" title={inputUrl}>{inputUrl}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto justify-end">
                    <button 
                      onClick={copySimmed} 
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center whitespace-nowrap ${
                        copied 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-white border-glassBorder text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {copied ? <><FiCheck className="mr-1.5" /> Copied!</> : <><FiCopy className="mr-1.5" /> Copy Link</>}
                    </button>
                    <button 
                      onClick={() => { setSimState("idle"); setInputUrl(""); }}
                      className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-650 border border-glassBorder rounded-xl text-xs font-bold transition-all"
                    >
                      Shorten Another
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Social Proof / Trust Badges */}
          <motion.div 
            className="flex flex-col items-center space-y-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center space-x-1.5 text-amber-500 font-bold text-sm">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              <span className="text-slate-655 font-semibold text-xs ml-1">Trusted by 10,000+ professionals & agencies</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">Platform Features</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base font-medium">Everything you need to configure, monitor, and scale custom link experiences.</p>
        </div>
        
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover="hover"
              className="bg-gradient-to-b from-white to-slate-50/40 border border-glassBorder/80 p-8 rounded-2xl cursor-pointer"
            >
              <motion.div 
                className="h-11 w-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 mb-6 shadow-sm"
                variants={{
                  hover: { 
                    scale: 1.12,
                    backgroundColor: "#00A88F",
                    color: "#FFFFFF",
                    borderColor: "#00A88F"
                  }
                }}
              >
                {f.icon}
              </motion.div>
              <h3 className="text-lg font-bold mb-3 text-slate-900">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">{f.desc}</p>
              <motion.div 
                className="mt-6 flex items-center text-xs font-bold text-primary-500"
                variants={{
                  hidden: { opacity: 0, x: -5 },
                  hover: { opacity: 1, x: 0 }
                }}
                transition={{ duration: 0.2 }}
              >
                <span>Explore feature</span>
                <FiArrowRight className="ml-1" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white border-y border-glassBorder/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">Simple Link Management</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm">Three easy steps to branding and optimizing your short links.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
            
            {[
              { step: '01', title: 'Input Original Link', desc: 'Paste your long URL into the LinkNova dashboard or live builder.' },
              { step: '02', title: 'Brand & Customize', desc: 'Select a custom domain, add aliases, expiry parameters, or generate QR code.' },
              { step: '03', title: 'Track Real-time Clicks', desc: 'Monitor details on geolocation, browser types, devices, and organic growth.' }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="relative z-10 flex flex-col items-center text-center p-8 bg-background rounded-2xl border border-glassBorder shadow-sm cursor-pointer"
                whileHover={{ 
                  y: -6,
                  scale: 1.01,
                  borderColor: "#00A88F",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)"
                }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
              >
                <div className="w-14 h-14 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-xl font-bold text-primary-600 mb-6 shadow-sm">
                  {item.step}
                </div>
                <h3 className="text-base font-bold mb-2 text-slate-950">{item.title}</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">Loved by professionals</h2>
          <p className="text-slate-650 text-slate-500 max-w-2xl mx-auto text-sm font-medium">See how modern marketing groups utilize LinkNova for tracking.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              className="bg-white border border-glassBorder p-8 rounded-2xl flex flex-col justify-between shadow-sm cursor-pointer"
              whileHover={{ 
                y: -6,
                borderColor: "rgba(0, 168, 143, 0.4)",
                boxShadow: "0 10px 25px -5px rgba(0, 168, 143, 0.05)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <p className="text-slate-600 italic text-sm leading-relaxed mb-6">"{t.quote}"</p>
              <div>
                <h4 className="text-slate-900 font-bold text-sm">{t.name}</h4>
                <p className="text-primary-500 text-xs mt-0.5 font-bold">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 md:px-12 max-w-3xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm">Everything you need to know about the product and billing.</p>
        </div>
        <div className="bg-white border border-glassBorder rounded-2xl p-8 shadow-sm">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} faq={faq} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 relative overflow-hidden bg-background border-t border-glassBorder/50">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-12 text-center relative z-10 shadow-lg text-white">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary-500/5 rounded-full blur-[80px] -z-10" />
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Ready to upgrade your links?</h2>
          <p className="text-sm md:text-base text-slate-350 mb-8 max-w-2xl mx-auto leading-relaxed">Join thousands of users who are already managing their links smarter and faster with LinkNova.</p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link to="/register" className="inline-block px-10 py-4 bg-primary-500 text-white hover:bg-primary-600 font-bold rounded-xl shadow-md">
              Create Your Free Account
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-glassBorder text-center text-slate-500 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded bg-gradient-premium flex items-center justify-center">
              <FiLink size={12} className="text-white" />
            </div>
            <span className="text-slate-800 font-bold tracking-wide">LinkNova</span>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} LinkNova – All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
