import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, MessageCircle, Share2, UserPlus, ArrowLeft, Users, Home, Search, Bell, Mail, Bookmark, User, MoreHorizontal, Image, Smile, MapPin, Calendar, Edit3, TrendingUp, Sparkles, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const postVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const sidebarVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/8 via-purple-500/8 to-pink-500/8 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-teal-500/8 via-blue-500/8 to-indigo-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
  </div>
);

const Sidebar = ({ navigate, isOpen, setIsOpen }) => {
  const menuItems = [
    { icon: Home, label: 'Home', active: true, count: null },
    { icon: Search, label: 'Explore', count: null },
    { icon: Bell, label: 'Notifications', count: 3 },
    { icon: Mail, label: 'Messages', count: 1 },
    { icon: Bookmark, label: 'Bookmarks', count: null },
    { icon: User, label: 'Profile', count: null },
    { icon: TrendingUp, label: 'Analytics', count: null },
    { icon: MoreHorizontal, label: 'More', count: null }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        className={`fixed left-0 top-0 h-screen bg-white/95 backdrop-blur-xl border-r border-gray-100 p-4 sm:p-6 z-40 shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 sm:w-72`}
        // Removed conflicting variants, initial, and animate props to rely on CSS classes
        initial={false}
        animate={false}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 lg:hidden z-50 touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <X size={20} className="text-gray-600" />
        </button>

        <motion.button
          onClick={() => navigate('/Features')}
          className="flex items-center gap-3 mb-6 sm:mb-10 p-3 text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all w-full group"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft size={20} className="group-hover:text-blue-700" />
          <span className="font-semibold group-hover:text-blue-700 text-sm sm:text-base">Back to Features</span>
        </motion.button>

        <div className="mb-6 sm:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles size={16} className="sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Community</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 ml-11 sm:ml-13">Connect, share, and grow together</p>
        </div>

        <nav className="space-y-1 mb-6 sm:mb-10 flex-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              className={`flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all w-full text-left group ${
                item.active 
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.01, x: 2 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <item.icon size={20} className={`sm:w-[22px] sm:h-[22px] ${item.active ? 'text-blue-600' : 'text-gray-600 group-hover:text-gray-800'}`} />
                <span className="text-base sm:text-lg font-medium">{item.label}</span>
              </div>
              {item.count && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </motion.button>
          ))}
        </nav>

        <motion.button
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-3 sm:py-4 px-6 sm:px-8 font-bold text-base sm:text-lg w-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Edit3 size={16} className="sm:w-[18px] sm:h-[18px]" />
            Share Story
          </div>
        </motion.button>
      </motion.div>
    </>
  );
};

