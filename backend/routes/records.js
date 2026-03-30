import express from 'express';
import { createRecord, getAllRecords, getRecordById, getRecordsByPatient, getRecordsByDoctor, updateRecord } from '../models/recordModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const record = await createRecord(req.body);
    res.status(201).json(record);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to create medical record',
      details: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const records = await getAllRecords();
    res.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ 
      error: 'Failed to fetch medical records',
      details: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const record = await getRecordById(req.params.id);
    res.json(record);
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(404).json({ 
      error: 'Medical record not found',
      details: error.message
    });
  }
});

router.get('/patient/:patientId', async (req, res) => {
  try {
    const records = await getRecordsByPatient(req.params.patientId);
    res.json(records);
  } catch (error) {
    console.error('Error fetching patient records:', error);
    res.status(500).json({ 
      error: 'Failed to fetch patient records',
      details: error.message
    });
  }
});

router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const records = await getRecordsByDoctor(req.params.doctorId);
    res.json(records);
  } catch (error) {
    console.error('Error fetching doctor records:', error);
    res.status(500).json({ 
      error: 'Failed to fetch doctor records',
      details: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const record = await updateRecord(req.params.id, req.body);
    res.json(record);
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to update medical record',
      details: error.message
    });
  }
});

export default router;
