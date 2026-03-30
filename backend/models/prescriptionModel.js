import { pool } from '../db.js';

export const createPrescription = async (data) => {
  console.log('Creating prescription with data:', data);
  
  const { record_id, medication, dosage, frequency, duration, instructions, refills } = data;

  // Validate required fields
  if (!record_id || !medication || !dosage || !frequency || !duration) {
    console.log('Validation failed - missing fields:', { record_id, medication, dosage, frequency, duration });
    throw new Error('Missing required fields: record_id, medication, dosage, frequency, and duration are required');
  }

  // Validate record_id is a number
  if (isNaN(record_id)) {
    console.log('Validation failed - invalid record_id:', record_id);
    throw new Error('Record ID must be a valid number');
  }

  // Check if medical record exists
  try {
    const recordCheck = await pool.query('SELECT record_id FROM MedicalRecords WHERE record_id = $1', [record_id]);
    if (recordCheck.rows.length === 0) {
      console.log('Medical record not found:', record_id);
      throw new Error(`Medical record with ID ${record_id} does not exist`);
    }
    console.log('Medical record found:', recordCheck.rows[0]);
  } catch (error) {
    console.error('Error checking medical record:', error);
    throw new Error(`Failed to verify medical record: ${error.message}`);
  }

  try {
    console.log('Attempting to insert prescription with values:', [record_id, medication, dosage, frequency, duration, instructions || null, refills || 0]);
    
    const result = await pool.query(
      `INSERT INTO Prescriptions (record_id, medication, dosage, frequency, duration, instructions, refills)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [record_id, medication, dosage, frequency, duration, instructions || null, refills || 0]
    );
    
    console.log('Prescription created successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Database error during prescription creation:', error);
    console.error('SQL State:', error.code);
    console.error('Error Detail:', error.detail);
    throw new Error(`Failed to create prescription: ${error.message}`);
  }
};

export const getAllPrescriptions = async () => {
  try {
    const result = await pool.query(
      `SELECT p.*, r.diagnosis, r.visit_date,
              pt.name as patient_name, pt.dob, pt.gender,
              d.name as doctor_name, d.specialty
       FROM Prescriptions p
       JOIN MedicalRecords r ON p.record_id = r.record_id
       JOIN Patients pt ON r.patient_id = pt.patient_id
       JOIN Doctors d ON r.doctor_id = d.doctor_id
       ORDER BY p.prescription_id DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to fetch prescriptions: ${error.message}`);
  }
};

export const getPrescriptionsByRecord = async (record_id) => {
  try {
    const result = await pool.query(
      `SELECT p.*, r.diagnosis, r.visit_date,
              pt.name as patient_name, pt.dob, pt.gender,
              d.name as doctor_name, d.specialty
       FROM Prescriptions p
       JOIN MedicalRecords r ON p.record_id = r.record_id
       JOIN Patients pt ON r.patient_id = pt.patient_id
       JOIN Doctors d ON r.doctor_id = d.doctor_id
       WHERE p.record_id = $1
       ORDER BY p.prescription_id DESC`,
      [record_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to fetch prescriptions for record: ${error.message}`);
  }
};

export const getPrescriptionsByPatient = async (patient_id) => {
  try {
    const result = await pool.query(
      `SELECT p.*, r.diagnosis, r.visit_date,
              d.name as doctor_name, d.specialty
       FROM Prescriptions p
       JOIN MedicalRecords r ON p.record_id = r.record_id
       JOIN Doctors d ON r.doctor_id = d.doctor_id
       WHERE r.patient_id = $1
       ORDER BY r.visit_date DESC, p.prescription_id DESC`,
      [patient_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to fetch patient prescriptions: ${error.message}`);
  }
};

export const getPrescriptionsByDoctor = async (doctor_id) => {
  try {
    const result = await pool.query(
      `SELECT p.*, r.diagnosis, r.visit_date,
              pt.name as patient_name, pt.dob, pt.gender
       FROM Prescriptions p
       JOIN MedicalRecords r ON p.record_id = r.record_id
       JOIN Patients pt ON r.patient_id = pt.patient_id
       WHERE r.doctor_id = $1
       ORDER BY r.visit_date DESC, p.prescription_id DESC`,
      [doctor_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to fetch doctor prescriptions: ${error.message}`);
  }
};

export const getPrescriptionById = async (prescription_id) => {
  try {
    const result = await pool.query(
      `SELECT p.*, r.diagnosis, r.visit_date,
              pt.name as patient_name, pt.dob, pt.gender, pt.contact, pt.insurance_id,
              d.name as doctor_name, d.specialty
       FROM Prescriptions p
       JOIN MedicalRecords r ON p.record_id = r.record_id
       JOIN Patients pt ON r.patient_id = pt.patient_id
       JOIN Doctors d ON r.doctor_id = d.doctor_id
       WHERE p.prescription_id = $1`,
      [prescription_id]
    );
    
    if (result.rows.length === 0) {
      throw new Error(`Prescription with ID ${prescription_id} not found`);
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to fetch prescription: ${error.message}`);
  }
};

export const updatePrescription = async (prescription_id, data) => {
  const { medication, dosage, frequency, duration, instructions, refills } = data;

  if (!medication || !dosage || !frequency || !duration) {
    throw new Error('Missing required fields: medication, dosage, frequency, and duration are required');
  }

  try {
    const result = await pool.query(
      `UPDATE Prescriptions 
       SET medication = $1, dosage = $2, frequency = $3, duration = $4, 
           instructions = $5, refills = $6
       WHERE prescription_id = $7
       RETURNING *`,
      [medication, dosage, frequency, duration, instructions || null, refills || 0, prescription_id]
    );
    
    if (result.rows.length === 0) {
      throw new Error(`Prescription with ID ${prescription_id} not found`);
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to update prescription: ${error.message}`);
  }
};

export const deletePrescription = async (prescription_id) => {
  try {
    const result = await pool.query(
      'DELETE FROM Prescriptions WHERE prescription_id = $1 RETURNING *',
      [prescription_id]
    );
    
    if (result.rows.length === 0) {
      throw new Error(`Prescription with ID ${prescription_id} not found`);
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to delete prescription: ${error.message}`);
  }
};