const PostCard = ({ post, onLike, onComment, onShare }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (post.likes && Array.isArray(post.likes)) {
      setIsLiked(post.likes.includes(userId));
    }
  }, [post.likes]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/community/like/${post._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onLike(post._id, response.data.likes);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleComment = async () => {
    if (commentText.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/community/comment/${post._id}`,
          { content: commentText.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onComment(post._id, response.data.post);
        setCommentText('');
        setShowComments(true);
      } catch (err) {
        console.error('Comment error:', err);
      }
    }
  };

  const handleShare = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/community/share/${post._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onShare(post._id, response.data.shares);
      setIsReposted(true);
      setTimeout(() => setIsReposted(false), 1000);
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const likesCount = post.likes ? (Array.isArray(post.likes) ? post.likes.length : 0) : 0;
  const commentsCount = post.comments ? (Array.isArray(post.comments) ? post.comments.length : 0) : 0;
  const sharesCount = post.shares || 0;

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.article
      className="bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4 sm:p-6 hover:bg-gray-50/30 transition-all duration-200 group"
      variants={postVariants}
      whileHover={{ y: -1 }}
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xs sm:text-sm">
              {getInitials(post.userId?.Fullname)}
            </span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <header className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors text-sm sm:text-base truncate">
              {post.userId?.Fullname || 'Anonymous User'}
            </h3>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <time className="text-gray-500 text-xs sm:text-sm font-medium flex-shrink-0">
              {getTimeAgo(post.createdAt)}
            </time>
          </header>
          
          <div className="mb-3 sm:mb-4">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words text-sm sm:text-[15px]">
              {post.content}
            </p>
          </div>
          
          <footer className="flex items-center justify-between max-w-lg">
            <motion.button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 transition-all group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px] group-hover:fill-blue-50" />
              <span className="text-xs sm:text-sm font-medium">{commentsCount}</span>
            </motion.button>
            
            <motion.button
              onClick={handleShare}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 transition-all group ${
                isReposted 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isReposted ? { rotate: 360 } : {}}
            >
              <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="text-xs sm:text-sm font-medium">{sharesCount}</span>
            </motion.button>
            
            <motion.button
              onClick={handleLike}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 transition-all group ${
                isLiked 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={16} className={`sm:w-[18px] sm:h-[18px] transition-all ${isLiked ? 'fill-red-500' : 'group-hover:fill-red-100'}`} />
              <span className="text-xs sm:text-sm font-medium">{likesCount}</span>
            </motion.button>
          </footer>
          
          <AnimatePresence>
            {showComments && (
              <motion.div
                className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {post.comments && Array.isArray(post.comments) && post.comments.length > 0 && (
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-60 sm:max-h-80 overflow-y-auto">
                    {post.comments.slice(-5).map((comment, i) => (
                      <motion.div 
                        key={i} 
                        className="flex gap-2 sm:gap-3 bg-gray-50/50 rounded-xl p-2.5 sm:p-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {getInitials(comment.userId?.Fullname)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                              {comment.userId?.Fullname || 'Anonymous'}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {getTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-800 text-xs sm:text-sm leading-relaxed break-words">{comment.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-xl p-2.5 sm:p-3 border-2 border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
                      <textarea
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full border-none outline-none bg-transparent placeholder-gray-500 resize-none text-xs sm:text-sm"
                        rows="2"
                        onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleComment())}
                      />
                      <div className="flex items-center justify-between pt-2 sm:pt-3">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Image size={14} className="sm:w-4 sm:h-4 text-blue-500 cursor-pointer hover:text-blue-600 transition-colors" />
                          <Smile size={14} className="sm:w-4 sm:h-4 text-blue-500 cursor-pointer hover:text-blue-600 transition-colors" />
                        </div>
                        <motion.button
                          onClick={handleComment}
                          disabled={!commentText.trim()}
                          className="bg-blue-600 text-white rounded-lg px-3 sm:px-4 py-1 sm:py-1.5 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Reply
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
};

const CreatePost = ({ onCreatePost, input, setInput }) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4 sm:p-6">
      <div className="flex gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex-shrink-0 shadow-sm"></div>
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 border-2 border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Share your story, thoughts, or encourage others..."
              className="w-full border-none outline-none bg-transparent placeholder-gray-500 resize-none text-sm sm:text-[15px] leading-relaxed"
              rows="3"
              maxLength="280"
            />
            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 mt-3 sm:mt-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Image size={16} className="sm:w-[18px] sm:h-[18px] text-blue-500 cursor-pointer hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded" />
                <Smile size={16} className="sm:w-[18px] sm:h-[18px] text-blue-500 cursor-pointer hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded" />
                <Calendar size={16} className="sm:w-[18px] sm:h-[18px] text-blue-500 cursor-pointer hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded hidden sm:block" />
                <MapPin size={16} className="sm:w-[18px] sm:h-[18px] text-blue-500 cursor-pointer hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded hidden sm:block" />
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className={`text-xs sm:text-sm font-medium ${input.length > 250 ? 'text-red-500' : 'text-gray-500'}`}>
                  {input.length}/280
                </div>
                <motion.button
                  onClick={onCreatePost}
                  disabled={!input.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-xs sm:text-sm"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="hidden sm:inline">Share Story</span>
                  <span className="sm:hidden">Share</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Set sidebar open on desktop
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/community/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const safePosts = (response.data.posts || []).map(post => ({
        ...post,
        likes: post.likes || [],
        comments: post.comments || [],
        shares: post.shares || 0,
        userId: post.userId || { Fullname: 'Anonymous User' }
      }));
      
      setPosts(safePosts);
    } catch (err) {
      console.error('Posts fetch error:', err);
      setError('Unable to load posts. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!input.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/community/create`,
        { content: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const newPost = {
        ...response.data.post,
        likes: response.data.post.likes || [],
        comments: response.data.post.comments || [],
        shares: response.data.post.shares || 0,
        userId: response.data.post.userId || { Fullname: 'Anonymous User' }
      };
      
      setPosts([newPost, ...posts]);
      setInput('');
    } catch (err) {
      console.error('Create post error:', err);
      setError('Unable to share your story. Please try again.');
    }
  };

  const handleLike = (postId, likes) => {
    setPosts(posts.map(post => 
      post._id === postId ? { ...post, likes: likes || [] } : post
    ));
  };

  const handleComment = (postId, updatedPost) => {
    setPosts(posts.map(p => 
      p._id === postId ? {
        ...updatedPost,
        likes: updatedPost.likes || [],
        comments: updatedPost.comments || [],
        shares: updatedPost.shares || 0
      } : p
    ));
  };

  const handleShare = (postId, shares) => {
    setPosts(posts.map(post => 
      post._id === postId ? { ...post, shares: shares || 0 } : post
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div 
            className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4 sm:mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Loading Community</h2>
          <p className="text-sm sm:text-base text-gray-500">Connecting you with stories of hope...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <AnimatedBackground />
      
      <Sidebar navigate={navigate} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-4 z-20">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">Community</h1>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full"></div>
        </div>
      </div>
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : ''}`}>
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm min-h-screen lg:border-x border-gray-100 shadow-sm">
          {/* Desktop Header */}
          <header className="hidden lg:block sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Community Feed</h1>
                <p className="text-sm text-gray-500 mt-1">Share your journey, inspire others</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600">{posts.length} stories</span>
              </div>
            </div>
          </header>
          
          <CreatePost 
            onCreatePost={handleCreatePost} 
            input={input} 
            setInput={setInput} 
          />
          
          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-xl p-4 m-4 sm:m-6 text-red-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm sm:text-base">{error}</span>
              </div>
            </motion.div>
          )}
          
          <AnimatePresence mode="wait">
            {posts.length === 0 && !loading ? (
              <motion.div
                className="text-center py-16 sm:py-20 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key="empty"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Start the Conversation</h3>
                <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto leading-relaxed">
                  Be the first to share your story and inspire others on their journey to wellness.
                </p>
              </motion.div>
            ) : (
              <div key="posts">
                {posts.map((post, i) => (
                  <PostCard
                    key={post._id || i}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-2 z-20">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 p-2 text-blue-600">
            <Home size={20} />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-500">
            <Search size={20} />
            <span className="text-xs font-medium">Explore</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-500 relative">
            <Bell size={20} />
            <span className="text-xs font-medium">Alerts</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-500 relative">
            <Mail size={20} />
            <span className="text-xs font-medium">Messages</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">1</span>
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-500">
            <User size={20} />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Mobile FAB for Create Post */}
      <motion.button
        className="lg:hidden fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center z-30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => document.querySelector('textarea')?.focus()}
      >
        <Edit3 size={20} className="text-white" />
      </motion.button>
    </div>
  );
}