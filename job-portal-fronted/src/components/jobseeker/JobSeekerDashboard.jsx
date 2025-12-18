import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../../services/jobService';
import LoadingSpinner from '../common/LoadingSpinner';

const JobSeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [applicationsData, savedJobsData] = await Promise.all([
        jobService.getMyApplications(),
        jobService.getSavedJobs(),
      ]);
      setApplications(applicationsData.slice(0, 5));
      setSavedJobs(savedJobsData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="mt-2 text-gray-600">Track your applications and saved jobs</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{applications.length}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Saved Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{savedJobs.length}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {applications.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
              <Link to="/jobseeker/applications" className="text-primary hover:text-secondary text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="p-6">
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't applied to any jobs yet</p>
                  <Link
                    to="/jobs"
                    className="inline-block bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <Link to={`/jobs/${application.job}`} className="font-medium text-gray-900 hover:text-primary">
                            {application.job_title}
                          </Link>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Applied on {new Date(application.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Saved Jobs */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Saved Jobs</h2>
              <Link to="/jobseeker/saved-jobs" className="text-primary hover:text-secondary text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="p-6">
              {savedJobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No saved jobs yet</p>
                  <Link
                    to="/jobs"
                    className="inline-block bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedJobs.map((saved) => (
                    <Link
                      key={saved.id}
                      to={`/jobs/${saved.job.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                    >
                      <h3 className="font-medium text-gray-900">{saved.job.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{saved.job.employer_name}</p>
                      <p className="text-sm text-gray-500 mt-2">{saved.job.location}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;