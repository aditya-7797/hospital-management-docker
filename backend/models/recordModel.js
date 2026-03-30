
import { pool } from '../db.js';

export const createRecord = async (data) => {
  const { patient_id, doctor_id, visit_date, diagnosis, notes } = data;

  // Validate required fields
  if (!patient_id || !doctor_id || !visit_date || !diagnosis) {
    throw new Error('Missing required fields: patient_id, doctor_id, visit_date, and diagnosis are required');
  }

  // Validate patient_id and doctor_id are numbers
  if (isNaN(patient_id) || isNaN(doctor_id)) {
    throw new Error('Patient ID and Doctor ID must be valid numbers');
  }

  // Validate visit_date format
  if (!visit_date || isNaN(new Date(visit_date).getTime())) {
    throw new Error('Invalid visit date format');
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

  try {
    const result = await pool.query(
      `INSERT INTO MedicalRecords (patient_id, doctor_id, visit_date, diagnosis, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [patient_id, doctor_id, visit_date, diagnosis, notes || null]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to create medical record: ${error.message}`);
  }
};

export const getAllRecords = async () => {
  try {
    const result = await pool.query(
      `SELECT r.*, p.name as patient_name, d.name as doctor_name, d.specialty
       FROM MedicalRecords r
       JOIN Patients p ON r.patient_id = p.patient_id
       JOIN Doctors d ON r.doctor_id = d.doctor_id
       ORDER BY r.visit_date DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to fetch medical records: ${error.message}`);
  }
};

export const getRecordById = async (record_id) => {
  try {
    const result = await pool.query(
      `SELECT r.*, p.name as patient_name, p.dob, p.gender, p.contact, p.insurance_id,
              d.name as doctor_name, d.specialty
       FROM MedicalRecords r
       JOIN Patients p ON r.patient_id = p.patient_id
       JOIN Doctors d ON r.doctor_id = d.doctor_id
       WHERE r.record_id = $1`,
      [record_id]
    );
    
    if (result.rows.length === 0) {
      throw new Error(`Medical record with ID ${record_id} not found`);
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to fetch medical record: ${error.message}`);
  }
};

export const getRecordsByPatient = async (patient_id) => {
  try {
    const result = await pool.query(
      `SELECT r.*, d.name as doctor_name, d.specialty
       FROM MedicalRecords r
       JOIN Doctors d ON r.doctor_id = d.doctor_id
       WHERE r.patient_id = $1
       ORDER BY r.visit_date DESC`,
      [patient_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to fetch patient records: ${error.message}`);
  }
};

export const getRecordsByDoctor = async (doctor_id) => {
  try {
    const result = await pool.query(
      `SELECT r.*, p.name as patient_name, p.dob, p.gender
       FROM MedicalRecords r
       JOIN Patients p ON r.patient_id = p.patient_id
       WHERE r.doctor_id = $1
       ORDER BY r.visit_date DESC`,
      [doctor_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to fetch doctor records: ${error.message}`);
  }
};

export const updateRecord = async (record_id, data) => {
  const { diagnosis, notes } = data;

  if (!diagnosis) {
    throw new Error('Diagnosis is required');
  }

  try {
    const result = await pool.query(
      `UPDATE MedicalRecords 
       SET diagnosis = $1, notes = $2
       WHERE record_id = $3
       RETURNING *`,
      [diagnosis, notes || null, record_id]
    );
    
    if (result.rows.length === 0) {
      throw new Error(`Medical record with ID ${record_id} not found`);
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to update medical record: ${error.message}`);
  }
};
