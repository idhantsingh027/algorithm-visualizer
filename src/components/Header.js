import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">ALGO • VIZ</div>
        <nav className="nav">
          <span className="nav-item by-author">BY IDHANT SINGH</span>
          <span className="nav-item language">EN</span>
        </nav>
      </div>
    </header>
  );
}

export default Header;
