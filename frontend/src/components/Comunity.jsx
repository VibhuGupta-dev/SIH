import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, MessageCircle, Share2, UserPlus, ArrowLeft, Users, Home, Search, Bell, Mail, Bookmark, User, MoreHorizontal, Image, Smile, MapPin, Calendar, Edit3, TrendingUp, Sparkles } from 'lucide-react';
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

const Sidebar = ({ navigate }) => {
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
    <motion.div 
      className="fixed left-0 top-0 h-screen w-72 bg-white/95 backdrop-blur-xl border-r border-gray-100 p-6 z-20 shadow-sm"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.button
        onClick={() => navigate('/Features')}
        className="flex items-center gap-3 mb-10 p-3 text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all w-full group"
        whileHover={{ x: -3 }}
      >
        <ArrowLeft size={20} className="group-hover:text-blue-700" />
        <span className="font-semibold group-hover:text-blue-700">Back to Features</span>
      </motion.button>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles size={20} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Community</h2>
        </div>
        <p className="text-sm text-gray-500 ml-13">Connect, share, and grow together</p>
      </div>

      <nav className="space-y-1 mb-10">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            className={`flex items-center justify-between p-4 rounded-xl transition-all w-full text-left group ${
              item.active 
                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-4">
              <item.icon size={22} className={`${item.active ? 'text-blue-600' : 'text-gray-600 group-hover:text-gray-800'}`} />
              <span className="text-lg font-medium">{item.label}</span>
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
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-4 px-8 font-bold text-lg w-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-center gap-2">
          <Edit3 size={18} />
          Share Story
        </div>
      </motion.button>
    </motion.div>
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
      className="bg-white/95 backdrop-blur-sm border-b border-gray-100 p-6 hover:bg-gray-50/30 transition-all duration-200 group"
      variants={postVariants}
      whileHover={{ y: -1 }}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">
              {getInitials(post.userId?.Fullname)}
            </span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <header className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
              {post.userId?.Fullname || 'Anonymous User'}
            </h3>
            <span className="text-gray-400">•</span>
            <time className="text-gray-500 text-sm font-medium">
              {getTimeAgo(post.createdAt)}
            </time>
          </header>
          
          <div className="mb-4">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words text-[15px]">
              {post.content}
            </p>
          </div>
          
          <footer className="flex items-center justify-between max-w-lg">
            <motion.button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-2 transition-all group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={18} className="group-hover:fill-blue-50" />
              <span className="text-sm font-medium">{commentsCount}</span>
            </motion.button>
            
            <motion.button
              onClick={handleShare}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all group ${
                isReposted 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isReposted ? { rotate: 360 } : {}}
            >
              <Share2 size={18} />
              <span className="text-sm font-medium">{sharesCount}</span>
            </motion.button>
            
            <motion.button
              onClick={handleLike}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all group ${
                isLiked 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={18} className={`transition-all ${isLiked ? 'fill-red-500' : 'group-hover:fill-red-100'}`} />
              <span className="text-sm font-medium">{likesCount}</span>
            </motion.button>
          </footer>
          
          <AnimatePresence>
            {showComments && (
              <motion.div
                className="mt-6 pt-4 border-t border-gray-100"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {post.comments && Array.isArray(post.comments) && post.comments.length > 0 && (
                  <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                    {post.comments.slice(-5).map((comment, i) => (
                      <motion.div 
                        key={i} 
                        className="flex gap-3 bg-gray-50/50 rounded-xl p-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {getInitials(comment.userId?.Fullname)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 text-sm">
                              {comment.userId?.Fullname || 'Anonymous'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {getTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-800 text-sm leading-relaxed">{comment.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-3 border-2 border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
                      <textarea
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full border-none outline-none bg-transparent placeholder-gray-500 resize-none text-sm"
                        rows="2"
                        onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleComment())}
                      />
                      <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center gap-2">
                          <Image size={16} className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors" />
                          <Smile size={16} className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors" />
                        </div>
                        <motion.button
                          onClick={handleComment}
                          disabled={!commentText.trim()}
                          className="bg-blue-600 text-white rounded-lg px-4 py-1.5 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors text-sm"
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
    <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 p-6">
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex-shrink-0 shadow-sm"></div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-2xl p-4 border-2 border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Share your story, thoughts, or encourage others..."
              className="w-full border-none outline-none bg-transparent placeholder-gray-500 resize-none text-[15px] leading-relaxed"
              rows="4"
              maxLength="280"
            />
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
              <div className="flex items-center gap-3">
                <Image size={18} className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded" />
                <Smile size={18} className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded" />
                <Calendar size={18} className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded" />
                <MapPin size={18} className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded" />
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-sm font-medium ${input.length > 250 ? 'text-red-500' : 'text-gray-500'}`}>
                  {input.length}/280
                </div>
                <motion.button
                  onClick={onCreatePost}
                  disabled={!input.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-6 py-2.5 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Share Story
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
  const navigate = useNavigate();

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Community</h2>
          <p className="text-gray-500">Connecting you with stories of hope...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <AnimatedBackground />
      
      <Sidebar navigate={navigate} />
      
      <div className="ml-72">
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm min-h-screen border-x border-gray-100 shadow-sm">
          <header className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-6 z-10">
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
              className="bg-red-50 border border-red-200 rounded-xl p-4 m-6 text-red-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {error}
              </div>
            </motion.div>
          )}
          
          <AnimatePresence mode="wait">
            {posts.length === 0 && !loading ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key="empty"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Start the Conversation</h3>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
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
    </div>
  );
}