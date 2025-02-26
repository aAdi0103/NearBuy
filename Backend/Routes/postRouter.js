import express from 'express'
const router = express.Router()

import {createPosts,deletePost,getCategories} from '../Controllers/postController.js'

import {protectRoute} from '../Middlewares/authMiddleware.js'


// router.get('/',protectRoute,getFeedPosts);
router.post('/create',protectRoute,createPosts);
router.get("/categories", getCategories);
router.delete('/delete/:id',protectRoute,deletePost)
// router.post("/:id/comment", protectRoute, createComment);
// router.post("/:id/like", protectRoute, likePost);

export default router