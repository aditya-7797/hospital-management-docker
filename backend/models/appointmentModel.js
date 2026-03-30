import { pool } from '../db.js';

export const createAppointment = async (data) => {
  const { patient_id, doctor_id, appointment_time, status } = data;

  // Validate required fields
  if (!patient_id || !doctor_id || !appointment_time || !status) {
    throw new Error('Missing required fields: patient_id, doctor_id, appointment_time, and status are required');
  }

  // Validate patient_id and doctor_id are numbers
  if (isNaN(patient_id) || isNaN(doctor_id)) {
    throw new Error('Patient ID and Doctor ID must be valid numbers');
  }

  // Validate appointment_time format (ISO string)
  if (!appointment_time || isNaN(new Date(appointment_time).getTime())) {
    throw new Error('Invalid appointment time format');
  }

  // Check if appointment time is in the future
  const appointmentDate = new Date(appointment_time);
  const now = new Date();
  if (appointmentDate <= now) {
    throw new Error('Appointment time must be in the future');
  }

  // Check if patient exists
  const patientCheck = await pool.query('SELECT patient_id FROM Patients WHERE patient_id = $1', [patient_id]);
  if (patientCheck.rows.length === 0) {
    throw new Error(`Patient with ID ${patient_id} does not exist`);
  }

  // Check if doctor exists
  const doctorCheck = await pool.query('SELECT doctor_id FROM Doctors WHERE doctor_id = $1', [doctor_id]);
  if (doctorCheck.rows.length === 0) {
    throw new Error(`Doctor with ID ${doctor_id} does not exist`);
  }

  // Check for scheduling conflicts (same doctor at same time)
  const conflictCheck = await pool.query(
    `SELECT appointment_id FROM Appointments 
     WHERE doctor_id = $1 
     AND appointment_time = $2 
     AND status != 'Cancelled'`,
    [doctor_id, appointment_time]
  );
  
  if (conflictCheck.rows.length > 0) {
    throw new Error('Doctor has another appointment at this time');
  }

  try {
    const result = await pool.query(
      `INSERT INTO Appointments (patient_id, doctor_id, appointment_time, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [patient_id, doctor_id, appointment_time, status]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to create appointment: ${error.message}`);
  }
};

export const getAllAppointments = async () => {
  try {
    const result = await pool.query(
      `SELECT a.*, p.name as patient_name, d.name as doctor_name, d.specialty
       FROM Appointments a
       JOIN Patients p ON a.patient_id = p.patient_id
       JOIN Doctors d ON a.doctor_id = d.doctor_id
       ORDER BY a.appointment_time DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to fetch appointments: ${error.message}`);
  }
};

export const updateAppointmentStatus = async (appointment_id, status) => {
  if (!appointment_id || !status) {
    throw new Error('Appointment ID and status are required');
  }

  const validStatuses = ['Scheduled', 'Completed', 'Cancelled', 'No Show'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  try {
    const result = await pool.query(
      'UPDATE Appointments SET status = $1 WHERE appointment_id = $2 RETURNING *',
      [status, appointment_id]
    );
    
    if (result.rows.length === 0) {
      throw new Error(`Appointment with ID ${appointment_id} not found`);
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to update appointment: ${error.message}`);
  }
};
