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

  // Close menus on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

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
    <>
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link 
                to="/"
                className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 transition-all duration-200"
              >
                CryptoInvest
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <Link
                to="/"
                className={`px-2 py-1 transition-all duration-200 ${
                  isActive("/home")
                    ? "text-white font-medium border-b-2 border-cyan-400"
                    : "text-white/80 hover:text-white hover:scale-105"
                }`}
              >
                Home
              </Link>

              {/* Dropdown for Pools */}
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={toggleDropdown}
                  className={`flex items-center space-x-1 px-2 py-1 transition-all duration-200 ${
                    isDropdownActive()
                      ? "text-white font-medium border-b-2 border-cyan-400"
                      : "text-white/80 hover:text-white hover:scale-105"
                  }`}
                >
                  <span>Pools</span>
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
                    className="absolute top-full left-0 mt-2 w-48 bg-black/40 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-200"
                  >
                    <div className="py-2">
                      <Link
                        to="/create-pool"
                        className={`block px-4 py-3 transition-all duration-200 ${
                          isActive("/create-pool")
                            ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-l-2 border-cyan-400"
                            : "text-white/80 hover:text-white hover:bg-white/10 hover:translate-x-1"
                        }`}
                        onClick={closeDropdown}
                      >
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-3"
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
                        className={`block px-4 py-3 transition-all duration-200 ${
                          isActive("/pools")
                            ? "text-white bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-l-2 border-cyan-400"
                            : "text-white/80 hover:text-white hover:bg-white/10 hover:translate-x-1"
                        }`}
                        onClick={closeDropdown}
                      >
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-3"
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
                className={`px-2 py-1 transition-all duration-200 ${
                  isActive("/about")
                    ? "text-white font-medium border-b-2 border-cyan-400"
                    : "text-white/80 hover:text-white hover:scale-105"
                }`}
              >
                About
              </Link>
            </div>

            {/* Desktop Connect Button */}
            <div className="hidden lg:block">
              <div className="inline-block p-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all duration-200">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
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
                        padding: "0",
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Connect Button and Menu */}
            <div className="lg:hidden flex items-center space-x-2 sm:space-x-3">
              {/* Mobile Connect Button */}
              <div className="inline-block p-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg">
                <div className="bg-black/50 backdrop-blur-sm rounded-md px-2 sm:px-3 py-1 sm:py-1.5">
                  <ConnectButton
                    chain={arbitrumSepolia}
                    client={client}
                    theme="dark"
                    connectButton={{
                      style: {
                        background: "transparent",
                        border: "none",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "600",
                        padding: "0px 4px",
                        whiteSpace: "nowrap",
                      },
                    }}
                    connectModal={{
                      size: "compact",
                    }}
                  />
                </div>
              </div>

              {/* Hamburger Menu */}
              <button
                ref={hamburgerRef}
                onClick={toggleMobileMenu}
                className="relative p-1.5 sm:p-2 text-white transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Toggle menu"
              >
                <div className="p-1 bg-gradient-to-r from-cyan-500/60 to-purple-500/60 rounded-lg backdrop-blur-sm border border-white/10">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200"
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
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile Navigation Menu */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-16 right-0 bottom-0 z-50 w-full max-w-xs sm:max-w-sm transition-all duration-300 ease-in-out transform ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        <div className="h-full bg-gradient-to-br from-black/95 via-purple-900/20 to-cyan-900/20 backdrop-blur-xl border-l border-white/20 shadow-2xl">
          <div className="h-full overflow-y-auto scrollbar-hide">
            <div className="p-4 sm:p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  Menu
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Section */}
              <div className="space-y-2">
                <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">
                  Navigation
                </h3>
                
                <Link
                  to="/"
                  className={`flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 group ${
                    isActive("/home")
                      ? "text-white bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-l-3 border-cyan-400 shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/5 hover:translate-x-1"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform flex-shrink-0"
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
                  <span className="font-medium text-sm">Home</span>
                </Link>

                <Link
                  to="/about"
                  className={`flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 group ${
                    isActive("/about")
                      ? "text-white bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-l-3 border-cyan-400 shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/5 hover:translate-x-1"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform flex-shrink-0"
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
                  <span className="font-medium text-sm">About</span>
                </Link>
              </div>

              {/* Pools Section */}
              <div className="space-y-2">
                <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">
                  Pool Management
                </h3>
                
                <Link
                  to="/create-pool"
                  className={`flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 group ${
                    isActive("/create-pool")
                      ? "text-white bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-l-3 border-cyan-400 shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/5 hover:translate-x-1"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform flex-shrink-0"
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
                  <span className="font-medium text-sm">Create Pool</span>
                </Link>

                <Link
                  to="/pools"
                  className={`flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 group ${
                    isActive("/pools")
                      ? "text-white bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-l-3 border-cyan-400 shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/5 hover:translate-x-1"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform flex-shrink-0"
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
                  <span className="font-medium text-sm">Pools List</span>
                </Link>
              </div>

              {/* Footer Info */}
              <div className="pt-6 border-t border-white/10 mt-auto">
                <div className="text-center">
                  <div className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-1">
                    CryptoInvest
                  </div>
                  <p className="text-white/40 text-xs">
                    Decentralized Investment Platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;