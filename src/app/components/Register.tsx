import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, User, Building, CreditCard, AlertCircle, Eye, EyeOff, ShieldCheck, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Footer } from './Footer';
import { sendOtpEmail, verifyOtp, clearOtp } from '../utils/emailOtp';

type RegisterProps = {
  onRegister: (email: string, password: string, name: string, university: string, studentId: string) => Promise<void>;
  onNavigateToLogin: () => void;
};

const ACCENT = '#E56E20';
const BG = '#FDF6F0';

export function Register({ onRegister, onNavigateToLogin }: RegisterProps) {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [studentId, setStudentId] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    setError('');
    if (!name || !email || !university || !studentId || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await sendOtpEmail(email, name);
      setStep('otp');
      startResendCooldown();
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    const isValid = verifyOtp(email, otp);
    if (!isValid) {
      setError('Invalid or expired OTP. Please try again.');
      return;
    }

    setLoading(true);
    try {
      await onRegister(email, password, name, university, studentId);
      clearOtp();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError('');
    try {
      await sendOtpEmail(email, name);
      startResendCooldown();
    } catch {
      setError('Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
      {/* Top decorative bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${ACCENT}, #f7a35c, ${ACCENT})` }} />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #f7a35c)` }}>
              <GraduationCap size={40} color="white" />
            </div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: ACCENT }}>Create Account</h1>
            <p className="text-gray-500 text-sm">Join Pass The Paper · Academic Marketplace</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {/* Step indicator */}
            <div className="flex border-b border-gray-100">
              {['Details', 'Verify Email'].map((label, i) => (
                <div key={i} className="flex-1 py-3 text-center text-xs font-semibold transition-colors"
                  style={{
                    color: i === (step === 'form' ? 0 : 1) ? ACCENT : '#9CA3AF',
                    borderBottom: i === (step === 'form' ? 0 : 1) ? `2px solid ${ACCENT}` : '2px solid transparent',
                  }}>
                  {i + 1}. {label}
                </div>
              ))}
            </div>

            <div className="p-7">
              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 mb-5"
                  >
                    <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {step === 'form' ? (
                <div className="space-y-4">
                  {/* Full Name */}
                  <Field label="Full Name" icon={<User size={16} />}>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="e.g. Rafi Ahmed"
                      className="w-full py-2.5 text-sm text-gray-800 bg-transparent outline-none" required />
                  </Field>

                  {/* Email */}
                  <Field label="University Email" icon={<Mail size={16} />}>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@uiu.ac.bd"
                      className="w-full py-2.5 text-sm text-gray-800 bg-transparent outline-none" required />
                  </Field>

                  {/* University */}
                  <Field label="University" icon={<Building size={16} />}>
                    <input type="text" value={university} onChange={e => setUniversity(e.target.value)}
                      placeholder="United International University"
                      className="w-full py-2.5 text-sm text-gray-800 bg-transparent outline-none" required />
                  </Field>

                  {/* Student ID */}
                  <Field label="Student ID" icon={<CreditCard size={16} />}>
                    <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)}
                      placeholder="011XXXXXXX"
                      className="w-full py-2.5 text-sm text-gray-800 bg-transparent outline-none" required />
                  </Field>

                  {/* Password */}
                  <Field label="Password" icon={<Lock size={16} />} extra={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }>
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full py-2.5 text-sm text-gray-800 bg-transparent outline-none" required />
                  </Field>

                  {/* Confirm Password */}
                  <Field label="Confirm Password" icon={<Lock size={16} />} extra={
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }>
                    <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full py-2.5 text-sm text-gray-800 bg-transparent outline-none" required />
                  </Field>

                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm mt-2 transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${ACCENT}, #f7a35c)` }}
                  >
                    {loading ? (
                      <><RefreshCw size={16} className="animate-spin" /> Sending OTP...</>
                    ) : (
                      <><Mail size={16} /> Send OTP to Email</>
                    )}
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  {/* OTP Step */}
                  <div className="text-center p-4 rounded-2xl bg-orange-50 border border-orange-100">
                    <CheckCircle2 size={32} style={{ color: ACCENT }} className="mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-800">OTP Sent!</p>
                    <p className="text-xs text-gray-500 mt-1">We sent a 6-digit code to</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: ACCENT }}>{email}</p>
                    <p className="text-xs text-gray-400 mt-1">Valid for 10 minutes</p>
                  </div>

                  {/* OTP Input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="• • • • • •"
                      inputMode="numeric"
                      maxLength={6}
                      className="w-full text-center text-2xl font-bold tracking-[0.5em] py-4 border-2 rounded-2xl outline-none transition-colors"
                      style={{ borderColor: otp.length === 6 ? ACCENT : '#E5E7EB', color: ACCENT }}
                    />
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${ACCENT}, #f7a35c)` }}
                  >
                    {loading ? (
                      <><RefreshCw size={16} className="animate-spin" /> Verifying...</>
                    ) : (
                      <><ShieldCheck size={16} /> Verify & Create Account</>
                    )}
                  </button>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => { setStep('form'); setOtp(''); setError(''); }}
                      className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                    >
                      <ArrowLeft size={12} /> Edit Details
                    </button>
                    <button
                      onClick={handleResend}
                      disabled={resendCooldown > 0 || loading}
                      className="text-xs font-semibold disabled:opacity-40 flex items-center gap-1"
                      style={{ color: ACCENT }}
                    >
                      <RefreshCw size={12} />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="mt-5 text-center">
                <p className="text-xs text-gray-500">
                  Already have an account?{' '}
                  <button onClick={onNavigateToLogin} className="font-semibold underline" style={{ color: ACCENT }}>
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, icon, children, extra }: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 focus-within:border-[#E56E20] focus-within:ring-2 focus-within:ring-orange-100 transition-all bg-gray-50">
        <span className="text-gray-400 flex-shrink-0">{icon}</span>
        <div className="flex-1">{children}</div>
        {extra && <span className="flex-shrink-0">{extra}</span>}
      </div>
    </div>
  );
}
