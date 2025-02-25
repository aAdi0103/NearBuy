import express from 'express'
const router = express.Router()

import {createService,deleteService} from '../Controllers/serviceController.js'

import {protectRoute} from '../Middlewares/authMiddleware.js'


// router.get('/',protectRoute,getFeedPosts);
router.post('/create',protectRoute,createService);
// router.get("/:id", protectRoute, getPostById);
router.delete('/delete/:id',protectRoute,deleteService)
// router.post("/:id/comment", protectRoute, createComment);
// router.post("/:id/like", protectRoute, likePost);

export default router