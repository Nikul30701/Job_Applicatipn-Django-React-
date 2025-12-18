import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import ProtectedRoute from './components/common/ProtectedRoute'

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register'

// Job Components
import JobList from './components/jobs/JobList'
import JobDetail from './components/jobs/JobDetail'

import EmployerDashboard from './components/employer/EmployerDashboard';

// Job Seeker Components
import JobSeekerDashboard from './components/jobseeker/JobSeekerDashboard';
import MyApplications from './components/jobseeker/MyApplications';

import Home from './components/Home';


function App() {

  return (
    <Router>
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/jobs' element={<JobList />} />

          {/* Employer Routes */}
          <Route 
            path='/employer/dashboard' 
            element={
              <ProtectedRoute requiredUserType="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Job Seeker Routes */}
          <Route 
            path='/jobseeker/dashboard' 
            element={
              <ProtectedRoute requiredUserType="jobseeker">
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Job Seeker Routes */}
          <Route 
            path='/jobseeker/applications' 
            element={
              <ProtectedRoute requiredUserType="jobseeker">
                <MyApplications  />
              </ProtectedRoute>
            }
          />
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
