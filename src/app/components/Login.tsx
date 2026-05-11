import React, { useEffect, useRef, useState } from 'react';
import { GraduationCap, Mail, Lock, AlertCircle, ArrowLeft, Eye, EyeOff, ShieldCheck, BookOpen, FileText, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Footer } from './Footer';

const ACCENT = '#E56E20';
const BG = '#FDF6F0';

type LoginProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  onAdminLogin?: (email: string, password: string) => Promise<void>;
  onNavigateToRegister: () => void;
  onNavigateBack?: () => void;
};

export function Login({ onLogin, onAdminLogin, onNavigateToRegister, onNavigateBack }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<number | null>(null);
  const pressedKeys = useRef(new Set<string>());

  const unlockAdminMode = () => {
    if (!onAdminLogin) return;
    setIsAdminMode(true);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleLogoClick = () => {
    logoClickCount.current += 1;
    if (logoClickTimer.current) window.clearTimeout(logoClickTimer.current);
    logoClickTimer.current = window.setTimeout(() => { logoClickCount.current = 0; }, 1800);
    if (logoClickCount.current === 5) { logoClickCount.current = 0; unlockAdminMode(); }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeys.current.add(event.code);
      const adminShortcut = event.ctrlKey && event.shiftKey && (
        (event.code === 'Numpad8' && pressedKeys.current.has('KeyN')) ||
        (event.code === 'KeyN' && pressedKeys.current.has('Numpad8'))
      );
      if (adminShortcut) { event.preventDefault(); unlockAdminMode(); }
    };
    const handleKeyUp = (e: KeyboardEvent) => pressedKeys.current.delete(e.code);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (logoClickTimer.current) window.clearTimeout(logoClickTimer.current);
    };
  }, [onAdminLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isAdminMode && onAdminLogin) await onAdminLogin(email, password);
      else await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${ACCENT}, #f7a35c, ${ACCENT})` }} />

      {/* Floating background icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[
          { icon: BookOpen, x: '8%', y: '15%', size: 48, color: ACCENT, delay: 0 },
          { icon: FileText, x: '85%', y: '20%', size: 40, color: '#3B82F6', delay: 1 },
          { icon: Cpu, x: '12%', y: '70%', size: 44, color: '#10B981', delay: 0.5 },
          { icon: BookOpen, x: '80%', y: '65%', size: 36, color: '#8B5CF6', delay: 1.5 },
        ].map(({ icon: Icon, x, y, size, color, delay }, i) => (
          <motion.div key={i} className="absolute"
            style={{ left: x, top: y }}
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay }}
          >
            <Icon size={size} color={color} opacity={0.12} />
          </motion.div>
        ))}
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-10 relative z-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-[1fr_420px] gap-12 items-center">
          {/* Left panel */}
          <motion.div className="hidden lg:block"
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
              Academic Marketplace for Students
            </p>
            <h2 className="text-5xl font-extrabold leading-tight text-gray-900 mb-6">
              Your campus,<br />your resources,<br />
              <span style={{ color: ACCENT }}>one platform.</span>
            </h2>
            <p className="text-base text-gray-500 leading-7 max-w-sm">
              Buy, sell, donate, and exchange academic materials — notes, papers, books, and equipment — with verified students.
            </p>
            <div className="flex gap-6 mt-8">
              {[['📚', 'Study Materials'], ['💰', 'Earn Points'], ['🔒', 'Verified Users']].map(([emoji, label]) => (
                <div key={label} className="text-center">
                  <div className="text-2xl mb-1">{emoji}</div>
                  <p className="text-xs font-semibold text-gray-600">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Login card */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
            {/* Logo */}
            <div className="text-center mb-7">
              <button type="button" onClick={handleLogoClick}
                className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transition-transform hover:scale-105 focus:outline-none"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #f7a35c)` }}>
                <GraduationCap size={40} color="white" />
              </button>
              <h1 className="text-2xl font-bold mb-1" style={{ color: ACCENT }}>
                {isAdminMode ? '🔐 Admin Login' : 'Welcome Back'}
              </h1>
              <p className="text-sm text-gray-500">
                {isAdminMode ? 'Secure access for platform admins' : 'Sign in to Pass The Paper'}
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <form onSubmit={handleSubmit} className="p-7 space-y-4">
                <AnimatePresence>
                  {isAdminMode && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                      <ShieldCheck size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700 font-medium">Admin mode active — use your administrator credentials.</p>
                    </motion.div>
                  )}
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-600">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    {isAdminMode ? 'Admin Email' : 'University Email'}
                  </label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 focus-within:border-[#E56E20] focus-within:ring-2 focus-within:ring-orange-100 transition-all bg-gray-50">
                    <Mail size={16} className="text-gray-400 flex-shrink-0" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder={isAdminMode ? 'admin@passthepaper.com' : 'you@uiu.ac.bd'}
                      className="w-full py-2.5 text-sm text-gray-800 bg-transparent outline-none"
                      autoComplete="email" required />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Password</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 focus-within:border-[#E56E20] focus-within:ring-2 focus-within:ring-orange-100 transition-all bg-gray-50">
                    <Lock size={16} className="text-gray-400 flex-shrink-0" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full py-2.5 text-sm text-gray-800 bg-transparent outline-none flex-1"
                      autoComplete="current-password" required />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 mt-2"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, #f7a35c)` }}>
                  {loading ? 'Signing in...' : isAdminMode ? 'Login as Admin' : 'Sign In'}
                </button>
              </form>

              <div className="px-7 pb-6 flex flex-col items-center gap-3 text-xs text-gray-500">
                {!isAdminMode && (
                  <p>Don't have an account?{' '}
                    <button onClick={onNavigateToRegister} className="font-semibold underline" style={{ color: ACCENT }}>
                      Register
                    </button>
                  </p>
                )}
                {isAdminMode && (
                  <button onClick={() => { setIsAdminMode(false); setEmail(''); setPassword(''); setError(''); }}
                    className="font-semibold flex items-center gap-1" style={{ color: ACCENT }}>
                    <ArrowLeft size={12} /> Back to Student Login
                  </button>
                )}
                {onNavigateBack && (
                  <button onClick={onNavigateBack} className="flex items-center gap-1 text-gray-400 hover:text-gray-600">
                    <ArrowLeft size={12} /> Go Back
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
