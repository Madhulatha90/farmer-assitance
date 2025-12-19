
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-green-700 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full">
            <i className="fas fa-seedling text-green-700 text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Kisan Sahay</h1>
            <p className="text-xs text-green-100">Farmer Advisory AI Assistant</p>
          </div>
        </div>
        <div className="hidden md:flex gap-4 text-sm font-medium">
          <span className="flex items-center gap-1"><i className="fas fa-sun"></i> Weather</span>
          <span className="flex items-center gap-1"><i className="fas fa-chart-line"></i> Markets</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
