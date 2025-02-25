import express from 'express'
const router = express.Router()

import {createPosts,deletePost} from '../Controllers/postController.js'

import {protectRoute} from '../Middlewares/authMiddleware.js'


// router.get('/',protectRoute,getFeedPosts);
router.post('/create',protectRoute,createPosts);
// router.get("/:id", protectRoute, getPostById);
router.delete('/delete/:id',protectRoute,deletePost)
// router.post("/:id/comment", protectRoute, createComment);
// router.post("/:id/like", protectRoute, likePost);

export default router