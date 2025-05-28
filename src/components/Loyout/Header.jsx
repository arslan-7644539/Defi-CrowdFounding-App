import { Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            CryptoInvest
          </div>
          <div className="hidden md:flex space-x-8">
            <Link
              to="/home"
              className="text-white/80 hover:text-white transition-colors"
            >
              Home
            </Link>

            {/* Dropdown for Create Pool */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-white/80 hover:text-white transition-colors flex items-center space-x-1"
              >
                <span>Create Pool</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg shadow-lg">
                  <div className="py-2">
                    <Link
                      to="/create-pool"
                      className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={closeDropdown}
                    >
                      Create Pool
                    </Link>
                    <Link
                      to="/pools"
                      className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={closeDropdown}
                    >
                      Pools List
                    </Link>
                    
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className="text-white/80 hover:text-white transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={closeDropdown}></div>
      )}
    </nav>
  );
};

export default Header;
