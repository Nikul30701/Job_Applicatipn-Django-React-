import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import jobService from '../../services/jobService';
import LoadingSpinner from '../common/LoadingSpinner';

const ApplicationList = () => {
  const { jobId } = useParams(); // Optional: filter by specific job
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await jobService.getEmployerApplications(jobId);
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setUpdatingStatus(applicationId);
      await jobService.updateApplicationStatus(applicationId, newStatus);
      
      // Update local state
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      alert(`Application status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Filter applications by status
  const filteredApplications = statusFilter === 'all'
    ? applications
    : applications.filter(app => app.status === statusFilter);

  // Get status counts
  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {jobId ? 'Job Applications' : 'All Applications'}
          </h1>
          <p className="mt-2 text-gray-600">
            Review and manage applications from candidates
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Reviewed</p>
            <p className="text-2xl font-bold text-blue-600">{statusCounts.reviewed}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600">Shortlisted</p>
            <p className="text-2xl font-bold text-purple-600">{statusCounts.shortlisted}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Accepted</p>
            <p className="text-2xl font-bold text-green-600">{statusCounts.accepted}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap px-4" aria-label="Tabs">
              {['all', 'pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`py-4 px-4 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
                    statusFilter === status
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {status} ({statusCounts[status]})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No applications found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {statusFilter === 'all'
                  ? 'No candidates have applied yet.'
                  : `No applications with status "${statusFilter}".`}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  {/* Applicant Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {application.applicant?.full_name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                      </div>

                      {/* Name and Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.applicant?.full_name || 'Anonymous'}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              application.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : application.status === 'reviewed'
                                ? 'bg-blue-100 text-blue-800'
                                : application.status === 'shortlisted'
                                ? 'bg-purple-100 text-purple-800'
                                : application.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {application.status}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          {application.applicant?.email && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {application.applicant.email}
                            </span>
                          )}

                          {application.applicant?.phone && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {application.applicant.phone}
                            </span>
                          )}
                        </div>

                        {/* Job Title (if showing all applications) */}
                        {!jobId && application.job && (
                          <div className="mt-2">
                            <Link
                              to={`/employer/jobs/${application.job.id}`}
                              className="text-sm text-primary hover:text-secondary font-medium"
                            >
                              Applied for: {application.job.title}
                            </Link>
                          </div>
                        )}

                        {/* Cover Letter Preview */}
                        {application.cover_letter && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              <span className="font-medium">Cover Letter:</span> {application.cover_letter}
                            </p>
                          </div>
                        )}

                        {/* Application Date */}
                        <div className="mt-2 text-xs text-gray-500">
                          Applied on {new Date(application.applied_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-6 flex flex-col space-y-2">
                    {/* Resume Download */}
                    {application.resume && (
                      <a
                        href={application.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-secondary transition-colors text-center flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Resume
                      </a>
                    )}

                    {/* Status Update Dropdown */}
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusUpdate(application.id, e.target.value)}
                      disabled={updatingStatus === application.id}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    {updatingStatus === application.id && (
                      <div className="text-xs text-gray-500 text-center">Updating...</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationList;
