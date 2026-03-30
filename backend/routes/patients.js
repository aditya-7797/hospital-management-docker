import express from 'express';
import { createPatient, getAllPatients } from '../models/patientModel.js';
import { getRedisClient } from '../redis.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const patient = await createPatient(req.body);

    // Invalidate cached patient list, if present
    try {
      const redis = getRedisClient();
      if (redis) {
        await redis.del('patients:all');
        console.log('🧹 Redis cache invalidated for key patients:all after patient create');
      }
    } catch (cacheErr) {
      console.error('Error invalidating patients cache:', cacheErr.message);
    }
    res.status(201).json(patient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to create patient',
      details: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const redis = getRedisClient();

    // Try Redis cache first (read-through cache)
    if (redis) {
      try {
        const cached = await redis.get('patients:all');
        if (cached) {
          console.log('📦 Serving patients from Redis cache');
          return res.json(JSON.parse(cached));
        }
      } catch (cacheErr) {
        console.error('Error reading patients from Redis cache:', cacheErr.message);
      }
    }

    const patients = await getAllPatients();

    // Store fresh result in cache for a short TTL so effects are visible quickly
    if (redis) {
      try {
        await redis.set('patients:all', JSON.stringify(patients), { EX: 30 });
        console.log('💾 Patients stored in Redis cache with 30s TTL');
      } catch (cacheErr) {
        console.error('Error writing patients to Redis cache:', cacheErr.message);
      }
    }

    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ 
      error: 'Failed to fetch patients',
      details: error.message
    });
  }
});

export default router;