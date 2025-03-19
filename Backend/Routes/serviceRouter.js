import express from 'express'
const router = express.Router()

import {createService,deleteService,getServices,updateService,getServiceById,getAllServices,getServicesId,getNearbyServices,getSearchedServices} from '../Controllers/serviceController.js'

import {protectRoute} from '../Middlewares/authMiddleware.js'


router.get('/getServices',protectRoute,getServices);
router.get('/getServices/:email',protectRoute,getServicesId)
router.get('/getAllServices',getAllServices)
router.post('/create',protectRoute,createService);
router.put('/updateService/:id',protectRoute,updateService);
router.delete('/delete/:id',protectRoute,deleteService)
router.get("/current/nearby",getNearbyServices);
router.get("/getSearchedServices",getSearchedServices)
router.get('/:id', protectRoute, getServiceById);
export default router