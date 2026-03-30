import express from 'express';
import { createDoctor, getAllDoctors } from '../models/doctorModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const doctor = await createDoctor(req.body);
  res.status(201).json(doctor);
});

router.get('/', async (req, res) => {
  const doctors = await getAllDoctors();
  res.json(doctors);
});

export default router;
