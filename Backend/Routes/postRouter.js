import express from 'express'
const router = express.Router()

import {createPosts, getPostsByIds,getFeedPosts, deletePost,updatePostt,getAllProducts,getFeedPostsID,getNearbyProducts,getSearchedProducts} from '../Controllers/postController.js'

import {protectRoute} from '../Middlewares/authMiddleware.js'


router.post('/create',protectRoute,createPosts);
router.get("/getPosts", protectRoute,getFeedPosts);
router.get("/getPosts/:email", protectRoute,getFeedPostsID);
router.get('/getAllProducts',getAllProducts)
router.delete('/delete/:id',protectRoute,deletePost)
router.put('/updatePost/:id',protectRoute,updatePostt)
router.get("/current/nearby",getNearbyProducts);
router.get('/getSearchedProducts',getSearchedProducts)

router.get('/:id',protectRoute,getPostsByIds)
export default router