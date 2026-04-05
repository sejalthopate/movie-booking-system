import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const TAHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <h1 className="text-xl font-bold">TA Dashboard</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-yellow-400">Home</a>
          <a href="#" className="hover:text-yellow-400">Reports</a>
          <a href="#" className="hover:text-yellow-400">Bookings</a>
          <a href="#" className="hover:text-yellow-400">Profile</a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2">
          <a href="#" className="block hover:text-yellow-400">Home</a>
          <a href="#" className="block hover:text-yellow-400">Reports</a>
          <a href="#" className="block hover:text-yellow-400">Bookings</a>
          <a href="#" className="block hover:text-yellow-400">Profile</a>
        </div>
      )}
    </header>
  );
};

export default TAHeader;
