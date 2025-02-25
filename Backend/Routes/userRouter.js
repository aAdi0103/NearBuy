import express from 'express';
import { updateProfile} from '../Controllers/userController.js';
import { protectRoute } from '../Middlewares/authMiddleware.js';
const router= express.Router();

router.put("/profile", protectRoute, updateProfile);


export default router