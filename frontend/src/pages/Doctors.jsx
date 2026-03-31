import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ name: '', specialty: '', availability: '{}' });

  const loadDoctors = async () => {
    const res = await API.get('/doctors');
    setDoctors(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await API.post('/doctors', { ...form, availability: JSON.parse(form.availability) });
    setForm({ name: '', specialty: '', availability: '{}' });
    loadDoctors();
  };

  useEffect(() => { loadDoctors(); }, []);

  return (
    <div className="page">
      <h1>Doctors</h1>
      <form onSubmit={handleAdd}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Specialty" value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} />
        <input placeholder='Availability (JSON)' value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} />
        <button type="submit">Add Doctor</button>
      </form>

      <ul>
        {doctors.map(d => (
          <li key={d.doctor_id}>{d.name} - {d.specialty}</li>
        ))}
      </ul>
    </div>
  );
};

export default Doctors;
