import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice"
import { useState } from 'react';

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.post(BASE_URL + "/logout", {}, {
        withCredentials: true,
      });

      dispatch(removeUser())
      navigate("/login")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoggingOut(false);
    }
  }

  const isActiveLink = (path) => {
    return location.pathname === path;
  }

  const pendingRequestsCount = requests?.length || 0;

  return (
    <nav className="bg-black border-b border-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-10 w-40 object-contain group-hover:scale-105 transition-transform duration-200" 
                />
                <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
            </Link>
          </div>

          {user ? (
            <div className="flex items-center space-x-6">
              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-1">
                <Link 
                  to="/" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActiveLink('/feed') 
                      ? 'bg-white text-black' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Feed
                </Link>
                <Link 
                  to="/connections" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActiveLink('/connections') 
                      ? 'bg-white text-black' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Connections
                </Link>
                <Link 
                  to="/requests" 
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActiveLink('/requests') 
                      ? 'bg-white text-black' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Requests
                  {pendingRequestsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Welcome Message */}
              <div className="hidden sm:block text-gray-300 text-sm">
                Welcome, <span className="font-medium text-white">{user.firstName}</span>
              </div>

              {/* User Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-800 transition-colors duration-200 group"
                >
                  <div className="relative">
                    <img
                      src={user.photoUrl || `https://via.placeholder.com/40x40/374151/ffffff?text=${user.firstName?.[0] || 'U'}`}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover border-2 border-gray-700 group-hover:border-gray-600 transition-all duration-200"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/40x40/374151/ffffff?text=${user.firstName?.[0] || 'U'}`;
                      }}
                    />
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-black"></div>
                  </div>
                  <div className="hidden lg:block">
                    <svg 
                      className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-20">
                      <div className="py-2">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-700">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.photoUrl || `https://via.placeholder.com/32x32/374151/ffffff?text=${user.firstName?.[0] || 'U'}`}
                              alt="Profile"
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-gray-400">{user.emailId}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile Settings
                          </Link>

                          {/* Mobile Navigation Links */}
                          <div className="md:hidden border-t border-gray-700 mt-2 pt-2">
                            <Link
                              to="/"
                              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              Feed
                            </Link>
                            <Link
                              to="/connections"
                              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              Connections
                            </Link>
                            <Link
                              to="/requests"
                              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                              Requests
                              {pendingRequestsCount > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                  {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                                </span>
                              )}
                            </Link>
                          </div>

                          <div className="border-t border-gray-700 mt-2 pt-2">
                            <button
                              onClick={handleLogout}
                              disabled={isLoggingOut}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-red-900 hover:text-red-300 transition-colors duration-150 disabled:opacity-50"
                            >
                              <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              {isLoggingOut ? 'Logging out...' : 'Logout'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Login/Register buttons for non-authenticated users */
           <div></div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar