import express from 'express';
import { 
  createPrescription, 
  getAllPrescriptions, 
  getPrescriptionsByRecord, 
  getPrescriptionsByPatient, 
  getPrescriptionsByDoctor, 
  getPrescriptionById, 
  updatePrescription, 
  deletePrescription 
} from '../models/prescriptionModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const prescription = await createPrescription(req.body);
    res.status(201).json(prescription);
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to create prescription',
      details: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const prescriptions = await getAllPrescriptions();
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch prescriptions',
      details: error.message
    });
  }
});

router.get('/record/:recordId', async (req, res) => {
  try {
    const prescriptions = await getPrescriptionsByRecord(req.params.recordId);
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions for record:', error);
    res.status(500).json({ 
      error: 'Failed to fetch prescriptions for record',
      details: error.message
    });
  }
});

router.get('/patient/:patientId', async (req, res) => {
  try {
    const prescriptions = await getPrescriptionsByPatient(req.params.patientId);
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch patient prescriptions',
      details: error.message
    });
  }
});

router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const prescriptions = await getPrescriptionsByDoctor(req.params.doctorId);
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching doctor prescriptions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch doctor prescriptions',
      details: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const prescription = await getPrescriptionById(req.params.id);
    res.json(prescription);
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(404).json({ 
      error: 'Prescription not found',
      details: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const prescription = await updatePrescription(req.params.id, req.body);
    res.json(prescription);
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to update prescription',
      details: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const prescription = await deletePrescription(req.params.id);
    res.json({ message: 'Prescription deleted successfully', prescription });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to delete prescription',
      details: error.message
    });
  }
});

export default router;
