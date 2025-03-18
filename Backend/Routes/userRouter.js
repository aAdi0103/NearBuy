import express from 'express';
import { updateProfile,getPublicProfile,FromEmail} from '../Controllers/userController.js';
import { protectRoute } from '../Middlewares/authMiddleware.js';
const router= express.Router();

router.put("/updateUser", protectRoute, updateProfile); 
router.get('/:id',protectRoute,getPublicProfile); 
router.get('/gett/:id',protectRoute,FromEmail)


export default router