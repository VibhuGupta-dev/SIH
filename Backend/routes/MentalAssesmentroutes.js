import express from 'express';
const router = express.Router();
import {createMentalHealthAssessment , checkAssessmentStatus  } from '../controller/MentalAssesment.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post('/submit', createMentalHealthAssessment);

router.get("/status", authMiddleware, checkAssessmentStatus)

export default router;
