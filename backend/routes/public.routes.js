import express from 'express';
const router = express.Router();
import { 
  getLandingStats, 
  getLandingTestimonials, 
  getLandingCategories 
} from '../controllers/public.controller.js';

router.get('/stats', getLandingStats);
router.get('/testimonials', getLandingTestimonials);
router.get('/categories', getLandingCategories);

export default router;
