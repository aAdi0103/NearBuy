import express from 'express'
const router = express.Router()

import {createPosts, getPostsByIds,getFeedPosts, deletePost,updatePostt,getAllProducts,getFeedPostsID} from '../Controllers/postController.js'

import {protectRoute} from '../Middlewares/authMiddleware.js'


// router.get('/',protectRoute,getFeedPosts);
router.post('/create',protectRoute,createPosts);
router.get("/getPosts", protectRoute,getFeedPosts);
router.get("/getPosts/:email", protectRoute,getFeedPostsID);
router.get('/getAllProducts',protectRoute,getAllProducts)
router.delete('/delete/:id',protectRoute,deletePost)
router.get('/:id',protectRoute,getPostsByIds)
router.put('/updatePost/:id',protectRoute,updatePostt)


export default router