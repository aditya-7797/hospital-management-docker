import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; // Optional for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>🏥 HealthCare System</h2>
      <ul className="nav-links">
        <li><NavLink to="/">Patients</NavLink></li>
        <li><NavLink to="/doctors">Doctors</NavLink></li>
        <li><NavLink to="/appointments">Appointments</NavLink></li>
        <li><NavLink to="/records">Records</NavLink></li>
        <li><NavLink to="/prescriptions">Prescriptions</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
