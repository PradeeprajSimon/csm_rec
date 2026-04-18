import React from 'react';

const Navbar = ({ onAddClick }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <span className="logo-icon">🗓️</span>
          <h1>Evently</h1>
        </div>
        <button className="btn-primary" onClick={onAddClick}>
          <span>+</span> Add Event
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
