
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, Bot, Video, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: 'spring',
      stiffness: 100,
    },
  },
};

const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Gradient Orbs */}
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full blur-4xl animate-pulse"></div>
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-4xl animate-pulse delay-1000"></div>
    <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
    <div className="absolute top-2/3 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-spin-slow"></div>

    {/* Animated Stars */}
    {[...Array(25)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-glow"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          scale: [0.8, 1.5, 0.8],
          opacity: [0.5, 1, 0.5],
          rotate: [0, 360],
        }}
        transition={{
          duration: 2.5 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: 'easeInOut',
        }}
      />
    ))}

    {/* Floating Particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        className={`absolute rounded-full ${i % 3 === 0 ? 'w-2 h-2 bg-teal-400/50' : i % 3 === 1 ? 'w-3 h-3 bg-blue-400/50' : 'w-2.5 h-2.5 bg-purple-400/50'}`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [-40, -120, -40],
          x: [0, Math.random() * 60 - 30, 0],
          opacity: [0.2, 0.8, 0.2],
          scale: [0.6, 1.2, 0.6],
        }}
        transition={{
          duration: 3 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: 'easeInOut',
        }}
      />
    ))}

    {/* Comet-like Streaks */}
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={`comet-${i}`}
        className="absolute w-1 h-8 bg-gradient-to-b from-white/80 to-transparent rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -200],
          opacity: [0, 1, 0],
          rotate: [0, 45],
        }}
        transition={{
          duration: 5 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 3,
          ease: 'linear',
        }}
      />
    ))}

    {/* Grid Pattern */}
    <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]"></div>
  </div>
);

const FeatureButton = ({ icon: Icon, title, description, onClick }) => (
  <motion.div
    className="flex flex-col items-center p-6 md:p-8 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-gray-200/30 hover:bg-white/100 hover:shadow-2xl transition-all duration-300 w-full max-w-md"
    variants={itemVariants}
    whileHover={{ scale: 1.05, y: -8 }}
    whileTap={{ scale: 0.98 }}
  >
    <motion.div
      className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white mb-4"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <Icon size={36} />
    </motion.div>
    <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
      {title}
    </h3>
    <p className="text-sm md:text-base text-gray-600 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
      {description}
    </p>
    <button
      onClick={onClick}
      className="mt-5 px-5 py-2.5 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-lg hover:from-slate-700 hover:to-slate-900 transition-all duration-200"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      Explore
    </button>
  </motion.div>
);

export default function Features() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const features = [
    {
      icon: Users,
      title: 'Community Post',
      description: 'Share your thoughts and connect with others in a supportive community.',
      onClick: () => navigate('/community'),
    },
    {
      icon: MessageSquare,
      title: 'Anonymous Chat',
      description: 'Talk anonymously with peers for safe and open conversations.',
      onClick: () => navigate('/anonymous-chat'),
    },
    {
      icon: Bot,
      title: 'AI Chatbot 24/7',
      description: 'Get instant mental health support from our AI chatbot, anytime, anywhere.',
      onClick: () => navigate('/dashboard'),
    },
    {
      icon: Video,
      title: '30-Day Motivational Program',
      description: 'Follow a daily schedule with motivational videos to combat depression.',
      onClick: () => navigate('/motivational-program'),
    },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
      window.location.href = '/signin';
    } catch (err) {
      console.error('Logout error:', err.response?.data || err.message);
      window.location.href = '/signin'; // Redirect even on error to ensure logout
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 relative overflow-hidden">
      <AnimatedBackground />
      <motion.div
        className="container mx-auto px-4 sm:px-6 md:px-10 py-10 md:py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-gray-900 mb-10 md:mb-16"
          style={{ fontFamily: 'Inter, sans-serif' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Features
        </motion.h1>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <FeatureButton
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              onClick={feature.onClick}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        disabled={loggingOut}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 p-4 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full shadow-xl hover:from-red-600 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: 'Inter, sans-serif' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        title="Logout"
      >
        {loggingOut ? (
          <motion.div
            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <LogOut size={28} />
        )}
      </motion.button>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .shadow-glow {
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.3);
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #64748b, #475569);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #475569, #334155);
        }
        .backdrop-blur-2xl {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
