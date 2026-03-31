import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Records from './pages/Records';
import Prescriptions from './pages/Prescriptions';

const App = () => (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Patients />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/records" element={<Records />} />
      <Route path="/prescriptions" element={<Prescriptions />} />
    </Routes>
    </>
);

export default App;
