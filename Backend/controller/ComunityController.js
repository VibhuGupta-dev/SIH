import CommunityPost from '../models/ComunityPost.js';
import User from '../models/Usermodel.js';

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Post content is required' });
    }

    if (content.length > 280) {
      return res.status(400).json({ success: false, message: 'Post too long (max 280 characters)' });
    }

    const post = new CommunityPost({
      userId,
      content: content.trim(),
    });

    const savedPost = await post.save();

    const postWithUser = await CommunityPost.findById(savedPost._id)
      .populate('userId', 'Fullname email')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: postWithUser,
    });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate('userId', 'Fullname email avatar')
      .populate('comments.userId', 'Fullname email avatar')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({
      success: true,
      posts,
      hasMore: posts.length === 20,
    });
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes.pull(userId);
      await post.save();
      return res.json({ success: true, message: 'Post unliked', likes: post.likes.length });
    } else {
      post.likes.push(userId);
      await post.save();
      return res.json({ success: true, message: 'Post liked', likes: post.likes.length });
    }
  } catch (err) {
    console.error('Like post error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    if (content.length > 500) {
      return res.status(400).json({ success: false, message: 'Comment too long (max 500 characters)' });
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.comments.push({
      userId,
      content: content.trim(),
    });

    await post.save();

    const postWithUser = await CommunityPost.findById(postId)
      .populate('userId', 'Fullname email avatar')
      .populate('comments.userId', 'Fullname email avatar')
      .lean();

    res.json({
      success: true,
      message: 'Comment added',
      post: postWithUser,
    });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const sharePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.shares += 1;
    await post.save();

    res.json({ success: true, message: 'Post shared', shares: post.shares });
  } catch (err) {
    console.error('Share post error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
