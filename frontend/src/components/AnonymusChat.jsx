
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full blur-4xl animate-pulse"></div>
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-4xl animate-pulse delay-1000"></div>
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-glow"
        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
      />
    ))}
    <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]"></div>
  </div>
);

export default function AnonymousChat() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('disconnected');
  const [roomId, setRoomId] = useState(null);
  const [queueCount, setQueueCount] = useState(0);
  const [reportReason, setReportReason] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [typing, setTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token retrieved from localStorage:', token);
    if (!token) {
      console.error('No token found in localStorage');
      navigate('/signin');
      return;
    }

    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: { token },
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      console.log('Emitting authenticate with token:', token);
      newSocket.emit('authenticate', token);
    });

    newSocket.on('authenticated', ({ success, error }) => {
      if (success) {
        console.log('Authentication successful, emitting findStranger');
        setStatus('waiting');
        newSocket.emit('findStranger');
      } else {
        console.error('Socket auth error:', error);
        setMessages(prev => [...prev, { sender: 'System', text: `Error: ${error}` }]);
        navigate('/signin');
      }
    });

    newSocket.on('waiting', ({ message }) => {
      console.log('Received waiting event:', message);
      setStatus('waiting');
      setMessages(prev => [...prev, { sender: 'System', text: message }]);
    });

    newSocket.on('queueUpdate', ({ count }) => {
      console.log('Received queue update:', count);
      setQueueCount(count);
    });

    newSocket.on('chatStarted', ({ roomId }) => {
      console.log('Chat started, room ID:', roomId);
      setStatus('connected');
      setRoomId(roomId);
      setMessages([{ sender: 'System', text: 'Connected with a stranger!' }]);
    });

    newSocket.on('message', ({ senderId, text, timestamp }) => {
      console.log('Received message:', { senderId, text, timestamp });
      const myUserId = localStorage.getItem('userId');
      const displaySender = senderId === myUserId ? 'You' : 'Stranger';
      setMessages(prev => [...prev, { sender: displaySender, text, timestamp }]);
    });

    newSocket.on('typing', () => {
      setPartnerTyping(true);
    });

    newSocket.on('stopTyping', () => {
      setPartnerTyping(false);
    });

    newSocket.on('strangerDisconnected', ({ message }) => {
      console.log('Stranger disconnected:', message);
      setStatus('disconnected');
      setRoomId(null);
      setMessages(prev => [...prev, { sender: 'System', text: message }]);
      newSocket.emit('findStranger');
    });

    newSocket.on('reportSubmitted', ({ message }) => {
      console.log('Report submitted:', message);
      setMessages(prev => [...prev, { sender: 'System', text: message }]);
      setShowReport(false);
      setReportReason('');
    });

    newSocket.on('error', ({ message }) => {
      console.error('Socket error:', message);
      setMessages(prev => [...prev, { sender: 'System', text: `Error: ${message}` }]);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setStatus('disconnected');
      setRoomId(null);
    });

    return () => {
      console.log('Cleaning up socket');
      newSocket.disconnect();
    };
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (socket && roomId) {
      if (e.target.value.length > 0 && !typing) {
        socket.emit('typing', { roomId });
        setTyping(true);
      } else if (e.target.value.length === 0 && typing) {
        socket.emit('stopTyping', { roomId });
        setTyping(false);
      }
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (typing) {
        socket.emit('stopTyping', { roomId });
        setTyping(false);
      }
    }, 2000);
  };

  const handleSendMessage = () => {
    if (input.trim() && socket && roomId) {
      console.log('Sending message:', input, 'to room:', roomId);
      socket.emit('message', { roomId, text: input });
      setInput('');
      socket.emit('stopTyping', { roomId });
      setTyping(false);
    }
  };

  const handleNextChat = () => {
    if (socket) {
      console.log('Requesting next chat');
      socket.emit('nextChat');
    }
  };

  const handleReport = () => {
    if (reportReason.trim() && socket) {
      console.log('Submitting report:', reportReason);
      socket.emit('report', { reason: reportReason });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 relative overflow-hidden">
      <AnimatedBackground />
      <motion.div
        className="container mx-auto px-4 sm:px-6 md:px-10 py-10 md:py-16 flex flex-col h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="flex items-center justify-between mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => navigate('/Features')}
              className="p-2 bg-white/90 backdrop-blur-xl rounded-lg hover:bg-white/100 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={24} />
            </motion.button>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Anonymous Chat
            </h1>
          </div>
          <motion.div
            className="text-sm font-medium text-gray-600"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Status: {status === 'connected' ? 'Connected' : status === 'waiting' ? 'Waiting...' : 'Disconnected'} | Users in queue: {queueCount}
          </motion.div>
        </motion.div>

        <div className="flex-1 overflow-y-auto bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-gray-200/30 p-4 md:p-6 mb-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`mb-4 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-xs md:max-w-md ${
                    msg.sender === 'You'
                      ? 'bg-gradient-to-r from-slate-600 to-slate-800 text-white'
                      : msg.sender === 'Stranger'
                      ? 'bg-gray-200/80 text-gray-800'
                      : 'bg-amber-100/80 text-amber-800'
                  }`}
                >
                  <p className="text-sm md:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <strong>{msg.sender}:</strong> {msg.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {partnerTyping && (
            <motion.div
              className="text-gray-500 text-sm italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Stranger is typing...
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-end gap-3">
          <motion.textarea
            value={input}
            onChange={handleInputChange}
            onKeyPress={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder="Type a message..."
            rows="1"
            className="flex-1 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 border border-gray-200/30 transition-all resize-none text-sm md:text-base"
            style={{
              fontFamily: 'Inter, sans-serif',
              minHeight: '48px',
              maxHeight: '120px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            disabled={status !== 'connected'}
            whileFocus={{ scale: 1.01 }}
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={status !== 'connected' || !input.trim()}
            className="p-3 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-lg hover:from-slate-700 hover:to-slate-900 disabled:opacity-50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={20} />
          </motion.button>
        </div>

        <div className="flex justify-between mt-4">
          <motion.button
            onClick={handleNextChat}
            disabled={status !== 'connected'}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 disabled:opacity-50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
          <motion.button
            onClick={() => setShowReport(true)}
            disabled={status !== 'connected'}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg hover:from-red-600 hover:to-red-800 disabled:opacity-50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AlertTriangle size={20} className="inline mr-1" /> Report
          </motion.button>
        </div>

        <AnimatePresence>
          {showReport && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white/95 backdrop-blur-2xl rounded-2xl p-6 w-full max-w-sm"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Report Stranger
                  </h2>
                  <button onClick={() => setShowReport(false)} className="p-1 hover:bg-gray-100 rounded">
                    <X size={20} />
                  </button>
                </div>
                <textarea
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  placeholder="Reason for reporting..."
                  rows="4"
                  className="w-full px-3 py-2 bg-gray-100/80 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 border border-gray-200/30"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setShowReport(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReport}
                    disabled={!reportReason.trim()}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx>{`
          .shadow-glow {
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.3);
          }
          .bg-grid-pattern {
            background-image: linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;
          }
          textarea::-webkit-scrollbar,
          div::-webkit-scrollbar {
            width: 8px;
          }
          textarea::-webkit-scrollbar-track,
          div::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
          }
          textarea::-webkit-scrollbar-thumb,
          div::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #64748b, #475569);
            border-radius: 4px;
          }
          textarea::-webkit-scrollbar-thumb:hover,
          div::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #475569, #334155);
          }
          .backdrop-blur-2xl {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
        `}</style>
      </motion.div>
    </div>
  );
}