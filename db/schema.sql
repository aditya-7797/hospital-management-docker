CREATE TABLE Patients (
    patient_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    timing TIME NOT NULL, 
    gender VARCHAR(10),
    contact VARCHAR(50) NOT NULL,
    insurance_id VARCHAR(50)
);

CREATE TABLE Doctors (
    doctor_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100),
    availability JSONB
);

CREATE TABLE Appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES Patients(patient_id) NOT NULL,
    doctor_id INT REFERENCES Doctors(doctor_id) NOT NULL,
    appointment_time TIMESTAMP,
    status VARCHAR(20)
);

CREATE TABLE MedicalRecords (
    record_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES Patients(patient_id) NOT NULL,
    doctor_id INT REFERENCES Doctors(doctor_id) NOT NULL,
    visit_date TIMESTAMP,
    diagnosis TEXT,
    notes TEXT
);

CREATE TABLE Prescriptions (
    prescription_id SERIAL PRIMARY KEY,
    record_id INT REFERENCES MedicalRecords(record_id) NOT NULL,
    medication TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    instructions TEXT,
    refills INT DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX idx_patients_name ON Patients(name);
CREATE INDEX idx_patients_contact ON Patients(contact);
CREATE INDEX idx_doctors_specialty ON Doctors(specialty);
CREATE INDEX idx_appointments_time ON Appointments(appointment_time);
CREATE INDEX idx_appointments_patient ON Appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON Appointments(doctor_id);
CREATE INDEX idx_records_visit_date ON MedicalRecords(visit_date);
CREATE INDEX idx_records_patient ON MedicalRecords(patient_id);
CREATE INDEX idx_records_doctor ON MedicalRecords(doctor_id);
CREATE INDEX idx_prescriptions_record ON Prescriptions(record_id);
CREATE INDEX idx_prescriptions_medication ON Prescriptions(medication);