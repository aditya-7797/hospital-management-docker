import { pool } from '../db.js';

export const createDoctor = async (data) => {
  const { name, specialty, availability } = data;
  const result = await pool.query(
    'INSERT INTO Doctors(name, specialty, availability) VALUES($1, $2, $3) RETURNING *',
    [name, specialty, availability]
  );
  return result.rows[0];
};

export const getAllDoctors = async () => {
  const result = await pool.query('SELECT * FROM Doctors');
  return result.rows;
};