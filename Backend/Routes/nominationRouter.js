import express from 'express';
import {nominationn} from '../Controllers/nominationController.js';
const router= express.Router();

router.get('/search-place',nominationn)


export default router