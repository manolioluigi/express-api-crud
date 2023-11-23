// postsRouter.js
const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// Definisci gli endpoint relativi ai post
router.post('/posts', postsController.createPost);
router.get('/posts/:slug', postsController.getPostBySlug);
router.get('/posts', postsController.getAllPosts);
router.put('/posts/:slug', postsController.updatePost);
router.delete('/posts/:slug', postsController.deletePost);

module.exports = router;
