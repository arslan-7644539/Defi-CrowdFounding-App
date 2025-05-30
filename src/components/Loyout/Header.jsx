import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { ConnectButton } from "thirdweb/react";
import { arbitrumSepolia } from "thirdweb/chains";
import { client } from "../../lib/thirdweb";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Add click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }

      // Close mobile menu when clicking outside
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    // Add event listener when dropdown or mobile menu is open
    if (isDropdownOpen || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isMobileMenuOpen]);

  // Check if the current path matches the link path
  const isActive = (path) => {
    if (
      path === "/home" &&
      (location.pathname === "/" || location.pathname === "/home")
    ) {
      return true;
    }
    return location.pathname === path;
  };

  // Check if any dropdown item is active
  const isDropdownActive = () => {
    return isActive("/create-pool") || isActive("/pools");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            CryptoInvest
          </div>

          {/* Mobile Connect Button (Left Side) */}
          <div className="md:hidden flex-1 flex justify-start ml-4">
            <div className="inline-block p-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-1 py-0.5">
                <ConnectButton
                  chain={arbitrumSepolia}
                  client={client}
                  theme="dark"
                  connectButton={{
                    style: {
                      background: "transparent",
                      border: "none",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "2px 8px",
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors ${
                isActive("/home")
                  ? "text-white font-medium border-b-2 border-cyan-400"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Home
            </Link>

            {/* Dropdown for Create Pool */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className={`flex items-center space-x-1 transition-colors ${
                  isDropdownActive()
                    ? "text-white font-medium border-b-2 border-cyan-400"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <span>Pools Campaigns</span>
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
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 mt-2 w-48 bg-black/40 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="py-2 divide-y divide-white/10">
                    <Link
                      to="/create-pool"
                      className={`block px-4 py-3 transition-colors ${
                        isActive("/create-pool")
                          ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-500/20"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                      onClick={closeDropdown}
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Create Pool
                      </div>
                    </Link>
                    <Link
                      to="/pools"
                      className={`block px-4 py-3 transition-colors ${
                        isActive("/pools")
                          ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-500/20"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                      onClick={closeDropdown}
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                          />
                        </svg>
                        Pools List
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`transition-colors ${
                isActive("/about")
                  ? "text-white font-medium border-b-2 border-cyan-400"
                  : "text-white/80 hover:text-white"
              }`}
            >
              About
            </Link>

            {/* Desktop Connect Button */}
            <div className="inline-block p-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                <ConnectButton
                  chain={arbitrumSepolia}
                  client={client}
                  theme="dark"
                  connectButton={{
                    style: {
                      background: "transparent",
                      border: "none",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: "bold",
                      padding: "4px 16px",
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Mobile Hamburger Menu (Right Side) */}
          <div className="md:hidden">
            <button
              ref={hamburgerRef}
              onClick={toggleMobileMenu}
              className="text-white p-2 relative z-50"
            >
              <div className="p-0.5 bg-gradient-to-r from-cyan-500/80 to-purple-500/80 rounded-lg">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-1 py-1">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        isMobileMenuOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu with Animation */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden fixed top-16 inset-x-0 bottom-0 z-40 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-purple-900/20 to-black/60 backdrop-blur-md">
          <div className="h-full max-w-xs w-4/5 ml-auto bg-gradient-to-b from-black/70 via-purple-900/10 to-cyan-900/10 backdrop-blur-xl border-l border-white/10 shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="space-y-1.5">
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                  Navigation
                </p>
                <Link
                  to="/"
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive("/home")
                      ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-l-2 border-cyan-400"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Home</span>
                </Link>

                <p className="text-white/50 text-xs font-medium uppercase tracking-wider mt-6 mb-2">
                  Pools
                </p>
                <Link
                  to="/create-pool"
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive("/create-pool")
                      ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-l-2 border-cyan-400"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Create Pool</span>
                </Link>

                <Link
                  to="/pools"
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive("/pools")
                      ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-l-2 border-cyan-400"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  <span>Pools List</span>
                </Link>

                <p className="text-white/50 text-xs font-medium uppercase tracking-wider mt-6 mb-2">
                  More
                </p>
                <Link
                  to="/about"
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive("/about")
                      ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-l-2 border-cyan-400"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>About</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
