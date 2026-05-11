import React, { useState } from 'react';
import { GraduationCap, Loader, CheckCircle, AlertCircle, Book, Cpu, FileText, BookOpen } from 'lucide-react';
import { useMockData } from '../utils/MockDataContext';
import { motion } from 'motion/react';

type SetupPageProps = {
  onSetupComplete: () => void;
};

export function SetupPage({ onSetupComplete }: SetupPageProps) {
  const mockData = useMockData();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleInitialize = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Simulate initialization delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // The data is already initialized from MockDataContext
      // Just show the credentials
      setResult({
        adminCredentials: {
          email: 'admin@passthepaper.com',
          password: 'admin123',
        },
        studentCredentials: {
          email: 'student@university.edu',
          password: 'student123',
        },
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred during setup');
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
      <div className="w-full max-w-2xl z-10">
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
            <GraduationCap size={48} color="white" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#E56E20' }}>
            Pass The Paper
          </h1>
          <p className="text-gray-600 text-lg">First-Time Setup</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {!result && !error && (
            <>
              <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
              <p className="text-gray-600 mb-6">
                This appears to be your first time setting up Pass The Paper. Click the button below to initialize the application with sample data, including:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>An admin account for managing users and approvals</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Sample student accounts for testing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Sample academic resources and files</span>
                </li>
              </ul>
              <button
                onClick={handleInitialize}
                disabled={loading}
                className="w-full py-4 rounded-lg text-white font-semibold text-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#E56E20' }}
              >
                {loading ? (
                  <>
                    <Loader size={24} className="animate-spin" />
                    Initializing...
                  </>
                ) : (
                  'Initialize Application'
                )}
              </button>
            </>
          )}

          {error && (
            <div className="text-center">
              <AlertCircle size={64} className="mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-bold mb-2 text-red-600">Setup Error</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={onSetupComplete}
                className="px-6 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: '#E56E20' }}
              >
                Continue to Login
              </button>
            </div>
          )}

          {result && (
            <div className="text-center">
              <CheckCircle size={64} className="mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold mb-4 text-green-600">Setup Complete!</h3>
              <p className="text-gray-600 mb-6">Your application has been initialized successfully.</p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h4 className="font-semibold mb-4">Test Credentials:</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Admin Account:</p>
                    <p className="font-mono text-sm">
                      <strong>Email:</strong> {result.adminCredentials?.email}
                    </p>
                    <p className="font-mono text-sm">
                      <strong>Password:</strong> {result.adminCredentials?.password}
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-1">Student Account:</p>
                    <p className="font-mono text-sm">
                      <strong>Email:</strong> {result.studentCredentials?.email}
                    </p>
                    <p className="font-mono text-sm">
                      <strong>Password:</strong> {result.studentCredentials?.password}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onSetupComplete}
                className="w-full py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: '#E56E20' }}
              >
                Continue to Application
              </button>
            </div>
          )}
        </motion.div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <strong>Note:</strong> This is a prototype application. Data is stored locally in your browser.
        </p>
      </div>
    </div>
  );
}