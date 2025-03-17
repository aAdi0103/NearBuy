import express from 'express'
const router = express.Router()

import {createService,deleteService,getServices,updateService,getServiceById,getAllServices} from '../Controllers/serviceController.js'

import {protectRoute} from '../Middlewares/authMiddleware.js'


router.get('/getServices',protectRoute,getServices);
router.get('/getAllServices',protectRoute,getAllServices)
router.post('/create',protectRoute,createService);
router.put('/updateService/:id',protectRoute,updateService);
router.get('/:id', protectRoute, getServiceById);
router.delete('/delete/:id',protectRoute,deleteService)


export default router