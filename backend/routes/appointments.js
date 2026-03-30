import express from 'express';
import { createAppointment, getAllAppointments, updateAppointmentStatus } from '../models/appointmentModel.js';
import { publishEvent } from '../kafka.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const appointment = await createAppointment(req.body);

    // Fire-and-forget Kafka event so you can see activity immediately
    try {
      await publishEvent('appointments', {
        type: 'AppointmentCreated',
        timestamp: new Date().toISOString(),
        appointment,
      });
    } catch (eventErr) {
      console.error('Error publishing Kafka appointment event:', eventErr.message);
    }

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to create appointment',
      details: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const appointments = await getAllAppointments();
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ 
      error: 'Failed to fetch appointments',
      details: error.message
    });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const appointment = await updateAppointmentStatus(id, status);
    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to update appointment status',
      details: error.message
    });
  }
});

export default router;
