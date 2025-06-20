import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LinkGuardian</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Documentation
            </Link>
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Support
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Start Free Trial
                </button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-6 space-y-4">
            <Link to="/" className="block text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link to="/" className="block text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link to="/" className="block text-gray-600 hover:text-gray-900 transition-colors">
              Documentation
            </Link>
            <Link to="/" className="block text-gray-600 hover:text-gray-900 transition-colors">
              Support
            </Link>
            <div className="pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Dashboard
                </button>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => navigate('/signup')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Start Free Trial
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;