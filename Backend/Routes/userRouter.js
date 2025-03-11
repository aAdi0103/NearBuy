import express from 'express';
import { updateProfile,getPublicProfile} from '../Controllers/userController.js';
import { protectRoute } from '../Middlewares/authMiddleware.js';
const router= express.Router();

router.put("/updateUser", protectRoute, updateProfile);
router.get('/:id',protectRoute,getPublicProfile)


export default router