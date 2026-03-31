import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    name: '',
    dob: '',
    timing: '',
    gender: '',
    contact: '',
    insurance_id: ''
  });

  const loadPatients = async () => {
    try {
      const res = await API.get('/patients');
      setPatients(res.data);
      setFilteredPatients(res.data);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/patients', form);
      setForm({
        name: '',
        dob: '',
        timing: '',
        gender: '',
        contact: '',
        insurance_id: ''
      });
      loadPatients();
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Error adding patient. Please check the form data.');
    }
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    if (!searchValue.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      patient.contact.includes(searchValue) ||
      (patient.insurance_id && patient.insurance_id.toLowerCase().includes(searchValue.toLowerCase())) ||
      patient.gender.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <div className="page">
      <h1>👥 Patients Management</h1>
      
      <div className="patient-form">
        <h2>Add New Patient</h2>
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                placeholder="Enter full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dob">Date of Birth *</label>
              <input
                type="date"
                id="dob"
                value={form.dob}
                onChange={e => setForm({ ...form, dob: e.target.value })}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="timing">Time *</label>
              <input
                type="time"
                id="timing"
                value={form.timing}
                onChange={e => setForm({ ...form, timing: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact">Contact Number *</label>
              <input
                id="contact"
                type="tel"
                placeholder="+1234567890"
                value={form.contact}
                onChange={e => setForm({ ...form, contact: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="insurance_id">Insurance ID</label>
              <input
                id="insurance_id"
                type="text"
                placeholder="INS123456 (optional)"
                value={form.insurance_id}
                onChange={e => setForm({ ...form, insurance_id: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            👤 Add Patient
          </button>
        </form>
      </div>

      <div className="patients-section">
        <div className="section-header">
          <h2>📋 Patient Records</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search patients by name, contact, insurance, or gender..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            <span className="patient-count">
              {filteredPatients.length} of {patients.length} patients
            </span>
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="no-patients">
            {searchTerm ? (
              <p>No patients found matching "{searchTerm}"</p>
            ) : (
              <p>No patients registered yet.</p>
            )}
          </div>
        ) : (
          <div className="patients-grid">
            {filteredPatients.map(patient => (
              <div key={patient.patient_id} className="patient-card">
                <div className="patient-header">
                  <span className="patient-id">#{patient.patient_id}</span>
                  <span className="patient-gender">{patient.gender}</span>
                </div>
                
                <div className="patient-details">
                  <div className="patient-name">{patient.name}</div>
                  
                  <div className="detail-row">
                    <span className="label">📅 DOB:</span>
                    <span className="value">{formatDate(patient.dob)}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">🕐 Time:</span>
                    <span className="value">{formatTime(patient.timing)}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">📞 Contact:</span>
                    <span className="value">{patient.contact}</span>
                  </div>
                  
                  {patient.insurance_id && (
                    <div className="detail-row">
                      <span className="label">🏥 Insurance:</span>
                      <span className="value">{patient.insurance_id}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
