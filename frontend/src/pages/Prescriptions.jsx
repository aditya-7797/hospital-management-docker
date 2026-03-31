import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';

const Prescriptions = () => {
  const [searchParams] = useSearchParams();
  const initialRecordId = searchParams.get('recordId') || '';

  const [recordId, setRecordId] = useState(initialRecordId);
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    refills: '0'
  });

  const frequencyOptions = [
    'Once daily',
    'Twice daily', 
    'Three times daily',
    'Four times daily',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'Before meals',
    'After meals',
    'At bedtime'
  ];

  const durationOptions = [
    '3 days',
    '5 days',
    '7 days',
    '10 days',
    '14 days',
    '21 days',
    '30 days',
    '60 days',
    '90 days',
    'Until finished',
    'As prescribed'
  ];

  const fetchPrescriptions = async () => {
    if (!recordId) return;
    try {
      const res = await API.get(`/prescriptions/record/${recordId}`);
      setPrescriptions(res.data);
      setFilteredPrescriptions(res.data);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    }
  };

  const loadMedicalRecords = async () => {
    try {
      const res = await API.get('/records');
      setMedicalRecords(res.data);
    } catch (error) {
      console.error('Error loading medical records:', error);
    }
  };

  const handleRecordSelect = (recordId) => {
    const record = medicalRecords.find(r => r.record_id === parseInt(recordId));
    if (record) {
      setSelectedRecord(record);
      setRecordId(recordId);
      fetchPrescriptions();
    }
  };

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    if (!recordId) {
      alert('Please select a medical record first');
      return;
    }

    // Log the form data being sent
    console.log('Form data being sent:', {
      record_id: recordId,
      ...form
    });

    try {
      const response = await API.post('/prescriptions', {
        record_id: recordId,
        ...form
      });
      
      console.log('Prescription created successfully:', response.data);
      
      setForm({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        refills: '0'
      });
      fetchPrescriptions();
    } catch (err) {
      console.error('Error adding prescription:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // Show more detailed error message
      let errorMessage = 'Error adding prescription. ';
      if (err.response?.data?.error) {
        errorMessage += err.response.data.error;
      } else if (err.response?.data?.details) {
        errorMessage += err.response.data.details;
      } else {
        errorMessage += 'Please check the form data.';
      }
      
      alert(errorMessage);
    }
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    if (!searchValue.trim()) {
      setFilteredPrescriptions(prescriptions);
      return;
    }

    const filtered = prescriptions.filter(prescription =>
      prescription.medication?.toLowerCase().includes(searchValue.toLowerCase()) ||
      prescription.dosage?.toLowerCase().includes(searchValue.toLowerCase()) ||
      prescription.instructions?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredPrescriptions(filtered);
  };

  const getMedicationIcon = (medication) => {
    const med = medication.toLowerCase();
    if (med.includes('antibiotic') || med.includes('penicillin')) return '🦠';
    if (med.includes('pain') || med.includes('ibuprofen') || med.includes('acetaminophen')) return '💊';
    if (med.includes('vitamin') || med.includes('supplement')) return '🥬';
    if (med.includes('insulin') || med.includes('diabetes')) return '💉';
    if (med.includes('heart') || med.includes('blood')) return '❤️';
    if (med.includes('sleep') || med.includes('melatonin')) return '😴';
    return '💊';
  };

  useEffect(() => {
    loadMedicalRecords();
    if (initialRecordId) {
      setRecordId(initialRecordId);
      fetchPrescriptions();
    }
  }, [initialRecordId]);

  useEffect(() => {
    if (recordId) fetchPrescriptions();
  }, [recordId]);

  return (
    <div className="page">
      <h1>💊 Prescriptions Management</h1>
      
      <div className="prescription-form">
        <h2>Create New Prescription</h2>
        <form onSubmit={handleAddPrescription}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="record_id">Select Medical Record *</label>
              <select
                id="record_id"
                value={recordId}
                onChange={(e) => handleRecordSelect(e.target.value)}
                required
              >
                <option value="">Choose a medical record...</option>
                {medicalRecords.map(record => (
                  <option key={record.record_id} value={record.record_id}>
                    {record.patient_name} - {record.diagnosis} ({new Date(record.visit_date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedRecord && (
            <div className="record-details-preview">
              <h3>📋 Selected Medical Record</h3>
              <div className="preview-grid">
                <div className="preview-item">
                  <span className="label">👤 Patient:</span>
                  <span className="value">{selectedRecord.patient_name}</span>
                </div>
                <div className="preview-item">
                  <span className="label">👨‍⚕️ Doctor:</span>
                  <span className="value">Dr. {selectedRecord.doctor_name}</span>
                </div>
                <div className="preview-item">
                  <span className="label">🏥 Diagnosis:</span>
                  <span className="value">{selectedRecord.diagnosis}</span>
                </div>
                <div className="preview-item">
                  <span className="label">📅 Visit Date:</span>
                  <span className="value">{new Date(selectedRecord.visit_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="medication">Medication Name *</label>
              <input
                type="text"
                id="medication"
                placeholder="e.g., Amoxicillin, Ibuprofen, Vitamin D"
                value={form.medication}
                onChange={(e) => setForm({ ...form, medication: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dosage">Dosage *</label>
              <input
                type="text"
                id="dosage"
                placeholder="e.g., 500mg, 10ml, 1 tablet"
                value={form.dosage}
                onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="frequency">Frequency *</label>
              <select
                id="frequency"
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                required
              >
                <option value="">Select frequency</option>
                {frequencyOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration *</label>
              <select
                id="duration"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                required
              >
                <option value="">Select duration</option>
                {durationOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="instructions">Special Instructions</label>
              <textarea
                id="instructions"
                placeholder="e.g., Take with food, Avoid alcohol, Store in refrigerator..."
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="refills">Number of Refills</label>
              <select
                id="refills"
                value={form.refills}
                onChange={(e) => setForm({ ...form, refills: e.target.value })}
              >
                <option value="0">No refills</option>
                <option value="1">1 refill</option>
                <option value="2">2 refills</option>
                <option value="3">3 refills</option>
                <option value="4">4 refills</option>
                <option value="5">5 refills</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={!recordId}>
            💊 Create Prescription
          </button>
        </form>
      </div>

      <div className="prescriptions-section">
        <div className="section-header">
          <h2>📋 All Prescriptions</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search prescriptions by medication, dosage, or instructions..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            <span className="prescription-count">
              {filteredPrescriptions.length} of {prescriptions.length} prescriptions
            </span>
          </div>
        </div>

        {filteredPrescriptions.length === 0 ? (
          <div className="no-prescriptions">
            {searchTerm ? (
              <p>No prescriptions found matching "{searchTerm}"</p>
            ) : (
              <p>No prescriptions created yet.</p>
            )}
          </div>
        ) : (
          <div className="prescriptions-grid">
            {filteredPrescriptions.map((prescription) => (
              <div key={prescription.prescription_id} className="prescription-card">
                <div className="prescription-header">
                  <span className="medication-icon">
                    {getMedicationIcon(prescription.medication)}
                  </span>
                  <span className="prescription-id">#{prescription.prescription_id}</span>
                </div>
                
                <div className="prescription-details">
                  <div className="medication-name">{prescription.medication}</div>
                  
                  <div className="detail-row">
                    <span className="label">💊 Dosage:</span>
                    <span className="value">{prescription.dosage}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">⏰ Frequency:</span>
                    <span className="value">{prescription.frequency}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">📅 Duration:</span>
                    <span className="value">{prescription.duration}</span>
                  </div>
                  
                  {prescription.instructions && (
                    <div className="detail-row">
                      <span className="label">📝 Instructions:</span>
                      <span className="value instructions-text">{prescription.instructions}</span>
                    </div>
                  )}
                  
                  <div className="detail-row">
                    <span className="label">🔄 Refills:</span>
                    <span className="value">{prescription.refills} refill{prescription.refills !== '1' ? 's' : ''}</span>
                  </div>
                </div>

                <div className="prescription-footer">
                  <span className="record-link">
                    📋 Record #{prescription.record_id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
