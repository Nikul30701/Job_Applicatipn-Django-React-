import React from 'react'

const Home = () => {
  return (
    <div className="max-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Find Your Dream Job Today
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Connect with top employers and discover opportunities that match your skills
          </p>

          <div className="flex justify-center space-x-4">
            <a
              href="/jobs"
              className="bg-primary hover:bg-secondary text-white hover:text-gray-900 px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Browse Jobs
            </a>

            <a
              href="/register"
              className="bg-white hover:bg-gray-50 text-primary border-2 border-primary px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Search Jobs
            </h3>

            <p className="text-gray-600">
              Browse thousands of job listings from top companies across various industries.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Apply Easily
            </h3>

            <p className="text-gray-600">
              Submit your application with just a few clicks and track your progress.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Get Hired
            </h3>

            <p className="text-gray-600">
              Connect directly with employers and land your dream job faster.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home;
