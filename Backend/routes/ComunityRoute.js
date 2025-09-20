
import express from 'express';
import { createPost, getPosts, likePost, addComment, sharePost } from '../controller/ComunityController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create post
router.post('/create', authMiddleware, createPost);

// Get feed (all posts, sorted by date)
router.get('/feed', authMiddleware, getPosts);

// Like/unlike post
router.post('/like/:postId', authMiddleware, likePost);

// Add comment to post
router.post('/comment/:postId', authMiddleware, addComment);

// Share post
router.post('/share/:postId', authMiddleware, sharePost);

export default router;
