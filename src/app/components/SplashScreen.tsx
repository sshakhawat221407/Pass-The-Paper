import React from 'react';
import { GraduationCap, Book, Cpu, FileText, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

type SplashScreenProps = {
  onGetStarted: () => void;
};

export function SplashScreen({ onGetStarted }: SplashScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ backgroundColor: '#FDF6F0' }}>
      {/* Floating Books Animations */}
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

      {/* Floating Equipment Animations */}
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
      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        >
          <div className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#E56E20' }}>
            <GraduationCap size={64} color="white" />
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold mb-2"
          style={{ color: '#E56E20' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Pass The Paper
        </motion.h1>

        <motion.p
          className="text-gray-600 text-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Academic Resource Marketplace
        </motion.p>

        <motion.button
          onClick={onGetStarted}
          className="px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all hover:opacity-90 transform hover:scale-105"
          style={{ backgroundColor: '#E56E20' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
}