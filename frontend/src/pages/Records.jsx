import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    appointment_id: '',
    diagnosis: '',
    notes: ''
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const navigate = useNavigate();

  const loadRecords = async () => {
    try {
      const res = await API.get('/records');
      setRecords(res.data);
      setFilteredRecords(res.data);
    } catch (error) {
      console.error('Error loading records:', error);
    }
  };

  const loadAppointments = async () => {
    try {
      const res = await API.get('/appointments');
      // Filter only recent appointments (last 30 days) and scheduled/completed ones
      const recentAppointments = res.data.filter(apt => {
        const aptDate = new Date(apt.appointment_time);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return aptDate >= thirtyDaysAgo && 
               (apt.status === 'Scheduled' || apt.status === 'Completed');
      });
      setAppointments(recentAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const handleAppointmentSelect = (appointmentId) => {
    const appointment = appointments.find(apt => apt.appointment_id === parseInt(appointmentId));
    if (appointment) {
      setSelectedAppointment(appointment);
      setForm(prev => ({ ...prev, appointment_id: appointmentId }));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) {
      alert('Please select an appointment first');
      return;
    }

    try {
      const recordData = {
        patient_id: selectedAppointment.patient_id,
        doctor_id: selectedAppointment.doctor_id,
        visit_date: selectedAppointment.appointment_time,
        diagnosis: form.diagnosis,
        notes: form.notes
      };

      await API.post('/records', recordData);
      setForm({ appointment_id: '', diagnosis: '', notes: '' });
      setSelectedAppointment(null);
      loadRecords();
    } catch (error) {
      console.error('Error adding record:', error);
      alert('Error adding medical record. Please check the form data.');
    }
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    if (!searchValue.trim()) {
      setFilteredRecords(records);
      return;
    }

    const filtered = records.filter(record =>
      record.patient_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      record.doctor_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      record.diagnosis?.toLowerCase().includes(searchValue.toLowerCase()) ||
      record.notes?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredRecords(filtered);
  };

  const goToPrescription = (recordId) => {
    navigate(`/prescriptions?recordId=${recordId}`);
  };

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

  useEffect(() => {
    loadRecords();
    loadAppointments();
  }, []);

  return (
    <div className="page">
      <h1>📋 Medical Records</h1>
      
      <div className="record-form">
        <h2>Create New Medical Record</h2>
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appointment_id">Select Recent Appointment *</label>
              <select
                id="appointment_id"
                value={form.appointment_id}
                onChange={(e) => handleAppointmentSelect(e.target.value)}
                required
              >
                <option value="">Choose an appointment...</option>
                {appointments.map(apt => (
                  <option key={apt.appointment_id} value={apt.appointment_id}>
                    {apt.patient_name} with Dr. {apt.doctor_name} - {formatDateTime(apt.appointment_time)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedAppointment && (
            <div className="appointment-details-preview">
              <h3>📅 Selected Appointment Details</h3>
              <div className="preview-grid">
                <div className="preview-item">
                  <span className="label">👤 Patient:</span>
                  <span className="value">{selectedAppointment.patient_name}</span>
                </div>
                <div className="preview-item">
                  <span className="label">👨‍⚕️ Doctor:</span>
                  <span className="value">Dr. {selectedAppointment.doctor_name}</span>
                </div>
                <div className="preview-item">
                  <span className="label">📅 Date & Time:</span>
                  <span className="value">{formatDateTime(selectedAppointment.appointment_time)}</span>
                </div>
                <div className="preview-item">
                  <span className="label">📊 Status:</span>
                  <span className="value">{selectedAppointment.status}</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="diagnosis">Diagnosis *</label>
              <textarea
                id="diagnosis"
                placeholder="Enter patient diagnosis..."
                value={form.diagnosis}
                onChange={e => setForm({ ...form, diagnosis: e.target.value })}
                required
                rows="3"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="notes">Clinical Notes</label>
              <textarea
                id="notes"
                placeholder="Enter additional clinical notes, observations, or treatment recommendations..."
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                rows="4"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={!selectedAppointment}>
            📝 Create Medical Record
          </button>
        </form>
      </div>

      <div className="records-section">
        <div className="section-header">
          <h2>📚 All Medical Records</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search records by patient, doctor, diagnosis, or notes..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            <span className="record-count">
              {filteredRecords.length} of {records.length} records
            </span>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="no-records">
            {searchTerm ? (
              <p>No records found matching "{searchTerm}"</p>
            ) : (
              <p>No medical records created yet.</p>
            )}
          </div>
        ) : (
          <div className="records-grid">
            {filteredRecords.map(record => (
              <div key={record.record_id} className="record-card">
                <div className="record-header">
                  <span className="record-id">#{record.record_id}</span>
                  <span className="record-date">{formatDateTime(record.visit_date)}</span>
                </div>
                
                <div className="record-details">
                  <div className="detail-row">
                    <span className="label">👤 Patient:</span>
                    <span className="value">{record.patient_name || `Patient #${record.patient_id}`}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">👨‍⚕️ Doctor:</span>
                    <span className="value">{record.doctor_name || `Dr. #${record.doctor_id}`}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">🏥 Diagnosis:</span>
                    <span className="value diagnosis-text">{record.diagnosis}</span>
                  </div>
                  
                  {record.notes && (
                    <div className="detail-row">
                      <span className="label">📝 Notes:</span>
                      <span className="value notes-text">{record.notes}</span>
                    </div>
                  )}
                </div>

                <div className="record-actions">
                  <button 
                    onClick={() => goToPrescription(record.record_id)}
                    className="action-btn prescription-btn"
                  >
                    💊 Add Prescription
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Records;
