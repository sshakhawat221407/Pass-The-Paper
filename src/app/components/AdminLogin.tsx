import React, { useState } from 'react';
import { Shield, Mail, Lock, AlertCircle, Book, Cpu, FileText, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

type AdminLoginProps = {
  onAdminLogin: (email: string, password: string) => Promise<void>;
  onNavigateToLogin: () => void;
};

export function AdminLogin({ onAdminLogin, onNavigateToLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onAdminLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Admin login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative" style={{ backgroundColor: '#F0D7C7' }}>
      {/* Floating Animations */}
      <motion.div
        className="absolute top-20 left-10"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Book size={48} color="#E56E20" opacity={0.3} />
      </motion.div>

      <motion.div
        className="absolute top-40 right-20"
        animate={{
          y: [0, -25, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <BookOpen size={56} color="#E56E20" opacity={0.25} />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-20"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <FileText size={44} color="#E56E20" opacity={0.3} />
      </motion.div>

      <motion.div
        className="absolute top-60 left-1/4"
        animate={{
          y: [0, -30, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      >
        <Cpu size={52} color="#3B82F6" opacity={0.25} />
      </motion.div>

      <motion.div
        className="absolute bottom-40 right-1/4"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
      >
        <Cpu size={40} color="#10B981" opacity={0.3} />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-10"
        animate={{
          y: [0, -18, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      >
        <Book size={36} color="#8B5CF6" opacity={0.28} />
      </motion.div>

      {/* Main Content */}
      <div className="w-full max-w-md z-10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: '#E56E20' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <Shield size={48} color="white" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#E56E20' }}>
            Admin Login
          </h1>
          <p className="text-gray-600">Access the Admin Dashboard</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@passthepaper.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#E56E20' }}
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Not an admin?{' '}
              <button
                onClick={onNavigateToLogin}
                className="font-semibold"
                style={{ color: '#E56E20' }}
              >
                Student Login
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}