import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full mb-6">
            <AlertTriangle className="h-12 w-12 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Oops! The truth you're seeking isn't here.
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for might have been moved, deleted, or doesn't exist. 
            Let's get you back to verified news.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Home className="h-5 w-5" />
            <span>Return to Home</span>
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/categories/technology"
              className="inline-flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-pink-500 hover:text-pink-600 transition-all duration-200"
            >
              <Search className="h-4 w-4" />
              <span>Browse Technology</span>
            </Link>
            
            <Link
              to="/categories/politics"
              className="inline-flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
            >
              <Search className="h-4 w-4" />
              <span>Browse Politics</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Report an Issue
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            If you believe this is an error or you were expecting to find content here, 
            please let us know so we can investigate.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 font-medium text-sm"
          >
            <span>Contact Support</span>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            "If it's not verified, it's just noise." - ZipTales
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;