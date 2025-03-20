import express from 'express'
const router = express.Router()

import {
	markNotificationAsRejected,
	getUserNotifications,
	markNotificationAsAccepted,
    createNotification,
	status
} from "../Controllers/notificationController.js";


import {protectRoute} from '../Middlewares/authMiddleware.js'

router.post('/createNotification',protectRoute,createNotification)
router.get('/status/:userId/:postId', protectRoute, status);
router.get("/", protectRoute, getUserNotifications);

router.put("/accepted/:id", protectRoute, markNotificationAsAccepted);
router.put("/rejected/:id", protectRoute, markNotificationAsRejected);



export default router