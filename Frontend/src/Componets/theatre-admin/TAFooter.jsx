import React from "react";

const TAFooter = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 text-center md:flex md:justify-between md:text-left">
        
        <p className="text-sm">
          © {new Date().getFullYear()} TA Dashboard. All Rights Reserved.
        </p>

        <div className="space-x-4 mt-3 md:mt-0">
          <a href="#" className="text-sm hover:text-yellow-400">Privacy Policy</a>
          <a href="#" className="text-sm hover:text-yellow-400">Terms</a>
          <a href="#" className="text-sm hover:text-yellow-400">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default TAFooter;
