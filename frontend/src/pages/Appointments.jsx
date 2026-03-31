import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    status: 'Scheduled'
  });

  const loadAppointments = async () => {
    try {
      const res = await API.get('/appointments');
      setAppointments(res.data);
      setFilteredAppointments(res.data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const loadPatients = async () => {
    try {
      const res = await API.get('/patients');
      setPatients(res.data);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const loadDoctors = async () => {
    try {
      const res = await API.get('/doctors');
      setDoctors(res.data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    // Combine date and time into appointment_time
    const appointment_time = `${form.appointment_date}T${form.appointment_time}`;
    
    try {
      await API.post('/appointments', {
        ...form,
        appointment_time
      });
      
      setForm({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        status: 'Scheduled'
      });
      
      loadAppointments();
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Error creating appointment. Please check the form data.');
    }
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    if (!searchValue.trim()) {
      setFilteredAppointments(appointments);
      return;
    }

    const filtered = appointments.filter(appointment =>
      appointment.patient_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      appointment.doctor_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      appointment.status?.toLowerCase().includes(searchValue.toLowerCase()) ||
      appointment.appointment_time?.includes(searchValue)
    );
    setFilteredAppointments(filtered);
  };

  useEffect(() => {
    loadAppointments();
    loadPatients();
    loadDoctors();
  }, []);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return '#3498db';
      case 'Completed': return '#27ae60';
      case 'Cancelled': return '#e74c3c';
      case 'No Show': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="page">
      <h1>📅 Appointments</h1>
      
      <div className="appointment-form">
        <h2>Schedule New Appointment</h2>
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="patient_id">Patient *</label>
              <select
                id="patient_id"
                value={form.patient_id}
                onChange={e => setForm({ ...form, patient_id: e.target.value })}
                required
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.patient_id} value={patient.patient_id}>
                    {patient.name} (ID: {patient.patient_id})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="doctor_id">Doctor *</label>
              <select
                id="doctor_id"
                value={form.doctor_id}
                onChange={e => setForm({ ...form, doctor_id: e.target.value })}
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.doctor_id} value={doctor.doctor_id}>
                    Dr. {doctor.name} - {doctor.specialty || 'General'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appointment_date">Date *</label>
              <input
                type="date"
                id="appointment_date"
                value={form.appointment_date}
                onChange={e => setForm({ ...form, appointment_date: e.target.value })}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="appointment_time">Time *</label>
              <input
                type="time"
                id="appointment_time"
                value={form.appointment_time}
                onChange={e => setForm({ ...form, appointment_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            📅 Schedule Appointment
          </button>
        </form>
      </div>

      <div className="appointments-section">
        <div className="section-header">
          <h2>📋 All Appointments</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search appointments by patient, doctor, status, or date..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            <span className="appointment-count">
              {filteredAppointments.length} of {appointments.length} appointments
            </span>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            {searchTerm ? (
              <p>No appointments found matching "{searchTerm}"</p>
            ) : (
              <p>No appointments scheduled yet.</p>
            )}
          </div>
        ) : (
          <div className="appointments-grid">
            {filteredAppointments.map(appointment => (
              <div key={appointment.appointment_id} className="appointment-card">
                <div className="appointment-header">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(appointment.status) }}
                  >
                    {appointment.status}
                  </span>
                  <span className="appointment-id">#{appointment.appointment_id}</span>
                </div>
                
                <div className="appointment-details">
                  <div className="detail-row">
                    <span className="label">👨‍⚕️ Doctor:</span>
                    <span className="value">{appointment.doctor_name || `Dr. #${appointment.doctor_id}`}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">👤 Patient:</span>
                    <span className="value">{appointment.patient_name || `Patient #${appointment.patient_id}`}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">📅 Date & Time:</span>
                    <span className="value">{formatDateTime(appointment.appointment_time)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
