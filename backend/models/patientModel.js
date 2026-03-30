import { pool } from '../db.js';

export const createPatient = async (data) => {
  const { name, dob, timing, gender, contact, insurance_id } = data;

  // Validate required fields
  if (!name || !dob || !timing || !gender || !contact) {
    throw new Error('Missing required fields: name, dob, timing, gender, and contact are required');
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dob)) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }

  // Validate time format (HH:MM:SS or HH:MM)
  const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
  if (!timeRegex.test(timing)) {
    throw new Error('Invalid time format. Expected HH:MM or HH:MM:SS');
  }

  try {
    const result = await pool.query(
      `INSERT INTO Patients(name, dob, timing, gender, contact, insurance_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        name,
        dob,
        timing,
        gender,
        contact,
        insurance_id || null
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to create patient: ${error.message}`);
  }
};

export const getAllPatients = async () => {
  try {
    const result = await pool.query('SELECT * FROM Patients ORDER BY patient_id DESC');
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to fetch patients: ${error.message}`);
  }
};