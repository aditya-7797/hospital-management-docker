-- Sample data for testing appointments
-- Run this after schema.sql to populate with test data

-- Insert sample patients
INSERT INTO Patients (name, dob, timing, gender, contact, insurance_id) VALUES
('John Smith', '1990-05-15', '09:30:00', 'Male', '+1234567890', 'INS123456'),
('Sarah Johnson', '1985-08-22', '14:15:00', 'Female', '+1234567891', 'INS123457'),
('Michael Brown', '1978-12-10', '11:00:00', 'Male', '+1234567892', 'INS123458'),
('Emily Davis', '1995-03-28', '16:45:00', 'Female', '+1234567893', 'INS123459'),
('David Wilson', '1982-07-14', '10:00:00', 'Male', '+1234567894', 'INS123460');

-- Insert sample doctors
INSERT INTO Doctors (name, specialty, availability) VALUES
('Dr. Robert Chen', 'Cardiology', '{"monday": ["09:00", "17:00"], "tuesday": ["09:00", "17:00"], "wednesday": ["09:00", "17:00"], "thursday": ["09:00", "17:00"], "friday": ["09:00", "17:00"]}'),
('Dr. Lisa Rodriguez', 'Pediatrics', '{"monday": ["08:00", "16:00"], "tuesday": ["08:00", "16:00"], "wednesday": ["08:00", "16:00"], "thursday": ["08:00", "16:00"], "friday": ["08:00", "16:00"]}'),
('Dr. James Thompson', 'Orthopedics', '{"monday": ["10:00", "18:00"], "tuesday": ["10:00", "18:00"], "wednesday": ["10:00", "18:00"], "thursday": ["10:00", "18:00"], "friday": ["10:00", "18:00"]}'),
('Dr. Maria Garcia', 'Dermatology', '{"monday": ["09:00", "17:00"], "tuesday": ["09:00", "17:00"], "wednesday": ["09:00", "17:00"], "thursday": ["09:00", "17:00"], "friday": ["09:00", "17:00"]}'),
('Dr. Kevin Lee', 'Neurology', '{"monday": ["08:00", "16:00"], "tuesday": ["08:00", "16:00"], "wednesday": ["08:00", "16:00"], "thursday": ["08:00", "16:00"], "friday": ["08:00", "16:00"]}');

-- Insert sample appointments (for future dates)
INSERT INTO Appointments (patient_id, doctor_id, appointment_time, status) VALUES
(1, 1, '2024-12-20 10:00:00', 'Scheduled'),
(2, 2, '2024-12-21 14:30:00', 'Scheduled'),
(3, 3, '2024-12-22 11:00:00', 'Scheduled'),
(4, 4, '2024-12-23 15:00:00', 'Scheduled'),
(5, 5, '2024-12-24 09:00:00', 'Scheduled');
